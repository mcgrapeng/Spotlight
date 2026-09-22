import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/spin/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSize: string;
  textColor: string;
  sizeTiny: string;
  sizeSmall: string;
  sizeMedium: string;
  sizeLarge: string;
  sizeHuge: string;
  color: string;
  opacitySpinning: string;
};
interface SpinThemeVars extends ReturnType<typeof self> {}
declare const spinLight: SpinTheme;
interface SpinTheme extends Theme<'Spin', SpinThemeVars> {}
interface SpinThemeOverrides extends ExtractThemeOverrides<SpinTheme> {}
//#endregion
export { SpinTheme, SpinThemeOverrides, SpinThemeVars, spinLight as default, self };