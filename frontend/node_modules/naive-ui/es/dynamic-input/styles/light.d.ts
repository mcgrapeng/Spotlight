import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/dynamic-input/styles/light.d.ts
declare function self(): {
  actionMargin: string;
  actionMarginRtl: string;
};
interface DynamicInputThemeVars extends ReturnType<typeof self> {}
declare const dynamicInputLight: DynamicInputTheme;
interface DynamicInputTheme extends Theme<'DynamicInput', DynamicInputThemeVars, {
  Input: InputTheme;
  Button: ButtonTheme;
}> {}
interface DynamicInputThemeOverrides extends ExtractThemeOverrides<DynamicInputTheme> {}
//#endregion
export { DynamicInputTheme, DynamicInputThemeOverrides, DynamicInputThemeVars, dynamicInputLight as default };