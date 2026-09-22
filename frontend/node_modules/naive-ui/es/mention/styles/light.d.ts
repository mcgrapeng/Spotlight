import { ThemeCommonVars } from "../../_styles/common/light.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/mention/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  menuBoxShadow: string;
};
declare const mentionLight: MentionTheme;
interface MentionTheme extends Theme<'Mention', MentionThemeVars, {
  InternalSelectMenu: InternalSelectMenuTheme;
  Input: InputTheme;
}> {}
interface MentionThemeOverrides extends ExtractThemeOverrides<MentionTheme> {}
interface MentionThemeVars extends ReturnType<typeof self> {}
//#endregion
export { MentionTheme, MentionThemeOverrides, MentionThemeVars, mentionLight as default };