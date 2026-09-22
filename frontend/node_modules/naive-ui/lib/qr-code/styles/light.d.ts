import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/qr-code/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  borderRadius: string;
};
interface QrCodeThemeVars extends ReturnType<typeof self> {}
declare const themeLight: QrCodeTheme;
interface QrCodeTheme extends Theme<'QrCode', QrCodeThemeVars> {}
interface QrCodeThemeOverrides extends ExtractThemeOverrides<QrCodeTheme> {}
//#endregion
export { QrCodeTheme, QrCodeThemeOverrides, QrCodeThemeVars, themeLight as default };