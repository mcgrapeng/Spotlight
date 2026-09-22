import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/avatar/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  borderRadius: string;
  fontSize: string;
  border: string;
  heightTiny: string;
  heightSmall: string;
  heightMedium: string;
  heightLarge: string;
  heightHuge: string;
  color: string;
  colorModal: string;
  colorPopover: string;
};
interface AvatarThemeVars extends ReturnType<typeof self> {}
declare const avatarLight: AvatarTheme;
interface AvatarTheme extends Theme<'Avatar', AvatarThemeVars> {}
interface AvatarThemeOverrides extends ExtractThemeOverrides<AvatarTheme> {}
type AvatarGroupTheme = AvatarTheme;
type AvatarGroupThemeOverrides = AvatarThemeOverrides;
//#endregion
export { AvatarGroupTheme, AvatarGroupThemeOverrides, AvatarTheme, AvatarThemeOverrides, AvatarThemeVars, avatarLight as default, self };