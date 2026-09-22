import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { FloatButtonGroupTheme, FloatButtonGroupThemeOverrides } from "../styles/light.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/float-button-group/src/FloatButtonGroup.d.ts
interface ButtonGroupInjection {
  shapeRef: Ref<'circle' | 'square'>;
}
declare const floatButtonGroupProps: {
  readonly left: PropType<string | number>;
  readonly right: PropType<string | number>;
  readonly top: PropType<string | number>;
  readonly bottom: PropType<string | number>;
  readonly shape: {
    readonly type: PropType<"square" | "circle">;
    readonly default: "circle";
  };
  readonly position: {
    readonly type: PropType<"relative" | "absolute" | "fixed">;
    readonly default: "fixed";
  };
  readonly theme: PropType<FloatButtonGroupTheme>;
  readonly themeOverrides: PropType<FloatButtonGroupThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FloatButtonGroupThemeOverrides>;
};
type FloatButtonGroupProps = ExtractPublicPropTypes<typeof floatButtonGroupProps>;
declare const floatButtonGroupInjectionKey: import("vue").InjectionKey<ButtonGroupInjection>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly left: PropType<string | number>;
  readonly right: PropType<string | number>;
  readonly top: PropType<string | number>;
  readonly bottom: PropType<string | number>;
  readonly shape: {
    readonly type: PropType<"square" | "circle">;
    readonly default: "circle";
  };
  readonly position: {
    readonly type: PropType<"relative" | "absolute" | "fixed">;
    readonly default: "fixed";
  };
  readonly theme: PropType<FloatButtonGroupTheme>;
  readonly themeOverrides: PropType<FloatButtonGroupThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FloatButtonGroupThemeOverrides>;
}>, {
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  mergedClsPrefix: Ref<string, string>;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly left: PropType<string | number>;
  readonly right: PropType<string | number>;
  readonly top: PropType<string | number>;
  readonly bottom: PropType<string | number>;
  readonly shape: {
    readonly type: PropType<"square" | "circle">;
    readonly default: "circle";
  };
  readonly position: {
    readonly type: PropType<"relative" | "absolute" | "fixed">;
    readonly default: "fixed";
  };
  readonly theme: PropType<FloatButtonGroupTheme>;
  readonly themeOverrides: PropType<FloatButtonGroupThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FloatButtonGroupThemeOverrides>;
}>> & Readonly<{}>, {
  readonly position: "fixed" | "absolute" | "relative";
  readonly shape: "circle" | "square";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ButtonGroupInjection, FloatButtonGroupProps, _default as default, floatButtonGroupInjectionKey, floatButtonGroupProps };