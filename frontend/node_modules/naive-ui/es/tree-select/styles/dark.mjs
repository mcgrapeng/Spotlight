import derived from "../../_styles/common/dark.mjs";
import emptyDark from "../../empty/styles/dark.mjs";
import internalSelectionDark from "../../_internal/selection/styles/dark.mjs";
import treeDark from "../../tree/styles/dark.mjs";
//#region src/tree-select/styles/dark.ts
const treeSelectDark = {
  name: "TreeSelect",
  common: derived,
  peers: {
    Tree: treeDark,
    Empty: emptyDark,
    InternalSelection: internalSelectionDark
  }
};
//#endregion
export { treeSelectDark as default };