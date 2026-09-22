import { FormItemInjection } from "../../_mixins/use-form-item.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ButtonSize } from "../../button/src/public-types.js";
import { ButtonProps } from "../../button/src/Button.js";
import "../../button/index.js";
import { DynamicInputTheme, DynamicInputThemeOverrides, DynamicInputThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { DynamicInputActionSlotProps, DynamicInputDefaultSlotProps, OnUpdateValue } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, VNode } from "vue";
//#region src/dynamic-input/src/DynamicInput.d.ts
declare const dynamicInputProps: {
  readonly max: NumberConstructor;
  readonly min: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly value: PropType<any[]>;
  readonly defaultValue: {
    readonly type: PropType<any[]>;
    readonly default: () => never[];
  };
  readonly preset: {
    readonly type: PropType<"input" | "pair">;
    readonly default: "input";
  };
  readonly keyField: StringConstructor;
  readonly itemClass: StringConstructor;
  readonly itemStyle: PropType<string | CSSProperties>;
  readonly keyPlaceholder: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly valuePlaceholder: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly placeholder: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly disabled: BooleanConstructor;
  readonly showSortButton: BooleanConstructor;
  readonly createButtonProps: PropType<ButtonProps>;
  readonly onCreate: PropType<(index: number) => any>;
  readonly onRemove: PropType<(index: number) => void>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onClear: PropType<() => void>;
  readonly onInput: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<DynamicInputTheme>;
  readonly themeOverrides: PropType<DynamicInputThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DynamicInputThemeOverrides>;
};
type DynamicInputProps = ExtractPublicPropTypes<typeof dynamicInputProps>;
interface DynamicInputSlots {
  action?: (props: DynamicInputActionSlotProps) => VNode[];
  default?: (props: DynamicInputDefaultSlotProps) => VNode[];
  'create-button-default'?: () => VNode[];
  'create-button-icon'?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly max: NumberConstructor;
  readonly min: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly value: PropType<any[]>;
  readonly defaultValue: {
    readonly type: PropType<any[]>;
    readonly default: () => never[];
  };
  readonly preset: {
    readonly type: PropType<"input" | "pair">;
    readonly default: "input";
  };
  readonly keyField: StringConstructor;
  readonly itemClass: StringConstructor;
  readonly itemStyle: PropType<string | CSSProperties>;
  readonly keyPlaceholder: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly valuePlaceholder: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly placeholder: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly disabled: BooleanConstructor;
  readonly showSortButton: BooleanConstructor;
  readonly createButtonProps: PropType<ButtonProps>;
  readonly onCreate: PropType<(index: number) => any>;
  readonly onRemove: PropType<(index: number) => void>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onClear: PropType<() => void>;
  readonly onInput: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<DynamicInputTheme>;
  readonly themeOverrides: PropType<DynamicInputThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DynamicInputThemeOverrides>;
}>, {
  locale: Ref<{
    create: string;
  }, {
    create: string;
  }>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  buttonSize: import("vue").ComputedRef<ButtonSize | undefined>;
  mergedClsPrefix: Ref<string, string>;
  NFormItem: FormItemInjection | null;
  uncontrolledValue: Ref<any[], any[]>;
  mergedValue: import("vue").ComputedRef<any[]>;
  insertionDisabled: import("vue").ComputedRef<boolean>;
  removeDisabled: import("vue").ComputedRef<boolean>;
  handleCreateClick: () => void;
  ensureKey: (value: any, index: number) => string | number;
  handleValueChange: (index: number, value: any) => void;
  remove: (index: number) => void;
  move: (type: "up" | "down", index: number) => void;
  createItem: (index: number) => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: DynamicInputThemeVars;
    peers: {
      Input: InputTheme;
      Button: ButtonTheme;
    };
    peerOverrides: {
      Input?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly max: NumberConstructor;
  readonly min: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly value: PropType<any[]>;
  readonly defaultValue: {
    readonly type: PropType<any[]>;
    readonly default: () => never[];
  };
  readonly preset: {
    readonly type: PropType<"input" | "pair">;
    readonly default: "input";
  };
  readonly keyField: StringConstructor;
  readonly itemClass: StringConstructor;
  readonly itemStyle: PropType<string | CSSProperties>;
  readonly keyPlaceholder: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly valuePlaceholder: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly placeholder: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly disabled: BooleanConstructor;
  readonly showSortButton: BooleanConstructor;
  readonly createButtonProps: PropType<ButtonProps>;
  readonly onCreate: PropType<(index: number) => any>;
  readonly onRemove: PropType<(index: number) => void>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onClear: PropType<() => void>;
  readonly onInput: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<DynamicInputTheme>;
  readonly themeOverrides: PropType<DynamicInputThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DynamicInputThemeOverrides>;
}>> & Readonly<{}>, {
  readonly defaultValue: any[];
  readonly disabled: boolean;
  readonly placeholder: string;
  readonly min: number;
  readonly preset: "input" | "pair";
  readonly keyPlaceholder: string;
  readonly valuePlaceholder: string;
  readonly showSortButton: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { DynamicInputProps, DynamicInputSlots, _default as default, dynamicInputProps };