import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import "../../_internal/index.js";
import { DrawerTheme, DrawerThemeOverrides, DrawerThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { Placement } from "./DrawerBodyWrapper.js";
import "../../index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/drawer/src/Drawer.d.ts
declare const drawerProps: {
  readonly show: BooleanConstructor;
  readonly width: PropType<string | number>;
  readonly height: PropType<string | number>;
  readonly placement: {
    readonly type: PropType<Placement>;
    readonly default: "right";
  };
  readonly maskClosable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showMask: {
    readonly type: PropType<boolean | "transparent">;
    readonly default: true;
  };
  readonly to: PropType<string | HTMLElement>;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show">;
    readonly default: "if";
  };
  readonly nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly zIndex: NumberConstructor;
  readonly onMaskClick: PropType<(e: MouseEvent) => void>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly trapFocus: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onEsc: PropType<() => void>;
  readonly autoFocus: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly closeOnEsc: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly blockScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly maxWidth: NumberConstructor;
  readonly maxHeight: NumberConstructor;
  readonly minWidth: NumberConstructor;
  readonly minHeight: NumberConstructor;
  readonly resizable: BooleanConstructor;
  readonly defaultWidth: {
    readonly type: PropType<string | number>;
    readonly default: 251;
  };
  readonly defaultHeight: {
    readonly type: PropType<string | number>;
    readonly default: 251;
  };
  readonly onUpdateWidth: PropType<MaybeArray<(value: number) => void>>;
  readonly onUpdateHeight: PropType<MaybeArray<(value: number) => void>>;
  readonly 'onUpdate:width': PropType<MaybeArray<(value: number) => void>>;
  readonly 'onUpdate:height': PropType<MaybeArray<(value: number) => void>>;
  readonly 'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  readonly onAfterEnter: PropType<() => void>;
  readonly onAfterLeave: PropType<() => void>;
  /** @deprecated */
  readonly drawerStyle: PropType<string | CSSProperties>;
  readonly drawerClass: StringConstructor;
  readonly target: null;
  readonly onShow: PropType<(value: boolean) => void>;
  readonly onHide: PropType<(value: boolean) => void>;
  readonly theme: PropType<DrawerTheme>;
  readonly themeOverrides: PropType<DrawerThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DrawerThemeOverrides>;
};
type DrawerProps = ExtractPublicPropTypes<typeof drawerProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly show: BooleanConstructor;
  readonly width: PropType<string | number>;
  readonly height: PropType<string | number>;
  readonly placement: {
    readonly type: PropType<Placement>;
    readonly default: "right";
  };
  readonly maskClosable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showMask: {
    readonly type: PropType<boolean | "transparent">;
    readonly default: true;
  };
  readonly to: PropType<string | HTMLElement>;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show">;
    readonly default: "if";
  };
  readonly nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly zIndex: NumberConstructor;
  readonly onMaskClick: PropType<(e: MouseEvent) => void>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly trapFocus: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onEsc: PropType<() => void>;
  readonly autoFocus: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly closeOnEsc: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly blockScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly maxWidth: NumberConstructor;
  readonly maxHeight: NumberConstructor;
  readonly minWidth: NumberConstructor;
  readonly minHeight: NumberConstructor;
  readonly resizable: BooleanConstructor;
  readonly defaultWidth: {
    readonly type: PropType<string | number>;
    readonly default: 251;
  };
  readonly defaultHeight: {
    readonly type: PropType<string | number>;
    readonly default: 251;
  };
  readonly onUpdateWidth: PropType<MaybeArray<(value: number) => void>>;
  readonly onUpdateHeight: PropType<MaybeArray<(value: number) => void>>;
  readonly 'onUpdate:width': PropType<MaybeArray<(value: number) => void>>;
  readonly 'onUpdate:height': PropType<MaybeArray<(value: number) => void>>;
  readonly 'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  readonly onAfterEnter: PropType<() => void>;
  readonly onAfterLeave: PropType<() => void>;
  /** @deprecated */
  readonly drawerStyle: PropType<string | CSSProperties>;
  readonly drawerClass: StringConstructor;
  readonly target: null;
  readonly onShow: PropType<(value: boolean) => void>;
  readonly onHide: PropType<(value: boolean) => void>;
  readonly theme: PropType<DrawerTheme>;
  readonly themeOverrides: PropType<DrawerThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DrawerThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  namespace: import("vue").ComputedRef<string | undefined>;
  mergedBodyStyle: import("vue").ComputedRef<(string | CSSProperties)[]>;
  handleOutsideClick: (e: MouseEvent) => void;
  handleMaskClick: (e: MouseEvent) => void;
  handleEsc: (e: KeyboardEvent) => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: DrawerThemeVars;
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
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  isMounted: Readonly<Ref<boolean, boolean>>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly show: BooleanConstructor;
  readonly width: PropType<string | number>;
  readonly height: PropType<string | number>;
  readonly placement: {
    readonly type: PropType<Placement>;
    readonly default: "right";
  };
  readonly maskClosable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showMask: {
    readonly type: PropType<boolean | "transparent">;
    readonly default: true;
  };
  readonly to: PropType<string | HTMLElement>;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show">;
    readonly default: "if";
  };
  readonly nativeScrollbar: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly zIndex: NumberConstructor;
  readonly onMaskClick: PropType<(e: MouseEvent) => void>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly trapFocus: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onEsc: PropType<() => void>;
  readonly autoFocus: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly closeOnEsc: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly blockScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly maxWidth: NumberConstructor;
  readonly maxHeight: NumberConstructor;
  readonly minWidth: NumberConstructor;
  readonly minHeight: NumberConstructor;
  readonly resizable: BooleanConstructor;
  readonly defaultWidth: {
    readonly type: PropType<string | number>;
    readonly default: 251;
  };
  readonly defaultHeight: {
    readonly type: PropType<string | number>;
    readonly default: 251;
  };
  readonly onUpdateWidth: PropType<MaybeArray<(value: number) => void>>;
  readonly onUpdateHeight: PropType<MaybeArray<(value: number) => void>>;
  readonly 'onUpdate:width': PropType<MaybeArray<(value: number) => void>>;
  readonly 'onUpdate:height': PropType<MaybeArray<(value: number) => void>>;
  readonly 'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  readonly onAfterEnter: PropType<() => void>;
  readonly onAfterLeave: PropType<() => void>;
  /** @deprecated */
  readonly drawerStyle: PropType<string | CSSProperties>;
  readonly drawerClass: StringConstructor;
  readonly target: null;
  readonly onShow: PropType<(value: boolean) => void>;
  readonly onHide: PropType<(value: boolean) => void>;
  readonly theme: PropType<DrawerTheme>;
  readonly themeOverrides: PropType<DrawerThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DrawerThemeOverrides>;
}>> & Readonly<{}>, {
  readonly show: boolean;
  readonly placement: Placement;
  readonly displayDirective: "show" | "if";
  readonly resizable: boolean;
  readonly blockScroll: boolean;
  readonly closeOnEsc: boolean;
  readonly autoFocus: boolean;
  readonly maskClosable: boolean;
  readonly showMask: boolean | "transparent";
  readonly nativeScrollbar: boolean;
  readonly trapFocus: boolean;
  readonly defaultWidth: string | number;
  readonly defaultHeight: string | number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { DrawerProps, _default as default, drawerProps };