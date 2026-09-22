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
      d: 'M10.5 20.4l-6.9-6.9c-.781-.781-.781-2.219 0-3l6.9-6.9c.781-.781 2.219-.781 3 0l6.9 6.9c.781.781.781 2.219 0 3l-6.9 6.9c-.781.781-2.219.781-3 0z'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M9 14v-2c0-.59.414-1 1-1h5'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M13 9l2 2l-2 2'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'RoadSign',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
