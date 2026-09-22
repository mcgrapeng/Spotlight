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
    /*#__PURE__*/ _createElementVNode('ellipse', {
      cx: '12',
      cy: '6',
      rx: '8',
      ry: '3'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M4 6v6c0 1.657 3.582 3 8 3a19.84 19.84 0 0 0 3.302-.267M20 12V6'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M4 12v6c0 1.599 3.335 2.905 7.538 2.995M20 14v-2m-6 7h7m-3-3l3 3l-3 3'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'DatabaseExport',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
