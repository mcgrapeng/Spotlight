import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import "../../_internal/index.js";
import { LayoutTheme, LayoutThemeOverrides, LayoutThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, ExtractPropTypes, PropType, Ref } from "vue";
//#region src/layout/src/Layout.d.ts
declare const layoutProps: {
  readonly embedded: BooleanConstructor;
  readonly position: {
    readonly type: PropType<"static" | "absolute">;
    readonly default: "static";
  };
  readonly nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly scrollbarProps: PropType<Partial<ScrollbarProps>>;
  readonly onScroll: PropType<(e: Event) => void>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: {
    readonly type: PropType<string | CSSProperties>;
    readonly default: "";
  };
  readonly hasSider: BooleanConstructor;
  readonly siderPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
};
type LayoutProps = ExtractPublicPropTypes<typeof layoutProps>;
declare const layoutInjectionKey: import("vue").InjectionKey<ExtractPropTypes<{
  readonly embedded: BooleanConstructor;
  readonly position: {
    readonly type: PropType<"static" | "absolute">;
    readonly default: "static";
  };
  readonly nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly scrollbarProps: PropType<Partial<ScrollbarProps>>;
  readonly onScroll: PropType<(e: Event) => void>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: {
    readonly type: PropType<string | CSSProperties>;
    readonly default: "";
  };
  readonly hasSider: BooleanConstructor;
  readonly siderPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
}>>;
declare function createLayoutComponent(isContent: boolean): import("vue").DefineComponent<ExtractPropTypes<{
  embedded: BooleanConstructor;
  position: {
    readonly type: PropType<"static" | "absolute">;
    readonly default: "static";
  };
  nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  scrollbarProps: PropType<Partial<ScrollbarProps>>;
  onScroll: PropType<(e: Event) => void>;
  contentClass: StringConstructor;
  contentStyle: {
    readonly type: PropType<string | CSSProperties>;
    readonly default: "";
  };
  hasSider: BooleanConstructor;
  siderPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  theme: PropType<LayoutTheme>;
  themeOverrides: PropType<LayoutThemeOverrides>;
  builtinThemeOverrides: PropType<LayoutThemeOverrides>;
}>, {
  scrollTo: ((options: ScrollToOptions) => void) & ((x: number, y: number) => void);
  mergedClsPrefix: Ref<string, string>;
  scrollableElRef: Ref<HTMLElement | null, HTMLElement | null>;
  scrollbarInstRef: unknown;
  hasSiderStyle: CSSProperties;
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
  handleNativeElScroll: (e: Event) => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  embedded: BooleanConstructor;
  position: {
    readonly type: PropType<"static" | "absolute">;
    readonly default: "static";
  };
  nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  scrollbarProps: PropType<Partial<ScrollbarProps>>;
  onScroll: PropType<(e: Event) => void>;
  contentClass: StringConstructor;
  contentStyle: {
    readonly type: PropType<string | CSSProperties>;
    readonly default: "";
  };
  hasSider: BooleanConstructor;
  siderPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  theme: PropType<LayoutTheme>;
  themeOverrides: PropType<LayoutThemeOverrides>;
  builtinThemeOverrides: PropType<LayoutThemeOverrides>;
}>> & Readonly<{}>, {
  position: "absolute" | "static";
  contentStyle: string | CSSProperties;
  embedded: boolean;
  nativeScrollbar: boolean;
  hasSider: boolean;
  siderPlacement: "left" | "right";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  embedded: BooleanConstructor;
  position: {
    readonly type: PropType<"static" | "absolute">;
    readonly default: "static";
  };
  nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  scrollbarProps: PropType<Partial<ScrollbarProps>>;
  onScroll: PropType<(e: Event) => void>;
  contentClass: StringConstructor;
  contentStyle: {
    readonly type: PropType<string | CSSProperties>;
    readonly default: "";
  };
  hasSider: BooleanConstructor;
  siderPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  theme: PropType<LayoutTheme>;
  themeOverrides: PropType<LayoutThemeOverrides>;
  builtinThemeOverrides: PropType<LayoutThemeOverrides>;
}>, {
  scrollTo: ((options: ScrollToOptions) => void) & ((x: number, y: number) => void);
  mergedClsPrefix: Ref<string, string>;
  scrollableElRef: Ref<HTMLElement | null, HTMLElement | null>;
  scrollbarInstRef: unknown;
  hasSiderStyle: CSSProperties;
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
  handleNativeElScroll: (e: Event) => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  embedded: BooleanConstructor;
  position: {
    readonly type: PropType<"static" | "absolute">;
    readonly default: "static";
  };
  nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  scrollbarProps: PropType<Partial<ScrollbarProps>>;
  onScroll: PropType<(e: Event) => void>;
  contentClass: StringConstructor;
  contentStyle: {
    readonly type: PropType<string | CSSProperties>;
    readonly default: "";
  };
  hasSider: BooleanConstructor;
  siderPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  theme: PropType<LayoutTheme>;
  themeOverrides: PropType<LayoutThemeOverrides>;
  builtinThemeOverrides: PropType<LayoutThemeOverrides>;
}>> & Readonly<{}>, {
  position: "absolute" | "static";
  contentStyle: string | CSSProperties;
  embedded: boolean;
  nativeScrollbar: boolean;
  hasSider: boolean;
  siderPlacement: "left" | "right";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { LayoutProps, createLayoutComponent, _default as default, layoutInjectionKey, layoutProps };