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
      d: 'M17 10h4v4'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M3 12c.887-1.284 2.48-2.033 4-2c1.52-.033 3.113.716 4 2s2.48 2.033 4 2c1.52.033 3-1 4-2l2-2'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'ArrowWaveRightUp',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
