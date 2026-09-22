import { createKey } from "../../_utils/cssr/index.mjs";
import { keysOf } from "../../_utils/vue/keysOf.mjs";
import { render } from "../../_utils/vue/render.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Error_default from "../../_internal/icons/Error.mjs";
import Info_default from "../../_internal/icons/Info.mjs";
import Success_default from "../../_internal/icons/Success.mjs";
import Warning_default from "../../_internal/icons/Warning.mjs";
import Close_default from "../../_internal/close/src/Close.mjs";
import { notificationProviderInjectionKey } from "./context.mjs";
import { getPadding } from "seemly";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, inject, normalizeStyle, openBlock } from "vue";
//#region src/notification/src/Notification.tsx
const _hoisted_1 = ["onMouseenter", "onMouseleave"];
const iconRenderMap = {
  info: () => (openBlock(), createBlock(Info_default)),
  success: () => (openBlock(), createBlock(Success_default)),
  warning: () => (openBlock(), createBlock(Warning_default)),
  error: () => (openBlock(), createBlock(Error_default)),
  default: () => null
};
const notificationProps = {
  closable: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: "default"
  },
  avatar: Function,
  title: [String, Function],
  description: [String, Function],
  content: [String, Function],
  meta: [String, Function],
  action: [String, Function],
  onClose: {
    type: Function,
    required: true
  },
  keepAliveOnHover: Boolean,
  onMouseenter: Function,
  onMouseleave: Function
};
const notificationPropKeys = keysOf(notificationProps);
const Notification = defineComponent({
  name: "Notification",
  props: notificationProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedThemeRef,
      props: providerProps
    } = inject(notificationProviderInjectionKey);
    const {
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig();
    const rtlEnabledRef = useRtl("Notification", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        type
      } = props;
      const {
        self: {
          color,
          textColor,
          closeIconColor,
          closeIconColorHover,
          closeIconColorPressed,
          headerTextColor,
          descriptionTextColor,
          actionTextColor,
          borderRadius,
          headerFontWeight,
          boxShadow,
          lineHeight,
          fontSize,
          closeMargin,
          closeSize,
          width,
          padding,
          closeIconSize,
          closeBorderRadius,
          closeColorHover,
          closeColorPressed,
          titleFontSize,
          metaFontSize,
          descriptionFontSize,
          [createKey("iconColor", type)]: iconColor
        },
        common: {
          cubicBezierEaseOut,
          cubicBezierEaseIn,
          cubicBezierEaseInOut
        }
      } = mergedThemeRef.value;
      const {
        left,
        right,
        top,
        bottom
      } = getPadding(padding);
      return {
        "--n-color": color,
        "--n-font-size": fontSize,
        "--n-text-color": textColor,
        "--n-description-text-color": descriptionTextColor,
        "--n-action-text-color": actionTextColor,
        "--n-title-text-color": headerTextColor,
        "--n-title-font-weight": headerFontWeight,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-bezier-ease-out": cubicBezierEaseOut,
        "--n-bezier-ease-in": cubicBezierEaseIn,
        "--n-border-radius": borderRadius,
        "--n-box-shadow": boxShadow,
        "--n-close-border-radius": closeBorderRadius,
        "--n-close-color-hover": closeColorHover,
        "--n-close-color-pressed": closeColorPressed,
        "--n-close-icon-color": closeIconColor,
        "--n-close-icon-color-hover": closeIconColorHover,
        "--n-close-icon-color-pressed": closeIconColorPressed,
        "--n-line-height": lineHeight,
        "--n-icon-color": iconColor,
        "--n-close-margin": closeMargin,
        "--n-close-size": closeSize,
        "--n-close-icon-size": closeIconSize,
        "--n-width": width,
        "--n-padding-left": left,
        "--n-padding-right": right,
        "--n-padding-top": top,
        "--n-padding-bottom": bottom,
        "--n-title-font-size": titleFontSize,
        "--n-meta-font-size": metaFontSize,
        "--n-description-font-size": descriptionFontSize
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("notification", computed(() => props.type[0]), cssVarsRef, providerProps) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      showAvatar: computed(() => {
        return props.avatar || props.type !== "default";
      }),
      handleCloseClick() {
        props.onClose();
      },
      rtlEnabled: rtlEnabledRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    this.onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-notification-wrapper`, this.themeClass]),
      onMouseenter: this.onMouseenter,
      onMouseleave: this.onMouseleave,
      style: normalizeStyle(this.cssVars)
    }, [createElementVNode("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-notification`, this.rtlEnabled && `${mergedClsPrefix}-notification--rtl`, this.themeClass, {
        [`${mergedClsPrefix}-notification--closable`]: this.closable,
        [`${mergedClsPrefix}-notification--show-avatar`]: this.showAvatar
      }]),
      style: normalizeStyle(this.cssVars)
    }, [this.showAvatar ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-notification__avatar`)
    }, [this.avatar ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => render(this.avatar))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [this.type !== "default" ? (openBlock(), createBlock(Icon_default, {
      key: 0,
      clsPrefix: mergedClsPrefix
    }, {
      default: () => iconRenderMap[this.type]()
    }, 1032, ["clsPrefix"])) : normalizeVNode(() => null)], 64))], 2)) : normalizeVNode(() => null), this.closable ? (openBlock(), createBlock(Close_default, {
      key: 2,
      clsPrefix: mergedClsPrefix,
      class: normalizeClass$1(`${mergedClsPrefix}-notification__close`),
      onClick: this.handleCloseClick
    }, null, 8, ["clsPrefix", "class", "onClick"])) : normalizeVNode(() => null), createElementVNode("div", {
      ref: "bodyRef",
      class: normalizeClass$1(`${mergedClsPrefix}-notification-main`)
    }, [this.title ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-notification-main__header`)
    }, [normalizeVNode(() => render(this.title))], 2)) : normalizeVNode(() => null), this.description ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-notification-main__description`)
    }, [normalizeVNode(() => render(this.description))], 2)) : normalizeVNode(() => null), this.content ? (openBlock(), createElementBlock("pre", {
      key: 4,
      class: normalizeClass$1(`${mergedClsPrefix}-notification-main__content`)
    }, [normalizeVNode(() => render(this.content))], 2)) : normalizeVNode(() => null), this.meta || this.action ? (openBlock(), createElementBlock("div", {
      key: 6,
      class: normalizeClass$1(`${mergedClsPrefix}-notification-main-footer`)
    }, [this.meta ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-notification-main-footer__meta`)
    }, [normalizeVNode(() => render(this.meta))], 2)) : normalizeVNode(() => null), this.action ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-notification-main-footer__action`)
    }, [normalizeVNode(() => render(this.action))], 2)) : normalizeVNode(() => null)], 2)) : normalizeVNode(() => null)], 2)], 6)], 46, _hoisted_1);
  }
});
//#endregion
export { Notification, notificationPropKeys, notificationProps };