/**
 * Shared environment for the multi-cluster e2e spec.
 *
 * Everything here is deterministic and module-level on purpose: Playwright's
 * `webServer` entries are declared in `playwright.config.ts`, which is loaded
 * in a different process than the specs. Writing a manifest from
 * `globalSetup` and reading it later would work, but the ports still have to be
 * agreed on up front — so they are just constants here, imported by both sides.
 *
 * Fixed ports, not free-port scanning: a silent shift would make the fake
 * apiserver the spec is asserting against a different one, and every failure
 * would look like a product bug. If a port is busy the server fails to start
 * loudly instead.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))

export const FAKE_PROD_PORT = 18081
export const FAKE_STAGING_PORT = 18082
export const BACKEND_PORT = 18080

export const PROD_CONTEXT = 'prod-cluster'
export const STAGING_CONTEXT = 'staging-cluster'

/** Fake apiservers stamp their short name into every object they return. */
export const PROD_SHORT = 'prod'
export const STAGING_SHORT = 'staging'
export const PROD_POD = `${PROD_SHORT}-pod-a`
export const STAGING_POD = `${STAGING_SHORT}-pod-a`

export const KUBECONFIG_PATH = resolve(HERE, '.tmp', 'cluster-switch-kubeconfig.yaml')

const KUBECONFIG = `apiVersion: v1
kind: Config
current-context: ${PROD_CONTEXT}
clusters:
- name: ${PROD_SHORT}
  cluster: {server: 'http://127.0.0.1:${FAKE_PROD_PORT}'}
- name: ${STAGING_SHORT}
  cluster: {server: 'http://127.0.0.1:${FAKE_STAGING_PORT}'}
contexts:
- name: ${PROD_CONTEXT}
  context: {cluster: ${PROD_SHORT}, user: u, namespace: ${PROD_SHORT}-ns}
- name: ${STAGING_CONTEXT}
  context: {cluster: ${STAGING_SHORT}, user: u, namespace: ${STAGING_SHORT}-ns}
users:
- name: u
  user: {token: fake-token}
`

/**
 * Write the kubeconfig at config-load time so it exists before the backend
 * starts. `current-context` is deliberately the prod one: landing there proves
 * the default path works, and switching away from it proves the switch does.
 */
export function ensureKubeconfig(): string {
  mkdirSync(dirname(KUBECONFIG_PATH), { recursive: true })
  writeFileSync(KUBECONFIG_PATH, KUBECONFIG)
  return KUBECONFIG_PATH
}

/** Fake apiserver source, run as a standalone process by webServer. */
export const FAKE_APISERVER = resolve(HERE, 'fake-apiserver.js')

/** Backend location — spawned with the generated kubeconfig in its env. */
export const BACKEND_DIR = resolve(HERE, '..', '..', 'backend')

/**
 * Interpreter used to start the backend for `cluster-switch.spec.ts`.
 *
 * Defaults to the project's own venv, which is what a developer has. CI has
 * no such path, so `SPOTLIGHT_BACKEND_PY` overrides it — otherwise the spec
 * would only run on machines set up the developer's way.
 */
export const BACKEND_PY = process.env.SPOTLIGHT_BACKEND_PY
  || resolve(BACKEND_DIR, '.venv', 'bin', 'python')

/**
 * Whether the backend interpreter can actually be launched.
 *
 * `SPOTLIGHT_BACKEND_PY` is frequently a bare command name — CI passes
 * `python` and relies on PATH. Asking the filesystem about a relative path
 * like that finds nothing, and because `playwright.config.ts` treats a miss as
 * fatal under CI, the whole run dies at config-load time with a message that
 * blames the wrong thing. So: probe the filesystem only when the value looks
 * like a path. A bare command is the operator's word that it resolves; an
 * explicit path that does not exist still fails, loudly and early.
 */
export function backendInterpreterAvailable(): boolean {
  const looksLikePath = BACKEND_PY.includes('/') || BACKEND_PY.includes(sep)
  return looksLikePath ? existsSync(BACKEND_PY) : true
}
