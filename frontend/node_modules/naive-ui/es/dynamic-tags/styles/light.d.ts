import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { TagTheme } from "../../tag/styles/light.js";
import "../../tag/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { SpaceTheme } from "../../space/styles/light.js";
import "../../space/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/dynamic-tags/styles/light.d.ts
declare function self(): {
  inputWidth: string;
};
interface DynamicTagsThemeVars extends ReturnType<typeof self> {}
declare const dynamicTagsLight: DynamicTagsTheme;
interface DynamicTagsTheme extends Theme<'DynamicTags', DynamicTagsThemeVars, {
  Input: InputTheme;
  Button: ButtonTheme;
  Tag: TagTheme;
  Space: SpaceTheme;
}> {}
interface DynamicTagsThemeOverrides extends ExtractThemeOverrides<DynamicTagsTheme> {}
//#endregion
export { DynamicTagsTheme, DynamicTagsThemeOverrides, DynamicTagsThemeVars, dynamicTagsLight as default, self };