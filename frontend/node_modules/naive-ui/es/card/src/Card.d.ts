import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { CardTheme, CardThemeOverrides, CardThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { CardSize } from "./public-types.js";
import "../../index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode, VNodeChild } from "vue";
//#region src/card/src/Card.d.ts
interface CardSegmented {
  content?: boolean | 'soft';
  footer?: boolean | 'soft';
  action?: boolean | 'soft';
}
declare const cardBaseProps: {
  readonly title: PropType<string | (() => VNodeChild)>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<CSSProperties | string>;
  readonly contentScrollable: BooleanConstructor;
  readonly headerClass: StringConstructor;
  readonly headerStyle: PropType<CSSProperties | string>;
  readonly headerExtraClass: StringConstructor;
  readonly headerExtraStyle: PropType<CSSProperties | string>;
  readonly footerClass: StringConstructor;
  readonly footerStyle: PropType<CSSProperties | string>;
  readonly embedded: BooleanConstructor;
  readonly segmented: {
    readonly type: PropType<boolean | CardSegmented>;
    readonly default: false;
  };
  readonly size: PropType<CardSize>;
  readonly bordered: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly closable: BooleanConstructor;
  readonly hoverable: BooleanConstructor;
  readonly role: StringConstructor;
  readonly onClose: PropType<MaybeArray<() => void>>;
  readonly tag: {
    readonly type: PropType<keyof HTMLElementTagNameMap>;
    readonly default: "div";
  };
  readonly cover: PropType<() => VNodeChild>;
  readonly content: PropType<string | (() => VNodeChild)>;
  readonly footer: PropType<() => VNodeChild>;
  readonly action: PropType<() => VNodeChild>;
  readonly headerExtra: PropType<() => VNodeChild>;
  readonly closeFocusable: BooleanConstructor;
};
declare const cardBasePropKeys: ("title" | "bordered" | "closable" | "onClose" | "content" | "footer" | "contentClass" | "contentStyle" | "size" | "cover" | "contentScrollable" | "headerClass" | "headerStyle" | "headerExtraClass" | "headerExtraStyle" | "footerClass" | "footerStyle" | "embedded" | "segmented" | "hoverable" | "role" | "tag" | "action" | "headerExtra" | "closeFocusable")[];
declare const cardProps: {
  title: PropType<string | (() => VNodeChild)>;
  contentClass: StringConstructor;
  contentStyle: PropType<CSSProperties | string>;
  contentScrollable: BooleanConstructor;
  headerClass: StringConstructor;
  headerStyle: PropType<CSSProperties | string>;
  headerExtraClass: StringConstructor;
  headerExtraStyle: PropType<CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<CSSProperties | string>;
  embedded: BooleanConstructor;
  segmented: {
    readonly type: PropType<boolean | CardSegmented>;
    readonly default: false;
  };
  size: PropType<CardSize>;
  bordered: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  closable: BooleanConstructor;
  hoverable: BooleanConstructor;
  role: StringConstructor;
  onClose: PropType<MaybeArray<() => void>>;
  tag: {
    readonly type: PropType<keyof HTMLElementTagNameMap>;
    readonly default: "div";
  };
  cover: PropType<() => VNodeChild>;
  content: PropType<string | (() => VNodeChild)>;
  footer: PropType<() => VNodeChild>;
  action: PropType<() => VNodeChild>;
  headerExtra: PropType<() => VNodeChild>;
  closeFocusable: BooleanConstructor;
  theme: PropType<CardTheme>;
  themeOverrides: PropType<CardThemeOverrides>;
  builtinThemeOverrides: PropType<CardThemeOverrides>;
};
type CardProps = ExtractPublicPropTypes<typeof cardProps>;
interface CardSlots {
  default?: () => VNode[];
  cover?: () => VNode[];
  header?: () => VNode[];
  'header-extra'?: () => VNode[];
  footer?: () => VNode[];
  action?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  title: PropType<string | (() => VNodeChild)>;
  contentClass: StringConstructor;
  contentStyle: PropType<CSSProperties | string>;
  contentScrollable: BooleanConstructor;
  headerClass: StringConstructor;
  headerStyle: PropType<CSSProperties | string>;
  headerExtraClass: StringConstructor;
  headerExtraStyle: PropType<CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<CSSProperties | string>;
  embedded: BooleanConstructor;
  segmented: {
    readonly type: PropType<boolean | CardSegmented>;
    readonly default: false;
  };
  size: PropType<CardSize>;
  bordered: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  closable: BooleanConstructor;
  hoverable: BooleanConstructor;
  role: StringConstructor;
  onClose: PropType<MaybeArray<() => void>>;
  tag: {
    readonly type: PropType<keyof HTMLElementTagNameMap>;
    readonly default: "div";
  };
  cover: PropType<() => VNodeChild>;
  content: PropType<string | (() => VNodeChild)>;
  footer: PropType<() => VNodeChild>;
  action: PropType<() => VNodeChild>;
  headerExtra: PropType<() => VNodeChild>;
  closeFocusable: BooleanConstructor;
  theme: PropType<CardTheme>;
  themeOverrides: PropType<CardThemeOverrides>;
  builtinThemeOverrides: PropType<CardThemeOverrides>;
}>, {
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: Ref<string, string>;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: CardThemeVars;
    peers: any;
    peerOverrides: {
      [x: string]: any;
    };
  }>;
  handleCloseClick: () => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  title: PropType<string | (() => VNodeChild)>;
  contentClass: StringConstructor;
  contentStyle: PropType<CSSProperties | string>;
  contentScrollable: BooleanConstructor;
  headerClass: StringConstructor;
  headerStyle: PropType<CSSProperties | string>;
  headerExtraClass: StringConstructor;
  headerExtraStyle: PropType<CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<CSSProperties | string>;
  embedded: BooleanConstructor;
  segmented: {
    readonly type: PropType<boolean | CardSegmented>;
    readonly default: false;
  };
  size: PropType<CardSize>;
  bordered: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  closable: BooleanConstructor;
  hoverable: BooleanConstructor;
  role: StringConstructor;
  onClose: PropType<MaybeArray<() => void>>;
  tag: {
    readonly type: PropType<keyof HTMLElementTagNameMap>;
    readonly default: "div";
  };
  cover: PropType<() => VNodeChild>;
  content: PropType<string | (() => VNodeChild)>;
  footer: PropType<() => VNodeChild>;
  action: PropType<() => VNodeChild>;
  headerExtra: PropType<() => VNodeChild>;
  closeFocusable: BooleanConstructor;
  theme: PropType<CardTheme>;
  themeOverrides: PropType<CardThemeOverrides>;
  builtinThemeOverrides: PropType<CardThemeOverrides>;
}>> & Readonly<{}>, {
  bordered: boolean;
  closable: boolean;
  contentScrollable: boolean;
  embedded: boolean;
  segmented: boolean | CardSegmented;
  hoverable: boolean;
  tag: keyof HTMLElementTagNameMap;
  closeFocusable: boolean;
}, SlotsType<CardSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { CardProps, CardSegmented, CardSlots, cardBasePropKeys, cardBaseProps, cardProps, _default as default };