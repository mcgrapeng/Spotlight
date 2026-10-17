import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'

vi.mock('@/stores/cluster', () => {
  const reactiveObj: any = {
    activeCluster: 'demo-cluster',
    activeNamespace: 'default',
    clusters: [
      { name: 'demo-cluster', cluster: 'https://demo:6443', user: 'admin',
        namespace: 'default', is_current: true },
    ],
  }
  return { useClusterStore: () => reactiveObj }
})

// ponytail: SettingsView 现在调用 useAuthStore (登出入口)，mock 一个最小实现
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    required: false,
    busy: false,
    error: null,
    logout: vi.fn(),
    login: vi.fn(),
    refreshStatus: vi.fn(),
  }),
}))

import SettingsView from '../SettingsView.vue'
import { getI18n } from '@/i18n'

// SettingsView reads its copy through `useI18n()`, so the mount needs the same
// instance `main.ts` installs. A locally created i18n would not share the
// `getI18n()` singleton the assertions below pin, so use the singleton itself.
const i18n = getI18n()

beforeEach(() => {
  vi.clearAllMocks()
  // The singleton outlives each test; rewind so `mountSettings` is order-independent.
  i18n.global.locale.value = 'zh-CN'
})

function mountSettings() {
  return mount(SettingsView, {
    global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
  })
}

describe('SettingsView', () => {
  it('renders the header and AI settings link', () => {
    const wrapper = mountSettings()
    expect(wrapper.text()).toContain('设置')
    expect(wrapper.text()).toContain('AI 模型')
    expect(wrapper.text()).toContain('OpenAI')
  })

  it('shows current cluster context', () => {
    const wrapper = mountSettings()
    expect(wrapper.text()).toContain('demo-cluster')
    expect(wrapper.text()).toContain('default')
    expect(wrapper.text()).toContain('https://demo:6443')
  })

  it('shows fallback text when no cluster is active', () => {
    vi.resetModules()
    vi.doMock('@/stores/cluster', () => {
      const reactiveObj: any = { activeCluster: null, activeNamespace: '_all', clusters: [] }
      return { useClusterStore: () => reactiveObj }
    })
    return import('../SettingsView.vue').then(({ default: SV }) => {
      const wrapper = mount(SV, {
        global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
      })
      expect(wrapper.text()).toContain('未选择')
    })
  })

  it('switches its chrome copy when the locale changes', async () => {
    const wrapper = mountSettings()
    expect(wrapper.text()).toContain('当前集群上下文')
    i18n.global.locale.value = 'en-US'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Current cluster context')
    expect(wrapper.text()).not.toContain('当前集群上下文')
  })

  // 新增：登出入口可见 + 点击触发 logout + 弹确认 Dialog
  it('exposes a logout entry that opens a confirmation dialog', async () => {
    // attachTo 让 Teleport 渲染的 Dialog 进入 wrapper 树
    const wrapper = mount(SettingsView, {
      attachTo: document.body,
      global: {
        plugins: [i18n],
        stubs: { RouterLink: RouterLinkStub },
        mocks: {
          // 防止 router.replace 真跳
          $router: { replace: vi.fn(), push: vi.fn() },
        },
      },
    })
    expect(wrapper.text()).toContain('登出')
    await wrapper.find('button[aria-label="登出"]').trigger('click')
    await wrapper.vm.$nextTick()
    // Teleport 把 Dialog 渲染到 body，要从 document 读
    expect(document.body.textContent).toContain('确认登出')
    expect(document.body.textContent).toContain('登出后会回到登录页')
    wrapper.unmount()
  })
})