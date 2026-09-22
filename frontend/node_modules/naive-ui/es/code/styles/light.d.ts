import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
//#region src/code/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  textColor: string;
  fontSize: string;
  fontWeightStrong: string;
  'mono-3': string;
  'hue-1': string;
  'hue-2': string;
  'hue-3': string;
  'hue-4': string;
  'hue-5': string;
  'hue-5-2': string;
  'hue-6': string;
  'hue-6-2': string;
  lineNumberTextColor: string;
};
interface CodeThemeVars extends ReturnType<typeof self> {}
declare const codeLight: CodeTheme;
interface CodeTheme extends Theme<'Code', CodeThemeVars> {}
interface CodeThemeOverrides extends ExtractThemeOverrides<CodeTheme> {}
//#endregion
export { CodeTheme, CodeThemeOverrides, CodeThemeVars, codeLight as default };