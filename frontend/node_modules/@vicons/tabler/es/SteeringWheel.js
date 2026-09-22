import { openBlock as _openBlock, createElementBlock as _createElementBlock, createStaticVNode as _createStaticVNode, defineComponent } from 'vue'
const _hoisted_1 = {
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': 'http://www.w3.org/1999/xlink',
  viewBox: '0 0 24 24'
}
const _hoisted_2 = /*#__PURE__*/ _createStaticVNode('<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="2"></circle><path d="M12 14v7"></path><path d="M10 12l-6.75-2"></path><path d="M14 12l6.75-2"></path></g>', 1)
const _hoisted_3 = [_hoisted_2]
export default defineComponent({
  name: 'SteeringWheel',
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock('svg', _hoisted_1, _hoisted_3)
  }
})
