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
      d: 'M8.7 3h6.6c.3 0 .5.1.7.3L20.7 8c.2.2.3.4.3.7v6.6c0 .3-.1.5-.3.7L16 20.7c-.2.2-.4.3-.7.3H8.7c-.3 0-.5-.1-.7-.3L3.3 16c-.2-.2-.3-.4-.3-.7V8.7c0-.3.1-.5.3-.7L8 3.3c.2-.2.4-.3.7-.3z'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M12 8v4'
    }),
    /*#__PURE__*/ _createElementVNode('path', {
      d: 'M12 16h.01'
    })
  ],
  -1
  /* HOISTED */
)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'AlertOctagon',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
