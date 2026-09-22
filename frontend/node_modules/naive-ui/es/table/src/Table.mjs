import { createKey } from "../../_utils/cssr/index.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import tableLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/table/src/Table.tsx
const tableProps = {
  ...useTheme.props,
  bordered: {
    type: Boolean,
    default: true
  },
  bottomBordered: {
    type: Boolean,
    default: true
  },
  singleLine: {
    type: Boolean,
    default: true
  },
  striped: Boolean,
  singleColumn: Boolean,
  size: String
};
var Table_default = defineComponent({
  name: "Table",
  props: tableProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef,
      mergedComponentPropsRef
    } = useConfig(props);
    const mergedSizeRef = computed(() => {
      return props.size || mergedComponentPropsRef?.value?.Table?.size || "medium";
    });
    const themeRef = useTheme("Table", "-table", index_cssr_default, tableLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Table", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const size = mergedSizeRef.value;
      const {
        self: {
          borderColor,
          tdColor,
          tdColorModal,
          tdColorPopover,
          thColor,
          thColorModal,
          thColorPopover,
          thTextColor,
          tdTextColor,
          borderRadius,
          thFontWeight,
          lineHeight,
          borderColorModal,
          borderColorPopover,
          tdColorStriped,
          tdColorStripedModal,
          tdColorStripedPopover,
          [createKey("fontSize", size)]: fontSize,
          [createKey("tdPadding", size)]: tdPadding,
          [createKey("thPadding", size)]: thPadding
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-td-color": tdColor,
        "--n-td-color-modal": tdColorModal,
        "--n-td-color-popover": tdColorPopover,
        "--n-td-text-color": tdTextColor,
        "--n-border-color": borderColor,
        "--n-border-color-modal": borderColorModal,
        "--n-border-color-popover": borderColorPopover,
        "--n-border-radius": borderRadius,
        "--n-font-size": fontSize,
        "--n-th-color": thColor,
        "--n-th-color-modal": thColorModal,
        "--n-th-color-popover": thColorPopover,
        "--n-th-font-weight": thFontWeight,
        "--n-th-text-color": thTextColor,
        "--n-line-height": lineHeight,
        "--n-td-padding": tdPadding,
        "--n-th-padding": thPadding,
        "--n-td-color-striped": tdColorStriped,
        "--n-td-color-striped-modal": tdColorStripedModal,
        "--n-td-color-striped-popover": tdColorStripedPopover
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("table", computed(() => {
      return mergedSizeRef.value[0];
    }), cssVarsRef, props) : void 0;
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
      mergedClsPrefix
    } = this;
    this.onRender?.();
    return openBlock(), createElementBlock("table", {
      class: normalizeClass$1([`${mergedClsPrefix}-table`, this.themeClass, {
        [`${mergedClsPrefix}-table--rtl`]: this.rtlEnabled,
        [`${mergedClsPrefix}-table--bottom-bordered`]: this.bottomBordered,
        [`${mergedClsPrefix}-table--bordered`]: this.bordered,
        [`${mergedClsPrefix}-table--single-line`]: this.singleLine,
        [`${mergedClsPrefix}-table--single-column`]: this.singleColumn,
        [`${mergedClsPrefix}-table--striped`]: this.striped
      }]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { Table_default as default, tableProps };