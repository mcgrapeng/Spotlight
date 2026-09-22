import { Key as Key$1, TmNode, TreeOption, TreeOverrideNodeClickBehavior, TreeOverrideNodeClickBehaviorReturn } from "./interface.js";
import { Ref } from "vue";
import { TreeNode } from "treemate";
//#region src/tree/src/keyboard.d.ts
declare function useKeyboard({ props, fNodesRef, mergedExpandedKeysRef, mergedSelectedKeysRef, mergedCheckedKeysRef, handleCheck, handleSelect, handleSwitcherClick }: {
  props: {
    keyboard: boolean;
    overrideDefaultNodeClickBehavior: TreeOverrideNodeClickBehavior | undefined;
  };
  fNodesRef: Ref<Array<TreeNode<TreeOption>>>;
  mergedExpandedKeysRef: Ref<Key$1[]>;
  mergedSelectedKeysRef: Ref<Key$1[]>;
  mergedCheckedKeysRef: Ref<Key$1[]>;
  handleSelect: (node: TmNode) => void;
  handleSwitcherClick: (node: TmNode) => void;
  handleCheck: (node: TmNode, checked: boolean) => void;
}): {
  pendingNodeKeyRef: Ref<null | Key$1>;
  handleKeydown: (e: KeyboardEvent) => {
    enterBehavior: TreeOverrideNodeClickBehaviorReturn | null;
  };
};
//#endregion
export { useKeyboard };