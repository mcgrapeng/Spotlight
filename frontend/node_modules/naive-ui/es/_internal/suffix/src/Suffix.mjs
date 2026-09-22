import { resolveSlot } from "../../../_utils/vue/resolve-slot.mjs";
import { normalizeClass as normalizeClass$1 } from "../../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../icon/src/Icon.mjs";
import ChevronDown_default from "../../icons/ChevronDown.mjs";
import Clear_default from "../../clear/src/Clear.mjs";
import Loading_default from "../../loading/src/Loading.mjs";
import { createBlock, defineComponent, openBlock } from "vue";
//#region src/_internal/suffix/src/Suffix.tsx
var Suffix_default = defineComponent({
  name: "InternalSelectionSuffix",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    showArrow: {
      type: Boolean,
      default: void 0
    },
    showClear: {
      type: Boolean,
      default: void 0
    },
    loading: Boolean,
    onClear: Function
  },
  setup(props, {
    slots
  }) {
    return () => {
      const {
        clsPrefix
      } = props;
      return openBlock(), createBlock(Loading_default, {
        clsPrefix,
        class: normalizeClass$1(`${clsPrefix}-base-suffix`),
        strokeWidth: 24,
        scale: .85,
        show: props.loading
      }, {
        default: () => props.showArrow ? (openBlock(), createBlock(Clear_default, {
          key: 1,
          clsPrefix,
          show: props.showClear,
          onClear: props.onClear
        }, {
          placeholder: () => (openBlock(), createBlock(Icon_default, {
            clsPrefix,
            class: normalizeClass$1(`${clsPrefix}-base-suffix__arrow`)
          }, {
            default: () => resolveSlot(slots.default, () => [(openBlock(), createBlock(ChevronDown_default))])
          }, 1032, ["clsPrefix", "class"]))
        }, 1032, ["clsPrefix", "show", "onClear"])) : null
      }, 1032, ["clsPrefix", "class", "show"]);
    };
  }
});
//#endregion
export { Suffix_default as default };