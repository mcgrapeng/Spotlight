import { SelectBaseOption, SelectGroupOption, SelectIgnoredOption, SelectMixedOption } from "./interface.js";
import { TreeMateOptions } from "treemate";
//#region src/select/src/utils.d.ts
declare function getIsGroup(option: SelectMixedOption): boolean;
declare function getIgnored(option: SelectMixedOption): boolean;
declare function patternMatched(pattern: string, value: string): boolean;
declare function createTmOptions(valueField: string, childrenField: string): TreeMateOptions<SelectBaseOption, SelectGroupOption, SelectIgnoredOption>;
declare function filterOptions(originalOpts: SelectMixedOption[], filter: (pattern: string, option: SelectBaseOption) => boolean, pattern: string, childrenField: string): SelectMixedOption[];
declare function createValOptMap(options: SelectMixedOption[], valueField: string, childrenField: string): Map<string | number, SelectBaseOption>;
//#endregion
export { createTmOptions, createValOptMap, filterOptions, getIgnored, getIsGroup, patternMatched };