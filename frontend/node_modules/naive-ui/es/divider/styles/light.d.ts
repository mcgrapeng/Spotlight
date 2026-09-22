import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/divider/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  textColor: string;
  color: string;
  fontWeight: string;
};
interface DividerThemeVars extends ReturnType<typeof self> {}
declare const dividerLight: DividerTheme;
interface DividerTheme extends Theme<'Divider', DividerThemeVars> {}
interface DividerThemeOverrides extends ExtractThemeOverrides<DividerTheme> {}
//#endregion
export { DividerTheme, DividerThemeOverrides, DividerThemeVars, dividerLight as default, self };