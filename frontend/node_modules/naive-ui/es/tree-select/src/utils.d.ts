import { SelectBaseOption } from "../../select/src/interface.js";
import { TreeSelectTmNode } from "./interface.js";
//#region src/tree-select/src/utils.d.ts
declare function treeOption2SelectOption(tmNode: TreeSelectTmNode, labelField: string): SelectBaseOption;
declare function treeOption2SelectOptionWithPath(tmNode: TreeSelectTmNode, path: TreeSelectTmNode[], separator: string, labelField: string): SelectBaseOption;
//#endregion
export { treeOption2SelectOption, treeOption2SelectOptionWithPath };