import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/table/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  lineHeight: string;
  borderRadius: string;
  borderColor: string;
  borderColorModal: string;
  borderColorPopover: string;
  tdColor: string;
  tdColorModal: string;
  tdColorPopover: string;
  tdColorStriped: string;
  tdColorStripedModal: string;
  tdColorStripedPopover: string;
  thColor: string;
  thColorModal: string;
  thColorPopover: string;
  thTextColor: string;
  tdTextColor: string;
  thFontWeight: string;
  thPaddingSmall: string;
  thPaddingMedium: string;
  thPaddingLarge: string;
  tdPaddingSmall: string;
  tdPaddingMedium: string;
  tdPaddingLarge: string;
};
interface TableThemeVars extends ReturnType<typeof self> {}
declare const tableLight: TableTheme;
interface TableTheme extends Theme<'Table', TableThemeVars> {}
interface TableThemeOverrides extends ExtractThemeOverrides<TableTheme> {}
//#endregion
export { TableTheme, TableThemeOverrides, TableThemeVars, tableLight as default, self };