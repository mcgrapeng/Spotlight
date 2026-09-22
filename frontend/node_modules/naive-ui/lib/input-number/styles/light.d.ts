import { ThemeCommonVars } from "../../_styles/common/light.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/input-number/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  iconColorDisabled: string;
};
interface InputNumberThemeVars extends ReturnType<typeof self> {}
declare const inputNumberLight: InputNumberTheme;
interface InputNumberTheme extends Theme<'InputNumber', InputNumberThemeVars, {
  Button: ButtonTheme;
  Input: InputTheme;
}> {}
interface InputNumberThemeOverrides extends ExtractThemeOverrides<InputNumberTheme> {}
//#endregion
export { InputNumberTheme, InputNumberThemeOverrides, InputNumberThemeVars, inputNumberLight as default };