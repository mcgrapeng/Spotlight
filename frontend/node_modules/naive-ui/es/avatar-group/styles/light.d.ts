import { AvatarTheme } from "../../avatar/styles/light.js";
import "../../avatar/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/avatar-group/styles/light.d.ts
declare function self(): {
  gap: string;
};
interface AvatarGroupThemeVars extends ReturnType<typeof self> {}
declare const avatarGroupLight: AvatarGroupTheme;
interface AvatarGroupTheme extends Theme<'AvatarGroup', AvatarGroupThemeVars, {
  Avatar: AvatarTheme;
}> {}
interface AvatarGroupThemeOverrides extends ExtractThemeOverrides<AvatarGroupTheme> {}
//#endregion
export { AvatarGroupTheme, AvatarGroupThemeOverrides, AvatarGroupThemeVars, avatarGroupLight as default, self };