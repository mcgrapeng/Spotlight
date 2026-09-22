import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ButtonTheme, ButtonThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { ButtonSize, ButtonSpinProps, ButtonType } from "./public-types.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { ButtonHTMLAttributes, CSSProperties, ExtractPropTypes, PropType, Ref, SlotsType, VNode, VNodeChild } from "vue";
//#region src/button/src/Button.d.ts
declare const buttonProps: {
  readonly color: StringConstructor;
  readonly textColor: StringConstructor;
  readonly text: BooleanConstructor;
  readonly block: BooleanConstructor;
  readonly loading: BooleanConstructor;
  readonly disabled: BooleanConstructor;
  readonly circle: BooleanConstructor;
  readonly size: PropType<ButtonSize>;
  readonly ghost: BooleanConstructor;
  readonly round: BooleanConstructor;
  readonly secondary: BooleanConstructor;
  readonly tertiary: BooleanConstructor;
  readonly quaternary: BooleanConstructor;
  readonly strong: BooleanConstructor;
  readonly focusable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly tag: {
    readonly type: PropType<keyof HTMLElementTagNameMap>;
    readonly default: "button";
  };
  readonly type: {
    readonly type: PropType<ButtonType>;
    readonly default: "default";
  };
  readonly dashed: BooleanConstructor;
  readonly renderIcon: PropType<() => VNodeChild>;
  readonly iconPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  readonly attrType: {
    readonly type: PropType<"button" | "submit" | "reset">;
    readonly default: "button";
  };
  readonly bordered: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onClick: PropType<MaybeArray<(e: MouseEvent) => void>>;
  readonly nativeFocusBehavior: {
    readonly type: BooleanConstructor;
    readonly default: boolean;
  };
  readonly spinProps: PropType<ButtonSpinProps>;
  readonly theme: PropType<ButtonTheme>;
  readonly themeOverrides: PropType<ButtonThemeOverrides>;
  readonly builtinThemeOverrides: PropType<ButtonThemeOverrides>;
};
type ButtonProps = ExtractPublicPropTypes<typeof buttonProps>;
interface ButtonSlots {
  default?: () => VNode[];
  icon?: () => VNode[];
}
declare const Button: import("vue").DefineComponent<ExtractPropTypes<{
  readonly color: StringConstructor;
  readonly textColor: StringConstructor;
  readonly text: BooleanConstructor;
  readonly block: BooleanConstructor;
  readonly loading: BooleanConstructor;
  readonly disabled: BooleanConstructor;
  readonly circle: BooleanConstructor;
  readonly size: PropType<ButtonSize>;
  readonly ghost: BooleanConstructor;
  readonly round: BooleanConstructor;
  readonly secondary: BooleanConstructor;
  readonly tertiary: BooleanConstructor;
  readonly quaternary: BooleanConstructor;
  readonly strong: BooleanConstructor;
  readonly focusable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly tag: {
    readonly type: PropType<keyof HTMLElementTagNameMap>;
    readonly default: "button";
  };
  readonly type: {
    readonly type: PropType<ButtonType>;
    readonly default: "default";
  };
  readonly dashed: BooleanConstructor;
  readonly renderIcon: PropType<() => VNodeChild>;
  readonly iconPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  readonly attrType: {
    readonly type: PropType<"button" | "submit" | "reset">;
    readonly default: "button";
  };
  readonly bordered: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onClick: PropType<MaybeArray<(e: MouseEvent) => void>>;
  readonly nativeFocusBehavior: {
    readonly type: BooleanConstructor;
    readonly default: boolean;
  };
  readonly spinProps: PropType<ButtonSpinProps>;
  readonly theme: PropType<ButtonTheme>;
  readonly themeOverrides: PropType<ButtonThemeOverrides>;
  readonly builtinThemeOverrides: PropType<ButtonThemeOverrides>;
}>, {
  selfElRef: Ref<HTMLElement | null, HTMLElement | null>;
  waveElRef: unknown;
  mergedClsPrefix: Ref<string, string>;
  mergedFocusable: import("vue").ComputedRef<boolean>;
  mergedSize: import("vue").ComputedRef<"small" | "medium" | "large" | "tiny">;
  showBorder: import("vue").ComputedRef<boolean>;
  enterPressed: Ref<boolean, boolean>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  handleMousedown: (e: MouseEvent) => void;
  handleKeydown: (e: KeyboardEvent) => void;
  handleBlur: () => void;
  handleKeyup: (e: KeyboardEvent) => void;
  handleClick: (e: MouseEvent) => void;
  customColorCssVars: Ref<CSSProperties>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  readonly color: StringConstructor;
  readonly textColor: StringConstructor;
  readonly text: BooleanConstructor;
  readonly block: BooleanConstructor;
  readonly loading: BooleanConstructor;
  readonly disabled: BooleanConstructor;
  readonly circle: BooleanConstructor;
  readonly size: PropType<ButtonSize>;
  readonly ghost: BooleanConstructor;
  readonly round: BooleanConstructor;
  readonly secondary: BooleanConstructor;
  readonly tertiary: BooleanConstructor;
  readonly quaternary: BooleanConstructor;
  readonly strong: BooleanConstructor;
  readonly focusable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly tag: {
    readonly type: PropType<keyof HTMLElementTagNameMap>;
    readonly default: "button";
  };
  readonly type: {
    readonly type: PropType<ButtonType>;
    readonly default: "default";
  };
  readonly dashed: BooleanConstructor;
  readonly renderIcon: PropType<() => VNodeChild>;
  readonly iconPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  readonly attrType: {
    readonly type: PropType<"button" | "submit" | "reset">;
    readonly default: "button";
  };
  readonly bordered: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onClick: PropType<MaybeArray<(e: MouseEvent) => void>>;
  readonly nativeFocusBehavior: {
    readonly type: BooleanConstructor;
    readonly default: boolean;
  };
  readonly spinProps: PropType<ButtonSpinProps>;
  readonly theme: PropType<ButtonTheme>;
  readonly themeOverrides: PropType<ButtonThemeOverrides>;
  readonly builtinThemeOverrides: PropType<ButtonThemeOverrides>;
}>> & Readonly<{}>, {
  readonly loading: boolean;
  readonly strong: boolean;
  readonly block: boolean;
  readonly type: ButtonType;
  readonly bordered: boolean;
  readonly tertiary: boolean;
  readonly text: boolean;
  readonly disabled: boolean;
  readonly circle: boolean;
  readonly ghost: boolean;
  readonly round: boolean;
  readonly secondary: boolean;
  readonly quaternary: boolean;
  readonly focusable: boolean;
  readonly keyboard: boolean;
  readonly tag: keyof HTMLElementTagNameMap;
  readonly dashed: boolean;
  readonly iconPlacement: "left" | "right";
  readonly attrType: "button" | "submit" | "reset";
  readonly nativeFocusBehavior: boolean;
}, SlotsType<ButtonSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
type InternalButtonProps = ExtractPropTypes<typeof buttonProps>;
type NativeButtonProps = Omit<ButtonHTMLAttributes, keyof InternalButtonProps>;
type MergedProps = Partial<InternalButtonProps & NativeButtonProps>;
declare const XButton: new () => {
  $props: MergedProps;
};
//#endregion
export { ButtonProps, ButtonSlots, XButton, buttonProps, Button as default };