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
      d: 'M4 6v8m5.009.783c.924.14 1.933.217 2.991.217c4.418 0 8-1.343 8-3V6'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M11.252 20.987c.246.009.496.013.748.013c4.418 0 8-1.343 8-3v-6M2 19h7m-3-3l3 3l-3 3'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'DatabaseImport',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
