/**
 * E2E specs.
 *
 * Two kinds live here, and the difference matters:
 *
 * 1. **UI specs** (`smoke`, `a11y`, `full-flow`, `happy-path`, `auth`) mock
 *    every `/api/v1/*` call with `page.route()`. They isolate the UI and are
 *    fast, but they cannot answer one question: *does the cluster you pick
 *    actually change what the backend reads?* A mock answers whatever it is
 *    asked for, so asking for the wrong cluster still returns plausible pods.
 *
 * 2. **`cluster-switch.spec.ts`** runs against the real backend and two real
 *    fake apiservers (`fake-apiserver.js`, one per kubeconfig context, each
 *    stamping its own name into every object it returns). Ports and the
 *    generated kubeconfig live in `_cluster-env.ts`; `playwright.config.ts`
 *    starts all four servers. Reverting the backend routes to the old
 *    `?cluster=` query parameter makes this spec fail with
 *    "staging-pod-a never rendered" — which is the bug it exists to catch, and
 *    which every mocked spec happily sailed past.
 *
 * Local scratch inspectors (`zz-*`) and the live-dev-stack log spec are not
 * tracked; see `playwright.dev.config.ts` for those.
 */
