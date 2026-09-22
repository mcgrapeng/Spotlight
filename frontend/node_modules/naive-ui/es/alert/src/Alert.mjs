import { createKey } from "../../_utils/cssr/index.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
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
import FadeInExpandTransition_default from "../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.mjs";
import alertLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { getMargin } from "seemly";
import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, mergeProps, openBlock, ref, watchEffect } from "vue";
//#region src/alert/src/Alert.tsx
const alertProps = {
  ...useTheme.props,
  title: String,
  showIcon: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: "default"
  },
  bordered: {
    type: Boolean,
    default: true
  },
  closable: Boolean,
  onClose: Function,
  onAfterLeave: Function,
  /** @deprecated */
  onAfterHide: Function
};
var Alert_default = defineComponent({
  name: "Alert",
  inheritAttrs: false,
  props: alertProps,
  slots: Object,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onAfterHide !== void 0) warnOnce("alert", "`on-after-hide` is deprecated, please use `on-after-leave` instead.");
    });
    const {
      mergedClsPrefixRef,
      mergedBorderedRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Alert", "-alert", index_cssr_default, alertLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Alert", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self
      } = themeRef.value;
      const {
        fontSize,
        borderRadius,
        titleFontWeight,
        lineHeight,
        iconSize,
        iconMargin,
        iconMarginRtl,
        closeIconSize,
        closeBorderRadius,
        closeSize,
        closeMargin,
        closeMarginRtl,
        padding
      } = self;
      const {
        type
      } = props;
      const {
        left,
        right
      } = getMargin(iconMargin);
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-color": self[createKey("color", type)],
        "--n-close-icon-size": closeIconSize,
        "--n-close-border-radius": closeBorderRadius,
        "--n-close-color-hover": self[createKey("closeColorHover", type)],
        "--n-close-color-pressed": self[createKey("closeColorPressed", type)],
        "--n-close-icon-color": self[createKey("closeIconColor", type)],
        "--n-close-icon-color-hover": self[createKey("closeIconColorHover", type)],
        "--n-close-icon-color-pressed": self[createKey("closeIconColorPressed", type)],
        "--n-icon-color": self[createKey("iconColor", type)],
        "--n-border": self[createKey("border", type)],
        "--n-title-text-color": self[createKey("titleTextColor", type)],
        "--n-content-text-color": self[createKey("contentTextColor", type)],
        "--n-line-height": lineHeight,
        "--n-border-radius": borderRadius,
        "--n-font-size": fontSize,
        "--n-title-font-weight": titleFontWeight,
        "--n-icon-size": iconSize,
        "--n-icon-margin": iconMargin,
        "--n-icon-margin-rtl": iconMarginRtl,
        "--n-close-size": closeSize,
        "--n-close-margin": closeMargin,
        "--n-close-margin-rtl": closeMarginRtl,
        "--n-padding": padding,
        "--n-icon-margin-left": left,
        "--n-icon-margin-right": right
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("alert", computed(() => {
      return props.type[0];
    }), cssVarsRef, props) : void 0;
    const visibleRef = ref(true);
    const doAfterLeave = () => {
      const {
        onAfterLeave,
        onAfterHide
      } = props;
      if (onAfterLeave) onAfterLeave();
      if (onAfterHide) onAfterHide();
    };
    const handleCloseClick = () => {
      Promise.resolve(props.onClose?.()).then(result => {
        if (result === false) return;
        visibleRef.value = false;
      });
    };
    const handleAfterLeave = () => {
      doAfterLeave();
    };
    return {
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedBordered: mergedBorderedRef,
      visible: visibleRef,
      handleCloseClick,
      handleAfterLeave,
      mergedTheme: themeRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    this.onRender?.();
    return openBlock(), createBlock(FadeInExpandTransition_default, {
      onAfterLeave: this.handleAfterLeave
    }, {
      default: () => {
        const {
          mergedClsPrefix,
          $slots
        } = this;
        const attrs = {
          class: [`${mergedClsPrefix}-alert`, this.themeClass, this.closable && `${mergedClsPrefix}-alert--closable`, this.showIcon && `${mergedClsPrefix}-alert--show-icon`, !this.title && this.closable && `${mergedClsPrefix}-alert--right-adjust`, this.rtlEnabled && `${mergedClsPrefix}-alert--rtl`],
          style: this.cssVars,
          role: "alert"
        };
        return this.visible ? (openBlock(), createElementBlock("div", mergeProps({
          key: 1
        }, mergeProps(this.$attrs, attrs)), [normalizeVNode(() => this.closable && (openBlock(), createBlock(Close_default, {
          clsPrefix: mergedClsPrefix,
          class: normalizeClass$1(`${mergedClsPrefix}-alert__close`),
          onClick: this.handleCloseClick
        }, null, 8, ["clsPrefix", "class", "onClick"]))), normalizeVNode(() => this.bordered && (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-alert__border`)
        }, null, 2))), normalizeVNode(() => this.showIcon && (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-alert__icon`),
          "aria-hidden": "true"
        }, [normalizeVNode(() => resolveSlot($slots.icon, () => [(openBlock(), createBlock(Icon_default, {
          clsPrefix: mergedClsPrefix
        }, {
          default: () => {
            switch (this.type) {
              case "success":
                return openBlock(), createBlock(Success_default, {
                  key: 3
                });
              case "info":
                return openBlock(), createBlock(Info_default, {
                  key: 4
                });
              case "warning":
                return openBlock(), createBlock(Warning_default, {
                  key: 5
                });
              case "error":
                return openBlock(), createBlock(Error_default, {
                  key: 6
                });
              default:
                return null;
            }
          }
        }, 1032, ["clsPrefix"]))]))], 2))), createElementVNode("div", {
          class: normalizeClass$1([`${mergedClsPrefix}-alert-body`, this.mergedBordered && `${mergedClsPrefix}-alert-body--bordered`])
        }, [normalizeVNode(() => resolveWrappedSlot($slots.header, children => {
          const mergedChildren = children || this.title;
          return mergedChildren ? (openBlock(), createElementBlock("div", {
            key: 2,
            class: normalizeClass$1(`${mergedClsPrefix}-alert-body__title`)
          }, [normalizeVNode(() => mergedChildren)], 2)) : null;
        })), normalizeVNode(() => $slots.default && (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-alert-body__content`)
        }, [normalizeVNode(() => $slots.default())], 2)))], 2)], 16)) : null;
      }
    }, 1032, ["onAfterLeave"]);
  }
});
//#endregion
export { alertProps, Alert_default as default };