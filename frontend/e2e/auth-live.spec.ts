/**
 * The auth path, live: real backend, real Teleport proxy, real cluster.
 *
 * Every other auth spec mocks `/api/v1/*`, and a mock answers whatever it
 * is asked for — which is exactly why the `?context=` / `?cluster=` mismatch
 * survived since the initial commit, and why the cluster name vs the
 * kubeconfig context name went unnoticed for the whole history of the repo.
 *
 * This spec drives the actual login form against the actual backend and
 * then checks the one thing a mock cannot check: that every API call the
 * dashboard makes succeeds.
 *
 * It needs credentials, so it skips unless they are in the environment:
 *
 *   SPOTLIGHT_TELEPORT_USER=...        Teleport user
 *   SPOTLIGHT_TELEPORT_PASSWORD=...    Teleport password
 *   SPOTLIGHT_TELEPORT_OTP_SECRET=...  base32 TOTP secret (for the MFA code)
 *
 * Run it against a live dev stack:
 *   node_modules/.bin/playwright test --config=playwright.dev.config.ts e2e/auth-live.spec.ts
 */
import { test, expect } from '@playwright/test'
import { createHmac } from 'node:crypto'

const USER = process.env.SPOTLIGHT_TELEPORT_USER
const PASSWORD = process.env.SPOTLIGHT_TELEPORT_PASSWORD
const OTP_SECRET = process.env.SPOTLIGHT_TELEPORT_OTP_SECRET

/** base32 → bytes (RFC 4648, no padding). */
function base32Decode(input: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const clean = input.replace(/=+$/, '').toUpperCase()
  let bits = 0
  let value = 0
  const out: number[] = []
  for (const char of clean) {
    const idx = alphabet.indexOf(char)
    if (idx < 0) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      bits -= 8
      out.push((value >>> bits) & 0xff)
    }
  }
  return Buffer.from(out)
}

/** RFC 6238 TOTP, 30s step, 6 digits. */
function totp(secret: string, at = Date.now()): string {
  const counter = Math.floor(at / 1000 / 30)
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64BE(BigInt(counter))
  const digest = createHmac('sha1', base32Decode(secret)).update(buf).digest()
  const offset = digest[digest.length - 1] & 0x0f
  const code =
    ((digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000)
      .toString()
      .padStart(6, '0')
  return code
}

test('login → pick a cluster → the dashboard reads real data', async ({ page }) => {
  test.skip(
    !USER || !PASSWORD || !OTP_SECRET,
    'set SPOTLIGHT_TELEPORT_USER / _PASSWORD / _OTP_SECRET to run the live auth flow',
  )

  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto('/login')

  await page.fill('#login-user', USER!)
  await page.fill('#login-password', PASSWORD!)
  const otp = page.locator('#login-otp')
  if (await otp.count()) await otp.fill(totp(OTP_SECRET!))
  await page.click('button[type=submit]')

  // One cluster → the app picks it and moves on. Several → a picker appears
  // and the first one is enough.
  const picker = page.locator('#login-cluster')
  await picker.waitFor({ state: 'visible', timeout: 20_000 }).catch(() => {})
  if (await picker.count()) {
    await picker.click()
    await page.locator('[role=option]').first().click()
    await page.click('button[type=submit]')
  }

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 })

  // From here on, every API call the dashboard makes must succeed. The
  // calls BEFORE the login are not part of that: the app asks
  // /api/v1/clusters before a session exists and gets a 401 — that is the
  // app working, not a failure. Counting it made this spec unpassable.
  const failed: string[] = []
  page.on('response', (r) => {
    if (r.url().includes('/api/v1/') && r.status() >= 400) {
      failed.push(`${r.status()} ${r.url()}`)
    }
  })

  // The dashboard's own data calls must all succeed. A wrong context name, a
  // stale selection or a broken credential plugin all show up here — the
  // mocked specs cannot see any of them.
  await page.waitForTimeout(3_000)
  expect(failed, `API calls failed:\n${failed.join('\n')}`).toEqual([])
  expect(errors, `page errors:\n${errors.join('\n')}`).toEqual([])

  // And the failure state the user sees must not be on the page.
  await expect(page.getByText('加载失败')).toHaveCount(0)
})
