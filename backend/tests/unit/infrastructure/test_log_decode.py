"""Regression test for the kubernetes SDK 36.x log-bytes-repr quirk.

The k8s SDK's pod-log endpoints return ``repr(bytes)`` when strict UTF-8
decode fails. Without the adapter's decoder, ``splitlines()`` yields one
"line" containing the whole log blob. This test pins the contract of
``_decode_sdk_log_content`` so a future SDK or Python change can't
silently break log rendering again.
"""
from __future__ import annotations

import pytest

from app.infrastructure.k8s.adapter import _decode_sdk_log_content


def test_decodes_bytes_with_real_newlines():
    raw = b"2026-10-09 03:28:56 line1\n2026-10-09 03:29:18 line2\n"
    out = _decode_sdk_log_content(raw)
    assert out.count("\n") == 2
    assert out.splitlines() == ["2026-10-09 03:28:56 line1", "2026-10-09 03:29:18 line2"]


def test_decodes_bytes_repr_string_with_ansi_and_embedded_newlines():
    # The exact form observed in the production incident: a single
    # repr-of-bytes string from the SDK with literal \\x1b (ANSI ESC) and
    # \\n (escaped newline) sequences.
    raw = (
        "b'2026-10-09 03:28:56 \\x1b[34mdebug\\x1b[39m "
        "[InternalClient] GET http://example:3000/api/x -> 200"
        "\\n2026-10-09 03:28:56 \\x1b[34mdebug\\x1b[39m next\\n'"
    )
    out = _decode_sdk_log_content(raw)
    lines = out.splitlines()
    assert len(lines) == 2, f"expected 2 real lines, got {len(lines)}: {out!r}"
    assert "\x1b[34m" in lines[0]  # real ESC byte, not the 4-char literal
    assert "InternalClient" in lines[0]
    assert lines[1] == "2026-10-09 03:28:56 \x1b[34mdebug\x1b[39m next"


def test_decodes_bytes_repr_with_double_quote_outer():
    # If the bytes contain a single quote, repr() picks the other outer
    # quote. The repr of bytes b"can't parse this\n" is the string
    # b"can't parse this\\n" (the literal backslash-n is TWO characters in
    # the repr). Here we build that exact repr via the bytes -> repr round
    # trip, so the test exercises the real production shape.
    src = b"can't parse this\n"
    raw = repr(src)  # → b"can't parse this\\n"
    assert raw[:2] in ("b'", 'b"') and raw[-1] == raw[1]  # sanity: valid repr
    out = _decode_sdk_log_content(raw)
    assert out == "can't parse this\n"


def test_passes_through_plain_string_unchanged():
    s = "2026-10-09T03:28:56.123Z hello\nworld"
    assert _decode_sdk_log_content(s) == s


def test_empty_and_none_become_empty_string():
    assert _decode_sdk_log_content("") == ""
    assert _decode_sdk_log_content(None) == ""
    assert _decode_sdk_log_content(b"") == ""


def test_malformed_repr_passes_through_untouched():
    # Looks like a repr start but isn't a valid literal — must not be
    # silently corrupted (e.g. split into a one-byte string).
    bad = "b'unterminated"
    assert _decode_sdk_log_content(bad) == bad


def test_passing_through_b_prefix_legitimate_log_line():
    # A real log line that happens to start with "b'" (e.g. a Python app
    # printing its own repr) is NOT a bytes-repr; the false-positive guard
    # (length >= 4, matching outer quotes) means the smallest 2- and 3-char
    # inputs are never mis-rewritten. For longer matches, ast.literal_eval
    # must succeed; if it does, the content really was a bytes literal.
    assert _decode_sdk_log_content("b'OK") == "b'OK"  # length 4 but no
    # valid bytes literal under ast.literal_eval → falls through.


def test_non_string_non_bytes_input_falls_through_gracefully():
    # Defensive: unknown types stringify rather than raise.
    out = _decode_sdk_log_content(12345)
    assert out == "12345"
