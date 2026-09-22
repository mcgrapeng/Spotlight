import { ThemeCommonVars } from "../../../_styles/common/light.js";
import { EmptyTheme } from "../../../empty/styles/light.js";
import "../../../empty/styles/index.js";
import { InternalSelectMenuTheme, InternalSelectMenuThemeOverrides, InternalSelectMenuThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { ScrollbarProps } from "../../scrollbar/src/Scrollbar.js";
import { SelectBaseOption, SelectGroupOption, SelectIgnoredOption, SelectOption, SelectTreeMate, Value } from "../../../select/src/interface.js";
import { NodeProps, RenderLabel, RenderOption, Size } from "./interface.js";
import "../../../index.js";
import { ScrollbarTheme } from "../../scrollbar/styles/light.js";
import "../../scrollbar/styles/index.js";
import { RtlItem } from "../../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref } from "vue";
import { TreeNode } from "treemate";
//#region src/_internal/select-menu/src/SelectMenu.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  scrollable: {
    type: BooleanConstructor;
    default: boolean;
  };
  treeMate: {
    type: PropType<SelectTreeMate>;
    required: true;
  };
  multiple: BooleanConstructor;
  size: {
    type: PropType<Size>;
    default: string;
  };
  value: {
    type: PropType<Value | null>;
    default: null;
  };
  autoPending: BooleanConstructor;
  virtualScroll: {
    type: BooleanConstructor;
    default: boolean;
  };
  show: {
    type: BooleanConstructor;
    default: boolean;
  };
  labelField: {
    type: StringConstructor;
    default: string;
  };
  valueField: {
    type: StringConstructor;
    default: string;
  };
  loading: BooleanConstructor;
  focusable: BooleanConstructor;
  renderLabel: PropType<RenderLabel>;
  renderOption: PropType<RenderOption>;
  nodeProps: PropType<NodeProps>;
  showCheckmark: {
    type: BooleanConstructor;
    default: boolean;
  };
  onMousedown: PropType<(e: MouseEvent) => void>;
  onScroll: PropType<(e: Event) => void>;
  onFocus: PropType<(e: FocusEvent) => void>;
  onBlur: PropType<(e: FocusEvent) => void>;
  onKeyup: PropType<(e: KeyboardEvent) => void>;
  onKeydown: PropType<(e: KeyboardEvent) => void>;
  onTabOut: PropType<() => void>;
  onMouseenter: PropType<(e: MouseEvent) => void>;
  onMouseleave: PropType<(e: MouseEvent) => void>;
  onResize: PropType<() => void>;
  resetMenuOnOptionsChange: {
    type: BooleanConstructor;
    default: boolean;
  };
  inlineThemeDisabled: BooleanConstructor;
  scrollbarProps: PropType<ScrollbarProps>;
  onToggle: PropType<(tmNode: TreeNode<SelectOption>) => void>;
  theme: PropType<InternalSelectMenuTheme>;
  themeOverrides: PropType<InternalSelectMenuThemeOverrides>;
  builtinThemeOverrides: PropType<InternalSelectMenuThemeOverrides>;
}>, {
  selfRef: Ref<HTMLElement | null>;
  getPendingTmNode: () => TreeNode<SelectBaseOption> | null;
  prev: () => void;
  next: () => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: InternalSelectMenuThemeVars;
    peers: {
      Scrollbar: ScrollbarTheme;
      Empty: EmptyTheme;
    };
    peerOverrides: {
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
  mergedClsPrefix: Ref<string, string>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  virtualListRef: unknown;
  scrollbarRef: unknown;
  itemSize: import("vue").ComputedRef<number>;
  padding: import("vue").ComputedRef<import("seemly").Margin>;
  flattenedNodes: import("vue").ComputedRef<TreeNode<SelectBaseOption<string | number, string | ((option: SelectBaseOption<string | number, string | /*elided*/ any>, selected: boolean) => import("vue").VNodeChild)>, SelectGroupOption, SelectIgnoredOption>[]>;
  empty: import("vue").ComputedRef<boolean>;
  mergedRenderEmpty: import("vue").ComputedRef<(() => import("vue").VNodeChild) | undefined>;
  virtualListContainer(): HTMLElement | undefined;
  virtualListContent(): HTMLElement | null | undefined;
  doScroll: (e: Event) => void;
  handleFocusin: (e: FocusEvent) => void;
  handleFocusout: (e: FocusEvent) => void;
  handleKeyUp: (e: KeyboardEvent) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleMouseDown: (e: MouseEvent) => void;
  handleVirtualListResize: () => void;
  handleVirtualListScroll: (e: Event) => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  scrollable: {
    type: BooleanConstructor;
    default: boolean;
  };
  treeMate: {
    type: PropType<SelectTreeMate>;
    required: true;
  };
  multiple: BooleanConstructor;
  size: {
    type: PropType<Size>;
    default: string;
  };
  value: {
    type: PropType<Value | null>;
    default: null;
  };
  autoPending: BooleanConstructor;
  virtualScroll: {
    type: BooleanConstructor;
    default: boolean;
  };
  show: {
    type: BooleanConstructor;
    default: boolean;
  };
  labelField: {
    type: StringConstructor;
    default: string;
  };
  valueField: {
    type: StringConstructor;
    default: string;
  };
  loading: BooleanConstructor;
  focusable: BooleanConstructor;
  renderLabel: PropType<RenderLabel>;
  renderOption: PropType<RenderOption>;
  nodeProps: PropType<NodeProps>;
  showCheckmark: {
    type: BooleanConstructor;
    default: boolean;
  };
  onMousedown: PropType<(e: MouseEvent) => void>;
  onScroll: PropType<(e: Event) => void>;
  onFocus: PropType<(e: FocusEvent) => void>;
  onBlur: PropType<(e: FocusEvent) => void>;
  onKeyup: PropType<(e: KeyboardEvent) => void>;
  onKeydown: PropType<(e: KeyboardEvent) => void>;
  onTabOut: PropType<() => void>;
  onMouseenter: PropType<(e: MouseEvent) => void>;
  onMouseleave: PropType<(e: MouseEvent) => void>;
  onResize: PropType<() => void>;
  resetMenuOnOptionsChange: {
    type: BooleanConstructor;
    default: boolean;
  };
  inlineThemeDisabled: BooleanConstructor;
  scrollbarProps: PropType<ScrollbarProps>;
  onToggle: PropType<(tmNode: TreeNode<SelectOption>) => void>;
  theme: PropType<InternalSelectMenuTheme>;
  themeOverrides: PropType<InternalSelectMenuThemeOverrides>;
  builtinThemeOverrides: PropType<InternalSelectMenuThemeOverrides>;
}>> & Readonly<{}>, {
  loading: boolean;
  inlineThemeDisabled: boolean;
  value: Value | null;
  show: boolean;
  size: Size;
  focusable: boolean;
  scrollable: boolean;
  multiple: boolean;
  virtualScroll: boolean;
  valueField: string;
  labelField: string;
  resetMenuOnOptionsChange: boolean;
  showCheckmark: boolean;
  autoPending: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export = _default;