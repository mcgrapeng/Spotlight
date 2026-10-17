import { describe, expect, it } from 'vitest'
import zhCN from '../locales/zh-CN'
import en from '../locales/en'

/** Flatten a message tree to dot-paths, e.g. `nav.collapseSidebar`. */
function keyPaths(tree: object, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? keyPaths(v, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  )
}

const zh = keyPaths(zhCN)
const enPaths = keyPaths(en)

describe('locale message trees', () => {
  // A key present in only one file is the worst failure mode here: vue-i18n
  // falls back silently, so the user sees Chinese copy under an English UI and
  // nothing — not even the type-checker — complains.
  it('declares exactly the same keys in both locales', () => {
    expect(zh.sort()).toEqual(enPaths.sort())
  })

  it('has no empty values', () => {
    const flat = (tree: object, prefix = ''): [string, unknown][] =>
      Object.entries(tree).flatMap(([k, v]) =>
        typeof v === 'object' && v !== null ? flat(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]],
      )
    for (const [key, value] of [...flat(zhCN), ...flat(en)]) {
      expect(value, `${key} is empty`).toBeTruthy()
    }
  })
})
