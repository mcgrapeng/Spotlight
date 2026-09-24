import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Card, CardHeader, CardTitle, CardContent } from '../card'

describe('Card', () => {
  it('renders Card with content slot', () => {
    const wrapper = mount(Card, {
      slots: { default: '<p>card body</p>' },
    })
    expect(wrapper.html()).toContain('card body')
  })

  it('renders CardHeader + CardTitle + CardContent together', () => {
    const wrapper = mount({
      components: { Card, CardHeader, CardTitle, CardContent },
      template: `
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Body</CardContent>
        </Card>
      `,
    })
    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Body')
  })
})