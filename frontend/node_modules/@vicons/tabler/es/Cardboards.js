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
      d: 'M3 7v8.5A2.5 2.5 0 0 0 5.5 18h1.06a3 3 0 0 0 2.34-1.13l1.54-1.92a2 2 0 0 1 3.12 0l1.54 1.92A3 3 0 0 0 17.44 18h1.06a2.5 2.5 0 0 0 2.5-2.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z'
    }),
    /*#__PURE__*/ _createElementVNode('circle', {
      cx: '8',
      cy: '11',
      r: '1'
    }),
    /*#__PURE__*/ _createElementVNode('circle', {
      cx: '16',
      cy: '11',
      r: '1'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'Cardboards',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
