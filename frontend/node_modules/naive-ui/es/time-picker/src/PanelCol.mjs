import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, defineComponent, openBlock } from "vue";
//#region src/time-picker/src/PanelCol.tsx
const _hoisted_1 = ["data-active", "onClick"];
var PanelCol_default = defineComponent({
  name: "TimePickerPanelCol",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    activeValue: {
      type: [Number, String],
      default: null
    },
    onItemClick: Function
  },
  render() {
    const {
      activeValue,
      onItemClick,
      clsPrefix
    } = this;
    return this.data.map(item => {
      const {
        label,
        disabled,
        value
      } = item;
      const active = activeValue === value;
      return openBlock(), createElementBlock("div", {
        key: label,
        "data-active": active ? "" : null,
        class: normalizeClass$1([`${clsPrefix}-time-picker-col__item`, active && `${clsPrefix}-time-picker-col__item--active`, disabled && `${clsPrefix}-time-picker-col__item--disabled`]),
        onClick: onItemClick && !disabled ? () => {
          onItemClick(value);
        } : void 0
      }, [normalizeVNode(() => label)], 10, _hoisted_1);
    });
  }
});
//#endregion
export { PanelCol_default as default };