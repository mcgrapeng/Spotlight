import { ThemeCommonVars } from "../../_styles/common/light.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import { OnUpdateValue, SelectBaseOption, SelectGroupOption, SelectIgnoredOption, SelectMixedOption, Value } from "../../select/src/interface.js";
import { NodeProps, RenderLabel } from "../../_internal/select-menu/src/interface.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import "../../_internal/index.js";
import { PopselectThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { PopselectSize } from "./public-types.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
import { TreeNode } from "treemate";
//#region src/popselect/src/PopselectPanel.d.ts
declare const panelProps: {
  readonly multiple: BooleanConstructor;
  readonly value: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  readonly cancelable: BooleanConstructor;
  readonly options: {
    readonly type: PropType<SelectMixedOption[]>;
    readonly default: () => never[];
  };
  readonly size: PropType<PopselectSize>;
  readonly scrollable: BooleanConstructor;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onMouseenter: PropType<(e: MouseEvent) => void>;
  readonly onMouseleave: PropType<(e: MouseEvent) => void>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly showCheckmark: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly nodeProps: PropType<NodeProps>;
  readonly virtualScroll: BooleanConstructor;
  readonly onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
};
declare const panelPropKeys: ("onChange" | "onMouseenter" | "onMouseleave" | "scrollable" | "value" | "renderLabel" | "size" | "options" | "onUpdate:value" | "onUpdateValue" | "multiple" | "virtualScroll" | "nodeProps" | "showCheckmark" | "cancelable")[];
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly multiple: BooleanConstructor;
  readonly value: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  readonly cancelable: BooleanConstructor;
  readonly options: {
    readonly type: PropType<SelectMixedOption[]>;
    readonly default: () => never[];
  };
  readonly size: PropType<PopselectSize>;
  readonly scrollable: BooleanConstructor;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onMouseenter: PropType<(e: MouseEvent) => void>;
  readonly onMouseleave: PropType<(e: MouseEvent) => void>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly showCheckmark: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly nodeProps: PropType<NodeProps>;
  readonly virtualScroll: BooleanConstructor;
  readonly onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
}>, {
  mergedTheme: Ref<{
    common: ThemeCommonVars;
    self: PopselectThemeVars;
    peers: {
      Popover: PopoverTheme;
      InternalSelectMenu: InternalSelectMenuTheme;
    };
    peerOverrides: {
      Popover?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
      InternalSelectMenu?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Empty?: ExtractThemeOverrides<EmptyTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }, {
    common: ThemeCommonVars;
    self: PopselectThemeVars;
    peers: {
      Popover: PopoverTheme;
      InternalSelectMenu: InternalSelectMenuTheme;
    };
    peerOverrides: {
      Popover?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
      InternalSelectMenu?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Empty?: ExtractThemeOverrides<EmptyTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  mergedClsPrefix: Ref<string, string>;
  treeMate: import("vue").ComputedRef<import("treemate").TreeMate<SelectBaseOption<string | number, string | ((option: SelectBaseOption<string | number, string | /*elided*/ any>, selected: boolean) => import("vue").VNodeChild)>, SelectGroupOption, SelectIgnoredOption>>;
  handleToggle: (tmNode: TreeNode<SelectBaseOption>) => void;
  handleMenuMousedown: (e: MouseEvent) => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  mergedSize: import("vue").ComputedRef<PopselectSize>;
  scrollbarProps: ScrollbarProps | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly multiple: BooleanConstructor;
  readonly value: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  readonly cancelable: BooleanConstructor;
  readonly options: {
    readonly type: PropType<SelectMixedOption[]>;
    readonly default: () => never[];
  };
  readonly size: PropType<PopselectSize>;
  readonly scrollable: BooleanConstructor;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onMouseenter: PropType<(e: MouseEvent) => void>;
  readonly onMouseleave: PropType<(e: MouseEvent) => void>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly showCheckmark: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly nodeProps: PropType<NodeProps>;
  readonly virtualScroll: BooleanConstructor;
  readonly onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
}>> & Readonly<{}>, {
  readonly scrollable: boolean;
  readonly value: Value | null;
  readonly options: SelectMixedOption[];
  readonly multiple: boolean;
  readonly virtualScroll: boolean;
  readonly showCheckmark: boolean;
  readonly cancelable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default, panelPropKeys, panelProps };