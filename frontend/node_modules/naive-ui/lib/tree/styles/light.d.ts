import { ThemeCommonVars } from "../../_styles/common/light.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
//#region src/tree/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSize: string;
  lineHeight: string;
  nodeHeight: string;
  nodeWrapperPadding: string;
  nodeBorderRadius: string;
  nodeColorHover: string;
  nodeColorPressed: string;
  nodeColorActive: string;
  arrowColor: string;
  nodeTextColor: string;
  nodeTextColorDisabled: string;
  loadingColor: string;
  dropMarkColor: string;
  lineColor: string;
};
interface TreeThemeVars extends ReturnType<typeof self> {}
declare const treeLight: TreeTheme;
interface TreeTheme extends Theme<'Tree', TreeThemeVars, {
  Checkbox: CheckboxTheme;
  Scrollbar: ScrollbarTheme;
  Empty: EmptyTheme;
}> {}
interface TreeThemeOverrides extends ExtractThemeOverrides<TreeTheme> {}
//#endregion
export { TreeTheme, TreeThemeOverrides, TreeThemeVars, treeLight as default, self };