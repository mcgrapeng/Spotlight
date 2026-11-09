"""One mapping from a Kubernetes API failure to an HTTP answer.

The list endpoints used to let `ApiException` escape: an RBAC denial, an
apiserver rate limit or a read timeout became `500 Internal Server Error`
with a plain-text body, and the frontend could only show its generic
"加载失败" — the user could not tell "I lack permission" from "the cluster
is down" from "we are being rate-limited".

The same mapping already existed, one copy at a time, in `routes/pods.py`
and `routes/logs.py`. This is that mapping, once.
"""
from __future__ import annotations

from typing import Awaitable, TypeVar

from fastapi import HTTPException
from kubernetes.client.exceptions import ApiException
from urllib3.exceptions import RequestError

T = TypeVar("T")


def k8s_http_error(e: ApiException, *, what: str = "查询失败") -> HTTPException:
    """Turn a Kubernetes `ApiException` into the answer it deserves.

    - 401/403 → the same status: the session's own kubeconfig says no.
    - 404 → 404: the object is gone.
    - 429 → 429, with `Retry-After` when the apiserver sent one.
    - anything else → 502: the cluster did not answer properly.

    Unknown context (409) and "no credentials" (503) are raised by the
    client pool, not here — they never reach this function.
    """
    if e.status in (401, 403):
        return HTTPException(status_code=e.status, detail=f"没有权限{what}")
    if e.status == 404:
        return HTTPException(status_code=404, detail=f"{what}：资源不存在")
    if e.status == 429:
        headers: dict[str, str] = {}
        retry_after = (getattr(e, "headers", None) or {}).get("Retry-After")
        if retry_after:
            headers["Retry-After"] = retry_after
        return HTTPException(
            status_code=429, detail="apiserver 限流，请稍后重试", headers=headers,
        )
    return HTTPException(status_code=502, detail=f"{what}：K8s API 请求失败")


async def k8s_call(awaitable: Awaitable[T], *, what: str = "查询失败") -> T:
    """Await a Kubernetes call and translate its failures.

    The Kubernetes SDK does not convert a read timeout into an
    `ApiException` — `rest.py` only catches `SSLError` — so a timeout would
    otherwise escape as an opaque 500 too. The class urllib3 raises is
    `MaxRetryError` (it retries a timed-out read before giving up), and that
    is a sibling of `ReadTimeoutError`, not a child — so catch their parent.
    """
    try:
        return await awaitable
    except ApiException as e:
        raise k8s_http_error(e, what=what) from e
    except RequestError as e:
        raise HTTPException(status_code=504, detail=f"{what}：K8s API 超时") from e
