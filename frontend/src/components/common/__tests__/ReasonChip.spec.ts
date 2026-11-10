import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ReasonChip from '../ReasonChip.vue'
import { getI18n } from '@/i18n'

const i18n = getI18n()

beforeEach(() => {
  i18n.global.locale.value = 'zh-CN'
})

describe('ReasonChip', () => {
  it('shows the term as-is for a known term', () => {
    const wrapper = mount(ReasonChip, {
      props: { term: 'CrashLoopBackOff' },
      global: { plugins: [i18n] },
    })
    expect(wrapper.text()).toContain('CrashLoopBackOff')
  })

  it('offers an explanation for a known term', () => {
    // 术语解释的入口挂在「那个词的芯片」上，而不是另加一个图标：
    // Pod 详情页的标题区只剩 111px 宽。
    const wrapper = mount(ReasonChip, {
      props: { term: 'CrashLoopBackOff' },
      global: { plugins: [i18n] },
      attachTo: document.body,
    })
    // reka-ui 的 PopoverTrigger 是一个 button
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders a plain chip for a term it does not know', () => {
    // 猜一个解释比不解释更糟：读者会以为它说的是真的。
    const wrapper = mount(ReasonChip, {
      props: { term: 'SomeBrandNewReason' },
      global: { plugins: [i18n] },
    })
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.text()).toContain('SomeBrandNewReason')
  })

  it('leaves the phase chip alone — phases are already bilingual', () => {
    const wrapper = mount(ReasonChip, {
      props: { term: 'Running' },
      global: { plugins: [i18n] },
    })
    expect(wrapper.text()).toContain('Running')
  })

  it('does not let its click reach an enclosing clickable row', () => {
    // Pod 列表的行是 <tr @click="open(row)">。芯片自己可点之后，
    // 点击会同时打开弹层**并**导航到 Pod 详情——两件事一起来。
    // 芯片自己消费掉这个点击（@click.stop）。
    //
    // 注意：这个 button 的根是 fragment，事件不透传到父组件，
    // 所以父组件的 @click.stop 拦不住——拦截只能发生在芯片这一层。
    const onRowClick = vi.fn()
    const wrapper = mount(
      {
        components: { ReasonChip },
        template: '<div @click="onRowClick"><ReasonChip term="CrashLoopBackOff" /></div>',
        setup: () => ({ onRowClick }),
      },
      { global: { plugins: [i18n] }, attachTo: document.body },
    )
    wrapper.find('button').trigger('click')
    expect(onRowClick).not.toHaveBeenCalled()
  })
})
