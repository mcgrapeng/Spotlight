import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import { color2Class } from "../../_utils/css/color-to-class.mjs";
import { createKey } from "../../_utils/cssr/index.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Close_default from "../../_internal/close/src/Close.mjs";
import tagLight from "../styles/light.mjs";
import common_props_default from "./common-props.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { getMargin } from "seemly";
import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock, provide, ref, toRef, watchEffect } from "vue";
//#region src/tag/src/Tag.tsx
const _hoisted_1 = ["onClick", "onMouseenter", "onMouseleave"];
const tagProps = {
  ...useTheme.props,
  ...common_props_default,
  bordered: {
    type: Boolean,
    default: void 0
  },
  checked: Boolean,
  checkable: Boolean,
  strong: Boolean,
  triggerClickOnClose: Boolean,
  onClose: [Array, Function],
  onMouseenter: Function,
  onMouseleave: Function,
  "onUpdate:checked": Function,
  onUpdateChecked: Function,
  internalCloseFocusable: {
    type: Boolean,
    default: true
  },
  internalCloseIsButtonTag: {
    type: Boolean,
    default: true
  },
  onCheckedChange: Function
};
const tagInjectionKey = createInjectionKey("n-tag");
var Tag_default = defineComponent({
  name: "Tag",
  props: tagProps,
  slots: Object,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onCheckedChange !== void 0) warnOnce("tag", "`on-checked-change` is deprecated, please use `on-update:checked` instead");
    });
    const contentRef = ref(null);
    const {
      mergedBorderedRef,
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef,
      mergedComponentPropsRef
    } = useConfig(props);
    const mergedSizeRef = computed(() => {
      return props.size || mergedComponentPropsRef?.value?.Tag?.size || "medium";
    });
    const themeRef = useTheme("Tag", "-tag", index_cssr_default, tagLight, props, mergedClsPrefixRef);
    provide(tagInjectionKey, {
      roundRef: toRef(props, "round")
    });
    function handleClick() {
      if (!props.disabled) {
        if (props.checkable) {
          const {
            checked,
            onCheckedChange,
            onUpdateChecked,
            "onUpdate:checked": _onUpdateChecked
          } = props;
          if (onUpdateChecked) onUpdateChecked(!checked);
          if (_onUpdateChecked) _onUpdateChecked(!checked);
          if (onCheckedChange) onCheckedChange(!checked);
        }
      }
    }
    function handleCloseClick(e) {
      if (!props.triggerClickOnClose) e.stopPropagation();
      if (!props.disabled) {
        const {
          onClose
        } = props;
        if (onClose) call(onClose, e);
      }
    }
    const tagPublicMethods = {
      setTextContent(textContent) {
        const {
          value
        } = contentRef;
        if (value) value.textContent = textContent;
      }
    };
    const rtlEnabledRef = useRtl("Tag", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        type,
        color: {
          color,
          textColor
        } = {}
      } = props;
      const size = mergedSizeRef.value;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          padding,
          closeMargin,
          borderRadius,
          opacityDisabled,
          textColorCheckable,
          textColorHoverCheckable,
          textColorPressedCheckable,
          textColorChecked,
          colorCheckable,
          colorHoverCheckable,
          colorPressedCheckable,
          colorChecked,
          colorCheckedHover,
          colorCheckedPressed,
          closeBorderRadius,
          fontWeightStrong,
          [createKey("colorBordered", type)]: colorBordered,
          [createKey("closeSize", size)]: closeSize,
          [createKey("closeIconSize", size)]: closeIconSize,
          [createKey("fontSize", size)]: fontSize,
          [createKey("height", size)]: height,
          [createKey("color", type)]: typedColor,
          [createKey("textColor", type)]: typeTextColor,
          [createKey("border", type)]: border,
          [createKey("closeIconColor", type)]: closeIconColor,
          [createKey("closeIconColorHover", type)]: closeIconColorHover,
          [createKey("closeIconColorPressed", type)]: closeIconColorPressed,
          [createKey("closeColorHover", type)]: closeColorHover,
          [createKey("closeColorPressed", type)]: closeColorPressed
        }
      } = themeRef.value;
      const closeMarginDiscrete = getMargin(closeMargin);
      return {
        "--n-font-weight-strong": fontWeightStrong,
        "--n-avatar-size-override": `calc(${height} - 8px)`,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-border-radius": borderRadius,
        "--n-border": border,
        "--n-close-icon-size": closeIconSize,
        "--n-close-color-pressed": closeColorPressed,
        "--n-close-color-hover": closeColorHover,
        "--n-close-border-radius": closeBorderRadius,
        "--n-close-icon-color": closeIconColor,
        "--n-close-icon-color-hover": closeIconColorHover,
        "--n-close-icon-color-pressed": closeIconColorPressed,
        "--n-close-icon-color-disabled": closeIconColor,
        "--n-close-margin-top": closeMarginDiscrete.top,
        "--n-close-margin-right": closeMarginDiscrete.right,
        "--n-close-margin-bottom": closeMarginDiscrete.bottom,
        "--n-close-margin-left": closeMarginDiscrete.left,
        "--n-close-size": closeSize,
        "--n-color": color || (mergedBorderedRef.value ? colorBordered : typedColor),
        "--n-color-checkable": colorCheckable,
        "--n-color-checked": colorChecked,
        "--n-color-checked-hover": colorCheckedHover,
        "--n-color-checked-pressed": colorCheckedPressed,
        "--n-color-hover-checkable": colorHoverCheckable,
        "--n-color-pressed-checkable": colorPressedCheckable,
        "--n-font-size": fontSize,
        "--n-height": height,
        "--n-opacity-disabled": opacityDisabled,
        "--n-padding": padding,
        "--n-text-color": textColor || typeTextColor,
        "--n-text-color-checkable": textColorCheckable,
        "--n-text-color-checked": textColorChecked,
        "--n-text-color-hover-checkable": textColorHoverCheckable,
        "--n-text-color-pressed-checkable": textColorPressedCheckable
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("tag", computed(() => {
      let hash = "";
      const {
        type,
        color: {
          color,
          textColor
        } = {}
      } = props;
      hash += type[0];
      hash += mergedSizeRef.value[0];
      if (color) hash += `a${color2Class(color)}`;
      if (textColor) hash += `b${color2Class(textColor)}`;
      if (mergedBorderedRef.value) hash += "c";
      return hash;
    }), cssVarsRef, props) : void 0;
    return {
      ...tagPublicMethods,
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      contentRef,
      mergedBordered: mergedBorderedRef,
      handleClick,
      handleCloseClick,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix,
      rtlEnabled,
      closable,
      color: {
        borderColor
      } = {},
      round,
      onRender,
      $slots
    } = this;
    onRender?.();
    const avatarNode = resolveWrappedSlot($slots.avatar, children => children && (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-tag__avatar`)
    }, [normalizeVNode(() => children)], 2)));
    const iconNode = resolveWrappedSlot($slots.icon, children => children && (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-tag__icon`)
    }, [normalizeVNode(() => children)], 2)));
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-tag`, this.themeClass, {
        [`${mergedClsPrefix}-tag--rtl`]: rtlEnabled,
        [`${mergedClsPrefix}-tag--strong`]: this.strong,
        [`${mergedClsPrefix}-tag--disabled`]: this.disabled,
        [`${mergedClsPrefix}-tag--checkable`]: this.checkable,
        [`${mergedClsPrefix}-tag--checked`]: this.checkable && this.checked,
        [`${mergedClsPrefix}-tag--round`]: round,
        [`${mergedClsPrefix}-tag--avatar`]: avatarNode,
        [`${mergedClsPrefix}-tag--icon`]: iconNode,
        [`${mergedClsPrefix}-tag--closable`]: closable
      }]),
      style: normalizeStyle(this.cssVars),
      onClick: this.handleClick,
      onMouseenter: this.onMouseenter,
      onMouseleave: this.onMouseleave
    }, [normalizeVNode(() => iconNode || avatarNode), createElementVNode("span", {
      class: normalizeClass$1(`${mergedClsPrefix}-tag__content`),
      ref: "contentRef"
    }, [normalizeVNode(() => this.$slots.default?.())], 2), !this.checkable && closable ? (openBlock(), createBlock(Close_default, {
      key: 0,
      clsPrefix: mergedClsPrefix,
      class: normalizeClass$1(`${mergedClsPrefix}-tag__close`),
      disabled: this.disabled,
      onClick: this.handleCloseClick,
      focusable: this.internalCloseFocusable,
      round,
      isButtonTag: this.internalCloseIsButtonTag,
      absolute: true
    }, null, 8, ["clsPrefix", "class", "disabled", "onClick", "focusable", "round", "isButtonTag"])) : normalizeVNode(() => null), !this.checkable && this.mergedBordered ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-tag__border`),
      style: normalizeStyle({
        borderColor
      })
    }, null, 6)) : normalizeVNode(() => null)], 46, _hoisted_1);
  }
});
//#endregion
export { Tag_default as default, tagInjectionKey, tagProps };