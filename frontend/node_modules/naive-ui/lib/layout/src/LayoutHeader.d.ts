import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { LayoutTheme, LayoutThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, Ref } from "vue";
//#region src/layout/src/LayoutHeader.d.ts
declare const headerProps: {
  readonly position: {
    readonly type: import("vue").PropType<"static" | "absolute">;
    readonly default: "static";
  };
  readonly inverted: BooleanConstructor;
  readonly bordered: BooleanConstructor;
};
type LayoutHeaderProps = ExtractPublicPropTypes<typeof headerProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  position: {
    readonly type: import("vue").PropType<"static" | "absolute">;
    readonly default: "static";
  };
  inverted: BooleanConstructor;
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
  position: {
    readonly type: import("vue").PropType<"static" | "absolute">;
    readonly default: "static";
  };
  inverted: BooleanConstructor;
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
export { LayoutHeaderProps, _default as default, headerProps };