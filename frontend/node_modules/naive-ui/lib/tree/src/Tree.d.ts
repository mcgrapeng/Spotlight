import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { ScrollbarProps } from "../../scrollbar/src/Scrollbar.js";
import { TreeTheme, TreeThemeOverrides, TreeThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { TreeSpinProps } from "./public-types.js";
import { AllowDrop, CheckOnClick, GetChildren, Key as Key$1, OnLoad, RenderLabel, RenderPrefix, RenderSuffix, RenderSwitcherIcon, TreeDragInfo, TreeDropInfo, TreeNodeProps, TreeOption, TreeOptions, TreeOverrideNodeClickBehavior, TreeOverrideNodeClickBehaviorReturn } from "./interface.js";
import { defaultAllowDrop } from "./dnd.js";
import "../../index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode, VNodeChild } from "vue";
import { CheckStrategy, TreeMateOptions } from "treemate";
//#region src/tree/src/Tree.d.ts
declare function createTreeMateOptions<T>(keyField: string, childrenField: string, disabledField: string, getChildren: GetChildren | undefined): TreeMateOptions<T, T, T>;
type OnUpdateCheckedKeys = (value: Array<string & number>, option: Array<TreeOption | null>, meta: {
  node: TreeOption | null;
  action: 'check' | 'uncheck';
}) => void;
type OnUpdateCheckedKeysImpl = (value: Key$1[], option: Array<TreeOption | null>, meta: {
  node: TreeOption | null;
  action: 'check' | 'uncheck';
}) => void;
type OnUpdateIndeterminateKeys = (value: Array<string & number>, option: Array<TreeOption | null>) => void;
type OnUpdateIndeterminateKeysImpl = (value: Key$1[], option: Array<TreeOption | null>) => void;
type OnUpdateSelectedKeys = (value: Array<string & number>, option: Array<TreeOption | null>, meta: {
  node: TreeOption | null;
  action: 'select' | 'unselect';
}) => void;
type OnUpdateSelectedKeysImpl = (value: Key$1[], option: Array<TreeOption | null>, meta: {
  node: TreeOption | null;
  action: 'select' | 'unselect';
}) => void;
type onUpdateExpandedKeys = (value: Array<string & number>, option: Array<TreeOption | null>, meta: {
  node: TreeOption;
  action: 'expand' | 'collapse';
} | {
  node: null;
  action: 'filter';
}) => void;
type OnUpdateExpandedKeysImpl = (value: Key$1[], option: Array<TreeOption | null>, meta: {
  node: TreeOption;
  action: 'expand' | 'collapse';
} | {
  node: null;
  action: 'filter';
}) => void;
declare const treeSharedProps: {
  readonly allowCheckingNotLoaded: BooleanConstructor;
  readonly filter: PropType<(pattern: string, node: TreeOption) => boolean>;
  readonly defaultExpandAll: BooleanConstructor;
  readonly expandedKeys: PropType<Key$1[]>;
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly defaultExpandedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly indent: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly indeterminateKeys: PropType<Key$1[]>;
  readonly renderSwitcherIcon: PropType<RenderSwitcherIcon>;
  readonly onUpdateIndeterminateKeys: PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly 'onUpdate:indeterminateKeys': PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly onUpdateExpandedKeys: PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly 'onUpdate:expandedKeys': PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly overrideDefaultNodeClickBehavior: PropType<TreeOverrideNodeClickBehavior>;
};
declare const treeProps: {
  readonly internalTreeSelect: BooleanConstructor;
  readonly internalScrollable: BooleanConstructor;
  readonly internalScrollablePadding: StringConstructor;
  readonly internalRenderEmpty: PropType<() => VNodeChild>;
  readonly internalHighlightKeySet: PropType<Set<Key$1> | null>;
  readonly internalUnifySelectCheck: BooleanConstructor;
  readonly internalCheckboxFocusable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly internalFocusable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly checkStrategy: {
    readonly type: PropType<CheckStrategy>;
    readonly default: "all";
  };
  readonly spinProps: PropType<TreeSpinProps>;
  /**
   * @deprecated
   */
  readonly leafOnly: BooleanConstructor;
  readonly allowCheckingNotLoaded: BooleanConstructor;
  readonly filter: PropType<(pattern: string, node: TreeOption) => boolean>;
  readonly defaultExpandAll: BooleanConstructor;
  readonly expandedKeys: PropType<Key$1[]>;
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly defaultExpandedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly indent: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly indeterminateKeys: PropType<Key$1[]>;
  readonly renderSwitcherIcon: PropType<RenderSwitcherIcon>;
  readonly onUpdateIndeterminateKeys: PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly 'onUpdate:indeterminateKeys': PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly onUpdateExpandedKeys: PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly 'onUpdate:expandedKeys': PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly overrideDefaultNodeClickBehavior: PropType<TreeOverrideNodeClickBehavior>;
  readonly accordion: BooleanConstructor;
  readonly showIrrelevantNodes: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly data: {
    readonly type: PropType<TreeOptions>;
    readonly default: () => never[];
  };
  readonly expandOnDragenter: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly expandOnClick: BooleanConstructor;
  readonly checkOnClick: {
    readonly type: PropType<boolean | CheckOnClick>;
    readonly default: false;
  };
  readonly cancelable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly checkable: BooleanConstructor;
  readonly draggable: BooleanConstructor;
  readonly blockNode: BooleanConstructor;
  readonly blockLine: BooleanConstructor;
  readonly showLine: BooleanConstructor;
  readonly disabled: BooleanConstructor;
  readonly checkedKeys: PropType<Key$1[]>;
  readonly defaultCheckedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly selectedKeys: PropType<Key$1[]>;
  readonly defaultSelectedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly multiple: BooleanConstructor;
  readonly pattern: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly onLoad: PropType<OnLoad>;
  readonly cascade: BooleanConstructor;
  readonly selectable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly allowDrop: {
    readonly type: PropType<AllowDrop>;
    readonly default: typeof defaultAllowDrop;
  };
  readonly animated: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly ellipsis: BooleanConstructor;
  readonly checkboxPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  readonly virtualScroll: BooleanConstructor;
  readonly watchProps: PropType<Array<"defaultCheckedKeys" | "defaultSelectedKeys" | "defaultExpandedKeys">>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly renderPrefix: PropType<RenderPrefix>;
  readonly renderSuffix: PropType<RenderSuffix>;
  readonly nodeProps: PropType<TreeNodeProps>;
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly getChildren: PropType<GetChildren>;
  readonly onDragenter: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDragleave: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDragend: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDragstart: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDragover: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDrop: PropType<MaybeArray<(e: TreeDropInfo) => void>>;
  readonly onUpdateCheckedKeys: PropType<MaybeArray<OnUpdateCheckedKeys>>;
  readonly 'onUpdate:checkedKeys': PropType<MaybeArray<OnUpdateCheckedKeys>>;
  readonly onUpdateSelectedKeys: PropType<MaybeArray<OnUpdateSelectedKeys>>;
  readonly 'onUpdate:selectedKeys': PropType<MaybeArray<OnUpdateSelectedKeys>>;
  readonly theme: PropType<TreeTheme>;
  readonly themeOverrides: PropType<TreeThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TreeThemeOverrides>;
};
type TreeProps = ExtractPublicPropTypes<typeof treeProps>;
interface TreeSlots {
  default?: () => VNode[];
  empty?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly internalTreeSelect: BooleanConstructor;
  readonly internalScrollable: BooleanConstructor;
  readonly internalScrollablePadding: StringConstructor;
  readonly internalRenderEmpty: PropType<() => VNodeChild>;
  readonly internalHighlightKeySet: PropType<Set<Key$1> | null>;
  readonly internalUnifySelectCheck: BooleanConstructor;
  readonly internalCheckboxFocusable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly internalFocusable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly checkStrategy: {
    readonly type: PropType<CheckStrategy>;
    readonly default: "all";
  };
  readonly spinProps: PropType<TreeSpinProps>;
  /**
   * @deprecated
   */
  readonly leafOnly: BooleanConstructor;
  readonly allowCheckingNotLoaded: BooleanConstructor;
  readonly filter: PropType<(pattern: string, node: TreeOption) => boolean>;
  readonly defaultExpandAll: BooleanConstructor;
  readonly expandedKeys: PropType<Key$1[]>;
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly defaultExpandedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly indent: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly indeterminateKeys: PropType<Key$1[]>;
  readonly renderSwitcherIcon: PropType<RenderSwitcherIcon>;
  readonly onUpdateIndeterminateKeys: PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly 'onUpdate:indeterminateKeys': PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly onUpdateExpandedKeys: PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly 'onUpdate:expandedKeys': PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly overrideDefaultNodeClickBehavior: PropType<TreeOverrideNodeClickBehavior>;
  readonly accordion: BooleanConstructor;
  readonly showIrrelevantNodes: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly data: {
    readonly type: PropType<TreeOptions>;
    readonly default: () => never[];
  };
  readonly expandOnDragenter: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly expandOnClick: BooleanConstructor;
  readonly checkOnClick: {
    readonly type: PropType<boolean | CheckOnClick>;
    readonly default: false;
  };
  readonly cancelable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly checkable: BooleanConstructor;
  readonly draggable: BooleanConstructor;
  readonly blockNode: BooleanConstructor;
  readonly blockLine: BooleanConstructor;
  readonly showLine: BooleanConstructor;
  readonly disabled: BooleanConstructor;
  readonly checkedKeys: PropType<Key$1[]>;
  readonly defaultCheckedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly selectedKeys: PropType<Key$1[]>;
  readonly defaultSelectedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly multiple: BooleanConstructor;
  readonly pattern: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly onLoad: PropType<OnLoad>;
  readonly cascade: BooleanConstructor;
  readonly selectable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly allowDrop: {
    readonly type: PropType<AllowDrop>;
    readonly default: typeof defaultAllowDrop;
  };
  readonly animated: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly ellipsis: BooleanConstructor;
  readonly checkboxPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  readonly virtualScroll: BooleanConstructor;
  readonly watchProps: PropType<Array<"defaultCheckedKeys" | "defaultSelectedKeys" | "defaultExpandedKeys">>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly renderPrefix: PropType<RenderPrefix>;
  readonly renderSuffix: PropType<RenderSuffix>;
  readonly nodeProps: PropType<TreeNodeProps>;
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly getChildren: PropType<GetChildren>;
  readonly onDragenter: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDragleave: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDragend: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDragstart: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDragover: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDrop: PropType<MaybeArray<(e: TreeDropInfo) => void>>;
  readonly onUpdateCheckedKeys: PropType<MaybeArray<OnUpdateCheckedKeys>>;
  readonly 'onUpdate:checkedKeys': PropType<MaybeArray<OnUpdateCheckedKeys>>;
  readonly onUpdateSelectedKeys: PropType<MaybeArray<OnUpdateSelectedKeys>>;
  readonly 'onUpdate:selectedKeys': PropType<MaybeArray<OnUpdateSelectedKeys>>;
  readonly theme: PropType<TreeTheme>;
  readonly themeOverrides: PropType<TreeThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TreeThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: TreeThemeVars;
    peers: {
      Checkbox: CheckboxTheme;
      Scrollbar: ScrollbarTheme;
      Empty: EmptyTheme;
    };
    peerOverrides: {
      Checkbox?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Empty?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  mergedRenderEmpty: import("vue").ComputedRef<(() => VNodeChild) | undefined>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  fNodes: import("vue").ComputedRef<({
    key: import("treemate").Key;
    rawNode: {
      [x: string]: unknown;
      key?: Key$1 | undefined;
      label?: string | undefined;
      checkboxDisabled?: boolean | undefined;
      disabled?: boolean | undefined;
      isLeaf?: boolean | undefined;
      children?: /*elided*/ any[] | undefined;
      prefix?: (() => VNodeChild) | undefined;
      suffix?: (() => VNodeChild) | undefined;
    };
    level: number;
    index: number;
    isFirstChild: boolean;
    isLastChild: boolean;
    parent: {
      key: import("treemate").Key;
      rawNode: {
        [x: string]: unknown;
        key?: Key$1 | undefined;
        label?: string | undefined;
        checkboxDisabled?: boolean | undefined;
        disabled?: boolean | undefined;
        isLeaf?: boolean | undefined;
        children?: /*elided*/ any[] | undefined;
        prefix?: (() => VNodeChild) | undefined;
        suffix?: (() => VNodeChild) | undefined;
      };
      level: number;
      index: number;
      isFirstChild: boolean;
      isLastChild: boolean;
      parent: /*elided*/ any | null;
      isLeaf: boolean;
      isGroup: boolean;
      ignored: boolean;
      shallowLoaded: boolean;
      disabled: boolean;
      siblings: /*elided*/ any[];
      children?: /*elided*/ any[] | undefined;
      getPrev: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      getNext: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      getParent: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      getChild: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      contains: (treeNode: import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null | undefined) => boolean;
    } | null;
    isLeaf: boolean;
    isGroup: boolean;
    ignored: boolean;
    shallowLoaded: boolean;
    disabled: boolean;
    siblings: {
      key: import("treemate").Key;
      rawNode: {
        [x: string]: unknown;
        key?: Key$1 | undefined;
        label?: string | undefined;
        checkboxDisabled?: boolean | undefined;
        disabled?: boolean | undefined;
        isLeaf?: boolean | undefined;
        children?: /*elided*/ any[] | undefined;
        prefix?: (() => VNodeChild) | undefined;
        suffix?: (() => VNodeChild) | undefined;
      };
      level: number;
      index: number;
      isFirstChild: boolean;
      isLastChild: boolean;
      parent: /*elided*/ any | null;
      isLeaf: boolean;
      isGroup: boolean;
      ignored: boolean;
      shallowLoaded: boolean;
      disabled: boolean;
      siblings: /*elided*/ any[];
      children?: /*elided*/ any[] | undefined;
      getPrev: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      getNext: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      getParent: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      getChild: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      contains: (treeNode: import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null | undefined) => boolean;
    }[];
    children?: {
      key: import("treemate").Key;
      rawNode: {
        [x: string]: unknown;
        key?: Key$1 | undefined;
        label?: string | undefined;
        checkboxDisabled?: boolean | undefined;
        disabled?: boolean | undefined;
        isLeaf?: boolean | undefined;
        children?: /*elided*/ any[] | undefined;
        prefix?: (() => VNodeChild) | undefined;
        suffix?: (() => VNodeChild) | undefined;
      };
      level: number;
      index: number;
      isFirstChild: boolean;
      isLastChild: boolean;
      parent: /*elided*/ any | null;
      isLeaf: boolean;
      isGroup: boolean;
      ignored: boolean;
      shallowLoaded: boolean;
      disabled: boolean;
      siblings: /*elided*/ any[];
      children?: /*elided*/ any[] | undefined;
      getPrev: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      getNext: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      getParent: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      getChild: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      contains: (treeNode: import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null | undefined) => boolean;
    }[] | undefined;
    getPrev: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
    getNext: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
    getParent: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
    getChild: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
    contains: (treeNode: import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null | undefined) => boolean;
  } | {
    __motion: true;
    height: number | undefined;
    mode: "expand" | "collapse";
    nodes: {
      key: import("treemate").Key;
      rawNode: {
        [x: string]: unknown;
        key?: Key$1 | undefined;
        label?: string | undefined;
        checkboxDisabled?: boolean | undefined;
        disabled?: boolean | undefined;
        isLeaf?: boolean | undefined;
        children?: /*elided*/ any[] | undefined;
        prefix?: (() => VNodeChild) | undefined;
        suffix?: (() => VNodeChild) | undefined;
      };
      level: number;
      index: number;
      isFirstChild: boolean;
      isLastChild: boolean;
      parent: {
        key: import("treemate").Key;
        rawNode: {
          [x: string]: unknown;
          key?: Key$1 | undefined;
          label?: string | undefined;
          checkboxDisabled?: boolean | undefined;
          disabled?: boolean | undefined;
          isLeaf?: boolean | undefined;
          children?: /*elided*/ any[] | undefined;
          prefix?: (() => VNodeChild) | undefined;
          suffix?: (() => VNodeChild) | undefined;
        };
        level: number;
        index: number;
        isFirstChild: boolean;
        isLastChild: boolean;
        parent: /*elided*/ any | null;
        isLeaf: boolean;
        isGroup: boolean;
        ignored: boolean;
        shallowLoaded: boolean;
        disabled: boolean;
        siblings: /*elided*/ any[];
        children?: /*elided*/ any[] | undefined;
        getPrev: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
        getNext: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
        getParent: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
        getChild: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
        contains: (treeNode: import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null | undefined) => boolean;
      } | null;
      isLeaf: boolean;
      isGroup: boolean;
      ignored: boolean;
      shallowLoaded: boolean;
      disabled: boolean;
      siblings: {
        key: import("treemate").Key;
        rawNode: {
          [x: string]: unknown;
          key?: Key$1 | undefined;
          label?: string | undefined;
          checkboxDisabled?: boolean | undefined;
          disabled?: boolean | undefined;
          isLeaf?: boolean | undefined;
          children?: /*elided*/ any[] | undefined;
          prefix?: (() => VNodeChild) | undefined;
          suffix?: (() => VNodeChild) | undefined;
        };
        level: number;
        index: number;
        isFirstChild: boolean;
        isLastChild: boolean;
        parent: /*elided*/ any | null;
        isLeaf: boolean;
        isGroup: boolean;
        ignored: boolean;
        shallowLoaded: boolean;
        disabled: boolean;
        siblings: /*elided*/ any[];
        children?: /*elided*/ any[] | undefined;
        getPrev: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
        getNext: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
        getParent: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
        getChild: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
        contains: (treeNode: import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null | undefined) => boolean;
      }[];
      children?: {
        key: import("treemate").Key;
        rawNode: {
          [x: string]: unknown;
          key?: Key$1 | undefined;
          label?: string | undefined;
          checkboxDisabled?: boolean | undefined;
          disabled?: boolean | undefined;
          isLeaf?: boolean | undefined;
          children?: /*elided*/ any[] | undefined;
          prefix?: (() => VNodeChild) | undefined;
          suffix?: (() => VNodeChild) | undefined;
        };
        level: number;
        index: number;
        isFirstChild: boolean;
        isLastChild: boolean;
        parent: /*elided*/ any | null;
        isLeaf: boolean;
        isGroup: boolean;
        ignored: boolean;
        shallowLoaded: boolean;
        disabled: boolean;
        siblings: /*elided*/ any[];
        children?: /*elided*/ any[] | undefined;
        getPrev: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
        getNext: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
        getParent: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
        getChild: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
        contains: (treeNode: import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null | undefined) => boolean;
      }[] | undefined;
      getPrev: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      getNext: (options?: import("treemate/lib/interface").GetPrevNextOptions) => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      getParent: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      getChild: () => import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null;
      contains: (treeNode: import("treemate").TreeNode<TreeOption, TreeOption, TreeOption> | null | undefined) => boolean;
    }[];
  })[]>;
  aip: Ref<boolean, boolean>;
  selfElRef: Ref<HTMLDivElement | null, HTMLDivElement | null>;
  virtualListInstRef: unknown;
  scrollbarInstRef: unknown;
  handleFocusout: (e: FocusEvent) => void;
  handleDragLeaveTree: (e: DragEvent) => void;
  handleScroll: () => void;
  getScrollContainer: () => HTMLElement | null | undefined;
  getScrollContent: () => HTMLElement | null | undefined;
  handleAfterEnter: () => void;
  handleResize: () => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  handleKeydown: (e: KeyboardEvent) => {
    enterBehavior: TreeOverrideNodeClickBehaviorReturn | null;
  };
  scrollTo: import("vueuc").VVirtualListScrollTo;
  getCheckedData: () => {
    keys: Key$1[];
    options: Array<TreeOption | null>;
  };
  getIndeterminateData: () => {
    keys: Key$1[];
    options: Array<TreeOption | null>;
  };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly internalTreeSelect: BooleanConstructor;
  readonly internalScrollable: BooleanConstructor;
  readonly internalScrollablePadding: StringConstructor;
  readonly internalRenderEmpty: PropType<() => VNodeChild>;
  readonly internalHighlightKeySet: PropType<Set<Key$1> | null>;
  readonly internalUnifySelectCheck: BooleanConstructor;
  readonly internalCheckboxFocusable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly internalFocusable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly checkStrategy: {
    readonly type: PropType<CheckStrategy>;
    readonly default: "all";
  };
  readonly spinProps: PropType<TreeSpinProps>;
  /**
   * @deprecated
   */
  readonly leafOnly: BooleanConstructor;
  readonly allowCheckingNotLoaded: BooleanConstructor;
  readonly filter: PropType<(pattern: string, node: TreeOption) => boolean>;
  readonly defaultExpandAll: BooleanConstructor;
  readonly expandedKeys: PropType<Key$1[]>;
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly defaultExpandedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly indent: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly indeterminateKeys: PropType<Key$1[]>;
  readonly renderSwitcherIcon: PropType<RenderSwitcherIcon>;
  readonly onUpdateIndeterminateKeys: PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly 'onUpdate:indeterminateKeys': PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly onUpdateExpandedKeys: PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly 'onUpdate:expandedKeys': PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly overrideDefaultNodeClickBehavior: PropType<TreeOverrideNodeClickBehavior>;
  readonly accordion: BooleanConstructor;
  readonly showIrrelevantNodes: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly data: {
    readonly type: PropType<TreeOptions>;
    readonly default: () => never[];
  };
  readonly expandOnDragenter: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly expandOnClick: BooleanConstructor;
  readonly checkOnClick: {
    readonly type: PropType<boolean | CheckOnClick>;
    readonly default: false;
  };
  readonly cancelable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly checkable: BooleanConstructor;
  readonly draggable: BooleanConstructor;
  readonly blockNode: BooleanConstructor;
  readonly blockLine: BooleanConstructor;
  readonly showLine: BooleanConstructor;
  readonly disabled: BooleanConstructor;
  readonly checkedKeys: PropType<Key$1[]>;
  readonly defaultCheckedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly selectedKeys: PropType<Key$1[]>;
  readonly defaultSelectedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly multiple: BooleanConstructor;
  readonly pattern: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly onLoad: PropType<OnLoad>;
  readonly cascade: BooleanConstructor;
  readonly selectable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly allowDrop: {
    readonly type: PropType<AllowDrop>;
    readonly default: typeof defaultAllowDrop;
  };
  readonly animated: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly ellipsis: BooleanConstructor;
  readonly checkboxPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  readonly virtualScroll: BooleanConstructor;
  readonly watchProps: PropType<Array<"defaultCheckedKeys" | "defaultSelectedKeys" | "defaultExpandedKeys">>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly renderPrefix: PropType<RenderPrefix>;
  readonly renderSuffix: PropType<RenderSuffix>;
  readonly nodeProps: PropType<TreeNodeProps>;
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly getChildren: PropType<GetChildren>;
  readonly onDragenter: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDragleave: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDragend: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDragstart: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDragover: PropType<MaybeArray<(e: TreeDragInfo) => void>>;
  readonly onDrop: PropType<MaybeArray<(e: TreeDropInfo) => void>>;
  readonly onUpdateCheckedKeys: PropType<MaybeArray<OnUpdateCheckedKeys>>;
  readonly 'onUpdate:checkedKeys': PropType<MaybeArray<OnUpdateCheckedKeys>>;
  readonly onUpdateSelectedKeys: PropType<MaybeArray<OnUpdateSelectedKeys>>;
  readonly 'onUpdate:selectedKeys': PropType<MaybeArray<OnUpdateSelectedKeys>>;
  readonly theme: PropType<TreeTheme>;
  readonly themeOverrides: PropType<TreeThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TreeThemeOverrides>;
}>> & Readonly<{}>, {
  readonly data: TreeOptions;
  readonly internalScrollable: boolean;
  readonly disabled: boolean;
  readonly keyboard: boolean;
  readonly draggable: boolean;
  readonly animated: boolean;
  readonly allowCheckingNotLoaded: boolean;
  readonly multiple: boolean;
  readonly disabledField: string;
  readonly cascade: boolean;
  readonly leafOnly: boolean;
  readonly virtualScroll: boolean;
  readonly checkStrategy: CheckStrategy;
  readonly labelField: string;
  readonly childrenField: string;
  readonly pattern: string;
  readonly accordion: boolean;
  readonly ellipsis: boolean;
  readonly defaultExpandAll: boolean;
  readonly indent: number;
  readonly keyField: string;
  readonly defaultExpandedKeys: Key$1[];
  readonly cancelable: boolean;
  readonly checkable: boolean;
  readonly defaultCheckedKeys: Key$1[];
  readonly defaultSelectedKeys: Key$1[];
  readonly showLine: boolean;
  readonly selectable: boolean;
  readonly internalTreeSelect: boolean;
  readonly internalUnifySelectCheck: boolean;
  readonly internalCheckboxFocusable: boolean;
  readonly internalFocusable: boolean;
  readonly showIrrelevantNodes: boolean;
  readonly expandOnDragenter: boolean;
  readonly expandOnClick: boolean;
  readonly checkOnClick: boolean | CheckOnClick;
  readonly blockNode: boolean;
  readonly blockLine: boolean;
  readonly allowDrop: AllowDrop;
  readonly checkboxPlacement: "left" | "right";
}, SlotsType<TreeSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { OnUpdateCheckedKeys, OnUpdateCheckedKeysImpl, OnUpdateExpandedKeysImpl, OnUpdateIndeterminateKeys, OnUpdateIndeterminateKeysImpl, OnUpdateSelectedKeys, OnUpdateSelectedKeysImpl, TreeProps, TreeSlots, createTreeMateOptions, _default as default, onUpdateExpandedKeys, treeProps, treeSharedProps };