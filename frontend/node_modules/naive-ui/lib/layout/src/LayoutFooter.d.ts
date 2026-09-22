import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { LayoutTheme, LayoutThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, Ref } from "vue";
//#region src/layout/src/LayoutFooter.d.ts
declare const layoutFooterProps: {
  inverted: BooleanConstructor;
  position: {
    readonly type: import("vue").PropType<"static" | "absolute">;
    readonly default: "static";
  };
  bordered: BooleanConstructor;
  theme: import("vue").PropType<LayoutTheme>;
  themeOverrides: import("vue").PropType<LayoutThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<LayoutThemeOverrides>;
};
type LayoutFooterProps = ExtractPublicPropTypes<typeof layoutFooterProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  inverted: BooleanConstructor;
  position: {
    readonly type: import("vue").PropType<"static" | "absolute">;
    readonly default: "static";
  };
  bordered: BooleanConstructor;
  theme: import("vue").PropType<LayoutTheme>;
  themeOverrides: import("vue").PropType<LayoutThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<LayoutThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  inverted: BooleanConstructor;
  position: {
    readonly type: import("vue").PropType<"static" | "absolute">;
    readonly default: "static";
  };
  bordered: BooleanConstructor;
  theme: import("vue").PropType<LayoutTheme>;
  themeOverrides: import("vue").PropType<LayoutThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<LayoutThemeOverrides>;
}>> & Readonly<{}>, {
  position: "absolute" | "static";
  bordered: boolean;
  inverted: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { LayoutFooterProps, _default as default, layoutFooterProps };