import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { TypographyTheme, TypographyThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, Ref } from "vue";
//#region src/typography/src/blockquote.d.ts
declare const blockquoteProps: {
  readonly alignText: BooleanConstructor;
  readonly theme: import("vue").PropType<TypographyTheme>;
  readonly themeOverrides: import("vue").PropType<TypographyThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<TypographyThemeOverrides>;
};
type BlockquoteProps = ExtractPublicPropTypes<typeof blockquoteProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly alignText: BooleanConstructor;
  readonly theme: import("vue").PropType<TypographyTheme>;
  readonly themeOverrides: import("vue").PropType<TypographyThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<TypographyThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly alignText: BooleanConstructor;
  readonly theme: import("vue").PropType<TypographyTheme>;
  readonly themeOverrides: import("vue").PropType<TypographyThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<TypographyThemeOverrides>;
}>> & Readonly<{}>, {
  readonly alignText: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { BlockquoteProps, blockquoteProps, _default as default };