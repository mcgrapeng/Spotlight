import { ThemeCommonVars } from "../../_styles/common/light.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { SharedSpinProps } from "../../_internal/loading/src/Loading.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { InternalSelectionTheme } from "../../_internal/selection/styles/light.js";
import "../../_internal/selection/styles/index.js";
import "../../_internal/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { CascaderThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { CascaderOption, TmNode } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType, VNode } from "vue";
//#region src/cascader/src/CascaderOption.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  tmNode: {
    type: PropType<TmNode>;
    required: true;
  };
}>, {
  checkStrategy: import("vue").Ref<import("treemate").CheckStrategy, import("treemate").CheckStrategy>;
  multiple: import("vue").Ref<boolean, boolean>;
  cascade: import("vue").Ref<boolean, boolean>;
  checked: import("vue").ComputedRef<boolean>;
  indeterminate: import("vue").ComputedRef<boolean>;
  hoverPending: import("vue").ComputedRef<boolean>;
  keyboardPending: import("vue").ComputedRef<boolean>;
  isLoading: import("vue").ComputedRef<boolean>;
  showCheckbox: import("vue").Ref<boolean, boolean>;
  isLeaf: import("vue").ComputedRef<boolean>;
  disabled: import("vue").ComputedRef<boolean>;
  label: import("vue").ComputedRef<any>;
  mergedClsPrefix: import("vue").Ref<string, string>;
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
  spinProps: import("vue").Ref<SharedSpinProps | undefined, SharedSpinProps | undefined>;
  handleClick: (e: MouseEvent) => void;
  handleCheckboxUpdateValue: () => void;
  mergedHandleMouseEnter: import("vue").ComputedRef<(() => void) | undefined>;
  mergedHandleMouseMove: import("vue").ComputedRef<(() => void) | undefined>;
  renderLabel: import("vue").Ref<((option: CascaderOption, checked: boolean) => import("vue").VNodeChild) | undefined, ((option: CascaderOption, checked: boolean) => import("vue").VNodeChild) | undefined>;
  renderPrefix: import("vue").Ref<((info: {
    option: CascaderOption;
    checked: boolean;
    node: VNode | null;
  }) => import("vue").VNodeChild) | undefined, ((info: {
    option: CascaderOption;
    checked: boolean;
    node: VNode | null;
  }) => import("vue").VNodeChild) | undefined>;
  renderSuffix: import("vue").Ref<((info: {
    option: CascaderOption;
    checked: boolean;
    node: VNode | null;
  }) => import("vue").VNodeChild) | undefined, ((info: {
    option: CascaderOption;
    checked: boolean;
    node: VNode | null;
  }) => import("vue").VNodeChild) | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  tmNode: {
    type: PropType<TmNode>;
    required: true;
  };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };