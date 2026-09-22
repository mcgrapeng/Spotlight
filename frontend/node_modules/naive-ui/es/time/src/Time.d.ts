import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { PropType } from "vue";
//#region src/time/src/Time.d.ts
declare const timeProps: {
  readonly time: {
    readonly type: PropType<number | Date>;
    readonly default: undefined;
  };
  readonly type: {
    readonly type: PropType<"relative" | "date" | "datetime">;
    readonly default: "datetime";
  };
  readonly to: {
    readonly type: PropType<number | Date>;
    readonly default: undefined;
  };
  readonly unix: BooleanConstructor;
  readonly format: StringConstructor;
  readonly text: BooleanConstructor;
  readonly timeZone: StringConstructor;
};
type TimeProps = ExtractPublicPropTypes<typeof timeProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly time: {
    readonly type: PropType<number | Date>;
    readonly default: undefined;
  };
  readonly type: {
    readonly type: PropType<"relative" | "date" | "datetime">;
    readonly default: "datetime";
  };
  readonly to: {
    readonly type: PropType<number | Date>;
    readonly default: undefined;
  };
  readonly unix: BooleanConstructor;
  readonly format: StringConstructor;
  readonly text: BooleanConstructor;
  readonly timeZone: StringConstructor;
}>, {
  renderedTime: import("vue").ComputedRef<string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly time: {
    readonly type: PropType<number | Date>;
    readonly default: undefined;
  };
  readonly type: {
    readonly type: PropType<"relative" | "date" | "datetime">;
    readonly default: "datetime";
  };
  readonly to: {
    readonly type: PropType<number | Date>;
    readonly default: undefined;
  };
  readonly unix: BooleanConstructor;
  readonly format: StringConstructor;
  readonly text: BooleanConstructor;
  readonly timeZone: StringConstructor;
}>> & Readonly<{}>, {
  readonly time: number | Date;
  readonly to: number | Date;
  readonly type: "date" | "relative" | "datetime";
  readonly text: boolean;
  readonly unix: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TimeProps, _default as default, timeProps };