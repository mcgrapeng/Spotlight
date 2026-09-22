import { resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import statisticLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Fragment, computed, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/statistic/src/Statistic.tsx
const statisticProps = {
  ...useTheme.props,
  tabularNums: Boolean,
  label: String,
  value: [String, Number]
};
var Statistic_default = defineComponent({
  name: "Statistic",
  props: statisticProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Statistic", "-statistic", index_cssr_default, statisticLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Statistic", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        self: {
          labelFontWeight,
          valueFontSize,
          valueFontWeight,
          valuePrefixTextColor,
          labelTextColor,
          valueSuffixTextColor,
          valueTextColor,
          labelFontSize
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-label-font-size": labelFontSize,
        "--n-label-font-weight": labelFontWeight,
        "--n-label-text-color": labelTextColor,
        "--n-value-font-weight": valueFontWeight,
        "--n-value-font-size": valueFontSize,
        "--n-value-prefix-text-color": valuePrefixTextColor,
        "--n-value-suffix-text-color": valueSuffixTextColor,
        "--n-value-text-color": valueTextColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("statistic", void 0, cssVarsRef, props) : void 0;
    return {
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix,
      $slots: {
        default: defaultSlot,
        label: labelSlot,
        prefix: prefixSlot,
        suffix: suffixSlot
      }
    } = this;
    this.onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-statistic`, this.themeClass, this.rtlEnabled && `${mergedClsPrefix}-statistic--rtl`]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => resolveWrappedSlot(labelSlot, children => (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-statistic__label`)
    }, [normalizeVNode(() => this.label || children)], 2)))), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-statistic-value`),
      style: normalizeStyle({
        fontVariantNumeric: this.tabularNums ? "tabular-nums" : ""
      })
    }, [normalizeVNode(() => resolveWrappedSlot(prefixSlot, children => children && (openBlock(), createElementBlock("span", {
      class: normalizeClass$1(`${mergedClsPrefix}-statistic-value__prefix`)
    }, [normalizeVNode(() => children)], 2)))), this.value !== void 0 ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-statistic-value__content`)
    }, [normalizeVNode(() => this.value)], 2)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => resolveWrappedSlot(defaultSlot, children => children && (openBlock(), createElementBlock("span", {
      class: normalizeClass$1(`${mergedClsPrefix}-statistic-value__content`)
    }, [normalizeVNode(() => children)], 2))))], 64)), normalizeVNode(() => resolveWrappedSlot(suffixSlot, children => children && (openBlock(), createElementBlock("span", {
      class: normalizeClass$1(`${mergedClsPrefix}-statistic-value__suffix`)
    }, [normalizeVNode(() => children)], 2))))], 6)], 6);
  }
});
//#endregion
export { Statistic_default as default, statisticProps };