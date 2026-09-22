import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { BackTopTheme, BackTopThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/back-top/src/BackTop.d.ts
declare const backTopProps: {
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly right: {
    readonly type: PropType<string | number>;
    readonly default: 40;
  };
  readonly bottom: {
    readonly type: PropType<string | number>;
    readonly default: 40;
  };
  readonly to: {
    readonly type: PropType<HTMLElement | string>;
    readonly default: "body";
  };
  readonly visibilityHeight: {
    readonly type: NumberConstructor;
    readonly default: 180;
  };
  readonly listenTo: PropType<string | HTMLElement | Document | (() => HTMLElement | Document)>;
  readonly 'onUpdate:show': {
    readonly type: FunctionConstructor;
    readonly default: () => void;
  };
  readonly target: PropType<() => HTMLElement>;
  readonly onShow: PropType<() => void>;
  readonly onHide: PropType<() => void>;
  readonly theme: PropType<BackTopTheme>;
  readonly themeOverrides: PropType<BackTopThemeOverrides>;
  readonly builtinThemeOverrides: PropType<BackTopThemeOverrides>;
};
type BackTopProps = ExtractPublicPropTypes<typeof backTopProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly right: {
    readonly type: PropType<string | number>;
    readonly default: 40;
  };
  readonly bottom: {
    readonly type: PropType<string | number>;
    readonly default: 40;
  };
  readonly to: {
    readonly type: PropType<HTMLElement | string>;
    readonly default: "body";
  };
  readonly visibilityHeight: {
    readonly type: NumberConstructor;
    readonly default: 180;
  };
  readonly listenTo: PropType<string | HTMLElement | Document | (() => HTMLElement | Document)>;
  readonly 'onUpdate:show': {
    readonly type: FunctionConstructor;
    readonly default: () => void;
  };
  readonly target: PropType<() => HTMLElement>;
  readonly onShow: PropType<() => void>;
  readonly onHide: PropType<() => void>;
  readonly theme: PropType<BackTopTheme>;
  readonly themeOverrides: PropType<BackTopThemeOverrides>;
  readonly builtinThemeOverrides: PropType<BackTopThemeOverrides>;
}>, {
  placeholderRef: Ref<HTMLElement | null, HTMLElement | null>;
  style: import("vue").ComputedRef<{
    right: string;
    bottom: string;
  }>;
  mergedShow: import("vue").ComputedRef<boolean>;
  isMounted: Readonly<Ref<boolean, boolean>>;
  scrollElement: Ref<null, null>;
  scrollTop: Ref<number | null, number | null>;
  DomInfoReady: Ref<boolean, boolean>;
  transitionDisabled: Ref<boolean, boolean>;
  mergedClsPrefix: Ref<string, string>;
  handleAfterEnter: () => void;
  handleScroll: () => void;
  handleClick: () => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly right: {
    readonly type: PropType<string | number>;
    readonly default: 40;
  };
  readonly bottom: {
    readonly type: PropType<string | number>;
    readonly default: 40;
  };
  readonly to: {
    readonly type: PropType<HTMLElement | string>;
    readonly default: "body";
  };
  readonly visibilityHeight: {
    readonly type: NumberConstructor;
    readonly default: 180;
  };
  readonly listenTo: PropType<string | HTMLElement | Document | (() => HTMLElement | Document)>;
  readonly 'onUpdate:show': {
    readonly type: FunctionConstructor;
    readonly default: () => void;
  };
  readonly target: PropType<() => HTMLElement>;
  readonly onShow: PropType<() => void>;
  readonly onHide: PropType<() => void>;
  readonly theme: PropType<BackTopTheme>;
  readonly themeOverrides: PropType<BackTopThemeOverrides>;
  readonly builtinThemeOverrides: PropType<BackTopThemeOverrides>;
}>> & Readonly<{}>, {
  readonly to: string | HTMLElement;
  readonly bottom: string | number;
  readonly right: string | number;
  readonly show: boolean | undefined;
  readonly 'onUpdate:show': Function;
  readonly visibilityHeight: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { BackTopProps, backTopProps, _default as default };