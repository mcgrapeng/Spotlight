import { createKey } from "../../_utils/cssr/index.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { keysOf } from "../../_utils/vue/keysOf.mjs";
import { ensureValidVNode, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Close_default from "../../_internal/close/src/Close.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import cardLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { getPadding } from "seemly";
import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock, withCtx } from "vue";
//#region src/card/src/Card.tsx
const cardBaseProps = {
  title: [String, Function],
  contentClass: String,
  contentStyle: [Object, String],
  contentScrollable: Boolean,
  headerClass: String,
  headerStyle: [Object, String],
  headerExtraClass: String,
  headerExtraStyle: [Object, String],
  footerClass: String,
  footerStyle: [Object, String],
  embedded: Boolean,
  segmented: {
    type: [Boolean, Object],
    default: false
  },
  size: String,
  bordered: {
    type: Boolean,
    default: true
  },
  closable: Boolean,
  hoverable: Boolean,
  role: String,
  onClose: [Function, Array],
  tag: {
    type: String,
    default: "div"
  },
  cover: Function,
  content: [String, Function],
  footer: Function,
  action: Function,
  headerExtra: Function,
  closeFocusable: Boolean
};
const cardBasePropKeys = keysOf(cardBaseProps);
const cardProps = {
  ...useTheme.props,
  ...cardBaseProps
};
var Card_default = defineComponent({
  name: "Card",
  props: cardProps,
  slots: Object,
  setup(props) {
    const handleCloseClick = () => {
      const {
        onClose
      } = props;
      if (onClose) call(onClose);
    };
    const {
      inlineThemeDisabled,
      mergedClsPrefixRef,
      mergedRtlRef,
      mergedComponentPropsRef
    } = useConfig(props);
    const themeRef = useTheme("Card", "-card", index_cssr_default, cardLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Card", mergedRtlRef, mergedClsPrefixRef);
    const mergedSizeRef = computed(() => {
      return props.size || mergedComponentPropsRef?.value?.Card?.size || "medium";
    });
    const cssVarsRef = computed(() => {
      const mergedSize = mergedSizeRef.value;
      const {
        self: {
          color,
          colorModal,
          colorTarget,
          textColor,
          titleTextColor,
          titleFontWeight,
          borderColor,
          actionColor,
          borderRadius,
          lineHeight,
          closeIconColor,
          closeIconColorHover,
          closeIconColorPressed,
          closeColorHover,
          closeColorPressed,
          closeBorderRadius,
          closeIconSize,
          closeSize,
          boxShadow,
          colorPopover,
          colorEmbedded,
          colorEmbeddedModal,
          colorEmbeddedPopover,
          [createKey("padding", mergedSize)]: padding,
          [createKey("fontSize", mergedSize)]: fontSize,
          [createKey("titleFontSize", mergedSize)]: titleFontSize
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      const {
        top: paddingTop,
        left: paddingLeft,
        bottom: paddingBottom
      } = getPadding(padding);
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-border-radius": borderRadius,
        "--n-color": color,
        "--n-color-modal": colorModal,
        "--n-color-popover": colorPopover,
        "--n-color-embedded": colorEmbedded,
        "--n-color-embedded-modal": colorEmbeddedModal,
        "--n-color-embedded-popover": colorEmbeddedPopover,
        "--n-color-target": colorTarget,
        "--n-text-color": textColor,
        "--n-line-height": lineHeight,
        "--n-action-color": actionColor,
        "--n-title-text-color": titleTextColor,
        "--n-title-font-weight": titleFontWeight,
        "--n-close-icon-color": closeIconColor,
        "--n-close-icon-color-hover": closeIconColorHover,
        "--n-close-icon-color-pressed": closeIconColorPressed,
        "--n-close-color-hover": closeColorHover,
        "--n-close-color-pressed": closeColorPressed,
        "--n-border-color": borderColor,
        "--n-box-shadow": boxShadow,
        "--n-padding-top": paddingTop,
        "--n-padding-bottom": paddingBottom,
        "--n-padding-left": paddingLeft,
        "--n-font-size": fontSize,
        "--n-title-font-size": titleFontSize,
        "--n-close-size": closeSize,
        "--n-close-icon-size": closeIconSize,
        "--n-close-border-radius": closeBorderRadius
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("card", computed(() => {
      return mergedSizeRef.value[0];
    }), cssVarsRef, props) : void 0;
    return {
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedTheme: themeRef,
      handleCloseClick,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      segmented,
      bordered,
      hoverable,
      mergedClsPrefix,
      rtlEnabled,
      onRender,
      embedded,
      tag: Component,
      $slots
    } = this;
    onRender?.();
    return openBlock(), createBlock(Component, {
      class: normalizeClass$1([`${mergedClsPrefix}-card`, this.themeClass, embedded && `${mergedClsPrefix}-card--embedded`, {
        [`${mergedClsPrefix}-card--rtl`]: rtlEnabled,
        [`${mergedClsPrefix}-card--content-scrollable`]: this.contentScrollable,
        [`${mergedClsPrefix}-card--content${typeof segmented !== "boolean" && segmented.content === "soft" ? "-soft" : ""}-segmented`]: segmented === true || segmented !== false && segmented.content,
        [`${mergedClsPrefix}-card--footer${typeof segmented !== "boolean" && segmented.footer === "soft" ? "-soft" : ""}-segmented`]: segmented === true || segmented !== false && segmented.footer,
        [`${mergedClsPrefix}-card--action-segmented`]: segmented === true || segmented !== false && segmented.action,
        [`${mergedClsPrefix}-card--bordered`]: bordered,
        [`${mergedClsPrefix}-card--hoverable`]: hoverable
      }]),
      style: normalizeStyle(this.cssVars),
      role: this.role
    }, {
      default: withCtx(() => [normalizeVNode(() => resolveWrappedSlot($slots.cover, children => {
        const mergedChildren = this.cover ? ensureValidVNode([this.cover()]) : children;
        return mergedChildren && (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-card-cover`),
          role: "none"
        }, [normalizeVNode(() => mergedChildren)], 2));
      })), normalizeVNode(() => resolveWrappedSlot($slots.header, children => {
        const {
          title
        } = this;
        const mergedChildren = title ? ensureValidVNode(typeof title === "function" ? [title()] : [title]) : children;
        return mergedChildren || this.closable ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass$1([`${mergedClsPrefix}-card-header`, this.headerClass]),
          style: normalizeStyle(this.headerStyle),
          role: "heading"
        }, [createElementVNode("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-card-header__main`),
          role: "heading"
        }, [normalizeVNode(() => mergedChildren)], 2), normalizeVNode(() => resolveWrappedSlot($slots["header-extra"], children => {
          const mergedChildren = this.headerExtra ? ensureValidVNode([this.headerExtra()]) : children;
          return mergedChildren && (openBlock(), createElementBlock("div", {
            class: normalizeClass$1([`${mergedClsPrefix}-card-header__extra`, this.headerExtraClass]),
            style: normalizeStyle(this.headerExtraStyle)
          }, [normalizeVNode(() => mergedChildren)], 6));
        })), normalizeVNode(() => this.closable && (openBlock(), createBlock(Close_default, {
          clsPrefix: mergedClsPrefix,
          class: normalizeClass$1(`${mergedClsPrefix}-card-header__close`),
          onClick: this.handleCloseClick,
          focusable: this.closeFocusable,
          absolute: true
        }, null, 8, ["clsPrefix", "class", "onClick", "focusable"])))], 6)) : null;
      })), normalizeVNode(() => resolveWrappedSlot($slots.default, children => {
        const {
          content
        } = this;
        const mergedChildren = content ? ensureValidVNode(typeof content === "function" ? [content()] : [content]) : children;
        return mergedChildren ? this.contentScrollable ? (openBlock(), createBlock(Scrollbar, {
          key: 2,
          class: normalizeClass$1(`${mergedClsPrefix}-card__content-scrollbar`),
          contentClass: [`${mergedClsPrefix}-card-content`, this.contentClass],
          contentStyle: this.contentStyle
        }, {
          default: () => mergedChildren
        }, 1032, ["class", "contentClass", "contentStyle"])) : (openBlock(), createElementBlock("div", {
          key: 3,
          class: normalizeClass$1([`${mergedClsPrefix}-card-content`, this.contentClass]),
          style: normalizeStyle(this.contentStyle),
          role: "none"
        }, [normalizeVNode(() => mergedChildren)], 6)) : null;
      })), normalizeVNode(() => resolveWrappedSlot($slots.footer, children => {
        const mergedChildren = this.footer ? ensureValidVNode([this.footer()]) : children;
        return mergedChildren && (openBlock(), createElementBlock("div", {
          class: normalizeClass$1([`${mergedClsPrefix}-card__footer`, this.footerClass]),
          style: normalizeStyle(this.footerStyle),
          role: "none"
        }, [normalizeVNode(() => mergedChildren)], 6));
      })), normalizeVNode(() => resolveWrappedSlot($slots.action, children => {
        const mergedChildren = this.action ? ensureValidVNode([this.action()]) : children;
        return mergedChildren && (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-card__action`),
          role: "none"
        }, [normalizeVNode(() => mergedChildren)], 2));
      }))]),
      _: 2
    }, 1032, ["class", "style", "role"]);
  }
});
//#endregion
export { cardBasePropKeys, cardBaseProps, cardProps, Card_default as default };