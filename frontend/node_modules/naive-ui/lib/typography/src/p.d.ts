import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { TypographyTheme, TypographyThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/typography/src/p.d.ts
declare const pProps: {
  depth: PropType<1 | 2 | 3 | "1" | "2" | "3">;
  theme: PropType<TypographyTheme>;
  themeOverrides: PropType<TypographyThemeOverrides>;
  builtinThemeOverrides: PropType<TypographyThemeOverrides>;
};
type PProps = ExtractPublicPropTypes<typeof pProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  depth: PropType<1 | 2 | 3 | "1" | "2" | "3">;
  theme: PropType<TypographyTheme>;
  themeOverrides: PropType<TypographyThemeOverrides>;
  builtinThemeOverrides: PropType<TypographyThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  depth: PropType<1 | 2 | 3 | "1" | "2" | "3">;
  theme: PropType<TypographyTheme>;
  themeOverrides: PropType<TypographyThemeOverrides>;
  builtinThemeOverrides: PropType<TypographyThemeOverrides>;
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { PProps, _default as default, pProps };