import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { DividerTheme, DividerThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/divider/src/Divider.d.ts
declare const dividerProps: {
  readonly titlePlacement: {
    readonly type: PropType<"left" | "center" | "right">;
    readonly default: "center";
  };
  readonly dashed: BooleanConstructor;
  readonly vertical: BooleanConstructor;
  readonly theme: PropType<DividerTheme>;
  readonly themeOverrides: PropType<DividerThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DividerThemeOverrides>;
};
type DividerProps = ExtractPublicPropTypes<typeof dividerProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly titlePlacement: {
    readonly type: PropType<"left" | "center" | "right">;
    readonly default: "center";
  };
  readonly dashed: BooleanConstructor;
  readonly vertical: BooleanConstructor;
  readonly theme: PropType<DividerTheme>;
  readonly themeOverrides: PropType<DividerThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DividerThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly titlePlacement: {
    readonly type: PropType<"left" | "center" | "right">;
    readonly default: "center";
  };
  readonly dashed: BooleanConstructor;
  readonly vertical: BooleanConstructor;
  readonly theme: PropType<DividerTheme>;
  readonly themeOverrides: PropType<DividerThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DividerThemeOverrides>;
}>> & Readonly<{}>, {
  readonly dashed: boolean;
  readonly vertical: boolean;
  readonly titlePlacement: "left" | "right" | "center";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { DividerProps, _default as default, dividerProps };