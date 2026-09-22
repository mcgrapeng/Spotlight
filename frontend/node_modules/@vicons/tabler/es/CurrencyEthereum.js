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
      d: 'M6 12l6-9l6 9l-6 9z'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M6 12l6-3l6 3l-6 2z'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'CurrencyEthereum',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
