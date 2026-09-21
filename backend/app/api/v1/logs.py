import json
from typing import AsyncIterator, Optional

from fastapi import APIRouter, Query
from sse_starlette.sse import EventSourceResponse

from app.core.logging import get_logger
from app.services import k8s_service

router = APIRouter()
log = get_logger(__name__)


@router.get("/{namespace}/{name}/logs/stream", summary="SSE 流式日志")
async def stream_logs(
    namespace: str,
    name: str,
    context: Optional[str] = Query(default=None),
    container: Optional[str] = Query(default=None),
    tail_lines: int = Query(default=200, ge=10, le=5000),
) -> EventSourceResponse:
    async def event_generator() -> AsyncIterator[dict]:
        log.info("SSE open pod=%s/%s container=%s", namespace, name, container)
        try:
            for line in k8s_service.stream_pod_logs(
                context=context,
                namespace=namespace,
                name=name,
                container=container,
                tail_lines=tail_lines,
                follow=True,
            ):
                yield {"event": "log", "data": json.dumps(line, ensure_ascii=False)}
        except Exception as e:
            log.exception("SSE error: %s", e)
            yield {"event": "error", "data": json.dumps({"message": str(e)})}
        finally:
            yield {"event": "end", "data": "[DONE]"}

    return EventSourceResponse(event_generator())


@router.get("/{namespace}/{name}/logs", summary="一次性读取历史日志")
def read_logs(
    namespace: str,
    name: str,
    context: Optional[str] = Query(default=None),
    container: Optional[str] = Query(default=None),
    tail_lines: int = Query(default=500, ge=10, le=5000),
):
    lines = list(
        k8s_service.stream_pod_logs(
            context=context,
            namespace=namespace,
            name=name,
            container=container,
            tail_lines=tail_lines,
            follow=False,
        )
    )
    return {"total": len(lines), "items": lines}
