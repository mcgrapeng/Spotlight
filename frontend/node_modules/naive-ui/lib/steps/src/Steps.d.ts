import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { StepsTheme, StepsThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { ExtractPropTypes, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/steps/src/Steps.d.ts
declare const stepsProps: {
  current: NumberConstructor;
  status: {
    type: PropType<"process" | "finish" | "error" | "wait">;
    default: string;
  };
  size: {
    type: PropType<"small" | "medium">;
    default: string;
  };
  vertical: BooleanConstructor;
  contentPlacement: {
    type: PropType<"right" | "bottom">;
    default: string;
  };
  'onUpdate:current': PropType<MaybeArray<(current: number) => void>>;
  onUpdateCurrent: PropType<MaybeArray<(current: number) => void>>;
  theme: PropType<StepsTheme>;
  themeOverrides: PropType<StepsThemeOverrides>;
  builtinThemeOverrides: PropType<StepsThemeOverrides>;
};
interface StepsInjection {
  props: ExtractPropTypes<typeof stepsProps>;
  mergedClsPrefixRef: Ref<string>;
  mergedThemeRef: Ref<MergedTheme<StepsTheme>>;
  stepsSlots: StepsSlots;
}
type StepsProps = ExtractPublicPropTypes<typeof stepsProps>;
interface StepsSlots {
  default?: () => VNode[];
  'finish-icon'?: () => VNode[];
  'error-icon'?: () => VNode[];
}
declare const stepsInjectionKey: import("vue").InjectionKey<StepsInjection>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  current: NumberConstructor;
  status: {
    type: PropType<"process" | "finish" | "error" | "wait">;
    default: string;
  };
  size: {
    type: PropType<"small" | "medium">;
    default: string;
  };
  vertical: BooleanConstructor;
  contentPlacement: {
    type: PropType<"right" | "bottom">;
    default: string;
  };
  'onUpdate:current': PropType<MaybeArray<(current: number) => void>>;
  onUpdateCurrent: PropType<MaybeArray<(current: number) => void>>;
  theme: PropType<StepsTheme>;
  themeOverrides: PropType<StepsThemeOverrides>;
  builtinThemeOverrides: PropType<StepsThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  current: NumberConstructor;
  status: {
    type: PropType<"process" | "finish" | "error" | "wait">;
    default: string;
  };
  size: {
    type: PropType<"small" | "medium">;
    default: string;
  };
  vertical: BooleanConstructor;
  contentPlacement: {
    type: PropType<"right" | "bottom">;
    default: string;
  };
  'onUpdate:current': PropType<MaybeArray<(current: number) => void>>;
  onUpdateCurrent: PropType<MaybeArray<(current: number) => void>>;
  theme: PropType<StepsTheme>;
  themeOverrides: PropType<StepsThemeOverrides>;
  builtinThemeOverrides: PropType<StepsThemeOverrides>;
}>> & Readonly<{}>, {
  size: "small" | "medium";
  status: "error" | "wait" | "finish" | "process";
  vertical: boolean;
  contentPlacement: "bottom" | "right";
}, SlotsType<StepsSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { StepsInjection, StepsProps, StepsSlots, _default as default, stepsInjectionKey, stepsProps };