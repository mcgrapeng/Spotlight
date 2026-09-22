import { createKey } from "../../_utils/cssr/index.mjs";
import { render } from "../../_utils/vue/render.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import IconSwitchTransition_default from "../../_internal/icon-switch-transition/src/IconSwitchTransition.mjs";
import Error_default from "../../_internal/icons/Error.mjs";
import Info_default from "../../_internal/icons/Info.mjs";
import Success_default from "../../_internal/icons/Success.mjs";
import Warning_default from "../../_internal/icons/Warning.mjs";
import Close_default from "../../_internal/close/src/Close.mjs";
import Loading_default from "../../_internal/loading/src/Loading.mjs";
import { messageProviderInjectionKey } from "./context.mjs";
import messageLight from "../styles/light.mjs";
import { messageProps } from "./message-props.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, createVNode, defineComponent, inject, mergeProps, normalizeStyle, openBlock } from "vue";
//#region src/message/src/Message.tsx
const _hoisted_1 = ["onMouseenter", "onMouseleave"];
const iconRenderMap = {
  info: () => (openBlock(), createBlock(Info_default)),
  success: () => (openBlock(), createBlock(Success_default)),
  warning: () => (openBlock(), createBlock(Warning_default)),
  error: () => (openBlock(), createBlock(Error_default)),
  default: () => null
};
var Message_default = defineComponent({
  name: "Message",
  props: {
    ...messageProps,
    render: Function
  },
  setup(props) {
    const {
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const {
      props: messageProviderProps,
      mergedClsPrefixRef
    } = inject(messageProviderInjectionKey);
    const rtlEnabledRef = useRtl("Message", mergedRtlRef, mergedClsPrefixRef);
    const themeRef = useTheme("Message", "-message", index_cssr_default, messageLight, messageProviderProps, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        type
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          padding,
          margin,
          maxWidth,
          iconMargin,
          closeMargin,
          closeSize,
          iconSize,
          fontSize,
          lineHeight,
          borderRadius,
          border,
          iconColorInfo,
          iconColorSuccess,
          iconColorWarning,
          iconColorError,
          iconColorLoading,
          closeIconSize,
          closeBorderRadius,
          [createKey("textColor", type)]: textColor,
          [createKey("boxShadow", type)]: boxShadow,
          [createKey("color", type)]: color,
          [createKey("closeColorHover", type)]: closeColorHover,
          [createKey("closeColorPressed", type)]: closeColorPressed,
          [createKey("closeIconColor", type)]: closeIconColor,
          [createKey("closeIconColorPressed", type)]: closeIconColorPressed,
          [createKey("closeIconColorHover", type)]: closeIconColorHover
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-margin": margin,
        "--n-padding": padding,
        "--n-max-width": maxWidth,
        "--n-font-size": fontSize,
        "--n-icon-margin": iconMargin,
        "--n-icon-size": iconSize,
        "--n-close-icon-size": closeIconSize,
        "--n-close-border-radius": closeBorderRadius,
        "--n-close-size": closeSize,
        "--n-close-margin": closeMargin,
        "--n-text-color": textColor,
        "--n-color": color,
        "--n-box-shadow": boxShadow,
        "--n-icon-color-info": iconColorInfo,
        "--n-icon-color-success": iconColorSuccess,
        "--n-icon-color-warning": iconColorWarning,
        "--n-icon-color-error": iconColorError,
        "--n-icon-color-loading": iconColorLoading,
        "--n-close-color-hover": closeColorHover,
        "--n-close-color-pressed": closeColorPressed,
        "--n-close-icon-color": closeIconColor,
        "--n-close-icon-color-pressed": closeIconColorPressed,
        "--n-close-icon-color-hover": closeIconColorHover,
        "--n-line-height": lineHeight,
        "--n-border-radius": borderRadius,
        "--n-border": border
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("message", computed(() => props.type[0]), cssVarsRef, {}) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      messageProviderProps,
      handleClose() {
        props.onClose?.();
      },
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      placement: messageProviderProps.placement
    };
  },
  render() {
    const {
      render: renderMessage,
      type,
      closable,
      content,
      mergedClsPrefix,
      cssVars,
      themeClass,
      onRender,
      icon,
      handleClose,
      showIcon
    } = this;
    onRender?.();
    const iconNode = renderMessage || createIconVNode(icon, type, mergedClsPrefix, this.spinProps);
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-message-wrapper`, themeClass]),
      onMouseenter: this.onMouseenter,
      onMouseleave: this.onMouseleave,
      style: normalizeStyle([{
        alignItems: this.placement.startsWith("top") ? "flex-start" : "flex-end"
      }, cssVars])
    }, [renderMessage ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderMessage(this.$props))], 64)) : (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass$1([`${mergedClsPrefix}-message ${mergedClsPrefix}-message--${type}-type`, this.rtlEnabled && `${mergedClsPrefix}-message--rtl`])
    }, [iconNode && showIcon ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-message__icon ${mergedClsPrefix}-message__icon--${type}-type`)
    }, [createVNode(IconSwitchTransition_default, null, {
      default: () => iconNode
    }, 1024)], 2)) : normalizeVNode(() => null), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-message__content`)
    }, [normalizeVNode(() => render(content))], 2), closable ? (openBlock(), createBlock(Close_default, {
      key: 2,
      clsPrefix: mergedClsPrefix,
      class: normalizeClass$1(`${mergedClsPrefix}-message__close`),
      onClick: handleClose,
      absolute: true
    }, null, 8, ["clsPrefix", "class", "onClick"])) : normalizeVNode(() => null)], 2))], 46, _hoisted_1);
  }
});
function createIconVNode(icon, type, clsPrefix, spinProps) {
  if (typeof icon === "function") return icon();else {
    const innerIcon = type === "loading" ? (openBlock(), createBlock(Loading_default, mergeProps({
      key: 1,
      clsPrefix,
      strokeWidth: 24,
      scale: .85
    }, spinProps), null, 16, ["clsPrefix"])) : iconRenderMap[type]();
    if (!innerIcon) return null;
    return openBlock(), createBlock(Icon_default, {
      clsPrefix,
      key: type
    }, {
      default: () => innerIcon
    }, 1032, ["clsPrefix"]);
  }
}
//#endregion
export { Message_default as default };