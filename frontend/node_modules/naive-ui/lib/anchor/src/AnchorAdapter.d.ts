import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ScrollTarget } from "../../affix/src/utils.js";
import { OffsetTarget } from "./utils.js";
import { AnchorTheme, AnchorThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
//#region src/anchor/src/AnchorAdapter.d.ts
interface AnchorInst {
  scrollTo: (href: string) => void;
}
declare const anchorProps: {
  readonly type: {
    readonly type: import("vue").PropType<"block" | "rail">;
    readonly default: "rail";
  };
  readonly showRail: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showBackground: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly bound: {
    readonly type: NumberConstructor;
    readonly default: 12;
  };
  readonly internalScrollable: BooleanConstructor;
  readonly ignoreGap: BooleanConstructor;
  readonly offsetTarget: import("vue").PropType<string | OffsetTarget | (() => HTMLElement)>;
  readonly listenTo: import("vue").PropType<string | ScrollTarget | (() => HTMLElement) | undefined>;
  readonly top: NumberConstructor;
  readonly bottom: NumberConstructor;
  readonly triggerTop: NumberConstructor;
  readonly triggerBottom: NumberConstructor;
  readonly position: {
    readonly type: import("vue").PropType<"fixed" | "absolute">;
    readonly default: "fixed";
  };
  readonly offsetTop: {
    readonly type: import("vue").PropType<number | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly offsetBottom: {
    readonly type: import("vue").PropType<number | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly target: {
    readonly type: import("vue").PropType<(() => HTMLElement) | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly affix: BooleanConstructor;
  readonly theme: import("vue").PropType<AnchorTheme>;
  readonly themeOverrides: import("vue").PropType<AnchorThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<AnchorThemeOverrides>;
};
type AnchorProps = ExtractPublicPropTypes<typeof anchorProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly type: {
    readonly type: import("vue").PropType<"block" | "rail">;
    readonly default: "rail";
  };
  readonly showRail: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showBackground: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly bound: {
    readonly type: NumberConstructor;
    readonly default: 12;
  };
  readonly internalScrollable: BooleanConstructor;
  readonly ignoreGap: BooleanConstructor;
  readonly offsetTarget: import("vue").PropType<string | OffsetTarget | (() => HTMLElement)>;
  readonly listenTo: import("vue").PropType<string | ScrollTarget | (() => HTMLElement) | undefined>;
  readonly top: NumberConstructor;
  readonly bottom: NumberConstructor;
  readonly triggerTop: NumberConstructor;
  readonly triggerBottom: NumberConstructor;
  readonly position: {
    readonly type: import("vue").PropType<"fixed" | "absolute">;
    readonly default: "fixed";
  };
  readonly offsetTop: {
    readonly type: import("vue").PropType<number | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly offsetBottom: {
    readonly type: import("vue").PropType<number | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly target: {
    readonly type: import("vue").PropType<(() => HTMLElement) | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly affix: BooleanConstructor;
  readonly theme: import("vue").PropType<AnchorTheme>;
  readonly themeOverrides: import("vue").PropType<AnchorThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<AnchorThemeOverrides>;
}>, {
  scrollTo(href: string): void;
  renderAnchor: () => JSX.Element;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly type: {
    readonly type: import("vue").PropType<"block" | "rail">;
    readonly default: "rail";
  };
  readonly showRail: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showBackground: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly bound: {
    readonly type: NumberConstructor;
    readonly default: 12;
  };
  readonly internalScrollable: BooleanConstructor;
  readonly ignoreGap: BooleanConstructor;
  readonly offsetTarget: import("vue").PropType<string | OffsetTarget | (() => HTMLElement)>;
  readonly listenTo: import("vue").PropType<string | ScrollTarget | (() => HTMLElement) | undefined>;
  readonly top: NumberConstructor;
  readonly bottom: NumberConstructor;
  readonly triggerTop: NumberConstructor;
  readonly triggerBottom: NumberConstructor;
  readonly position: {
    readonly type: import("vue").PropType<"fixed" | "absolute">;
    readonly default: "fixed";
  };
  readonly offsetTop: {
    readonly type: import("vue").PropType<number | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly offsetBottom: {
    readonly type: import("vue").PropType<number | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly target: {
    readonly type: import("vue").PropType<(() => HTMLElement) | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly affix: BooleanConstructor;
  readonly theme: import("vue").PropType<AnchorTheme>;
  readonly themeOverrides: import("vue").PropType<AnchorThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<AnchorThemeOverrides>;
}>> & Readonly<{}>, {
  readonly type: "block" | "rail";
  readonly showRail: boolean;
  readonly showBackground: boolean;
  readonly bound: number;
  readonly internalScrollable: boolean;
  readonly ignoreGap: boolean;
  readonly position: "fixed" | "absolute";
  readonly offsetTop: number | undefined;
  readonly offsetBottom: number | undefined;
  readonly target: (() => HTMLElement) | undefined;
  readonly affix: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { AnchorInst, AnchorProps, anchorProps, _default as default };