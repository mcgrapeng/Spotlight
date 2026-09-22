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
    /*#__PURE__*/ _createElementVNode('circle', {
      cx: '9.5',
      cy: '9.5',
      r: '6.5'
    }),
    /*#__PURE__*/ _createElementVNode('rect', {
      x: '10',
      y: '10',
      width: '11',
      height: '11',
      rx: '2'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'CircleSquare',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
