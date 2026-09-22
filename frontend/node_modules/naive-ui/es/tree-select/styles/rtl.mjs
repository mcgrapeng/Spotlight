import { c } from "../../_utils/cssr/index.mjs";
import scrollbarRtl from "../../_internal/scrollbar/styles/rtl.mjs";
import { internalSelectMenuRtl } from "../../_internal/select-menu/styles/rtl.mjs";
import { tagRtl } from "../../tag/styles/rtl.mjs";
import { internalSelectionRtl } from "../../_internal/selection/styles/rtl.mjs";
import { treeRtl } from "../../tree/styles/rtl.mjs";
//#region src/tree-select/styles/rtl.ts
const treeSelectRtl = {
  name: "Select",
  style: c([]),
  peers: [internalSelectionRtl, internalSelectMenuRtl, tagRtl, scrollbarRtl, treeRtl]
};
//#endregion
export { treeSelectRtl };