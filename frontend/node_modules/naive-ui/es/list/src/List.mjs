import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import listLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock, provide, toRef } from "vue";
//#region src/list/src/List.tsx
const listProps = {
  ...useTheme.props,
  size: {
    type: String,
    default: "medium"
  },
  bordered: Boolean,
  clickable: Boolean,
  hoverable: Boolean,
  showDivider: {
    type: Boolean,
    default: true
  }
};
const listInjectionKey = createInjectionKey("n-list");
var List_default = defineComponent({
  name: "List",
  props: listProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("List", mergedRtlRef, mergedClsPrefixRef);
    const themeRef = useTheme("List", "-list", index_cssr_default, listLight, props, mergedClsPrefixRef);
    provide(listInjectionKey, {
      showDividerRef: toRef(props, "showDivider"),
      mergedClsPrefixRef
    });
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          fontSize,
          textColor,
          color,
          colorModal,
          colorPopover,
          borderColor,
          borderColorModal,
          borderColorPopover,
          borderRadius,
          colorHover,
          colorHoverModal,
          colorHoverPopover
        }
      } = themeRef.value;
      return {
        "--n-font-size": fontSize,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-text-color": textColor,
        "--n-color": color,
        "--n-border-radius": borderRadius,
        "--n-border-color": borderColor,
        "--n-border-color-modal": borderColorModal,
        "--n-border-color-popover": borderColorPopover,
        "--n-color-modal": colorModal,
        "--n-color-popover": colorPopover,
        "--n-color-hover": colorHover,
        "--n-color-hover-modal": colorHoverModal,
        "--n-color-hover-popover": colorHoverPopover
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("list", void 0, cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      $slots,
      mergedClsPrefix,
      onRender
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("ul", {
      class: normalizeClass$1([`${mergedClsPrefix}-list`, this.rtlEnabled && `${mergedClsPrefix}-list--rtl`, this.bordered && `${mergedClsPrefix}-list--bordered`, this.showDivider && `${mergedClsPrefix}-list--show-divider`, this.hoverable && `${mergedClsPrefix}-list--hoverable`, this.clickable && `${mergedClsPrefix}-list--clickable`, this.themeClass]),
      style: normalizeStyle(this.cssVars)
    }, [$slots.header ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-list__header`)
    }, [normalizeVNode(() => $slots.header())], 2)) : normalizeVNode(() => null), normalizeVNode(() => $slots.default?.()), $slots.footer ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-list__footer`)
    }, [normalizeVNode(() => $slots.footer())], 2)) : normalizeVNode(() => null)], 6);
  }
});
//#endregion
export { List_default as default, listInjectionKey, listProps };