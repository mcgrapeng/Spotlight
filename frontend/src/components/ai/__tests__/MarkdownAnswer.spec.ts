import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownAnswer from '../MarkdownAnswer.vue'

function render(text: string) {
  return mount(MarkdownAnswer, { props: { text } })
}

describe('MarkdownAnswer', () => {
  it('renders a heading as a heading', () => {
    const w = render('## 为什么这个 Pod 在重启')
    expect(w.find('h3').exists()).toBe(true)
    expect(w.find('h3').text()).toBe('为什么这个 Pod 在重启')
  })

  it('renders a bullet list as a list', () => {
    const w = render('- 第一条\n- 第二条')
    expect(w.findAll('li').length).toBe(2)
    expect(w.find('ul').exists()).toBe(true)
  })

  it('renders strong and emphasis as elements', () => {
    const w = render('这是**重点**，那是*次要*')
    expect(w.find('strong').text()).toBe('重点')
    expect(w.find('em').text()).toBe('次要')
  })

  it('renders a fenced code block as <pre><code>', () => {
    const w = render('\`\`\`bash\nkubectl get pods\n\`\`\`')
    expect(w.find('pre code').text()).toBe('kubectl get pods')
  })

  it('does not turn markup into elements — the text stays text', () => {
    // The whole point of rendering a tree instead of an HTML string.
    const w = render('<img src=x onerror="alert(1)">')
    expect(w.find('img').exists()).toBe(false)
    expect(w.text()).toContain('<img src=x')
  })

  it('does not make a javascript: link clickable', () => {
    const w = render('[点我](javascript:alert(1))')
    expect(w.find('a').exists()).toBe(false)
  })

  it('makes an http link safe to click', () => {
    const w = render('[文档](https://example.com/a)')
    const a = w.find('a')
    expect(a.exists()).toBe(true)
    expect(a.attributes('href')).toBe('https://example.com/a')
    expect(a.attributes('rel')).toBe('noopener noreferrer')
  })
})
