import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ScrollbarTheme, ScrollbarThemeOverrides } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType } from "vue";
//#region src/scrollbar/src/Scrollbar.d.ts
interface ScrollTo {
  (x: number, y: number): void;
  (options: {
    left?: number;
    top?: number;
    behavior?: ScrollBehavior;
  }): void;
}
type ScrollBy = ScrollTo;
interface ScrollbarInst {
  scrollTo: ScrollTo;
  scrollBy: ScrollBy;
}
declare const scrollbarProps: {
  readonly trigger: PropType<"none" | "hover">;
  readonly xScrollable: BooleanConstructor;
  readonly onScroll: PropType<(e: Event) => void>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | Record<string, any>>;
  readonly yPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "right";
  };
  readonly xPlacement: {
    readonly type: PropType<"top" | "bottom">;
    readonly default: "bottom";
  };
  readonly theme: PropType<ScrollbarTheme>;
  readonly themeOverrides: PropType<ScrollbarThemeOverrides>;
  readonly builtinThemeOverrides: PropType<ScrollbarThemeOverrides>;
};
type ScrollbarProps = ExtractPublicPropTypes<typeof scrollbarProps>;
declare const Scrollbar: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly trigger: PropType<"none" | "hover">;
  readonly xScrollable: BooleanConstructor;
  readonly onScroll: PropType<(e: Event) => void>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | Record<string, any>>;
  readonly yPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "right";
  };
  readonly xPlacement: {
    readonly type: PropType<"top" | "bottom">;
    readonly default: "bottom";
  };
  readonly theme: PropType<ScrollbarTheme>;
  readonly themeOverrides: PropType<ScrollbarThemeOverrides>;
  readonly builtinThemeOverrides: PropType<ScrollbarThemeOverrides>;
}>, {
  scrollbarInstRef: unknown;
  scrollTo: ScrollTo;
  scrollBy: ScrollBy;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly trigger: PropType<"none" | "hover">;
  readonly xScrollable: BooleanConstructor;
  readonly onScroll: PropType<(e: Event) => void>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | Record<string, any>>;
  readonly yPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "right";
  };
  readonly xPlacement: {
    readonly type: PropType<"top" | "bottom">;
    readonly default: "bottom";
  };
  readonly theme: PropType<ScrollbarTheme>;
  readonly themeOverrides: PropType<ScrollbarThemeOverrides>;
  readonly builtinThemeOverrides: PropType<ScrollbarThemeOverrides>;
}>> & Readonly<{}>, {
  readonly xScrollable: boolean;
  readonly yPlacement: "left" | "right";
  readonly xPlacement: "top" | "bottom";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ScrollBy, ScrollTo, ScrollbarInst, ScrollbarProps, Scrollbar as default, scrollbarProps };