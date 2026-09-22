import { ProgressGradient, ProgressStatus } from "./public-types.js";
import { CSSProperties, PropType } from "vue";
//#region src/progress/src/Line.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  percentage: {
    type: NumberConstructor;
    default: number;
  };
  railColor: StringConstructor;
  railStyle: PropType<string | CSSProperties>;
  fillColor: PropType<string | ProgressGradient>;
  status: {
    type: PropType<ProgressStatus>;
    required: true;
  };
  indicatorPlacement: {
    type: PropType<"inside" | "outside">;
    required: true;
  };
  indicatorTextColor: StringConstructor;
  unit: {
    type: StringConstructor;
    default: string;
  };
  processing: {
    type: BooleanConstructor;
    required: true;
  };
  showIndicator: {
    type: BooleanConstructor;
    required: true;
  };
  height: (StringConstructor | NumberConstructor)[];
  railBorderRadius: (StringConstructor | NumberConstructor)[];
  fillBorderRadius: (StringConstructor | NumberConstructor)[];
}>, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  percentage: {
    type: NumberConstructor;
    default: number;
  };
  railColor: StringConstructor;
  railStyle: PropType<string | CSSProperties>;
  fillColor: PropType<string | ProgressGradient>;
  status: {
    type: PropType<ProgressStatus>;
    required: true;
  };
  indicatorPlacement: {
    type: PropType<"inside" | "outside">;
    required: true;
  };
  indicatorTextColor: StringConstructor;
  unit: {
    type: StringConstructor;
    default: string;
  };
  processing: {
    type: BooleanConstructor;
    required: true;
  };
  showIndicator: {
    type: BooleanConstructor;
    required: true;
  };
  height: (StringConstructor | NumberConstructor)[];
  railBorderRadius: (StringConstructor | NumberConstructor)[];
  fillBorderRadius: (StringConstructor | NumberConstructor)[];
}>> & Readonly<{}>, {
  unit: string;
  percentage: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };