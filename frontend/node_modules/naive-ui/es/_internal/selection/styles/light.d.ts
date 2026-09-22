import { ThemeCommonVars } from "../../../_styles/common/light.js";
import { PopoverTheme } from "../../../popover/styles/light.js";
import "../../../popover/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../../_mixins/use-theme.js";
import "../../../_mixins/index.js";
//#region src/_internal/selection/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSizeTiny: string;
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  heightTiny: string;
  heightSmall: string;
  heightMedium: string;
  heightLarge: string;
  borderRadius: string;
  fontWeight: string;
  textColor: string;
  textColorDisabled: string;
  placeholderColor: string;
  placeholderColorDisabled: string;
  color: string;
  colorDisabled: string;
  colorActive: string;
  border: string;
  borderHover: string;
  borderActive: string;
  borderFocus: string;
  boxShadowHover: string;
  boxShadowActive: string;
  boxShadowFocus: string;
  caretColor: string;
  arrowColor: string;
  arrowColorDisabled: string;
  loadingColor: string;
  borderWarning: string;
  borderHoverWarning: string;
  borderActiveWarning: string;
  borderFocusWarning: string;
  boxShadowHoverWarning: string;
  boxShadowActiveWarning: string;
  boxShadowFocusWarning: string;
  colorActiveWarning: string;
  caretColorWarning: string;
  borderError: string;
  borderHoverError: string;
  borderActiveError: string;
  borderFocusError: string;
  boxShadowHoverError: string;
  boxShadowActiveError: string;
  boxShadowFocusError: string;
  colorActiveError: string;
  caretColorError: string;
  clearColor: string;
  clearColorHover: string;
  clearColorPressed: string;
  paddingSingle: string;
  paddingMultiple: string;
  clearSize: string;
  arrowSize: string;
};
interface InternalSelectionThemeVars extends ReturnType<typeof self> {}
declare const internalSelectionLight: InternalSelectionTheme;
interface InternalSelectionTheme extends Theme<'InternalSelection', InternalSelectionThemeVars, {
  Popover: PopoverTheme;
}> {}
interface InternalSelectionThemeOverrides extends ExtractThemeOverrides<InternalSelectionTheme> {}
//#endregion
export { InternalSelectionTheme, InternalSelectionThemeOverrides, InternalSelectionThemeVars, internalSelectionLight as default };