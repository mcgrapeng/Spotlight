import { TooltipTheme } from "../../tooltip/styles/light.js";
import "../../tooltip/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/image/styles/light.d.ts
declare function self(): {
  toolbarIconColor: string;
  toolbarColor: string;
  toolbarBoxShadow: string;
  toolbarBorderRadius: string;
};
declare const imageLight: ImageTheme;
interface ImageThemeVars extends ReturnType<typeof self> {}
interface ImageTheme extends Theme<'Image', ImageThemeVars, {
  Tooltip: TooltipTheme;
}> {}
interface ImageThemeOverrides extends ExtractThemeOverrides<ImageTheme> {}
//#endregion
export { ImageTheme, ImageThemeOverrides, ImageThemeVars, imageLight };