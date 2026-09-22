import { SelectBaseOption } from "../../select/src/interface.js";
import { CascaderOption, TmNode } from "./interface.js";
//#region src/cascader/src/utils.d.ts
declare function getRawNodePath(tmNodes: TmNode[]): CascaderOption[];
declare function getRawNodePath(tmNodes: TmNode[] | undefined): CascaderOption[] | null;
declare function createSelectOptions(tmNodes: TmNode[], checkStrategyIsChild: boolean, labelField: string, separator: string): Array<SelectBaseOption & {
  rawNode: CascaderOption;
  path: CascaderOption[];
}>;
declare function getPathLabel(node: TmNode | null, separator: string, labelField: string): string;
//#endregion
export { createSelectOptions, getPathLabel, getRawNodePath };