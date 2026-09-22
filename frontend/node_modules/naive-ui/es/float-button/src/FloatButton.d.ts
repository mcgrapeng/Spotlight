import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { FloatButtonTheme, FloatButtonThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/float-button/src/FloatButton.d.ts
declare const floatButtonProps: {
  readonly width: {
    readonly type: PropType<string | number>;
    readonly default: 40;
  };
  readonly height: {
    readonly type: PropType<string | number>;
    readonly default: 40;
  };
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
  readonly type: {
    readonly type: PropType<"default" | "primary">;
    readonly default: "default";
  };
  readonly menuTrigger: PropType<"hover" | "click">;
  readonly showMenu: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly onUpdateShowMenu: {
    readonly type: PropType<MaybeArray<(value: boolean) => void>>;
    readonly default: undefined;
  };
  readonly 'onUpdate:showMenu': {
    readonly type: PropType<MaybeArray<(value: boolean) => void>>;
    readonly default: undefined;
  };
  readonly theme: PropType<FloatButtonTheme>;
  readonly themeOverrides: PropType<FloatButtonThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FloatButtonThemeOverrides>;
};
type FloatButtonProps = ExtractPublicPropTypes<typeof floatButtonProps>;
interface FloatButtonSlots {
  default?: () => VNode[];
  description?: () => VNode[];
  menu?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly width: {
    readonly type: PropType<string | number>;
    readonly default: 40;
  };
  readonly height: {
    readonly type: PropType<string | number>;
    readonly default: 40;
  };
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
  readonly type: {
    readonly type: PropType<"default" | "primary">;
    readonly default: "default";
  };
  readonly menuTrigger: PropType<"hover" | "click">;
  readonly showMenu: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly onUpdateShowMenu: {
    readonly type: PropType<MaybeArray<(value: boolean) => void>>;
    readonly default: undefined;
  };
  readonly 'onUpdate:showMenu': {
    readonly type: PropType<MaybeArray<(value: boolean) => void>>;
    readonly default: undefined;
  };
  readonly theme: PropType<FloatButtonTheme>;
  readonly themeOverrides: PropType<FloatButtonThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FloatButtonThemeOverrides>;
}>, {
  inlineStyle: import("vue").ComputedRef<CSSProperties>;
  selfElRef: Ref<HTMLDivElement | null, HTMLDivElement | null>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  mergedClsPrefix: Ref<string, string>;
  mergedShape: import("vue").ComputedRef<"circle" | "square">;
  mergedShowMenu: import("vue").ComputedRef<boolean>;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  Mouseenter: () => void;
  handleMouseleave: () => void;
  handleClick: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly width: {
    readonly type: PropType<string | number>;
    readonly default: 40;
  };
  readonly height: {
    readonly type: PropType<string | number>;
    readonly default: 40;
  };
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
  readonly type: {
    readonly type: PropType<"default" | "primary">;
    readonly default: "default";
  };
  readonly menuTrigger: PropType<"hover" | "click">;
  readonly showMenu: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly onUpdateShowMenu: {
    readonly type: PropType<MaybeArray<(value: boolean) => void>>;
    readonly default: undefined;
  };
  readonly 'onUpdate:showMenu': {
    readonly type: PropType<MaybeArray<(value: boolean) => void>>;
    readonly default: undefined;
  };
  readonly theme: PropType<FloatButtonTheme>;
  readonly themeOverrides: PropType<FloatButtonThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FloatButtonThemeOverrides>;
}>> & Readonly<{}>, {
  readonly type: "default" | "primary";
  readonly position: "fixed" | "absolute" | "relative";
  readonly height: string | number;
  readonly width: string | number;
  readonly shape: "circle" | "square";
  readonly showMenu: boolean;
  readonly onUpdateShowMenu: MaybeArray<(value: boolean) => void>;
  readonly 'onUpdate:showMenu': MaybeArray<(value: boolean) => void>;
}, SlotsType<FloatButtonSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { FloatButtonProps, FloatButtonSlots, _default as default, floatButtonProps };