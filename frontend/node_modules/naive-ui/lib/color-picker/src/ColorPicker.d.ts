import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ColorPickerTheme, ColorPickerThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { OnClear, OnUpdateValue, RenderLabel } from "./interface.js";
import { ColorPickerSize } from "./public-types.js";
import { ActionType, ColorPickerMode } from "./utils.js";
import { CSSProperties, ComponentPublicInstance, PropType, Ref, SlotsType, VNode } from "vue";
import { FollowerPlacement } from "vueuc";
import { HSLA, RGBA } from "seemly";
//#region src/color-picker/src/ColorPicker.d.ts
declare const colorPickerProps: {
  readonly value: PropType<string | null>;
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly defaultShow: BooleanConstructor;
  readonly defaultValue: PropType<string | null>;
  readonly modes: {
    readonly type: PropType<ColorPickerMode[]>;
    readonly default: () => string[];
  };
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly showAlpha: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showPreview: BooleanConstructor;
  readonly swatches: PropType<string[]>;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly actions: {
    readonly type: PropType<ActionType[]>;
    readonly default: null;
  };
  readonly internalActions: PropType<ReadonlyArray<"redo" | "undo">>;
  readonly size: PropType<ColorPickerSize>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly onComplete: PropType<OnUpdateValue>;
  readonly onConfirm: PropType<OnUpdateValue>;
  readonly onClear: PropType<OnClear>;
  readonly 'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<ColorPickerTheme>;
  readonly themeOverrides: PropType<ColorPickerThemeOverrides>;
  readonly builtinThemeOverrides: PropType<ColorPickerThemeOverrides>;
};
type ColorPickerProps = ExtractPublicPropTypes<typeof colorPickerProps>;
interface ColorPickerSlots {
  default?: () => VNode[];
  label?: (color: string | null) => VNode[];
  action?: () => VNode[];
  trigger?: (props: {
    value: string | null;
    onClick: (() => void) | undefined;
    ref: (el: any) => void;
  }) => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly value: PropType<string | null>;
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly defaultShow: BooleanConstructor;
  readonly defaultValue: PropType<string | null>;
  readonly modes: {
    readonly type: PropType<ColorPickerMode[]>;
    readonly default: () => string[];
  };
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly showAlpha: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showPreview: BooleanConstructor;
  readonly swatches: PropType<string[]>;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly actions: {
    readonly type: PropType<ActionType[]>;
    readonly default: null;
  };
  readonly internalActions: PropType<ReadonlyArray<"redo" | "undo">>;
  readonly size: PropType<ColorPickerSize>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly onComplete: PropType<OnUpdateValue>;
  readonly onConfirm: PropType<OnUpdateValue>;
  readonly onClear: PropType<OnClear>;
  readonly 'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<ColorPickerTheme>;
  readonly themeOverrides: PropType<ColorPickerThemeOverrides>;
  readonly builtinThemeOverrides: PropType<ColorPickerThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  namespace: import("vue").ComputedRef<string | undefined>;
  hsla: import("vue").ComputedRef<HSLA | null>;
  rgba: import("vue").ComputedRef<RGBA | null>;
  mergedShow: import("vue").ComputedRef<boolean>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  isMounted: Readonly<Ref<boolean, boolean>>;
  adjustedTo: import("vue").ComputedRef<string | HTMLElement>;
  mergedValue: import("vue").ComputedRef<string | null>;
  handleTriggerClick(): void;
  setTriggerRef: (el: Element | ComponentPublicInstance | null) => void;
  handleClickOutside(e: MouseEvent): void;
  renderPanel: () => VNode;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly value: PropType<string | null>;
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly defaultShow: BooleanConstructor;
  readonly defaultValue: PropType<string | null>;
  readonly modes: {
    readonly type: PropType<ColorPickerMode[]>;
    readonly default: () => string[];
  };
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly showAlpha: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showPreview: BooleanConstructor;
  readonly swatches: PropType<string[]>;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly actions: {
    readonly type: PropType<ActionType[]>;
    readonly default: null;
  };
  readonly internalActions: PropType<ReadonlyArray<"redo" | "undo">>;
  readonly size: PropType<ColorPickerSize>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly onComplete: PropType<OnUpdateValue>;
  readonly onConfirm: PropType<OnUpdateValue>;
  readonly onClear: PropType<OnClear>;
  readonly 'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<ColorPickerTheme>;
  readonly themeOverrides: PropType<ColorPickerThemeOverrides>;
  readonly builtinThemeOverrides: PropType<ColorPickerThemeOverrides>;
}>> & Readonly<{}>, {
  readonly to: string | boolean | HTMLElement;
  readonly show: boolean | undefined;
  readonly disabled: boolean | undefined;
  readonly placement: FollowerPlacement;
  readonly defaultShow: boolean;
  readonly modes: ColorPickerMode[];
  readonly showAlpha: boolean;
  readonly showPreview: boolean;
  readonly actions: ActionType[];
}, SlotsType<ColorPickerSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ColorPickerProps, ColorPickerSlots, colorPickerProps, _default as default };