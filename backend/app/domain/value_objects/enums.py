from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import NewType


class PodPhase(str, Enum):
    """K8s Pod lifecycle phase. Strict — invalid values raise."""

    PENDING = "Pending"
    RUNNING = "Running"
    SUCCEEDED = "Succeeded"
    FAILED = "Failed"
    UNKNOWN = "Unknown"

    @classmethod
    def parse(cls, raw: str | None) -> "PodPhase":
        if not raw:
            return cls.UNKNOWN
        try:
            return cls(raw)
        except ValueError:
            return cls.UNKNOWN

    @property
    def is_healthy(self) -> bool:
        return self in (PodPhase.RUNNING, PodPhase.SUCCEEDED)


class ContainerState(str, Enum):
    RUNNING = "running"
    WAITING = "waiting"
    TERMINATED = "terminated"
    UNKNOWN = "unknown"


class NodeStatus(str, Enum):
    READY = "Ready"
    NOT_READY = "NotReady"
    UNKNOWN = "Unknown"


class LogSeverity(str, Enum):
    """Universal log severity. Maps to UI palette + filtering."""

    TRACE = "trace"
    DEBUG = "debug"
    INFO = "info"
    NOTICE = "notice"
    WARN = "warn"
    ERROR = "error"
    CRITICAL = "critical"
    FATAL = "fatal"
    UNKNOWN = "unknown"

    @classmethod
    def ordered(cls) -> list["LogSeverity"]:
        return [
            cls.TRACE, cls.DEBUG, cls.INFO, cls.NOTICE,
            cls.WARN, cls.ERROR, cls.CRITICAL, cls.FATAL, cls.UNKNOWN,
        ]

    def rank(self) -> int:
        return self.ordered().index(self)

    def is_at_least(self, threshold: "LogSeverity") -> bool:
        return self.rank() >= threshold.rank()

    @property
    def color_var(self) -> str:
        # CSS variable name; resolved by frontend theme
        return {
            LogSeverity.TRACE: "--log-trace",
            LogSeverity.DEBUG: "--log-debug",
            LogSeverity.INFO: "--log-info",
            LogSeverity.NOTICE: "--log-notice",
            LogSeverity.WARN: "--log-warn",
            LogSeverity.ERROR: "--log-error",
            LogSeverity.CRITICAL: "--log-critical",
            LogSeverity.FATAL: "--log-fatal",
            LogSeverity.UNKNOWN: "--log-unknown",
        }[self]


@dataclass(frozen=True, slots=True)
class PodMetrics:
    restart_count: int
    ready_containers: int
    total_containers: int

    @property
    def is_fully_ready(self) -> bool:
        return self.ready_containers == self.total_containers > 0

    @property
    def readiness_ratio(self) -> float:
        return self.ready_containers / self.total_containers if self.total_containers else 0.0


NamespaceName = NewType("NamespaceName", str)
PodName = NewType("PodName", str)
ContainerName = NewType("ContainerName", str)
NodeName = NewType("NodeName", str)
ClusterName = NewType("ClusterName", str)
