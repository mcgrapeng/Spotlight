import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { SplitTheme, SplitThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { SplitOnUpdateSize } from "./types.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/split/src/Split.d.ts
declare const splitProps: {
  readonly direction: {
    readonly type: PropType<"horizontal" | "vertical">;
    readonly default: "horizontal";
  };
  readonly resizeTriggerSize: {
    readonly type: NumberConstructor;
    readonly default: 3;
  };
  readonly disabled: BooleanConstructor;
  readonly defaultSize: {
    readonly type: PropType<string | number>;
    readonly default: 0.5;
  };
  readonly 'onUpdate:size': PropType<SplitOnUpdateSize | SplitOnUpdateSize[]>;
  readonly onUpdateSize: PropType<SplitOnUpdateSize | SplitOnUpdateSize[]>;
  readonly size: PropType<string | number>;
  readonly min: {
    readonly type: PropType<string | number>;
    readonly default: 0;
  };
  readonly max: {
    readonly type: PropType<string | number>;
    readonly default: 1;
  };
  readonly pane1Class: StringConstructor;
  readonly pane1Style: PropType<CSSProperties | string>;
  readonly pane2Class: StringConstructor;
  readonly pane2Style: PropType<CSSProperties | string>;
  readonly onDragStart: PropType<(e: Event) => void>;
  readonly onDragMove: PropType<(e: Event) => void>;
  readonly onDragEnd: PropType<(e: Event) => void>;
  readonly watchProps: PropType<Array<"defaultSize">>;
  readonly theme: PropType<SplitTheme>;
  readonly themeOverrides: PropType<SplitThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SplitThemeOverrides>;
};
type SplitProps = ExtractPublicPropTypes<typeof splitProps>;
interface SplitSlots {
  default?: () => VNode[];
  1?: () => VNode[];
  2?: () => VNode[];
  'resize-trigger'?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly direction: {
    readonly type: PropType<"horizontal" | "vertical">;
    readonly default: "horizontal";
  };
  readonly resizeTriggerSize: {
    readonly type: NumberConstructor;
    readonly default: 3;
  };
  readonly disabled: BooleanConstructor;
  readonly defaultSize: {
    readonly type: PropType<string | number>;
    readonly default: 0.5;
  };
  readonly 'onUpdate:size': PropType<SplitOnUpdateSize | SplitOnUpdateSize[]>;
  readonly onUpdateSize: PropType<SplitOnUpdateSize | SplitOnUpdateSize[]>;
  readonly size: PropType<string | number>;
  readonly min: {
    readonly type: PropType<string | number>;
    readonly default: 0;
  };
  readonly max: {
    readonly type: PropType<string | number>;
    readonly default: 1;
  };
  readonly pane1Class: StringConstructor;
  readonly pane1Style: PropType<CSSProperties | string>;
  readonly pane2Class: StringConstructor;
  readonly pane2Style: PropType<CSSProperties | string>;
  readonly onDragStart: PropType<(e: Event) => void>;
  readonly onDragMove: PropType<(e: Event) => void>;
  readonly onDragEnd: PropType<(e: Event) => void>;
  readonly watchProps: PropType<Array<"defaultSize">>;
  readonly theme: PropType<SplitTheme>;
  readonly themeOverrides: PropType<SplitThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SplitThemeOverrides>;
}>, {
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  resizeTriggerElRef: Ref<HTMLElement | null, HTMLElement | null>;
  isDragging: Ref<boolean, boolean>;
  mergedClsPrefix: Ref<string, string>;
  resizeTriggerWrapperStyle: import("vue").ComputedRef<{
    width: string;
    height: string;
    cursor: string;
  }>;
  resizeTriggerStyle: import("vue").ComputedRef<{
    width: string;
    height: string;
  }>;
  handleMouseDown: (e: MouseEvent) => void;
  firstPaneStyle: import("vue").ComputedRef<{
    flex: string;
  } | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly direction: {
    readonly type: PropType<"horizontal" | "vertical">;
    readonly default: "horizontal";
  };
  readonly resizeTriggerSize: {
    readonly type: NumberConstructor;
    readonly default: 3;
  };
  readonly disabled: BooleanConstructor;
  readonly defaultSize: {
    readonly type: PropType<string | number>;
    readonly default: 0.5;
  };
  readonly 'onUpdate:size': PropType<SplitOnUpdateSize | SplitOnUpdateSize[]>;
  readonly onUpdateSize: PropType<SplitOnUpdateSize | SplitOnUpdateSize[]>;
  readonly size: PropType<string | number>;
  readonly min: {
    readonly type: PropType<string | number>;
    readonly default: 0;
  };
  readonly max: {
    readonly type: PropType<string | number>;
    readonly default: 1;
  };
  readonly pane1Class: StringConstructor;
  readonly pane1Style: PropType<CSSProperties | string>;
  readonly pane2Class: StringConstructor;
  readonly pane2Style: PropType<CSSProperties | string>;
  readonly onDragStart: PropType<(e: Event) => void>;
  readonly onDragMove: PropType<(e: Event) => void>;
  readonly onDragEnd: PropType<(e: Event) => void>;
  readonly watchProps: PropType<Array<"defaultSize">>;
  readonly theme: PropType<SplitTheme>;
  readonly themeOverrides: PropType<SplitThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SplitThemeOverrides>;
}>> & Readonly<{}>, {
  readonly disabled: boolean;
  readonly max: string | number;
  readonly defaultSize: string | number;
  readonly direction: "vertical" | "horizontal";
  readonly min: string | number;
  readonly resizeTriggerSize: number;
}, SlotsType<SplitSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { SplitProps, SplitSlots, _default as default, splitProps };