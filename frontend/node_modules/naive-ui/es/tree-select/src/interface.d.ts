import { TreeOption, TreeOptionBase } from "../../tree/src/interface.js";
import { HTMLAttributes, Ref, VNodeChild } from "vue";
import { TreeMate, TreeNode } from "treemate";
//#region src/tree-select/src/interface.d.ts
type TreeSelectOption = Omit<TreeOptionBase, 'checkboxDisabled' | 'isLeaf' | 'children'> & {
  children?: TreeSelectOption[];
  [k: string]: unknown;
};
type TreeSelectTmNode = TreeNode<TreeSelectOption>;
type OnUpdateValue = (value: string & number & (string | number) & string[] & number[] & Array<string | number> & null, option: TreeSelectOption & null & TreeSelectOption[] & Array<TreeSelectOption | null>, meta: {
  node: TreeSelectOption;
  action: 'select' | 'unselect';
} | {
  node: TreeSelectOption | null;
  action: 'delete';
} | {
  node: null;
  action: 'clear';
}) => void;
type OnUpdateValueImpl = (value: string | number | (string | number) | string[] | number[] | Array<string | number> | null, option: TreeSelectOption | null | Array<TreeSelectOption | null>, meta: {
  node: TreeSelectOption;
  action: 'select' | 'unselect';
} | {
  node: TreeSelectOption | null;
  action: 'delete';
} | {
  node: null;
  action: 'clear';
}) => void;
type OnUpdateIndeterminateKeysImpl = (value: string | number | (string | number) | string[] | number[] | Array<string | number> | null, option: TreeSelectOption | null | Array<TreeSelectOption | null>) => void;
type Value = string | number | Array<string | number> | null;
interface TreeSelectInjection {
  pendingNodeKeyRef: Ref<string | number | null>;
  dataTreeMate: Ref<TreeMate<TreeOption>>;
}
declare const treeSelectInjectionKey: import("vue").InjectionKey<TreeSelectInjection>;
type TreeSelectRenderTag = (props: {
  option: TreeSelectOption;
  handleClose: () => void;
}) => VNodeChild;
interface TreeSelectRenderProps {
  option: TreeSelectOption;
  checked: boolean;
  selected: boolean;
}
type TreeSelectRenderTreePart = ({ option, checked, selected }: TreeSelectRenderProps) => VNodeChild;
type TreeSelectRenderLabel = TreeSelectRenderTreePart;
type TreeSelectRenderPrefix = TreeSelectRenderTreePart;
type TreeSelectRenderSuffix = TreeSelectRenderTreePart;
type TreeSelectNodeProps = (info: {
  option: TreeSelectOption;
}) => HTMLAttributes & Record<string, unknown>;
interface TreeSelectInst {
  getCheckedData: () => {
    keys: Array<string | number>;
    options: Array<TreeSelectOption | null>;
  };
  getIndeterminateData: () => {
    keys: Array<string | number>;
    options: Array<TreeSelectOption | null>;
  };
  focus: () => void;
  focusInput: () => void;
  blur: () => void;
  blurInput: () => void;
}
//#endregion
export { OnUpdateIndeterminateKeysImpl, OnUpdateValue, OnUpdateValueImpl, TreeSelectInjection, TreeSelectInst, TreeSelectNodeProps, TreeSelectOption, TreeSelectRenderLabel, TreeSelectRenderPrefix, TreeSelectRenderProps, TreeSelectRenderSuffix, TreeSelectRenderTag, TreeSelectRenderTreePart, TreeSelectTmNode, Value, treeSelectInjectionKey };