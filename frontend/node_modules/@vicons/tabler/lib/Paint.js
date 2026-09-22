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
    /*#__PURE__*/ (0, vue_1.createElementVNode)('rect', {
      x: '5',
      y: '3',
      width: '14',
      height: '6',
      rx: '2'
    }),
    /*#__PURE__*/ (0, vue_1.createElementVNode)('path', {
      d: 'M19 6h1a2 2 0 0 1 2 2a5 5 0 0 1-5 5h-5v2'
    }),
    /*#__PURE__*/ (0, vue_1.createElementVNode)('rect', {
      x: '10',
      y: '15',
      width: '4',
      height: '6',
      rx: '1'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
exports.default = (0, vue_1.defineComponent)({
  name: 'Paint',
  render: function render(_ctx, _cache) {
    return (0, vue_1.openBlock)(), (0, vue_1.createElementBlock)('svg', _hoisted_1, _hoisted_3)
  }
})
