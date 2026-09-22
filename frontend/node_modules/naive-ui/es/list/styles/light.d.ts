import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/list/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  textColor: string;
  color: string;
  colorHover: string;
  colorModal: string;
  colorHoverModal: string;
  colorPopover: string;
  colorHoverPopover: string;
  borderColor: string;
  borderColorModal: string;
  borderColorPopover: string;
  borderRadius: string;
  fontSize: string;
};
interface ListThemeVars extends ReturnType<typeof self> {}
declare const listLight: ListTheme;
interface ListTheme extends Theme<'List', ListThemeVars> {}
interface ListThemeOverrides extends ExtractThemeOverrides<ListTheme> {}
//#endregion
export { ListTheme, ListThemeOverrides, ListThemeVars, listLight as default, self };