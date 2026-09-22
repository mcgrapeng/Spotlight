import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
//#region src/descriptions/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  lineHeight: string;
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  titleTextColor: string;
  thColor: string;
  thColorModal: string;
  thColorPopover: string;
  thTextColor: string;
  thFontWeight: string;
  tdTextColor: string;
  tdColor: string;
  tdColorModal: string;
  tdColorPopover: string;
  borderColor: string;
  borderColorModal: string;
  borderColorPopover: string;
  borderRadius: string;
  thPaddingBorderedSmall: string;
  thPaddingBorderedMedium: string;
  thPaddingBorderedLarge: string;
  thPaddingSmall: string;
  thPaddingMedium: string;
  thPaddingLarge: string;
  tdPaddingBorderedSmall: string;
  tdPaddingBorderedMedium: string;
  tdPaddingBorderedLarge: string;
  tdPaddingSmall: string;
  tdPaddingMedium: string;
  tdPaddingLarge: string;
};
interface DescriptionsThemeVars extends ReturnType<typeof self> {}
declare const descriptionsLight: DescriptionsTheme;
interface DescriptionsTheme extends Theme<'Descriptions', DescriptionsThemeVars> {}
interface DescriptionsThemeOverrides extends ExtractThemeOverrides<DescriptionsTheme> {}
//#endregion
export { DescriptionsTheme, DescriptionsThemeOverrides, DescriptionsThemeVars, descriptionsLight as default, self };