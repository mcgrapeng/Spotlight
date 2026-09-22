import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { SliderTheme, SliderThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode, VNodeChild } from "vue";
import { FollowerPlacement } from "vueuc";
//#region src/slider/src/Slider.d.ts
interface ClosestMark {
  value: number;
  distance: number;
  index: number;
}
declare const sliderProps: {
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly defaultValue: {
    readonly type: PropType<number | number[]>;
    readonly default: 0;
  };
  readonly marks: PropType<Record<string, string | (() => VNodeChild)>>;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly formatTooltip: PropType<(value: number) => string | number>;
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly min: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly max: {
    readonly type: NumberConstructor;
    readonly default: 100;
  };
  readonly step: {
    readonly type: PropType<number | "mark">;
    readonly default: 1;
  };
  readonly range: BooleanConstructor;
  readonly value: PropType<number | number[]>;
  readonly placement: PropType<FollowerPlacement>;
  readonly showTooltip: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly tooltip: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly vertical: BooleanConstructor;
  readonly reverse: BooleanConstructor;
  readonly 'onUpdate:value': PropType<MaybeArray<(value: number & number[]) => void>>;
  readonly onUpdateValue: PropType<MaybeArray<(value: number & number[]) => void>>;
  readonly onDragstart: PropType<() => void>;
  readonly onDragend: PropType<() => void>;
  readonly theme: PropType<SliderTheme>;
  readonly themeOverrides: PropType<SliderThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SliderThemeOverrides>;
};
type SliderProps = ExtractPublicPropTypes<typeof sliderProps>;
interface SliderSlots {
  thumb?: () => VNode[];
  default?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly defaultValue: {
    readonly type: PropType<number | number[]>;
    readonly default: 0;
  };
  readonly marks: PropType<Record<string, string | (() => VNodeChild)>>;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly formatTooltip: PropType<(value: number) => string | number>;
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly min: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly max: {
    readonly type: NumberConstructor;
    readonly default: 100;
  };
  readonly step: {
    readonly type: PropType<number | "mark">;
    readonly default: 1;
  };
  readonly range: BooleanConstructor;
  readonly value: PropType<number | number[]>;
  readonly placement: PropType<FollowerPlacement>;
  readonly showTooltip: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly tooltip: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly vertical: BooleanConstructor;
  readonly reverse: BooleanConstructor;
  readonly 'onUpdate:value': PropType<MaybeArray<(value: number & number[]) => void>>;
  readonly onUpdateValue: PropType<MaybeArray<(value: number & number[]) => void>>;
  readonly onDragstart: PropType<() => void>;
  readonly onDragend: PropType<() => void>;
  readonly theme: PropType<SliderTheme>;
  readonly themeOverrides: PropType<SliderThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SliderThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  namespace: import("vue").ComputedRef<string | undefined>;
  uncontrolledValue: Ref<number | number[], number | number[]>;
  mergedValue: import("vue").ComputedRef<number | number[]>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  mergedPlacement: import("vue").ComputedRef<FollowerPlacement>;
  isMounted: Readonly<Ref<boolean, boolean>>;
  adjustedTo: import("vue").ComputedRef<string | HTMLElement>;
  dotTransitionDisabled: Ref<boolean, boolean>;
  markInfos: import("vue").ComputedRef<{
    active: boolean;
    label: string | (() => VNodeChild);
    key: number;
    style: CSSProperties;
  }[]>;
  isShowTooltip: (index: number) => boolean;
  shouldKeepTooltipTransition: (index: number) => boolean;
  handleRailRef: Ref<HTMLElement | null, HTMLElement | null>;
  setHandleRefs: (key: number) => (el: any) => void;
  setFollowerRefs: (key: number) => (el: any) => void;
  fillStyle: import("vue").ComputedRef<{
    [x: string]: string;
    height: string;
    width?: undefined;
  } | {
    [x: string]: string;
    width: string;
    height?: undefined;
  } | undefined>;
  getHandleStyle: (value: number, index: number) => Record<string, any>;
  activeIndex: Ref<number, number>;
  arrifiedValues: import("vue").ComputedRef<number[]>;
  followerEnabledIndexSet: Ref<Set<number> & Omit<Set<number>, keyof Set<any>>, Set<number> | (Set<number> & Omit<Set<number>, keyof Set<any>>)>;
  handleRailMouseDown: (event: MouseEvent | TouchEvent) => void;
  handleHandleFocus: (index: number) => void;
  handleHandleBlur: (index: number) => void;
  handleHandleMouseEnter: (index: number) => void;
  handleHandleMouseLeave: (index: number) => void;
  handleRailKeyDown: (e: KeyboardEvent) => void;
  indicatorCssVars: Ref<CSSProperties, CSSProperties> | undefined;
  indicatorThemeClass: Ref<string, string> | undefined;
  indicatorOnRender: (() => void) | undefined;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly defaultValue: {
    readonly type: PropType<number | number[]>;
    readonly default: 0;
  };
  readonly marks: PropType<Record<string, string | (() => VNodeChild)>>;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly formatTooltip: PropType<(value: number) => string | number>;
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly min: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly max: {
    readonly type: NumberConstructor;
    readonly default: 100;
  };
  readonly step: {
    readonly type: PropType<number | "mark">;
    readonly default: 1;
  };
  readonly range: BooleanConstructor;
  readonly value: PropType<number | number[]>;
  readonly placement: PropType<FollowerPlacement>;
  readonly showTooltip: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly tooltip: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly vertical: BooleanConstructor;
  readonly reverse: BooleanConstructor;
  readonly 'onUpdate:value': PropType<MaybeArray<(value: number & number[]) => void>>;
  readonly onUpdateValue: PropType<MaybeArray<(value: number & number[]) => void>>;
  readonly onDragstart: PropType<() => void>;
  readonly onDragend: PropType<() => void>;
  readonly theme: PropType<SliderTheme>;
  readonly themeOverrides: PropType<SliderThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SliderThemeOverrides>;
}>> & Readonly<{}>, {
  readonly reverse: boolean;
  readonly to: string | boolean | HTMLElement;
  readonly max: number;
  readonly disabled: boolean | undefined;
  readonly keyboard: boolean;
  readonly defaultValue: number | number[];
  readonly vertical: boolean;
  readonly min: number;
  readonly range: boolean;
  readonly tooltip: boolean;
  readonly step: number | "mark";
  readonly showTooltip: boolean | undefined;
}, SlotsType<SliderSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ClosestMark, SliderProps, SliderSlots, _default as default, sliderProps };