import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ScrollTarget } from "./utils.js";
import { CSSProperties, PropType } from "vue";
//#region src/affix/src/Affix.d.ts
declare const affixProps: {
  readonly listenTo: PropType<string | ScrollTarget | (() => HTMLElement) | undefined>;
  readonly top: NumberConstructor;
  readonly bottom: NumberConstructor;
  readonly triggerTop: NumberConstructor;
  readonly triggerBottom: NumberConstructor;
  readonly position: {
    readonly type: PropType<"fixed" | "absolute">;
    readonly default: "fixed";
  };
  readonly offsetTop: {
    readonly type: PropType<number | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly offsetBottom: {
    readonly type: PropType<number | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly target: {
    readonly type: PropType<(() => HTMLElement) | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
};
declare const affixPropKeys: ("listenTo" | "top" | "bottom" | "triggerTop" | "triggerBottom" | "position" | "offsetTop" | "offsetBottom" | "target")[];
type AffixProps = ExtractPublicPropTypes<typeof affixProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly listenTo: PropType<string | ScrollTarget | (() => HTMLElement) | undefined>;
  readonly top: NumberConstructor;
  readonly bottom: NumberConstructor;
  readonly triggerTop: NumberConstructor;
  readonly triggerBottom: NumberConstructor;
  readonly position: {
    readonly type: PropType<"fixed" | "absolute">;
    readonly default: "fixed";
  };
  readonly offsetTop: {
    readonly type: PropType<number | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly offsetBottom: {
    readonly type: PropType<number | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly target: {
    readonly type: PropType<(() => HTMLElement) | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
}>, {
  selfRef: import("vue").Ref<Element | null, Element | null>;
  affixed: import("vue").ComputedRef<boolean>;
  mergedClsPrefix: import("vue").Ref<string, string>;
  mergedstyle: import("vue").ComputedRef<CSSProperties>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly listenTo: PropType<string | ScrollTarget | (() => HTMLElement) | undefined>;
  readonly top: NumberConstructor;
  readonly bottom: NumberConstructor;
  readonly triggerTop: NumberConstructor;
  readonly triggerBottom: NumberConstructor;
  readonly position: {
    readonly type: PropType<"fixed" | "absolute">;
    readonly default: "fixed";
  };
  readonly offsetTop: {
    readonly type: PropType<number | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly offsetBottom: {
    readonly type: PropType<number | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly target: {
    readonly type: PropType<(() => HTMLElement) | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
}>> & Readonly<{}>, {
  readonly position: "fixed" | "absolute";
  readonly offsetTop: number | undefined;
  readonly offsetBottom: number | undefined;
  readonly target: (() => HTMLElement) | undefined;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { AffixProps, affixPropKeys, affixProps, _default as default };