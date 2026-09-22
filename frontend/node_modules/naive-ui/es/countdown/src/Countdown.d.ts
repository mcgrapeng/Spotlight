import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { PropType, VNodeChild } from "vue";
//#region src/countdown/src/Countdown.d.ts
interface CountdownTimeInfo {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}
interface CountdownInst {
  reset: () => void;
}
declare const countdownProps: {
  duration: {
    type: NumberConstructor;
    default: number;
  };
  active: {
    type: BooleanConstructor;
    default: boolean;
  };
  precision: {
    type: PropType<0 | 1 | 2 | 3>;
    default: number;
  };
  render: PropType<(props: CountdownTimeInfo) => VNodeChild>;
  onFinish: PropType<() => void>;
};
type CountdownProps = ExtractPublicPropTypes<typeof countdownProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  duration: {
    type: NumberConstructor;
    default: number;
  };
  active: {
    type: BooleanConstructor;
    default: boolean;
  };
  precision: {
    type: PropType<0 | 1 | 2 | 3>;
    default: number;
  };
  render: PropType<(props: CountdownTimeInfo) => VNodeChild>;
  onFinish: PropType<() => void>;
}>, CountdownInst & {
  distance: import("vue").Ref<number, number>;
  getTimeInfo: (distance: number) => CountdownTimeInfo;
  getDisplayValue: (info: CountdownTimeInfo) => string;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  duration: {
    type: NumberConstructor;
    default: number;
  };
  active: {
    type: BooleanConstructor;
    default: boolean;
  };
  precision: {
    type: PropType<0 | 1 | 2 | 3>;
    default: number;
  };
  render: PropType<(props: CountdownTimeInfo) => VNodeChild>;
  onFinish: PropType<() => void>;
}>> & Readonly<{}>, {
  duration: number;
  active: boolean;
  precision: 0 | 1 | 2 | 3;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { CountdownInst, CountdownProps, CountdownTimeInfo, countdownProps, _default as default };