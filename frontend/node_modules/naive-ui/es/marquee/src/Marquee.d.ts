import { MarqueeTheme, MarqueeThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, Ref } from "vue";
//#region src/marquee/src/Marquee.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  autoFill: BooleanConstructor;
  speed: {
    type: NumberConstructor;
    default: number;
  };
  theme: import("vue").PropType<MarqueeTheme>;
  themeOverrides: import("vue").PropType<MarqueeThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<MarqueeThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  animationCssVars: Ref<CSSProperties>;
  containerElRef: Ref<HTMLDivElement | null, HTMLDivElement | null>;
  repeatCountInOneGroup: import("vue").ComputedRef<number>;
  handleContainerResize: (entry: ResizeObserverEntry) => void;
  handleContentResize: (entry: ResizeObserverEntry) => void;
  handleAnimationIteration: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  autoFill: BooleanConstructor;
  speed: {
    type: NumberConstructor;
    default: number;
  };
  theme: import("vue").PropType<MarqueeTheme>;
  themeOverrides: import("vue").PropType<MarqueeThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<MarqueeThemeOverrides>;
}>> & Readonly<{}>, {
  autoFill: boolean;
  speed: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };