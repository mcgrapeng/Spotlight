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
      d: 'M19 18a3.5 3.5 0 0 0 0-7h-1c.397-1.768-.285-3.593-1.788-4.787c-1.503-1.193-3.6-1.575-5.5-1S7.397 7.232 7 9c-2.199-.088-4.155 1.326-4.666 3.373c-.512 2.047.564 4.154 2.566 5.027'
    }),
    /*#__PURE__*/ _createElementVNode('rect', {
      x: '8',
      y: '15',
      width: '8',
      height: '5',
      rx: '1'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M10 15v-2a2 2 0 1 1 4 0v2'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'CloudLock',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
