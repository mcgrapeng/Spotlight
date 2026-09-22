import { Key as Key$1, TmNode, TreeOption } from "./interface.js";
import { ComputedRef } from "vue";
import { CheckStrategy } from "treemate";
//#region src/tree/src/utils.d.ts
declare function useMergedCheckStrategy(props: {
  leafOnly: boolean;
  checkStrategy: CheckStrategy;
}): ComputedRef<CheckStrategy>;
declare function isNodeDisabled(node: TmNode, disabledField: string): boolean;
declare function keysWithFilter(nodes: TreeOption[], pattern: string, keyField: string, childrenField: string, filter: (pattern: string, node: TreeOption) => boolean): {
  expandedKeys: Key$1[];
  highlightKeySet: Set<Key$1>;
};
declare const emptyImage: HTMLImageElement | null;
declare function filterTree(tree: TreeOption[], filter: (pattern: string, v: TreeOption) => boolean, pattern: string, keyField: string, childrenField: string): {
  filteredTree: TreeOption[];
  expandedKeys: Key$1[];
  highlightKeySet: Set<Key$1>;
};
declare function treeGetClickTarget(e: MouseEvent): 'checkbox' | 'switcher' | 'node';
//#endregion
export { emptyImage, filterTree, isNodeDisabled, keysWithFilter, treeGetClickTarget, useMergedCheckStrategy };