import { ThemeCommonVars } from "../../_styles/common/light.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import { SelectBaseOption, SelectGroupOption, SelectIgnoredOption } from "../../select/src/interface.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { InternalSelectionTheme } from "../../_internal/selection/styles/light.js";
import "../../_internal/selection/styles/index.js";
import "../../_internal/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { CascaderThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { Filter, TmNode, Value } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType } from "vue";
import { TreeNode } from "treemate";
//#region src/cascader/src/CascaderSelectMenu.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  value: {
    type: PropType<Value | null>;
    default: null;
  };
  show: BooleanConstructor;
  pattern: {
    type: StringConstructor;
    default: string;
  };
  multiple: BooleanConstructor;
  tmNodes: {
    type: PropType<TmNode[]>;
    default: () => never[];
  };
  filter: PropType<Filter>;
  labelField: {
    type: StringConstructor;
    required: true;
  };
  separator: {
    type: StringConstructor;
    required: true;
  };
}>, {
  prev: () => void;
  next: () => void;
  enter: () => boolean;
  isMounted: import("vue").Ref<boolean, boolean>;
  mergedTheme: import("vue").Ref<{
    common: ThemeCommonVars;
    self: CascaderThemeVars;
    peers: {
      InternalSelectMenu: InternalSelectMenuTheme;
      InternalSelection: InternalSelectionTheme;
      Scrollbar: ScrollbarTheme;
      Checkbox: CheckboxTheme;
      Empty: EmptyTheme;
    };
    peerOverrides: {
      InternalSelectMenu?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Empty?: ExtractThemeOverrides<EmptyTheme> | undefined;
        } | undefined;
      } | undefined;
      InternalSelection?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Checkbox?: {
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
  }, {
    common: ThemeCommonVars;
    self: CascaderThemeVars;
    peers: {
      InternalSelectMenu: InternalSelectMenuTheme;
      InternalSelection: InternalSelectionTheme;
      Scrollbar: ScrollbarTheme;
      Checkbox: CheckboxTheme;
      Empty: EmptyTheme;
    };
    peerOverrides: {
      InternalSelectMenu?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Empty?: ExtractThemeOverrides<EmptyTheme> | undefined;
        } | undefined;
      } | undefined;
      InternalSelection?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Checkbox?: {
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
  mergedClsPrefix: import("vue").Ref<string, string>;
  menuInstRef: unknown;
  selectTreeMate: import("vue").ComputedRef<import("treemate").TreeMate<SelectBaseOption<string | number, string | ((option: SelectBaseOption<string | number, string | /*elided*/ any>, selected: boolean) => import("vue").VNodeChild)>, SelectGroupOption, SelectIgnoredOption>>;
  handleResize: () => void;
  handleToggle: (tmNode: TreeNode<SelectBaseOption>) => void;
  handleClickOutside: (e: MouseEvent) => void;
  cascaderSlots: Readonly<{
    [name: string]: import("vue").Slot<any> | undefined;
  }>;
  scrollbarProps: import("vue").Ref<ScrollbarProps | undefined, ScrollbarProps | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  value: {
    type: PropType<Value | null>;
    default: null;
  };
  show: BooleanConstructor;
  pattern: {
    type: StringConstructor;
    default: string;
  };
  multiple: BooleanConstructor;
  tmNodes: {
    type: PropType<TmNode[]>;
    default: () => never[];
  };
  filter: PropType<Filter>;
  labelField: {
    type: StringConstructor;
    required: true;
  };
  separator: {
    type: StringConstructor;
    required: true;
  };
}>> & Readonly<{}>, {
  value: Value | null;
  show: boolean;
  multiple: boolean;
  pattern: string;
  tmNodes: TmNode[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };