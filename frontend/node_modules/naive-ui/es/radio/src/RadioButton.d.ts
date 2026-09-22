import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { RadioSize } from "./public-types.js";
import { UseRadio, radioBaseProps } from "./use-radio.js";
//#region src/radio/src/RadioButton.d.ts
declare const radioButtonProps: {
  readonly name: StringConstructor;
  readonly value: {
    readonly type: import("vue").PropType<string | number | boolean>;
    readonly default: "on";
  };
  readonly checked: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly defaultChecked: BooleanConstructor;
  readonly disabled: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly label: StringConstructor;
  readonly size: import("vue").PropType<RadioSize>;
  readonly onUpdateChecked: import("vue").PropType<undefined | MaybeArray<(value: boolean) => void>>;
  readonly 'onUpdate:checked': import("vue").PropType<undefined | MaybeArray<(value: boolean) => void>>;
  readonly checkedValue: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
};
type RadioButtonProps = ExtractPublicPropTypes<typeof radioBaseProps>;
declare const _default: import("vue").DefineComponent<{
  readonly value: string | number | boolean;
  readonly defaultChecked: boolean;
  readonly name?: string | undefined;
  readonly label?: string | undefined;
  readonly disabled?: boolean | undefined;
  readonly size?: RadioSize | undefined;
  readonly checked?: boolean | undefined;
  readonly checkedValue?: boolean | undefined;
  readonly 'onUpdate:checked'?: MaybeArray<(value: boolean) => void> | undefined;
  readonly onUpdateChecked?: MaybeArray<(value: boolean) => void> | undefined;
}, UseRadio, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{
  readonly value: string | number | boolean;
  readonly defaultChecked: boolean;
  readonly name?: string | undefined;
  readonly label?: string | undefined;
  readonly disabled?: boolean | undefined;
  readonly size?: RadioSize | undefined;
  readonly checked?: boolean | undefined;
  readonly checkedValue?: boolean | undefined;
  readonly 'onUpdate:checked'?: MaybeArray<(value: boolean) => void> | undefined;
  readonly onUpdateChecked?: MaybeArray<(value: boolean) => void> | undefined;
}> & Readonly<{}>, {
  readonly disabled: boolean | undefined;
  readonly value: string | number | boolean;
  readonly checked: boolean | undefined;
  readonly defaultChecked: boolean;
  readonly checkedValue: boolean | undefined;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { RadioButtonProps, _default as default, radioButtonProps };