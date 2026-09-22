import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { SpinTheme, SpinThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/spin/src/Spin.d.ts
declare const spinProps: {
  strokeWidth: NumberConstructor;
  stroke: {
    type: StringConstructor;
    default: undefined;
  };
  scale: {
    type: NumberConstructor;
    default: number;
  };
  radius: {
    type: NumberConstructor;
    default: number;
  };
  contentClass: StringConstructor;
  contentStyle: PropType<CSSProperties | string>;
  description: StringConstructor;
  size: {
    type: PropType<"small" | "medium" | "large" | number>;
    default: string;
  };
  show: {
    type: BooleanConstructor;
    default: boolean;
  };
  rotate: {
    type: BooleanConstructor;
    default: boolean;
  };
  spinning: {
    type: BooleanConstructor;
    validator: () => boolean;
    default: undefined;
  };
  delay: NumberConstructor;
  theme: PropType<SpinTheme>;
  themeOverrides: PropType<SpinThemeOverrides>;
  builtinThemeOverrides: PropType<SpinThemeOverrides>;
};
type SpinProps = ExtractPublicPropTypes<typeof spinProps>;
interface SpinSlots {
  default?: () => VNode[];
  description?: () => VNode[];
  icon?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  strokeWidth: NumberConstructor;
  stroke: {
    type: StringConstructor;
    default: undefined;
  };
  scale: {
    type: NumberConstructor;
    default: number;
  };
  radius: {
    type: NumberConstructor;
    default: number;
  };
  contentClass: StringConstructor;
  contentStyle: PropType<CSSProperties | string>;
  description: StringConstructor;
  size: {
    type: PropType<"small" | "medium" | "large" | number>;
    default: string;
  };
  show: {
    type: BooleanConstructor;
    default: boolean;
  };
  rotate: {
    type: BooleanConstructor;
    default: boolean;
  };
  spinning: {
    type: BooleanConstructor;
    validator: () => boolean;
    default: undefined;
  };
  delay: NumberConstructor;
  theme: PropType<SpinTheme>;
  themeOverrides: PropType<SpinThemeOverrides>;
  builtinThemeOverrides: PropType<SpinThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  active: Ref<boolean, boolean>;
  mergedStrokeWidth: import("vue").ComputedRef<number>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  strokeWidth: NumberConstructor;
  stroke: {
    type: StringConstructor;
    default: undefined;
  };
  scale: {
    type: NumberConstructor;
    default: number;
  };
  radius: {
    type: NumberConstructor;
    default: number;
  };
  contentClass: StringConstructor;
  contentStyle: PropType<CSSProperties | string>;
  description: StringConstructor;
  size: {
    type: PropType<"small" | "medium" | "large" | number>;
    default: string;
  };
  show: {
    type: BooleanConstructor;
    default: boolean;
  };
  rotate: {
    type: BooleanConstructor;
    default: boolean;
  };
  spinning: {
    type: BooleanConstructor;
    validator: () => boolean;
    default: undefined;
  };
  delay: NumberConstructor;
  theme: PropType<SpinTheme>;
  themeOverrides: PropType<SpinThemeOverrides>;
  builtinThemeOverrides: PropType<SpinThemeOverrides>;
}>> & Readonly<{}>, {
  size: number | "large" | "medium" | "small";
  show: boolean;
  stroke: string;
  scale: number;
  radius: number;
  rotate: boolean;
  spinning: boolean;
}, SlotsType<SpinSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { SpinProps, SpinSlots, _default as default, spinProps };