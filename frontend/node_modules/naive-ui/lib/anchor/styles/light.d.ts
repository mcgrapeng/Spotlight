import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/anchor/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  borderRadius: string;
  railColor: string;
  railColorActive: string;
  linkColor: string;
  linkTextColor: string;
  linkTextColorHover: string;
  linkTextColorPressed: string;
  linkTextColorActive: string;
  linkFontSize: string;
  linkPadding: string;
  railWidth: string;
};
interface AnchorThemeVars extends ReturnType<typeof self> {}
declare const anchorLight: AnchorTheme;
interface AnchorTheme extends Theme<'Anchor', AnchorThemeVars> {}
interface AnchorThemeOverrides extends ExtractThemeOverrides<AnchorTheme> {}
//#endregion
export { AnchorTheme, AnchorThemeOverrides, AnchorThemeVars, anchorLight as default, self };