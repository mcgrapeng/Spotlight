import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { PropType } from "vue";
//#region src/number-animation/src/NumberAnimation.d.ts
declare const numberAnimationProps: {
  to: {
    type: NumberConstructor;
    default: number;
  };
  precision: {
    type: NumberConstructor;
    default: number;
  };
  showSeparator: BooleanConstructor;
  locale: StringConstructor;
  from: {
    type: NumberConstructor;
    default: number;
  };
  active: {
    type: BooleanConstructor;
    default: boolean;
  };
  duration: {
    type: NumberConstructor;
    default: number;
  };
  onFinish: PropType<() => void>;
};
type NumberAnimationProps = ExtractPublicPropTypes<typeof numberAnimationProps>;
interface NumberAnimationInst {
  play: () => void;
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  to: {
    type: NumberConstructor;
    default: number;
  };
  precision: {
    type: NumberConstructor;
    default: number;
  };
  showSeparator: BooleanConstructor;
  locale: StringConstructor;
  from: {
    type: NumberConstructor;
    default: number;
  };
  active: {
    type: BooleanConstructor;
    default: boolean;
  };
  duration: {
    type: NumberConstructor;
    default: number;
  };
  onFinish: PropType<() => void>;
}>, {
  play: () => void;
  formattedValue: import("vue").ComputedRef<{
    integer: string;
    decimal: string;
    decimalSeparator: string | undefined;
  }>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  to: {
    type: NumberConstructor;
    default: number;
  };
  precision: {
    type: NumberConstructor;
    default: number;
  };
  showSeparator: BooleanConstructor;
  locale: StringConstructor;
  from: {
    type: NumberConstructor;
    default: number;
  };
  active: {
    type: BooleanConstructor;
    default: boolean;
  };
  duration: {
    type: NumberConstructor;
    default: number;
  };
  onFinish: PropType<() => void>;
}>> & Readonly<{}>, {
  to: number;
  duration: number;
  active: boolean;
  from: number;
  showSeparator: boolean;
  precision: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { NumberAnimationInst, NumberAnimationProps, _default as default, numberAnimationProps };