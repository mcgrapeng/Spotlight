import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { StepsSlots } from "./Steps.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/steps/src/Step.d.ts
declare const stepProps: {
  readonly status: PropType<"process" | "finish" | "error" | "wait">;
  readonly title: StringConstructor;
  readonly description: StringConstructor;
  readonly disabled: BooleanConstructor;
  readonly internalIndex: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
};
type StepProps = ExtractPublicPropTypes<typeof stepProps>;
interface StepSlots {
  default?: () => VNode[];
  icon?: () => VNode[];
  title?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly status: PropType<"process" | "finish" | "error" | "wait">;
  readonly title: StringConstructor;
  readonly description: StringConstructor;
  readonly disabled: BooleanConstructor;
  readonly internalIndex: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
}>, {
  stepsSlots: StepsSlots;
  mergedClsPrefix: Ref<string, string>;
  vertical: Ref<boolean, boolean>;
  mergedStatus: import("vue").ComputedRef<"error" | "wait" | "finish" | "process">;
  handleStepClick: import("vue").ComputedRef<(() => void) | undefined>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  contentPlacement: Ref<"bottom" | "right", "bottom" | "right">;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly status: PropType<"process" | "finish" | "error" | "wait">;
  readonly title: StringConstructor;
  readonly description: StringConstructor;
  readonly disabled: BooleanConstructor;
  readonly internalIndex: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
}>> & Readonly<{}>, {
  readonly disabled: boolean;
  readonly internalIndex: number;
}, SlotsType<StepSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { StepProps, StepSlots, _default as default, stepProps };