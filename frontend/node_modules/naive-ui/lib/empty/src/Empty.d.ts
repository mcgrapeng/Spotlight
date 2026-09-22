import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { EmptyTheme, EmptyThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode, VNodeChild } from "vue";
//#region src/empty/src/Empty.d.ts
declare const emptyProps: {
  description: StringConstructor;
  showDescription: {
    type: BooleanConstructor;
    default: boolean;
  };
  showIcon: {
    type: BooleanConstructor;
    default: boolean;
  };
  size: {
    type: PropType<"tiny" | "small" | "medium" | "large" | "huge">;
    default: string;
  };
  renderIcon: PropType<() => VNodeChild>;
  theme: PropType<EmptyTheme>;
  themeOverrides: PropType<EmptyThemeOverrides>;
  builtinThemeOverrides: PropType<EmptyThemeOverrides>;
};
type EmptyProps = ExtractPublicPropTypes<typeof emptyProps>;
interface EmptySlots {
  default?: () => VNode[];
  extra?: () => VNode[];
  icon?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  description: StringConstructor;
  showDescription: {
    type: BooleanConstructor;
    default: boolean;
  };
  showIcon: {
    type: BooleanConstructor;
    default: boolean;
  };
  size: {
    type: PropType<"tiny" | "small" | "medium" | "large" | "huge">;
    default: string;
  };
  renderIcon: PropType<() => VNodeChild>;
  theme: PropType<EmptyTheme>;
  themeOverrides: PropType<EmptyThemeOverrides>;
  builtinThemeOverrides: PropType<EmptyThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  mergedRenderIcon: import("vue").ComputedRef<() => VNodeChild>;
  localizedDescription: import("vue").ComputedRef<string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  description: StringConstructor;
  showDescription: {
    type: BooleanConstructor;
    default: boolean;
  };
  showIcon: {
    type: BooleanConstructor;
    default: boolean;
  };
  size: {
    type: PropType<"tiny" | "small" | "medium" | "large" | "huge">;
    default: string;
  };
  renderIcon: PropType<() => VNodeChild>;
  theme: PropType<EmptyTheme>;
  themeOverrides: PropType<EmptyThemeOverrides>;
  builtinThemeOverrides: PropType<EmptyThemeOverrides>;
}>> & Readonly<{}>, {
  showIcon: boolean;
  size: "small" | "medium" | "large" | "huge" | "tiny";
  showDescription: boolean;
}, SlotsType<EmptySlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { EmptyProps, EmptySlots, _default as default, emptyProps };