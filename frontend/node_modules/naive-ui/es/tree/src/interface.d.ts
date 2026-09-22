import { TreeTheme } from "../styles/light.js";
import "../styles/index.js";
import { TreeSpinProps } from "./public-types.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { HTMLAttributes, Ref, VNodeChild } from "vue";
import { VirtualListScrollTo } from "vueuc";
import { CheckStrategy, TreeNode } from "treemate";
//#region src/tree/src/interface.d.ts
type Key = string | number;
type OnLoad = (node: TreeOption) => Promise<unknown>;
interface TreeOptionBase {
  key?: Key;
  label?: string;
  checkboxDisabled?: boolean;
  disabled?: boolean;
  isLeaf?: boolean;
  children?: TreeOption[];
  prefix?: () => VNodeChild;
  suffix?: () => VNodeChild;
}
type TreeOption = TreeOptionBase & Record<string, unknown>;
type TreeOptions = TreeOption[];
interface TreeRenderProps {
  option: TreeOption;
  checked: boolean;
  selected: boolean;
}
type RenderTreePart = ({ option, checked, selected }: TreeRenderProps) => VNodeChild;
type RenderLabel = RenderTreePart;
type RenderPrefix = RenderTreePart;
type RenderSuffix = RenderTreePart;
type TreeOverrideNodeClickBehaviorReturn = 'toggleSelect' | 'toggleExpand' | 'toggleCheck' | 'default' | 'none';
type TreeOverrideNodeClickBehavior = (info: {
  option: TreeOption;
}) => TreeOverrideNodeClickBehaviorReturn;
type TreeNodeProps = (info: {
  option: TreeOption;
}) => HTMLAttributes & Record<string, unknown>;
interface TreeDragInfo {
  event: DragEvent;
  node: TreeOption;
}
interface TreeDropInfo {
  event: DragEvent;
  node: TreeOption;
  dragNode: TreeOption;
  dropPosition: 'before' | 'inside' | 'after';
}
interface InternalDragInfo {
  event: DragEvent;
  node: TmNode;
}
type DropPosition = 'before' | 'inside' | 'after';
type AllowDrop = (info: {
  dropPosition: DropPosition;
  node: TreeOption;
  phase: 'drag' | 'drop';
}) => boolean;
interface InternalDropInfo {
  event: DragEvent;
  node: TmNode;
  dropPosition: DropPosition;
}
type RenderSwitcherIcon = (props: {
  expanded: boolean;
  selected: boolean;
  option: TreeOption;
}) => VNodeChild;
type CheckOnClick = (option: TreeOption) => boolean;
interface TreeInjection {
  loadingKeysRef: Ref<Set<Key>>;
  highlightKeySetRef: Ref<Set<Key> | null>;
  displayedCheckedKeysRef: Ref<Key[]>;
  displayedIndeterminateKeysRef: Ref<Key[]>;
  mergedSelectedKeysRef: Ref<Key[]>;
  mergedExpandedKeysRef: Ref<Key[]>;
  fNodesRef: Ref<Array<TreeNode<TreeOption>>>;
  draggableRef: Ref<boolean>;
  mergedThemeRef: Ref<MergedTheme<TreeTheme>>;
  onLoadRef: Ref<OnLoad | undefined>;
  blockLineRef: Ref<boolean>;
  indentRef: Ref<number>;
  draggingNodeRef: Ref<TmNode | null>;
  droppingMouseNodeRef: Ref<TmNode | null>;
  droppingNodeParentRef: Ref<TmNode | null>;
  droppingPositionRef: Ref<null | DropPosition>;
  droppingOffsetLevelRef: Ref<number>;
  disabledRef: Ref<boolean>;
  checkableRef: Ref<boolean>;
  cascadeRef: Ref<boolean>;
  mergedCheckStrategyRef: Ref<CheckStrategy>;
  selectableRef: Ref<boolean>;
  expandOnClickRef: Ref<boolean>;
  pendingNodeKeyRef: Ref<null | Key>;
  internalScrollableRef: Ref<boolean>;
  internalCheckboxFocusableRef: Ref<boolean>;
  renderLabelRef: Ref<RenderLabel | undefined>;
  renderPrefixRef: Ref<RenderPrefix | undefined>;
  renderSuffixRef: Ref<RenderSuffix | undefined>;
  renderSwitcherIconRef: Ref<RenderSwitcherIcon | undefined>;
  labelFieldRef: Ref<string>;
  nodePropsRef: Ref<TreeNodeProps | undefined>;
  multipleRef: Ref<boolean>;
  checkboxPlacementRef: 'left' | 'right';
  internalTreeSelect: boolean;
  checkOnClickRef: Ref<boolean | CheckOnClick>;
  disabledFieldRef: Ref<string>;
  showLineRef: Ref<boolean>;
  overrideDefaultNodeClickBehaviorRef: Ref<TreeOverrideNodeClickBehavior | undefined>;
  spinPropsRef: Ref<TreeSpinProps | undefined>;
  handleSwitcherClick: (node: TreeNode<TreeOption>) => void;
  handleSelect: (node: TreeNode<TreeOption>) => void;
  handleCheck: (node: TreeNode<TreeOption>, checked: boolean) => void;
  handleDragStart: (info: InternalDragInfo) => void;
  handleDragEnter: (info: InternalDragInfo) => void;
  handleDragLeave: (info: InternalDragInfo) => void;
  handleDragEnd: (info: InternalDragInfo) => void;
  handleDragOver: (info: InternalDragInfo) => void;
  handleDrop: (info: InternalDropInfo) => void;
}
declare const treeInjectionKey: import("vue").InjectionKey<TreeInjection>;
type TmNode = TreeNode<TreeOption>;
interface MotionData {
  __motion: true;
  height: number | undefined;
  mode: 'expand' | 'collapse';
  nodes: TmNode[];
}
interface InternalTreeInst {
  handleKeydown: (e: KeyboardEvent) => {
    enterBehavior: TreeOverrideNodeClickBehaviorReturn | null;
  };
}
interface TreeInst {
  scrollTo: VirtualListScrollTo;
  getCheckedData: () => {
    keys: Key[];
    options: Array<TreeOption | null>;
  };
  getIndeterminateData: () => {
    keys: Key[];
    options: Array<TreeOption | null>;
  };
}
type GetChildren = (option: any) => unknown;
//#endregion
export { AllowDrop, CheckOnClick, DropPosition, GetChildren, InternalDragInfo, InternalDropInfo, InternalTreeInst, Key, MotionData, OnLoad, RenderLabel, RenderPrefix, RenderSuffix, RenderSwitcherIcon, TmNode, TreeDragInfo, TreeDropInfo, TreeInjection, TreeInst, TreeNodeProps, TreeOption, TreeOptionBase, TreeOptions, TreeOverrideNodeClickBehavior, TreeOverrideNodeClickBehaviorReturn, TreeRenderProps, treeInjectionKey };