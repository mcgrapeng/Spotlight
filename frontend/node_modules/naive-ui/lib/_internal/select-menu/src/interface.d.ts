import { SelectBaseOption, SelectGroupOption, SelectIgnoredOption } from "../../../select/src/interface.js";
import { HTMLAttributes, Ref, UnwrapRef, VNode, VNodeChild } from "vue";
import { TreeNode } from "treemate";
//#region src/_internal/select-menu/src/interface.d.ts
type Size = 'tiny' | 'small' | 'medium' | 'large' | 'huge';
type RenderLabel = (option: SelectBaseOption & SelectGroupOption & SelectIgnoredOption, selected: boolean) => VNodeChild;
type RenderLabelImpl = (option: SelectBaseOption | SelectGroupOption | SelectIgnoredOption, selected: boolean) => VNodeChild;
type RenderOption = (info: {
  node: VNode;
  option: SelectBaseOption & SelectGroupOption & SelectIgnoredOption;
  selected: boolean;
}) => VNodeChild;
type RenderOptionImpl = (info: {
  node: VNode;
  option: SelectBaseOption | SelectGroupOption | SelectIgnoredOption;
  selected: boolean;
}) => VNodeChild;
type NodeProps = (option: SelectBaseOption | SelectGroupOption) => HTMLAttributes & Record<string, unknown>;
interface InternalSelectMenuInjection {
  handleOptionMouseEnter: (e: MouseEvent, tmNode: TreeNode<SelectBaseOption>) => void;
  handleOptionClick: (e: MouseEvent, tmNode: TreeNode<SelectBaseOption>) => void;
  showCheckmarkRef: Ref<boolean>;
  valueSetRef: Ref<Set<number | string>>;
  pendingTmNodeRef: Ref<TreeNode<SelectBaseOption> | null>;
  multipleRef: Ref<boolean>;
  valueRef: Ref<string | number | Array<string | number> | null>;
  renderLabelRef: Ref<RenderLabel | undefined>;
  renderOptionRef: Ref<RenderOption | undefined>;
  labelFieldRef: Ref<string>;
  valueFieldRef: Ref<string>;
  nodePropsRef: Ref<NodeProps | undefined>;
}
interface InternalExposedProps {
  selfRef: Ref<HTMLElement | null>;
  getPendingTmNode: () => TreeNode<SelectBaseOption> | null;
  prev: () => void;
  next: () => void;
}
declare const internalSelectionMenuInjectionKey: import("vue").InjectionKey<InternalSelectMenuInjection>;
declare const internalSelectionMenuBodyInjectionKey: import("vue").InjectionKey<Ref<HTMLElement | null, HTMLElement | null>>;
type InternalSelectMenuRef = UnwrapRef<InternalExposedProps>;
//#endregion
export { InternalExposedProps, InternalSelectMenuInjection, InternalSelectMenuRef, NodeProps, RenderLabel, RenderLabelImpl, RenderOption, RenderOptionImpl, Size, internalSelectionMenuBodyInjectionKey, internalSelectionMenuInjectionKey };