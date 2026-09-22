import { ThemeCommonVars } from "../../_styles/common/light.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { TreeThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType } from "vue";
//#region src/tree/src/TreeNodeCheckbox.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  indent: {
    type: NumberConstructor;
    required: true;
  };
  right: BooleanConstructor;
  focusable: BooleanConstructor;
  disabled: BooleanConstructor;
  checked: BooleanConstructor;
  indeterminate: BooleanConstructor;
  onCheck: PropType<(value: boolean) => void>;
}>, {
  handleUpdateValue: (value: boolean) => void;
  mergedTheme: import("vue").Ref<{
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
  }, {
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
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  indent: {
    type: NumberConstructor;
    required: true;
  };
  right: BooleanConstructor;
  focusable: BooleanConstructor;
  disabled: BooleanConstructor;
  checked: BooleanConstructor;
  indeterminate: BooleanConstructor;
  onCheck: PropType<(value: boolean) => void>;
}>> & Readonly<{}>, {
  right: boolean;
  disabled: boolean;
  focusable: boolean;
  checked: boolean;
  indeterminate: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export = _default;