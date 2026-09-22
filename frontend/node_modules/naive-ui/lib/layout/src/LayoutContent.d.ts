import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import "../../_internal/index.js";
import { LayoutTheme, LayoutThemeOverrides, LayoutThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
//#region src/layout/src/LayoutContent.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  embedded: BooleanConstructor;
  position: {
    readonly type: import("vue").PropType<"static" | "absolute">;
    readonly default: "static";
  };
  nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  scrollbarProps: import("vue").PropType<Partial<ScrollbarProps>>;
  onScroll: import("vue").PropType<(e: Event) => void>;
  contentClass: StringConstructor;
  contentStyle: {
    readonly type: import("vue").PropType<string | import("vue").CSSProperties>;
    readonly default: "";
  };
  hasSider: BooleanConstructor;
  siderPlacement: {
    readonly type: import("vue").PropType<"left" | "right">;
    readonly default: "left";
  };
  theme: import("vue").PropType<LayoutTheme>;
  themeOverrides: import("vue").PropType<LayoutThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<LayoutThemeOverrides>;
}>, {
  scrollTo: ((options: ScrollToOptions) => void) & ((x: number, y: number) => void);
  mergedClsPrefix: import("vue").Ref<string, string>;
  scrollableElRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
  scrollbarInstRef: unknown;
  hasSiderStyle: import("vue").CSSProperties;
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
  cssVars: import("vue").Ref<import("vue").CSSProperties, import("vue").CSSProperties> | undefined;
  themeClass: import("vue").Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  embedded: BooleanConstructor;
  position: {
    readonly type: import("vue").PropType<"static" | "absolute">;
    readonly default: "static";
  };
  nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  scrollbarProps: import("vue").PropType<Partial<ScrollbarProps>>;
  onScroll: import("vue").PropType<(e: Event) => void>;
  contentClass: StringConstructor;
  contentStyle: {
    readonly type: import("vue").PropType<string | import("vue").CSSProperties>;
    readonly default: "";
  };
  hasSider: BooleanConstructor;
  siderPlacement: {
    readonly type: import("vue").PropType<"left" | "right">;
    readonly default: "left";
  };
  theme: import("vue").PropType<LayoutTheme>;
  themeOverrides: import("vue").PropType<LayoutThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<LayoutThemeOverrides>;
}>> & Readonly<{}>, {
  position: "absolute" | "static";
  contentStyle: string | import("vue").CSSProperties;
  embedded: boolean;
  nativeScrollbar: boolean;
  hasSider: boolean;
  siderPlacement: "left" | "right";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export = _default;