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
      d: 'M13 10l7.383 7.418c.823.82.823 2.148 0 2.967a2.11 2.11 0 0 1-2.976 0L10 13'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M6.293 15.293l-2.586-2.586a1 1 0 0 1 0-1.414l7.586-7.586a1 1 0 0 1 1.414 0l2.586 2.586a1 1 0 0 1 0 1.414l-7.586 7.586a1 1 0 0 1-1.414 0z'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'Hammer',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
