import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ComputedRef, PropType, Ref } from "vue";
//#region src/checkbox/src/CheckboxGroup.d.ts
interface CheckboxGroupInjection {
  checkedCountRef: ComputedRef<number>;
  maxRef: Ref<number | undefined>;
  minRef: Ref<number | undefined>;
  disabledRef: Ref<boolean>;
  valueSetRef: Ref<Set<string | number>>;
  mergedSizeRef: Ref<'small' | 'medium' | 'large'>;
  toggleCheckbox: (checked: boolean, checkboxValue: string | number) => void;
}
declare const checkboxGroupInjectionKey: import("vue").InjectionKey<CheckboxGroupInjection>;
interface CheckboxGroupOption {
  label?: string;
  value?: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}
declare const checkboxGroupProps: {
  readonly min: NumberConstructor;
  readonly max: NumberConstructor;
  readonly size: PropType<"small" | "medium" | "large">;
  readonly options: PropType<CheckboxGroupOption[]>;
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly valueField: {
    readonly type: StringConstructor;
    readonly default: "value";
  };
  readonly value: PropType<Array<string | number> | null>;
  readonly defaultValue: {
    readonly type: PropType<Array<string | number> | null>;
    readonly default: null;
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly 'onUpdate:value': PropType<MaybeArray<(value: Array<string | number>, meta: {
    actionType: "check" | "uncheck";
    value: string | number;
  }) => void>>;
  readonly onUpdateValue: PropType<MaybeArray<(value: Array<string | number>, meta: {
    actionType: "check" | "uncheck";
    value: string | number;
  }) => void>>;
  readonly onChange: PropType<MaybeArray<(value: Array<string | number>) => void> | undefined>;
};
type CheckboxGroupProps = ExtractPublicPropTypes<typeof checkboxGroupProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly min: NumberConstructor;
  readonly max: NumberConstructor;
  readonly size: PropType<"small" | "medium" | "large">;
  readonly options: PropType<CheckboxGroupOption[]>;
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly valueField: {
    readonly type: StringConstructor;
    readonly default: "value";
  };
  readonly value: PropType<Array<string | number> | null>;
  readonly defaultValue: {
    readonly type: PropType<Array<string | number> | null>;
    readonly default: null;
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly 'onUpdate:value': PropType<MaybeArray<(value: Array<string | number>, meta: {
    actionType: "check" | "uncheck";
    value: string | number;
  }) => void>>;
  readonly onUpdateValue: PropType<MaybeArray<(value: Array<string | number>, meta: {
    actionType: "check" | "uncheck";
    value: string | number;
  }) => void>>;
  readonly onChange: PropType<MaybeArray<(value: Array<string | number>) => void> | undefined>;
}>, {
  mergedClsPrefix: Ref<string, string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly min: NumberConstructor;
  readonly max: NumberConstructor;
  readonly size: PropType<"small" | "medium" | "large">;
  readonly options: PropType<CheckboxGroupOption[]>;
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly valueField: {
    readonly type: StringConstructor;
    readonly default: "value";
  };
  readonly value: PropType<Array<string | number> | null>;
  readonly defaultValue: {
    readonly type: PropType<Array<string | number> | null>;
    readonly default: null;
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly 'onUpdate:value': PropType<MaybeArray<(value: Array<string | number>, meta: {
    actionType: "check" | "uncheck";
    value: string | number;
  }) => void>>;
  readonly onUpdateValue: PropType<MaybeArray<(value: Array<string | number>, meta: {
    actionType: "check" | "uncheck";
    value: string | number;
  }) => void>>;
  readonly onChange: PropType<MaybeArray<(value: Array<string | number>) => void> | undefined>;
}>> & Readonly<{}>, {
  readonly defaultValue: (string | number)[] | null;
  readonly disabled: boolean | undefined;
  readonly valueField: string;
  readonly labelField: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { CheckboxGroupInjection, CheckboxGroupOption, CheckboxGroupProps, checkboxGroupInjectionKey, checkboxGroupProps, _default as default };