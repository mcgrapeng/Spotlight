import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { RadioSize } from "./public-types.js";
import { OnUpdateValue } from "./interface.js";
import { ComputedRef, ExtractPropTypes, PropType, Ref } from "vue";
//#region src/radio/src/use-radio.d.ts
declare const radioBaseProps: {
  readonly name: StringConstructor;
  readonly value: {
    readonly type: PropType<string | number | boolean>;
    readonly default: "on";
  };
  readonly checked: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly defaultChecked: BooleanConstructor;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly label: StringConstructor;
  readonly size: PropType<RadioSize>;
  readonly onUpdateChecked: PropType<undefined | MaybeArray<(value: boolean) => void>>;
  readonly 'onUpdate:checked': PropType<undefined | MaybeArray<(value: boolean) => void>>;
  readonly checkedValue: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
};
interface RadioGroupInjection {
  mergedClsPrefixRef: Ref<string>;
  nameRef: Ref<string | undefined>;
  valueRef: Ref<string | number | boolean | null>;
  mergedSizeRef: Ref<RadioSize>;
  disabledRef: Ref<boolean>;
  doUpdateValue: OnUpdateValue;
}
declare const radioGroupInjectionKey: import("vue").InjectionKey<RadioGroupInjection>;
interface UseRadio {
  mergedClsPrefix: Ref<string>;
  inputRef: Ref<HTMLElement | null>;
  labelRef: Ref<HTMLElement | null>;
  mergedName: Ref<string | undefined>;
  mergedDisabled: Ref<boolean>;
  renderSafeChecked: Ref<boolean>;
  focus: Ref<boolean>;
  mergedSize: ComputedRef<RadioSize>;
  handleRadioInputChange: () => void;
  handleRadioInputBlur: () => void;
  handleRadioInputFocus: () => void;
}
declare function setup(props: ExtractPropTypes<typeof radioBaseProps>): UseRadio;
type RadioBaseProps = ExtractPropTypes<typeof radioBaseProps>;
//#endregion
export { RadioBaseProps, RadioGroupInjection, UseRadio, radioBaseProps, radioGroupInjectionKey, setup };