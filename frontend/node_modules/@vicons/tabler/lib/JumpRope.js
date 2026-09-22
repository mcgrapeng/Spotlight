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
    /*#__PURE__*/ (0, vue_1.createElementVNode)('path', {
      d: 'M6 14V8a3 3 0 1 1 6 0v8a3 3 0 0 0 6 0v-6'
    }),
    /*#__PURE__*/ (0, vue_1.createElementVNode)('rect', {
      x: '16',
      y: '3',
      width: '4',
      height: '7',
      rx: '2'
    }),
    /*#__PURE__*/ (0, vue_1.createElementVNode)('rect', {
      x: '4',
      y: '14',
      width: '4',
      height: '7',
      rx: '2'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
exports.default = (0, vue_1.defineComponent)({
  name: 'JumpRope',
  render: function render(_ctx, _cache) {
    return (0, vue_1.openBlock)(), (0, vue_1.createElementBlock)('svg', _hoisted_1, _hoisted_3)
  }
})
