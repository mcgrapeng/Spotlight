import useStyle from "../../../_mixins/use-style.mjs";
import { createVNodeCache, normalizeClass as normalizeClass$1 } from "../../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../icon/src/Icon.mjs";
import Close_default$1 from "../../icons/Close.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createBlock, defineComponent, openBlock, toRef, withCtx } from "vue";
//#region src/_internal/close/src/Close.tsx
var Close_default = defineComponent({
  name: "BaseClose",
  props: {
    isButtonTag: {
      type: Boolean,
      default: true
    },
    clsPrefix: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: void 0
    },
    focusable: {
      type: Boolean,
      default: true
    },
    round: Boolean,
    onClick: Function,
    absolute: Boolean
  },
  setup(props) {
    useStyle("-base-close", index_cssr_default, toRef(props, "clsPrefix"));
    return () => {
      const {
        clsPrefix,
        disabled,
        absolute,
        round,
        isButtonTag
      } = props;
      const Tag = isButtonTag ? "button" : "div";
      return (() => {
        const _cache = createVNodeCache("b5bdc9fe09f5ae00");
        return openBlock(), createBlock(Tag, {
          type: isButtonTag ? "button" : void 0,
          tabindex: disabled || !props.focusable ? -1 : 0,
          "aria-disabled": disabled,
          "aria-label": "close",
          role: isButtonTag ? void 0 : "button",
          disabled,
          class: normalizeClass$1([`${clsPrefix}-base-close`, absolute && `${clsPrefix}-base-close--absolute`, disabled && `${clsPrefix}-base-close--disabled`, round && `${clsPrefix}-base-close--round`]),
          onMousedown: _cache[0] || (_cache[0] = e => {
            if (!props.focusable) e.preventDefault();
          }),
          onClick: props.onClick
        }, {
          default: withCtx(() => [(openBlock(), createBlock(Icon_default, {
            clsPrefix
          }, {
            default: () => (openBlock(), createBlock(Close_default$1))
          }, 1032, ["clsPrefix"]))]),
          _: 2
        }, 1032, ["type", "tabindex", "aria-disabled", "role", "disabled", "class", "onClick"]);
      })();
    };
  }
});
//#endregion
export { Close_default as default };