import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ProgressTheme, ProgressThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { ProgressGradient, ProgressStatus } from "./public-types.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/progress/src/Progress.d.ts
declare const progressProps: {
  readonly processing: BooleanConstructor;
  readonly type: {
    readonly type: PropType<"line" | "circle" | "multiple-circle" | "dashboard">;
    readonly default: "line";
  };
  readonly gapDegree: NumberConstructor;
  readonly gapOffsetDegree: NumberConstructor;
  readonly status: {
    readonly type: PropType<ProgressStatus>;
    readonly default: "default";
  };
  readonly railColor: PropType<string | string[]>;
  readonly railStyle: PropType<string | CSSProperties | Array<string | CSSProperties>>;
  readonly color: PropType<string | string[] | ProgressGradient | ProgressGradient[]>;
  readonly viewBoxWidth: {
    readonly type: NumberConstructor;
    readonly default: 100;
  };
  readonly strokeWidth: {
    readonly type: NumberConstructor;
    readonly default: 7;
  };
  readonly percentage: PropType<number | number[]>;
  readonly unit: {
    readonly type: StringConstructor;
    readonly default: "%";
  };
  readonly showIndicator: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly indicatorPosition: {
    readonly type: PropType<"inside" | "outside">;
    readonly default: "outside";
  };
  readonly indicatorPlacement: {
    readonly type: PropType<"inside" | "outside">;
    readonly default: "outside";
  };
  readonly indicatorTextColor: StringConstructor;
  readonly circleGap: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly height: NumberConstructor;
  readonly borderRadius: PropType<string | number>;
  readonly fillBorderRadius: PropType<string | number>;
  readonly offsetDegree: NumberConstructor;
  readonly theme: PropType<ProgressTheme>;
  readonly themeOverrides: PropType<ProgressThemeOverrides>;
  readonly builtinThemeOverrides: PropType<ProgressThemeOverrides>;
};
type ProgressProps = ExtractPublicPropTypes<typeof progressProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly processing: BooleanConstructor;
  readonly type: {
    readonly type: PropType<"line" | "circle" | "multiple-circle" | "dashboard">;
    readonly default: "line";
  };
  readonly gapDegree: NumberConstructor;
  readonly gapOffsetDegree: NumberConstructor;
  readonly status: {
    readonly type: PropType<ProgressStatus>;
    readonly default: "default";
  };
  readonly railColor: PropType<string | string[]>;
  readonly railStyle: PropType<string | CSSProperties | Array<string | CSSProperties>>;
  readonly color: PropType<string | string[] | ProgressGradient | ProgressGradient[]>;
  readonly viewBoxWidth: {
    readonly type: NumberConstructor;
    readonly default: 100;
  };
  readonly strokeWidth: {
    readonly type: NumberConstructor;
    readonly default: 7;
  };
  readonly percentage: PropType<number | number[]>;
  readonly unit: {
    readonly type: StringConstructor;
    readonly default: "%";
  };
  readonly showIndicator: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly indicatorPosition: {
    readonly type: PropType<"inside" | "outside">;
    readonly default: "outside";
  };
  readonly indicatorPlacement: {
    readonly type: PropType<"inside" | "outside">;
    readonly default: "outside";
  };
  readonly indicatorTextColor: StringConstructor;
  readonly circleGap: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly height: NumberConstructor;
  readonly borderRadius: PropType<string | number>;
  readonly fillBorderRadius: PropType<string | number>;
  readonly offsetDegree: NumberConstructor;
  readonly theme: PropType<ProgressTheme>;
  readonly themeOverrides: PropType<ProgressThemeOverrides>;
  readonly builtinThemeOverrides: PropType<ProgressThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  mergedIndicatorPlacement: import("vue").ComputedRef<"inside" | "outside">;
  gapDeg: import("vue").ComputedRef<number | undefined>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly processing: BooleanConstructor;
  readonly type: {
    readonly type: PropType<"line" | "circle" | "multiple-circle" | "dashboard">;
    readonly default: "line";
  };
  readonly gapDegree: NumberConstructor;
  readonly gapOffsetDegree: NumberConstructor;
  readonly status: {
    readonly type: PropType<ProgressStatus>;
    readonly default: "default";
  };
  readonly railColor: PropType<string | string[]>;
  readonly railStyle: PropType<string | CSSProperties | Array<string | CSSProperties>>;
  readonly color: PropType<string | string[] | ProgressGradient | ProgressGradient[]>;
  readonly viewBoxWidth: {
    readonly type: NumberConstructor;
    readonly default: 100;
  };
  readonly strokeWidth: {
    readonly type: NumberConstructor;
    readonly default: 7;
  };
  readonly percentage: PropType<number | number[]>;
  readonly unit: {
    readonly type: StringConstructor;
    readonly default: "%";
  };
  readonly showIndicator: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly indicatorPosition: {
    readonly type: PropType<"inside" | "outside">;
    readonly default: "outside";
  };
  readonly indicatorPlacement: {
    readonly type: PropType<"inside" | "outside">;
    readonly default: "outside";
  };
  readonly indicatorTextColor: StringConstructor;
  readonly circleGap: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly height: NumberConstructor;
  readonly borderRadius: PropType<string | number>;
  readonly fillBorderRadius: PropType<string | number>;
  readonly offsetDegree: NumberConstructor;
  readonly theme: PropType<ProgressTheme>;
  readonly themeOverrides: PropType<ProgressThemeOverrides>;
  readonly builtinThemeOverrides: PropType<ProgressThemeOverrides>;
}>> & Readonly<{}>, {
  readonly type: "circle" | "line" | "multiple-circle" | "dashboard";
  readonly status: ProgressStatus;
  readonly strokeWidth: number;
  readonly processing: boolean;
  readonly unit: string;
  readonly showIndicator: boolean;
  readonly viewBoxWidth: number;
  readonly indicatorPlacement: "inside" | "outside";
  readonly indicatorPosition: "inside" | "outside";
  readonly circleGap: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ProgressProps, _default as default, progressProps };