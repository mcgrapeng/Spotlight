import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { Addable, OnBeforeLeave, OnClose, OnUpdateValue, TabsType } from "./interface.js";
import { TabsSize } from "./public-types.js";
import { TabsTheme, TabsThemeOverrides, TabsThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, ExtractPropTypes, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/tabs/src/Tabs.d.ts
declare const tabsProps: {
  readonly value: PropType<string | number>;
  readonly defaultValue: PropType<string | number>;
  readonly trigger: {
    readonly type: PropType<"click" | "hover">;
    readonly default: "click";
  };
  readonly type: {
    readonly type: PropType<TabsType>;
    readonly default: "bar";
  };
  readonly closable: BooleanConstructor;
  readonly justifyContent: PropType<"space-between" | "space-around" | "space-evenly" | "center" | "start" | "end">;
  readonly size: PropType<TabsSize>;
  readonly placement: {
    readonly type: PropType<"top" | "right" | "bottom" | "left" | "start" | "end">;
    readonly default: "top";
  };
  readonly tabStyle: PropType<string | CSSProperties>;
  readonly tabClass: StringConstructor;
  readonly addTabStyle: PropType<string | CSSProperties>;
  readonly addTabClass: StringConstructor;
  readonly barWidth: NumberConstructor;
  readonly paneClass: StringConstructor;
  readonly paneStyle: PropType<string | CSSProperties>;
  readonly paneWrapperClass: StringConstructor;
  readonly paneWrapperStyle: PropType<string | CSSProperties>;
  readonly addable: PropType<Addable>;
  readonly tabsPadding: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly animated: BooleanConstructor;
  readonly onBeforeLeave: PropType<OnBeforeLeave>;
  readonly onAdd: PropType<() => void>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onClose: PropType<MaybeArray<OnClose>>;
  readonly labelSize: PropType<TabsSize>;
  readonly activeName: PropType<string | number>;
  readonly onActiveNameChange: PropType<MaybeArray<(value: string & number) => void>>;
  readonly showScrollButton: BooleanConstructor;
  readonly centerActiveTab: BooleanConstructor;
  readonly theme: PropType<TabsTheme>;
  readonly themeOverrides: PropType<TabsThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TabsThemeOverrides>;
};
type TabsProps = ExtractPublicPropTypes<typeof tabsProps>;
interface TabsSlots {
  default?: () => VNode[];
  prefix?: () => VNode[];
  suffix?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  readonly value: PropType<string | number>;
  readonly defaultValue: PropType<string | number>;
  readonly trigger: {
    readonly type: PropType<"click" | "hover">;
    readonly default: "click";
  };
  readonly type: {
    readonly type: PropType<TabsType>;
    readonly default: "bar";
  };
  readonly closable: BooleanConstructor;
  readonly justifyContent: PropType<"space-between" | "space-around" | "space-evenly" | "center" | "start" | "end">;
  readonly size: PropType<TabsSize>;
  readonly placement: {
    readonly type: PropType<"top" | "right" | "bottom" | "left" | "start" | "end">;
    readonly default: "top";
  };
  readonly tabStyle: PropType<string | CSSProperties>;
  readonly tabClass: StringConstructor;
  readonly addTabStyle: PropType<string | CSSProperties>;
  readonly addTabClass: StringConstructor;
  readonly barWidth: NumberConstructor;
  readonly paneClass: StringConstructor;
  readonly paneStyle: PropType<string | CSSProperties>;
  readonly paneWrapperClass: StringConstructor;
  readonly paneWrapperStyle: PropType<string | CSSProperties>;
  readonly addable: PropType<Addable>;
  readonly tabsPadding: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly animated: BooleanConstructor;
  readonly onBeforeLeave: PropType<OnBeforeLeave>;
  readonly onAdd: PropType<() => void>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onClose: PropType<MaybeArray<OnClose>>;
  readonly labelSize: PropType<TabsSize>;
  readonly activeName: PropType<string | number>;
  readonly onActiveNameChange: PropType<MaybeArray<(value: string & number) => void>>;
  readonly showScrollButton: BooleanConstructor;
  readonly centerActiveTab: BooleanConstructor;
  readonly theme: PropType<TabsTheme>;
  readonly themeOverrides: PropType<TabsThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TabsThemeOverrides>;
}>, {
  syncBarPosition: () => void;
  scrollToCurrentTab: () => void;
  mergedClsPrefix: Ref<string, string>;
  mergedValue: import("vue").ComputedRef<string | number | null>;
  renderedNames: Set<NonNullable<string | number>>;
  segmentCapsuleElRef: Ref<HTMLElement | null, HTMLElement | null>;
  tabsPaneWrapperRef: Ref<HTMLElement | null, HTMLElement | null>;
  tabsElRef: Ref<HTMLElement | null, HTMLElement | null>;
  selfElRef: Ref<HTMLElement | null, HTMLElement | null>;
  barElRef: Ref<HTMLElement | null, HTMLElement | null>;
  addTabInstRef: unknown;
  xScrollInstRef: unknown;
  scrollWrapperElRef: Ref<HTMLElement | null, HTMLElement | null>;
  addTabFixed: Ref<boolean, boolean>;
  tabWrapperStyle: import("vue").ComputedRef<{
    display: string;
    justifyContent: "center" | "start" | "end" | "space-around" | "space-between" | "space-evenly";
  } | undefined>;
  handleNavResize: (entry: ResizeObserverEntry) => void;
  mergedSize: import("vue").ComputedRef<TabsSize>;
  handleScroll: (e: Event) => void;
  handleTabsResize: (entry: ResizeObserverEntry) => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  animationDirection: Ref<"prev" | "next", "prev" | "next">;
  renderNameListRef: {
    value: Array<string | number>;
  };
  yScrollElRef: Ref<HTMLElement | null, HTMLElement | null>;
  handleSegmentResize: () => void;
  onAnimationBeforeLeave: (el: HTMLElement) => void;
  onAnimationEnter: (el: HTMLElement) => void;
  onAnimationAfterEnter: () => void;
  onRender: (() => void) | undefined;
  startReachedRef: Ref<boolean, boolean>;
  endReachedRef: Ref<boolean, boolean>;
  isOverflow: Ref<boolean, boolean>;
  handleButtonClick: (type: string) => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: TabsThemeVars;
    peers: {
      Button: ButtonTheme;
    };
    peerOverrides: {
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedPlacement: import("vue").ComputedRef<"top" | "bottom" | "left" | "right">;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  readonly value: PropType<string | number>;
  readonly defaultValue: PropType<string | number>;
  readonly trigger: {
    readonly type: PropType<"click" | "hover">;
    readonly default: "click";
  };
  readonly type: {
    readonly type: PropType<TabsType>;
    readonly default: "bar";
  };
  readonly closable: BooleanConstructor;
  readonly justifyContent: PropType<"space-between" | "space-around" | "space-evenly" | "center" | "start" | "end">;
  readonly size: PropType<TabsSize>;
  readonly placement: {
    readonly type: PropType<"top" | "right" | "bottom" | "left" | "start" | "end">;
    readonly default: "top";
  };
  readonly tabStyle: PropType<string | CSSProperties>;
  readonly tabClass: StringConstructor;
  readonly addTabStyle: PropType<string | CSSProperties>;
  readonly addTabClass: StringConstructor;
  readonly barWidth: NumberConstructor;
  readonly paneClass: StringConstructor;
  readonly paneStyle: PropType<string | CSSProperties>;
  readonly paneWrapperClass: StringConstructor;
  readonly paneWrapperStyle: PropType<string | CSSProperties>;
  readonly addable: PropType<Addable>;
  readonly tabsPadding: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly animated: BooleanConstructor;
  readonly onBeforeLeave: PropType<OnBeforeLeave>;
  readonly onAdd: PropType<() => void>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onClose: PropType<MaybeArray<OnClose>>;
  readonly labelSize: PropType<TabsSize>;
  readonly activeName: PropType<string | number>;
  readonly onActiveNameChange: PropType<MaybeArray<(value: string & number) => void>>;
  readonly showScrollButton: BooleanConstructor;
  readonly centerActiveTab: BooleanConstructor;
  readonly theme: PropType<TabsTheme>;
  readonly themeOverrides: PropType<TabsThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TabsThemeOverrides>;
}>> & Readonly<{}>, {
  readonly type: TabsType;
  readonly closable: boolean;
  readonly trigger: "hover" | "click";
  readonly placement: "top" | "bottom" | "left" | "right" | "start" | "end";
  readonly animated: boolean;
  readonly tabsPadding: number;
  readonly showScrollButton: boolean;
  readonly centerActiveTab: boolean;
}, SlotsType<TabsSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TabsProps, TabsSlots, _default as default, tabsProps };