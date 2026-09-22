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
      d: 'M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M20 18H3'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M6 15l-3 3l3 3'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'ArrowAutofitLeft',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
