import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, defineComponent } from 'vue'
const _hoisted_1 = {
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': 'http://www.w3.org/1999/xlink',
  viewBox: '0 0 24 24'
}
const _hoisted_2 = /*#__PURE__*/ _createElementVNode(
  'g',
  {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  [
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M12 12v.01'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M19.071 4.929a4 10 45 0 0-9.9 4.243a4 10 45 0 0-4.242 9.9a4 10 45 0 0 9.9-4.244a4 10 45 0 0 4.242-9.9'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M4.929 4.929a10 4 45 0 0 4.243 9.9a10 4 45 0 0 9.9 4.242a10 4 45 0 0-4.244-9.9a10 4 45 0 0-9.9-4.242'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'Atom',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
