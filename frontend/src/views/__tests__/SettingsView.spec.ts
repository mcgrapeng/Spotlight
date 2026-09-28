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

import SettingsView from '../SettingsView.vue'

beforeEach(() => {
  vi.clearAllMocks()
})

function mountSettings() {
  return mount(SettingsView, {
    global: { stubs: { RouterLink: RouterLinkStub } },
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
        global: { stubs: { RouterLink: RouterLinkStub } },
      })
      expect(wrapper.text()).toContain('未选择')
    })
  })
})