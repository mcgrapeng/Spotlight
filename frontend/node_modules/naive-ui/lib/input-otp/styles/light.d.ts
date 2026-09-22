import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/input-otp/styles/light.d.ts
declare function self(): {
  inputWidthSmall: string;
  inputWidthMedium: string;
  inputWidthLarge: string;
  gapSmall: string;
  gapMedium: string;
  gapLarge: string;
};
interface InputOtpThemeVars extends ReturnType<typeof self> {}
declare const inputOtpLight: InputOtpTheme;
interface InputOtpTheme extends Theme<'InputOtp', InputOtpThemeVars, {
  Input: InputTheme;
}> {}
interface InputOtpThemeOverrides extends ExtractThemeOverrides<InputOtpTheme> {}
//#endregion
export { InputOtpTheme, InputOtpThemeOverrides, InputOtpThemeVars, inputOtpLight as default, self };