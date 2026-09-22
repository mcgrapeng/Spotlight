from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True, slots=True)
class LogFilter:
    """Composable log filter.

    All fields are AND-ed. Empty matchers are no-op.
    """

    keyword: str = ""
    severities: frozenset[str] = field(default_factory=frozenset)  # subset of LogSeverity
    since: str | None = None  # ISO timestamp
    container: str | None = None
    regex: bool = False  # interpret keyword as regex
    case_insensitive: bool = True

    def is_active(self) -> bool:
        return bool(self.keyword or self.severities or self.since or self.container)


@dataclass(frozen=True, slots=True)
class ResourceRef:
    """Strongly typed K8s object reference (avoids passing 3 strings)."""

    cluster: str
    namespace: str
    kind: str  # Pod | Node | Namespace
    name: str

    def qualified_name(self) -> str:
        return f"{self.namespace}/{self.name}" if self.namespace else self.name


@dataclass(frozen=True, slots=True)
class LabelSelector:
    """Parsed label selector; subset of K8s grammar (equality only — sufficient for v1)."""

    pairs: dict[str, str] = field(default_factory=dict)

    @classmethod
    def parse(cls, raw: str | None) -> "LabelSelector":
        if not raw:
            return cls()
        out: dict[str, str] = {}
        for chunk in raw.split(","):
            chunk = chunk.strip()
            if not chunk or "=" not in chunk:
                continue
            k, v = chunk.split("=", 1)
            k, v = k.strip(), v.strip()
            if not k or not v:
                continue
            out[k] = v
        return cls(pairs=out)

    def to_query(self) -> str | None:
        return ",".join(f"{k}={v}" for k, v in self.pairs.items()) or None
