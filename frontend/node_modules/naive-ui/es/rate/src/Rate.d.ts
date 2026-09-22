import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { RateSize } from "./public-types.js";
import { RateTheme, RateThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { RateOnUpdateValue } from "./interface.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/rate/src/Rate.d.ts
declare const rateProps: {
  readonly allowHalf: BooleanConstructor;
  readonly count: {
    readonly type: NumberConstructor;
    readonly default: 5;
  };
  readonly value: NumberConstructor;
  readonly defaultValue: {
    readonly type: PropType<number | null>;
    readonly default: null;
  };
  readonly readonly: BooleanConstructor;
  readonly size: PropType<RateSize>;
  readonly clearable: BooleanConstructor;
  readonly color: StringConstructor;
  readonly onClear: PropType<() => void>;
  readonly 'onUpdate:value': PropType<MaybeArray<RateOnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<RateOnUpdateValue>>;
  readonly 'onUpdate:hoverValue': PropType<MaybeArray<RateOnUpdateValue>>;
  readonly onUpdateHoverValue: PropType<MaybeArray<RateOnUpdateValue>>;
  readonly theme: PropType<RateTheme>;
  readonly themeOverrides: PropType<RateThemeOverrides>;
  readonly builtinThemeOverrides: PropType<RateThemeOverrides>;
};
type RateProps = ExtractPublicPropTypes<typeof rateProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly allowHalf: BooleanConstructor;
  readonly count: {
    readonly type: NumberConstructor;
    readonly default: 5;
  };
  readonly value: NumberConstructor;
  readonly defaultValue: {
    readonly type: PropType<number | null>;
    readonly default: null;
  };
  readonly readonly: BooleanConstructor;
  readonly size: PropType<RateSize>;
  readonly clearable: BooleanConstructor;
  readonly color: StringConstructor;
  readonly onClear: PropType<() => void>;
  readonly 'onUpdate:value': PropType<MaybeArray<RateOnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<RateOnUpdateValue>>;
  readonly 'onUpdate:hoverValue': PropType<MaybeArray<RateOnUpdateValue>>;
  readonly onUpdateHoverValue: PropType<MaybeArray<RateOnUpdateValue>>;
  readonly theme: PropType<RateTheme>;
  readonly themeOverrides: PropType<RateThemeOverrides>;
  readonly builtinThemeOverrides: PropType<RateThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  mergedValue: import("vue").ComputedRef<number | null>;
  hoverIndex: Ref<number | null, number | null>;
  handleMouseMove: (index: number, e: MouseEvent) => void;
  handleClick: (index: number, e: MouseEvent) => void;
  handleMouseLeave: () => void;
  handleMouseEnterSomeStar: () => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly allowHalf: BooleanConstructor;
  readonly count: {
    readonly type: NumberConstructor;
    readonly default: 5;
  };
  readonly value: NumberConstructor;
  readonly defaultValue: {
    readonly type: PropType<number | null>;
    readonly default: null;
  };
  readonly readonly: BooleanConstructor;
  readonly size: PropType<RateSize>;
  readonly clearable: BooleanConstructor;
  readonly color: StringConstructor;
  readonly onClear: PropType<() => void>;
  readonly 'onUpdate:value': PropType<MaybeArray<RateOnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<RateOnUpdateValue>>;
  readonly 'onUpdate:hoverValue': PropType<MaybeArray<RateOnUpdateValue>>;
  readonly onUpdateHoverValue: PropType<MaybeArray<RateOnUpdateValue>>;
  readonly theme: PropType<RateTheme>;
  readonly themeOverrides: PropType<RateThemeOverrides>;
  readonly builtinThemeOverrides: PropType<RateThemeOverrides>;
}>> & Readonly<{}>, {
  readonly clearable: boolean;
  readonly defaultValue: number | null;
  readonly readonly: boolean;
  readonly allowHalf: boolean;
  readonly count: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { RateProps, _default as default, rateProps };