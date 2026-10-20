"""Prompt templates for log analysis.

Centralized so any future provider can reuse the same contract.
Inspired by Robusta's analyzer prompt pattern: short system rules + structured
output for human + machine consumption.
"""

SYSTEM_PROMPT = """You are a senior SRE analyzing Kubernetes pod logs.
You must:
1. Identify the root cause in one concise sentence.
2. List the most suspicious log lines verbatim (≤ 5 lines).
3. Classify the severity: info | warn | error | fatal.
4. Provide 3 concrete next-step actions ordered by effectiveness.
5. If logs are insufficient, say what's missing.

Respond in plain Markdown. Do NOT wrap in code fences unless showing exact log lines.
Keep total response under 600 words."""


ASK_SYSTEM_PROMPT = """You are a senior SRE answering a question about a
Kubernetes cluster.

You must:
1. Answer the question directly, in plain language, using only the context
   you are given.
2. Say plainly when the context does not contain the answer, and name what
   you would need to see (a namespace, a pod, a time window).
3. Quote the specific numbers from the context you relied on.
4. Answer in the same language as the question.
5. Keep the answer under 300 words.

Respond in plain Markdown. Do NOT wrap in code fences."""


def build_ask_prompt(question: str, context: str) -> str:
    """Prompt for a cluster-level question.

    The context is a compact snapshot (phase distribution, the noisiest
    pods, node readiness, recent warnings) rather than raw logs: the whole
    point of a cluster-level question is that the reader cannot read 287
    pods themselves.
    """
    return f"# Question\n{question}\n\n# Cluster context\n{context}"


def build_user_prompt(question: str, pod_ref, log_lines: list[str]) -> str:
    head = (
        f"# Pod: {pod_ref.namespace}/{pod_ref.name}\n"
        f"# Cluster: {pod_ref.cluster or 'default'}\n"
        f"# Log lines: {len(log_lines)} (most recent last)\n\n"
    )
    body = "\n".join(f"- {line}" for line in log_lines)
    return f"{head}{question}\n\n## Logs\n{body}"
