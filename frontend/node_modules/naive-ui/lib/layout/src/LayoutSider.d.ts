import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import "../../_internal/index.js";
import { LayoutTheme, LayoutThemeOverrides, LayoutThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/layout/src/LayoutSider.d.ts
declare const layoutSiderProps: {
  readonly position: {
    readonly type: PropType<"static" | "absolute">;
    readonly default: "static";
  };
  readonly bordered: BooleanConstructor;
  readonly collapsedWidth: {
    readonly type: NumberConstructor;
    readonly default: 48;
  };
  readonly width: {
    readonly type: PropType<string | number>;
    readonly default: 272;
  };
  readonly contentClass: StringConstructor;
  readonly contentStyle: {
    readonly type: PropType<string | CSSProperties>;
    readonly default: "";
  };
  readonly collapseMode: {
    readonly type: PropType<"width" | "transform">;
    readonly default: "transform";
  };
  readonly collapsed: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly defaultCollapsed: BooleanConstructor;
  readonly showCollapsedContent: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showTrigger: {
    readonly type: PropType<boolean | "arrow-circle" | "bar">;
    readonly default: false;
  };
  readonly nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly inverted: BooleanConstructor;
  readonly scrollbarProps: PropType<Partial<ScrollbarProps> & {
    style: CSSProperties;
  }>;
  readonly triggerClass: StringConstructor;
  readonly triggerStyle: PropType<string | CSSProperties>;
  readonly collapsedTriggerClass: StringConstructor;
  readonly collapsedTriggerStyle: PropType<string | CSSProperties>;
  readonly 'onUpdate:collapsed': PropType<MaybeArray<(value: boolean) => void>>;
  readonly onUpdateCollapsed: PropType<MaybeArray<(value: boolean) => void>>;
  readonly onAfterEnter: PropType<() => void>;
  readonly onAfterLeave: PropType<() => void>;
  readonly onExpand: PropType<MaybeArray<() => void>>;
  readonly onCollapse: PropType<MaybeArray<() => void>>;
  readonly onScroll: PropType<(e: Event) => void>;
};
type LayoutSiderProps = ExtractPublicPropTypes<typeof layoutSiderProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  position: {
    readonly type: PropType<"static" | "absolute">;
    readonly default: "static";
  };
  bordered: BooleanConstructor;
  collapsedWidth: {
    readonly type: NumberConstructor;
    readonly default: 48;
  };
  width: {
    readonly type: PropType<string | number>;
    readonly default: 272;
  };
  contentClass: StringConstructor;
  contentStyle: {
    readonly type: PropType<string | CSSProperties>;
    readonly default: "";
  };
  collapseMode: {
    readonly type: PropType<"width" | "transform">;
    readonly default: "transform";
  };
  collapsed: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  defaultCollapsed: BooleanConstructor;
  showCollapsedContent: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  showTrigger: {
    readonly type: PropType<boolean | "arrow-circle" | "bar">;
    readonly default: false;
  };
  nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  inverted: BooleanConstructor;
  scrollbarProps: PropType<Partial<ScrollbarProps> & {
    style: CSSProperties;
  }>;
  triggerClass: StringConstructor;
  triggerStyle: PropType<string | CSSProperties>;
  collapsedTriggerClass: StringConstructor;
  collapsedTriggerStyle: PropType<string | CSSProperties>;
  'onUpdate:collapsed': PropType<MaybeArray<(value: boolean) => void>>;
  onUpdateCollapsed: PropType<MaybeArray<(value: boolean) => void>>;
  onAfterEnter: PropType<() => void>;
  onAfterLeave: PropType<() => void>;
  onExpand: PropType<MaybeArray<() => void>>;
  onCollapse: PropType<MaybeArray<() => void>>;
  onScroll: PropType<(e: Event) => void>;
  theme: PropType<LayoutTheme>;
  themeOverrides: PropType<LayoutThemeOverrides>;
  builtinThemeOverrides: PropType<LayoutThemeOverrides>;
}>, {
  scrollTo: ((options: ScrollToOptions) => void) & ((x: number, y: number) => void);
  scrollableElRef: Ref<HTMLElement | null, HTMLElement | null>;
  scrollbarInstRef: unknown;
  mergedClsPrefix: Ref<string, string>;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: LayoutThemeVars;
    peers: {
      Scrollbar: ScrollbarTheme;
    };
    peerOverrides: {
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  styleMaxWidth: import("vue").ComputedRef<string>;
  mergedCollapsed: import("vue").ComputedRef<boolean>;
  scrollContainerStyle: import("vue").ComputedRef<CSSProperties>;
  siderPlacement: import("vue").ComputedRef<"left" | "right">;
  handleNativeElScroll: (e: Event) => void;
  handleTransitionend: (e: TransitionEvent) => void;
  handleTriggerClick: () => void;
  inlineThemeDisabled: boolean | undefined;
  cssVars: Ref<CSSProperties>;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  position: {
    readonly type: PropType<"static" | "absolute">;
    readonly default: "static";
  };
  bordered: BooleanConstructor;
  collapsedWidth: {
    readonly type: NumberConstructor;
    readonly default: 48;
  };
  width: {
    readonly type: PropType<string | number>;
    readonly default: 272;
  };
  contentClass: StringConstructor;
  contentStyle: {
    readonly type: PropType<string | CSSProperties>;
    readonly default: "";
  };
  collapseMode: {
    readonly type: PropType<"width" | "transform">;
    readonly default: "transform";
  };
  collapsed: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  defaultCollapsed: BooleanConstructor;
  showCollapsedContent: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  showTrigger: {
    readonly type: PropType<boolean | "arrow-circle" | "bar">;
    readonly default: false;
  };
  nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  inverted: BooleanConstructor;
  scrollbarProps: PropType<Partial<ScrollbarProps> & {
    style: CSSProperties;
  }>;
  triggerClass: StringConstructor;
  triggerStyle: PropType<string | CSSProperties>;
  collapsedTriggerClass: StringConstructor;
  collapsedTriggerStyle: PropType<string | CSSProperties>;
  'onUpdate:collapsed': PropType<MaybeArray<(value: boolean) => void>>;
  onUpdateCollapsed: PropType<MaybeArray<(value: boolean) => void>>;
  onAfterEnter: PropType<() => void>;
  onAfterLeave: PropType<() => void>;
  onExpand: PropType<MaybeArray<() => void>>;
  onCollapse: PropType<MaybeArray<() => void>>;
  onScroll: PropType<(e: Event) => void>;
  theme: PropType<LayoutTheme>;
  themeOverrides: PropType<LayoutThemeOverrides>;
  builtinThemeOverrides: PropType<LayoutThemeOverrides>;
}>> & Readonly<{}>, {
  position: "absolute" | "static";
  bordered: boolean;
  width: string | number;
  contentStyle: string | CSSProperties;
  collapsed: boolean | undefined;
  nativeScrollbar: boolean;
  inverted: boolean;
  collapsedWidth: number;
  collapseMode: "transform" | "width";
  defaultCollapsed: boolean;
  showCollapsedContent: boolean;
  showTrigger: boolean | "bar" | "arrow-circle";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { LayoutSiderProps, _default as default, layoutSiderProps };