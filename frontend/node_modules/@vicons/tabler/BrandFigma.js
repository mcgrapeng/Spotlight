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
      cx: '15',
      cy: '12',
      r: '3'
    }),
    /*#__PURE__*/ (0, vue_1.createElementVNode)('rect', {
      x: '6',
      y: '3',
      width: '12',
      height: '6',
      rx: '3'
    }),
    /*#__PURE__*/ (0, vue_1.createElementVNode)('path', {
      d: 'M9 9a3 3 0 0 0 0 6h3m-3 0a3 3 0 1 0 3 3V3'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
exports.default = (0, vue_1.defineComponent)({
  name: 'BrandFigma',
  render: function render(_ctx, _cache) {
    return (0, vue_1.openBlock)(), (0, vue_1.createElementBlock)('svg', _hoisted_1, _hoisted_3)
  }
})
