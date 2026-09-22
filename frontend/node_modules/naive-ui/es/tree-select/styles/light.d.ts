import { ThemeCommonVars } from "../../_styles/common/light.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InternalSelectionTheme } from "../../_internal/selection/styles/light.js";
import "../../_internal/selection/styles/index.js";
import { TreeTheme } from "../../tree/styles/light.js";
import "../../tree/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
//#region src/tree-select/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  menuPadding: string;
  menuColor: string;
  menuBoxShadow: string;
  menuBorderRadius: string;
  menuHeight: string;
  actionDividerColor: string;
  actionTextColor: string;
  actionPadding: string;
  headerDividerColor: string;
  headerTextColor: string;
  headerPadding: string;
};
interface TreeSelectThemeVars extends ReturnType<typeof self> {}
declare const treeSelectLight: TreeSelectTheme;
interface TreeSelectTheme extends Theme<'TreeSelect', TreeSelectThemeVars, {
  Tree: TreeTheme;
  Empty: EmptyTheme;
  InternalSelection: InternalSelectionTheme;
}> {}
interface TreeSelectThemeOverrides extends ExtractThemeOverrides<TreeSelectTheme> {}
//#endregion
export { TreeSelectTheme, TreeSelectThemeOverrides, TreeSelectThemeVars, treeSelectLight as default, self };