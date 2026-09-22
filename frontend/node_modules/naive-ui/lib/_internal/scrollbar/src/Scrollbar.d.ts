import { ExtractInternalPropTypes, ExtractPublicPropTypes } from "../../../_utils/naive/extract-public-props.js";
import "../../../_utils/index.js";
import { ScrollbarTheme, ScrollbarThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { RtlItem } from "../../../config-provider/src/internal-interface.js";
import { CSSProperties, HTMLAttributes, PropType, Ref } from "vue";
//#region src/_internal/scrollbar/src/Scrollbar.d.ts
interface ScrollTo {
  (x: number, y: number): void;
  (options: {
    left?: number;
    top?: number;
    behavior?: ScrollBehavior;
    debounce?: boolean;
  }): void;
  (options: {
    el: HTMLElement;
    behavior?: ScrollBehavior;
    debounce?: boolean;
  }): void;
  (options: {
    index: number;
    elSize: number;
    behavior?: ScrollBehavior;
    debounce?: boolean;
  }): void;
  (options: {
    position: 'top' | 'bottom';
    behavior?: ScrollBehavior;
    debounce?: boolean;
  }): void;
}
interface ScrollBy {
  (x: number, y: number): void;
  (options: {
    left?: number;
    top?: number;
    behavior?: ScrollBehavior;
  }): void;
}
interface ScrollbarInstMethods {
  syncUnifiedContainer: () => void;
  scrollTo: ScrollTo;
  scrollBy: ScrollBy;
  sync: () => void;
  handleMouseEnterWrapper: () => void;
  handleMouseLeaveWrapper: () => void;
}
interface ScrollbarInst extends ScrollbarInstMethods {
  $el: HTMLElement;
  containerRef: HTMLElement | null;
  contentRef: HTMLElement | null;
  containerScrollTop: number;
}
declare const scrollbarProps: {
  readonly duration: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly scrollable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly xScrollable: BooleanConstructor;
  readonly trigger: {
    readonly type: PropType<"none" | "hover">;
    readonly default: "hover";
  };
  readonly useUnifiedContainer: BooleanConstructor;
  readonly triggerDisplayManually: BooleanConstructor;
  readonly container: PropType<() => HTMLElement | null | undefined>;
  readonly content: PropType<() => HTMLElement | null | undefined>;
  readonly containerClass: StringConstructor;
  readonly containerStyle: PropType<string | CSSProperties>;
  readonly contentClass: PropType<string | Array<string | undefined>>;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly horizontalRailStyle: PropType<string | CSSProperties>;
  readonly verticalRailStyle: PropType<string | CSSProperties>;
  readonly onScroll: PropType<(e: Event) => void>;
  readonly onWheel: PropType<(e: WheelEvent) => void>;
  readonly onResize: PropType<(e: ResizeObserverEntry) => void>;
  readonly internalOnUpdateScrollLeft: PropType<(scrollLeft: number) => void>;
  readonly internalHoistYRail: BooleanConstructor;
  readonly internalExposeWidthCssVar: BooleanConstructor;
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
type ScrollbarInternalProps = ExtractInternalPropTypes<typeof scrollbarProps>;
declare const Scrollbar: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly duration: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly scrollable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly xScrollable: BooleanConstructor;
  readonly trigger: {
    readonly type: PropType<"none" | "hover">;
    readonly default: "hover";
  };
  readonly useUnifiedContainer: BooleanConstructor;
  readonly triggerDisplayManually: BooleanConstructor;
  readonly container: PropType<() => HTMLElement | null | undefined>;
  readonly content: PropType<() => HTMLElement | null | undefined>;
  readonly containerClass: StringConstructor;
  readonly containerStyle: PropType<string | CSSProperties>;
  readonly contentClass: PropType<string | Array<string | undefined>>;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly horizontalRailStyle: PropType<string | CSSProperties>;
  readonly verticalRailStyle: PropType<string | CSSProperties>;
  readonly onScroll: PropType<(e: Event) => void>;
  readonly onWheel: PropType<(e: WheelEvent) => void>;
  readonly onResize: PropType<(e: ResizeObserverEntry) => void>;
  readonly internalOnUpdateScrollLeft: PropType<(scrollLeft: number) => void>;
  readonly internalHoistYRail: BooleanConstructor;
  readonly internalExposeWidthCssVar: BooleanConstructor;
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
  mergedClsPrefix: Ref<string, string>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  containerScrollTop: Ref<number, number>;
  wrapperRef: Ref<HTMLElement | null, HTMLElement | null>;
  containerRef: Ref<HTMLElement | null, HTMLElement | null>;
  contentRef: Ref<HTMLElement | null, HTMLElement | null>;
  yRailRef: Ref<HTMLElement | null, HTMLElement | null>;
  xRailRef: Ref<HTMLElement | null, HTMLElement | null>;
  needYBar: import("vue").ComputedRef<boolean>;
  needXBar: import("vue").ComputedRef<boolean>;
  yBarSizePx: import("vue").ComputedRef<string>;
  xBarSizePx: import("vue").ComputedRef<string>;
  yBarTopPx: import("vue").ComputedRef<string>;
  xBarLeftPx: import("vue").ComputedRef<string>;
  isShowXBar: import("vue").ComputedRef<boolean>;
  isShowYBar: import("vue").ComputedRef<boolean>;
  isIos: boolean;
  handleScroll: (e: Event) => void;
  handleContentResize: () => void;
  handleContainerResize: (e: ResizeObserverEntry) => void;
  handleYScrollMouseDown: (e: MouseEvent) => void;
  handleXScrollMouseDown: (e: MouseEvent) => void;
  containerWidth: Ref<number | null, number | null>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  syncUnifiedContainer: () => void;
  scrollTo: ScrollTo;
  scrollBy: ScrollBy;
  sync: () => void;
  handleMouseEnterWrapper: () => void;
  handleMouseLeaveWrapper: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly duration: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly scrollable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly xScrollable: BooleanConstructor;
  readonly trigger: {
    readonly type: PropType<"none" | "hover">;
    readonly default: "hover";
  };
  readonly useUnifiedContainer: BooleanConstructor;
  readonly triggerDisplayManually: BooleanConstructor;
  readonly container: PropType<() => HTMLElement | null | undefined>;
  readonly content: PropType<() => HTMLElement | null | undefined>;
  readonly containerClass: StringConstructor;
  readonly containerStyle: PropType<string | CSSProperties>;
  readonly contentClass: PropType<string | Array<string | undefined>>;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly horizontalRailStyle: PropType<string | CSSProperties>;
  readonly verticalRailStyle: PropType<string | CSSProperties>;
  readonly onScroll: PropType<(e: Event) => void>;
  readonly onWheel: PropType<(e: WheelEvent) => void>;
  readonly onResize: PropType<(e: ResizeObserverEntry) => void>;
  readonly internalOnUpdateScrollLeft: PropType<(scrollLeft: number) => void>;
  readonly internalHoistYRail: BooleanConstructor;
  readonly internalExposeWidthCssVar: BooleanConstructor;
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
  readonly duration: number;
  readonly scrollable: boolean;
  readonly xScrollable: boolean;
  readonly trigger: "none" | "hover";
  readonly useUnifiedContainer: boolean;
  readonly triggerDisplayManually: boolean;
  readonly internalHoistYRail: boolean;
  readonly internalExposeWidthCssVar: boolean;
  readonly yPlacement: "left" | "right";
  readonly xPlacement: "top" | "bottom";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
type NativeScrollbarProps = Omit<HTMLAttributes, keyof ScrollbarInternalProps>;
type MergedProps = Partial<ScrollbarInternalProps & NativeScrollbarProps>;
declare const XScrollbar: new () => {
  $props: MergedProps;
};
//#endregion
export { ScrollBy, ScrollTo, ScrollbarInst, ScrollbarInstMethods, ScrollbarInternalProps, ScrollbarProps, XScrollbar, Scrollbar as default };