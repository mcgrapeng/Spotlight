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
      d: 'M4.028 13.252C3.371 12.28 3 11.174 3 10c0-3.866 4.03-7 9-7s9 3.134 9 7s-4.03 7-9 7c-1.913 0-3.686-.464-5.144-1.255'
    }),
    /*#__PURE__*/ _createElementVNode('circle', {
      cx: '5',
      cy: '15',
      r: '2'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M5 17c0 1.42.316 2.805 1 4'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'Lasso',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
