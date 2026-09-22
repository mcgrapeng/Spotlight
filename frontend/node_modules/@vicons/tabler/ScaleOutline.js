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
      x: '3',
      y: '3',
      width: '18',
      height: '18',
      rx: '4'
    }),
    /*#__PURE__*/ (0, vue_1.createElementVNode)('path', {
      d: 'M12 7c1.956 0 3.724.802 4.994 2.095l-2.956 2.904A3 3 0 0 0 12 11.2a3 3 0 0 0-2.038.798L7.006 9.095A6.979 6.979 0 0 1 12 7z'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
exports.default = (0, vue_1.defineComponent)({
  name: 'ScaleOutline',
  render: function render(_ctx, _cache) {
    return (0, vue_1.openBlock)(), (0, vue_1.createElementBlock)('svg', _hoisted_1, _hoisted_3)
  }
})
