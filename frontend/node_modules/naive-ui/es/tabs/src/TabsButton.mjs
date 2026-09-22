import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import ChevronLeft_default from "../../_internal/icons/ChevronLeft.mjs";
import ChevronRight_default from "../../_internal/icons/ChevronRight.mjs";
import Button from "../../button/src/Button.mjs";
import { createBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/tabs/src/TabsButton.tsx
var TabsButton_default = defineComponent({
  name: "TabsButton",
  props: {
    type: {
      type: String,
      default: "next"
    },
    mergedClsPrefix: {
      type: String,
      required: true
    },
    vertical: Boolean,
    disabled: Boolean,
    rtl: Boolean,
    theme: Object,
    themeOverrides: Object,
    onClick: Function
  },
  setup(props) {
    const handleClick = () => {
      if (!props.disabled) props.onClick?.(props.type);
    };
    return {
      handleClick
    };
  },
  render() {
    const {
      mergedClsPrefix,
      disabled,
      type,
      vertical,
      rtl,
      theme,
      themeOverrides,
      handleClick
    } = this;
    const isNext = type === "next";
    const showRightIcon = vertical ? isNext : rtl ? !isNext : isNext;
    return openBlock(), createBlock(Button, {
      text: true,
      disabled,
      size: "small",
      theme,
      themeOverrides,
      onClick: handleClick,
      class: normalizeClass$1([`${mergedClsPrefix}-tabs-scroll-button`, !vertical && type === "prev" && `${mergedClsPrefix}-tabs-scroll-button--start`, !vertical && type === "next" && `${mergedClsPrefix}-tabs-scroll-button--end`, vertical && type === "prev" && `${mergedClsPrefix}-tabs-scroll-button--up`, vertical && type === "next" && `${mergedClsPrefix}-tabs-scroll-button--down`])
    }, {
      icon: () => (openBlock(), createBlock(Icon_default, {
        clsPrefix: mergedClsPrefix,
        style: normalizeStyle(vertical ? {
          transform: "rotate(90deg)"
        } : void 0)
      }, {
        default: () => showRightIcon ? (openBlock(), createBlock(ChevronRight_default, {
          key: 1
        })) : (openBlock(), createBlock(ChevronLeft_default, {
          key: 2
        }))
      }, 1032, ["clsPrefix", "style"]))
    }, 1032, ["disabled", "theme", "themeOverrides", "onClick", "class"]);
  }
});
//#endregion
export { TabsButton_default as default };