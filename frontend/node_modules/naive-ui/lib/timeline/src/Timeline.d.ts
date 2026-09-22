import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { TimelineTheme, TimelineThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ExtractPropTypes, PropType, Ref } from "vue";
//#region src/timeline/src/Timeline.d.ts
declare const timelineProps: {
  readonly horizontal: BooleanConstructor;
  readonly itemPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  readonly size: {
    readonly type: PropType<"medium" | "large">;
    readonly default: "medium";
  };
  readonly iconSize: NumberConstructor;
  readonly theme: PropType<TimelineTheme>;
  readonly themeOverrides: PropType<TimelineThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TimelineThemeOverrides>;
};
interface TimelineInjection {
  props: ExtractPropTypes<typeof timelineProps>;
  mergedThemeRef: Ref<MergedTheme<TimelineTheme>>;
  mergedClsPrefixRef: Ref<string>;
}
declare const timelineInjectionKey: import("vue").InjectionKey<TimelineInjection>;
type TimelineProps = ExtractPublicPropTypes<typeof timelineProps>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  readonly horizontal: BooleanConstructor;
  readonly itemPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  readonly size: {
    readonly type: PropType<"medium" | "large">;
    readonly default: "medium";
  };
  readonly iconSize: NumberConstructor;
  readonly theme: PropType<TimelineTheme>;
  readonly themeOverrides: PropType<TimelineThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TimelineThemeOverrides>;
}>, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  readonly horizontal: BooleanConstructor;
  readonly itemPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  readonly size: {
    readonly type: PropType<"medium" | "large">;
    readonly default: "medium";
  };
  readonly iconSize: NumberConstructor;
  readonly theme: PropType<TimelineTheme>;
  readonly themeOverrides: PropType<TimelineThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TimelineThemeOverrides>;
}>> & Readonly<{}>, {
  readonly size: "medium" | "large";
  readonly horizontal: boolean;
  readonly itemPlacement: "left" | "right";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TimelineInjection, TimelineProps, _default as default, timelineInjectionKey, timelineProps };