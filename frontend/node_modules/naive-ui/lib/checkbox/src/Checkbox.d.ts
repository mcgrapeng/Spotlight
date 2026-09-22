import { UseFormItem } from "../../_mixins/use-form-item.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { CheckboxTheme, CheckboxThemeOverrides, CheckboxThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { CheckboxInst, OnUpdateChecked } from "./interface.js";
import { CheckboxSize } from "./public-types.js";
import "../../index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/checkbox/src/Checkbox.d.ts
declare const checkboxProps: {
  size: PropType<CheckboxSize>;
  checked: {
    type: PropType<boolean | string | number | undefined>;
    default: undefined;
  };
  defaultChecked: {
    type: PropType<boolean | string | number>;
    default: boolean;
  };
  value: PropType<string | number>;
  disabled: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  indeterminate: BooleanConstructor;
  label: StringConstructor;
  focusable: {
    type: BooleanConstructor;
    default: boolean;
  };
  checkedValue: {
    type: (BooleanConstructor | StringConstructor | NumberConstructor)[];
    default: boolean;
  };
  uncheckedValue: {
    type: (BooleanConstructor | StringConstructor | NumberConstructor)[];
    default: boolean;
  };
  'onUpdate:checked': PropType<MaybeArray<OnUpdateChecked>>;
  onUpdateChecked: PropType<MaybeArray<OnUpdateChecked>>;
  privateInsideTable: BooleanConstructor;
  onChange: PropType<MaybeArray<OnUpdateChecked>>;
  theme: PropType<CheckboxTheme>;
  themeOverrides: PropType<CheckboxThemeOverrides>;
  builtinThemeOverrides: PropType<CheckboxThemeOverrides>;
};
type CheckboxProps = ExtractPublicPropTypes<typeof checkboxProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  size: PropType<CheckboxSize>;
  checked: {
    type: PropType<boolean | string | number | undefined>;
    default: undefined;
  };
  defaultChecked: {
    type: PropType<boolean | string | number>;
    default: boolean;
  };
  value: PropType<string | number>;
  disabled: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  indeterminate: BooleanConstructor;
  label: StringConstructor;
  focusable: {
    type: BooleanConstructor;
    default: boolean;
  };
  checkedValue: {
    type: (BooleanConstructor | StringConstructor | NumberConstructor)[];
    default: boolean;
  };
  uncheckedValue: {
    type: (BooleanConstructor | StringConstructor | NumberConstructor)[];
    default: boolean;
  };
  'onUpdate:checked': PropType<MaybeArray<OnUpdateChecked>>;
  onUpdateChecked: PropType<MaybeArray<OnUpdateChecked>>;
  privateInsideTable: BooleanConstructor;
  onChange: PropType<MaybeArray<OnUpdateChecked>>;
  theme: PropType<CheckboxTheme>;
  themeOverrides: PropType<CheckboxThemeOverrides>;
  builtinThemeOverrides: PropType<CheckboxThemeOverrides>;
}>, UseFormItem<"small" | "medium" | "large"> & CheckboxInst & {
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  selfRef: Ref<HTMLDivElement | null, HTMLDivElement | null>;
  mergedClsPrefix: Ref<string, string>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  renderedChecked: import("vue").ComputedRef<boolean>;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: CheckboxThemeVars;
    peers: any;
    peerOverrides: {
      [x: string]: any;
    };
  }>;
  labelId: string;
  handleClick: (e: MouseEvent) => void;
  handleKeyUp: (e: KeyboardEvent) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  size: PropType<CheckboxSize>;
  checked: {
    type: PropType<boolean | string | number | undefined>;
    default: undefined;
  };
  defaultChecked: {
    type: PropType<boolean | string | number>;
    default: boolean;
  };
  value: PropType<string | number>;
  disabled: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  indeterminate: BooleanConstructor;
  label: StringConstructor;
  focusable: {
    type: BooleanConstructor;
    default: boolean;
  };
  checkedValue: {
    type: (BooleanConstructor | StringConstructor | NumberConstructor)[];
    default: boolean;
  };
  uncheckedValue: {
    type: (BooleanConstructor | StringConstructor | NumberConstructor)[];
    default: boolean;
  };
  'onUpdate:checked': PropType<MaybeArray<OnUpdateChecked>>;
  onUpdateChecked: PropType<MaybeArray<OnUpdateChecked>>;
  privateInsideTable: BooleanConstructor;
  onChange: PropType<MaybeArray<OnUpdateChecked>>;
  theme: PropType<CheckboxTheme>;
  themeOverrides: PropType<CheckboxThemeOverrides>;
  builtinThemeOverrides: PropType<CheckboxThemeOverrides>;
}>> & Readonly<{}>, {
  disabled: boolean | undefined;
  focusable: boolean;
  checked: string | number | boolean | undefined;
  indeterminate: boolean;
  defaultChecked: string | number | boolean;
  checkedValue: string | number | boolean;
  uncheckedValue: string | number | boolean;
  privateInsideTable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { CheckboxProps, checkboxProps, _default as default };