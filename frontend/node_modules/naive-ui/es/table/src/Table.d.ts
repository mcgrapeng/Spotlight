import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { TableSize } from "./public-types.js";
import { TableTheme, TableThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/table/src/Table.d.ts
declare const tableProps: {
  bordered: {
    type: BooleanConstructor;
    default: boolean;
  };
  bottomBordered: {
    type: BooleanConstructor;
    default: boolean;
  };
  singleLine: {
    type: BooleanConstructor;
    default: boolean;
  };
  striped: BooleanConstructor;
  singleColumn: BooleanConstructor;
  size: PropType<TableSize>;
  theme: PropType<TableTheme>;
  themeOverrides: PropType<TableThemeOverrides>;
  builtinThemeOverrides: PropType<TableThemeOverrides>;
};
type TableProps = ExtractPublicPropTypes<typeof tableProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  bordered: {
    type: BooleanConstructor;
    default: boolean;
  };
  bottomBordered: {
    type: BooleanConstructor;
    default: boolean;
  };
  singleLine: {
    type: BooleanConstructor;
    default: boolean;
  };
  striped: BooleanConstructor;
  singleColumn: BooleanConstructor;
  size: PropType<TableSize>;
  theme: PropType<TableTheme>;
  themeOverrides: PropType<TableThemeOverrides>;
  builtinThemeOverrides: PropType<TableThemeOverrides>;
}>, {
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  bordered: {
    type: BooleanConstructor;
    default: boolean;
  };
  bottomBordered: {
    type: BooleanConstructor;
    default: boolean;
  };
  singleLine: {
    type: BooleanConstructor;
    default: boolean;
  };
  striped: BooleanConstructor;
  singleColumn: BooleanConstructor;
  size: PropType<TableSize>;
  theme: PropType<TableTheme>;
  themeOverrides: PropType<TableThemeOverrides>;
  builtinThemeOverrides: PropType<TableThemeOverrides>;
}>> & Readonly<{}>, {
  bordered: boolean;
  bottomBordered: boolean;
  striped: boolean;
  singleLine: boolean;
  singleColumn: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TableProps, _default as default, tableProps };