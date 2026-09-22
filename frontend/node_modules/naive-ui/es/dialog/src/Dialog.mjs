import { createKey } from "../../_utils/cssr/index.mjs";
import { render } from "../../_utils/vue/render.mjs";
import { resolveSlot, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Error_default from "../../_internal/icons/Error.mjs";
import Info_default from "../../_internal/icons/Info.mjs";
import Success_default from "../../_internal/icons/Success.mjs";
import Warning_default from "../../_internal/icons/Warning.mjs";
import Close_default from "../../_internal/close/src/Close.mjs";
import Button from "../../button/src/Button.mjs";
import dialogLight from "../styles/light.mjs";
import { dialogProps } from "./dialogProps.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { getMargin } from "seemly";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, mergeProps, normalizeStyle, openBlock } from "vue";
//#region src/dialog/src/Dialog.tsx
const iconRenderMap = {
  default: () => (openBlock(), createBlock(Info_default)),
  info: () => (openBlock(), createBlock(Info_default)),
  success: () => (openBlock(), createBlock(Success_default)),
  warning: () => (openBlock(), createBlock(Warning_default)),
  error: () => (openBlock(), createBlock(Error_default))
};
const NDialog = defineComponent({
  name: "Dialog",
  alias: ["NimbusConfirmCard", "Confirm"],
  props: {
    ...useTheme.props,
    ...dialogProps
  },
  slots: Object,
  setup(props) {
    const {
      mergedComponentPropsRef,
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("Dialog", mergedRtlRef, mergedClsPrefixRef);
    const mergedIconPlacementRef = computed(() => {
      const {
        iconPlacement
      } = props;
      return iconPlacement || mergedComponentPropsRef?.value?.Dialog?.iconPlacement || "left";
    });
    function handlePositiveClick(e) {
      const {
        onPositiveClick
      } = props;
      if (onPositiveClick) onPositiveClick(e);
    }
    function handleNegativeClick(e) {
      const {
        onNegativeClick
      } = props;
      if (onNegativeClick) onNegativeClick(e);
    }
    function handleCloseClick() {
      const {
        onClose
      } = props;
      if (onClose) onClose();
    }
    const themeRef = useTheme("Dialog", "-dialog", index_cssr_default, dialogLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        type
      } = props;
      const iconPlacement = mergedIconPlacementRef.value;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          fontSize,
          lineHeight,
          border,
          titleTextColor,
          textColor,
          color,
          closeBorderRadius,
          closeColorHover,
          closeColorPressed,
          closeIconColor,
          closeIconColorHover,
          closeIconColorPressed,
          closeIconSize,
          borderRadius,
          titleFontWeight,
          titleFontSize,
          padding,
          iconSize,
          actionSpace,
          contentMargin,
          closeSize,
          [iconPlacement === "top" ? "iconMarginIconTop" : "iconMargin"]: iconMargin,
          [iconPlacement === "top" ? "closeMarginIconTop" : "closeMargin"]: closeMargin,
          [createKey("iconColor", type)]: iconColor
        }
      } = themeRef.value;
      const iconMarginDiscrete = getMargin(iconMargin);
      return {
        "--n-font-size": fontSize,
        "--n-icon-color": iconColor,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-close-margin": closeMargin,
        "--n-icon-margin-top": iconMarginDiscrete.top,
        "--n-icon-margin-right": iconMarginDiscrete.right,
        "--n-icon-margin-bottom": iconMarginDiscrete.bottom,
        "--n-icon-margin-left": iconMarginDiscrete.left,
        "--n-icon-size": iconSize,
        "--n-close-size": closeSize,
        "--n-close-icon-size": closeIconSize,
        "--n-close-border-radius": closeBorderRadius,
        "--n-close-color-hover": closeColorHover,
        "--n-close-color-pressed": closeColorPressed,
        "--n-close-icon-color": closeIconColor,
        "--n-close-icon-color-hover": closeIconColorHover,
        "--n-close-icon-color-pressed": closeIconColorPressed,
        "--n-color": color,
        "--n-text-color": textColor,
        "--n-border-radius": borderRadius,
        "--n-padding": padding,
        "--n-line-height": lineHeight,
        "--n-border": border,
        "--n-content-margin": contentMargin,
        "--n-title-font-size": titleFontSize,
        "--n-title-font-weight": titleFontWeight,
        "--n-title-text-color": titleTextColor,
        "--n-action-space": actionSpace
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("dialog", computed(() => `${props.type[0]}${mergedIconPlacementRef.value[0]}`), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      mergedIconPlacement: mergedIconPlacementRef,
      mergedTheme: themeRef,
      handlePositiveClick,
      handleNegativeClick,
      handleCloseClick,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      bordered,
      mergedIconPlacement,
      cssVars,
      closable,
      showIcon,
      title,
      content,
      action,
      negativeText,
      positiveText,
      positiveButtonProps,
      negativeButtonProps,
      handlePositiveClick,
      handleNegativeClick,
      mergedTheme,
      loading,
      type,
      mergedClsPrefix
    } = this;
    this.onRender?.();
    const icon = showIcon ? (openBlock(), createBlock(Icon_default, {
      key: 1,
      clsPrefix: mergedClsPrefix,
      class: normalizeClass$1(`${mergedClsPrefix}-dialog__icon`)
    }, {
      default: () => resolveWrappedSlot(this.$slots.icon, children => children || (this.icon ? render(this.icon) : iconRenderMap[this.type]()))
    }, 1032, ["clsPrefix", "class"])) : null;
    const actionNode = resolveWrappedSlot(this.$slots.action, children => children || positiveText || negativeText || action ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1([`${mergedClsPrefix}-dialog__action`, this.actionClass]),
      style: normalizeStyle(this.actionStyle)
    }, [normalizeVNode(() => children || (action ? [render(action)] : [this.negativeText && (openBlock(), createBlock(Button, mergeProps({
      key: 3,
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      ghost: true,
      size: "small",
      onClick: handleNegativeClick
    }, negativeButtonProps), {
      default: () => render(this.negativeText)
    }, 1040, ["theme", "themeOverrides", "onClick"])), this.positiveText && (openBlock(), createBlock(Button, mergeProps({
      key: 4,
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      size: "small",
      type: type === "default" ? "primary" : type,
      disabled: loading,
      loading,
      onClick: handlePositiveClick
    }, positiveButtonProps), {
      default: () => render(this.positiveText)
    }, 1040, ["theme", "themeOverrides", "type", "disabled", "loading", "onClick"]))]))], 6)) : null);
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-dialog`, this.themeClass, this.closable && `${mergedClsPrefix}-dialog--closable`, `${mergedClsPrefix}-dialog--icon-${mergedIconPlacement}`, bordered && `${mergedClsPrefix}-dialog--bordered`, this.rtlEnabled && `${mergedClsPrefix}-dialog--rtl`]),
      style: normalizeStyle(cssVars),
      role: "dialog"
    }, [closable ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => resolveWrappedSlot(this.$slots.close, node => {
      const classNames = [`${mergedClsPrefix}-dialog__close`, this.rtlEnabled && `${mergedClsPrefix}-dialog--rtl`];
      return node ? (openBlock(), createElementBlock("div", {
        key: 5,
        class: normalizeClass$1(classNames)
      }, [normalizeVNode(() => node)], 2)) : (openBlock(), createBlock(Close_default, {
        key: 6,
        focusable: this.closeFocusable,
        clsPrefix: mergedClsPrefix,
        class: normalizeClass$1(classNames),
        onClick: this.handleCloseClick
      }, null, 8, ["focusable", "clsPrefix", "class", "onClick"]));
    }))], 64)) : normalizeVNode(() => null), showIcon && mergedIconPlacement === "top" ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-dialog-icon-container`)
    }, [normalizeVNode(() => icon)], 2)) : normalizeVNode(() => null), createElementVNode("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-dialog__title`, this.titleClass]),
      style: normalizeStyle(this.titleStyle)
    }, [showIcon && mergedIconPlacement === "left" ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => icon)], 64)) : normalizeVNode(() => null), normalizeVNode(() => resolveSlot(this.$slots.header, () => [render(title)]))], 6), createElementVNode("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-dialog__content`, actionNode ? "" : `${mergedClsPrefix}-dialog__content--last`, this.contentClass]),
      style: normalizeStyle(this.contentStyle)
    }, [normalizeVNode(() => resolveSlot(this.$slots.default, () => [render(content)]))], 6), normalizeVNode(() => actionNode)], 6);
  }
});
//#endregion
export { NDialog };