'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const vue_1 = require('vue')
const _hoisted_1 = {
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': 'http://www.w3.org/1999/xlink',
  viewBox: '0 0 24 24'
}
const _hoisted_2 = /*#__PURE__*/ (0, vue_1.createElementVNode)(
  'g',
  {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  [
    /*#__PURE__*/ (0, vue_1.createElementVNode)('circle', {
      cx: '12',
      cy: '12',
      r: '9'
    }),
    /*#__PURE__*/ (0, vue_1.createElementVNode)('path', {
      d: 'M10 16.5l2-3l2 3m-2-3v-2l3-1m-6 0l3 1'
    }),
    /*#__PURE__*/ (0, vue_1.createElementVNode)('circle', {
      cx: '12',
      cy: '7.5',
      r: '.5',
      fill: 'currentColor'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
exports.default = (0, vue_1.defineComponent)({
  name: 'Accessible',
  render: function render(_ctx, _cache) {
    return (0, vue_1.openBlock)(), (0, vue_1.createElementBlock)('svg', _hoisted_1, _hoisted_3)
  }
})
