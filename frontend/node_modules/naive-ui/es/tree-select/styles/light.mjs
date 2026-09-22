import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import emptyLight from "../../empty/styles/light.mjs";
import internalSelectionLight from "../../_internal/selection/styles/light.mjs";
import treeLight from "../../tree/styles/light.mjs";
//#region src/tree-select/styles/light.ts
function self(vars) {
  const {
    popoverColor,
    boxShadow2,
    borderRadius,
    heightMedium,
    dividerColor,
    textColor2
  } = vars;
  return {
    menuPadding: "4px",
    menuColor: popoverColor,
    menuBoxShadow: boxShadow2,
    menuBorderRadius: borderRadius,
    menuHeight: `calc(${heightMedium} * 7.6)`,
    actionDividerColor: dividerColor,
    actionTextColor: textColor2,
    actionPadding: "8px 12px",
    headerDividerColor: dividerColor,
    headerTextColor: textColor2,
    headerPadding: "8px 12px"
  };
}
const treeSelectLight = createTheme({
  name: "TreeSelect",
  common: derived,
  peers: {
    Tree: treeLight,
    Empty: emptyLight,
    InternalSelection: internalSelectionLight
  },
  self
});
//#endregion
export { treeSelectLight as default, self };