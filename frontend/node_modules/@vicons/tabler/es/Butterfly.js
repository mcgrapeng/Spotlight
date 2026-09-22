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
      d: 'M11.995 18.176a3 3 0 1 1-4.953-2.449l-.025.023A4.502 4.502 0 0 1 8.5 7c1.414 0 2.675.652 3.5 1.671a4.5 4.5 0 1 1 4.983 7.079A3 3 0 1 1 12 18z'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M12 19V9'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M9 3l3 2l3-2'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'Butterfly',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
