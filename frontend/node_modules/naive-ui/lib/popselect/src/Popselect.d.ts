import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import { OnUpdateValue, SelectMixedOption, Value } from "../../select/src/interface.js";
import { NodeProps, RenderLabel } from "../../_internal/select-menu/src/interface.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { PopoverTrigger } from "../../popover/src/interface.js";
import { TriggerEventHandlers } from "../../popover/src/Popover.js";
import "../../popover/index.js";
import { PopselectTheme, PopselectThemeOverrides, PopselectThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { PopselectSize } from "./public-types.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { ExtractPropTypes, PropType, SlotsType, VNode } from "vue";
//#region src/popselect/src/Popselect.d.ts
declare const popselectProps: {
  scrollbarProps: PropType<ScrollbarProps>;
  multiple: BooleanConstructor;
  value: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  cancelable: BooleanConstructor;
  options: {
    readonly type: PropType<SelectMixedOption[]>;
    readonly default: () => never[];
  };
  size: PropType<PopselectSize>;
  scrollable: BooleanConstructor;
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  onMouseenter: PropType<(e: MouseEvent) => void>;
  onMouseleave: PropType<(e: MouseEvent) => void>;
  renderLabel: PropType<RenderLabel>;
  showCheckmark: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  nodeProps: PropType<NodeProps>;
  virtualScroll: BooleanConstructor;
  onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  placement: {
    default: string;
    type: PropType<import("vueuc").FollowerPlacement>;
  };
  trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  raw: BooleanConstructor;
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  zIndex: NumberConstructor;
  disabled: BooleanConstructor;
  width: {
    type: PropType<number | "trigger">;
    default: undefined;
  };
  duration: {
    type: NumberConstructor;
    default: number;
  };
  contentClass: StringConstructor;
  contentStyle: PropType<import("vue").CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: PropType<import("vue").CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<import("vue").CSSProperties | string>;
  defaultShow: BooleanConstructor;
  delay: {
    type: NumberConstructor;
    default: number;
  };
  x: NumberConstructor;
  y: NumberConstructor;
  arrowPointToCenter: BooleanConstructor;
  getDisabled: PropType<() => boolean>;
  displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  arrowClass: StringConstructor;
  arrowStyle: PropType<string | import("vue").CSSProperties>;
  arrowWrapperClass: StringConstructor;
  arrowWrapperStyle: PropType<string | import("vue").CSSProperties>;
  flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  animated: {
    type: BooleanConstructor;
    default: boolean;
  };
  overlap: BooleanConstructor;
  keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  onClickoutside: PropType<(e: MouseEvent) => void>;
  'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  internalDeactivateImmediately: BooleanConstructor;
  internalSyncTargetWithParent: BooleanConstructor;
  internalInheritedEventHandlers: {
    type: PropType<TriggerEventHandlers[]>;
    default: () => never[];
  };
  internalTrapFocus: BooleanConstructor;
  internalExtraClass: {
    type: PropType<string[]>;
    default: () => never[];
  };
  onShow: PropType<MaybeArray<(value: boolean) => void> | undefined>;
  onHide: PropType<MaybeArray<(value: boolean) => void> | undefined>;
  minWidth: NumberConstructor;
  maxWidth: NumberConstructor;
  theme: PropType<PopselectTheme>;
  themeOverrides: PropType<PopselectThemeOverrides>;
  builtinThemeOverrides: PropType<PopselectThemeOverrides>;
};
type PopselectSetupProps = ExtractPropTypes<typeof popselectProps>;
type PopselectProps = ExtractPublicPropTypes<typeof popselectProps>;
interface PopselectSlots {
  default?: () => VNode[];
  header?: () => VNode[];
  action?: () => VNode[];
  empty?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  scrollbarProps: PropType<ScrollbarProps>;
  multiple: BooleanConstructor;
  value: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  cancelable: BooleanConstructor;
  options: {
    readonly type: PropType<SelectMixedOption[]>;
    readonly default: () => never[];
  };
  size: PropType<PopselectSize>;
  scrollable: BooleanConstructor;
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  onMouseenter: PropType<(e: MouseEvent) => void>;
  onMouseleave: PropType<(e: MouseEvent) => void>;
  renderLabel: PropType<RenderLabel>;
  showCheckmark: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  nodeProps: PropType<NodeProps>;
  virtualScroll: BooleanConstructor;
  onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  placement: {
    default: string;
    type: PropType<import("vueuc").FollowerPlacement>;
  };
  trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  raw: BooleanConstructor;
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  zIndex: NumberConstructor;
  disabled: BooleanConstructor;
  width: {
    type: PropType<number | "trigger">;
    default: undefined;
  };
  duration: {
    type: NumberConstructor;
    default: number;
  };
  contentClass: StringConstructor;
  contentStyle: PropType<import("vue").CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: PropType<import("vue").CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<import("vue").CSSProperties | string>;
  defaultShow: BooleanConstructor;
  delay: {
    type: NumberConstructor;
    default: number;
  };
  x: NumberConstructor;
  y: NumberConstructor;
  arrowPointToCenter: BooleanConstructor;
  getDisabled: PropType<() => boolean>;
  displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  arrowClass: StringConstructor;
  arrowStyle: PropType<string | import("vue").CSSProperties>;
  arrowWrapperClass: StringConstructor;
  arrowWrapperStyle: PropType<string | import("vue").CSSProperties>;
  flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  animated: {
    type: BooleanConstructor;
    default: boolean;
  };
  overlap: BooleanConstructor;
  keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  onClickoutside: PropType<(e: MouseEvent) => void>;
  'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  internalDeactivateImmediately: BooleanConstructor;
  internalSyncTargetWithParent: BooleanConstructor;
  internalInheritedEventHandlers: {
    type: PropType<TriggerEventHandlers[]>;
    default: () => never[];
  };
  internalTrapFocus: BooleanConstructor;
  internalExtraClass: {
    type: PropType<string[]>;
    default: () => never[];
  };
  onShow: PropType<MaybeArray<(value: boolean) => void> | undefined>;
  onHide: PropType<MaybeArray<(value: boolean) => void> | undefined>;
  minWidth: NumberConstructor;
  maxWidth: NumberConstructor;
  theme: PropType<PopselectTheme>;
  themeOverrides: PropType<PopselectThemeOverrides>;
  builtinThemeOverrides: PropType<PopselectThemeOverrides>;
}>, {
  popoverInstRef: unknown;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: PopselectThemeVars;
    peers: {
      Popover: PopoverTheme;
      InternalSelectMenu: InternalSelectMenuTheme;
    };
    peerOverrides: {
      Popover?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
      InternalSelectMenu?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Empty?: ExtractThemeOverrides<EmptyTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  syncPosition: () => void;
  setShow: (value: boolean) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  scrollbarProps: PropType<ScrollbarProps>;
  multiple: BooleanConstructor;
  value: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  cancelable: BooleanConstructor;
  options: {
    readonly type: PropType<SelectMixedOption[]>;
    readonly default: () => never[];
  };
  size: PropType<PopselectSize>;
  scrollable: BooleanConstructor;
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  onMouseenter: PropType<(e: MouseEvent) => void>;
  onMouseleave: PropType<(e: MouseEvent) => void>;
  renderLabel: PropType<RenderLabel>;
  showCheckmark: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  nodeProps: PropType<NodeProps>;
  virtualScroll: BooleanConstructor;
  onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  placement: {
    default: string;
    type: PropType<import("vueuc").FollowerPlacement>;
  };
  trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  raw: BooleanConstructor;
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  zIndex: NumberConstructor;
  disabled: BooleanConstructor;
  width: {
    type: PropType<number | "trigger">;
    default: undefined;
  };
  duration: {
    type: NumberConstructor;
    default: number;
  };
  contentClass: StringConstructor;
  contentStyle: PropType<import("vue").CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: PropType<import("vue").CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<import("vue").CSSProperties | string>;
  defaultShow: BooleanConstructor;
  delay: {
    type: NumberConstructor;
    default: number;
  };
  x: NumberConstructor;
  y: NumberConstructor;
  arrowPointToCenter: BooleanConstructor;
  getDisabled: PropType<() => boolean>;
  displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  arrowClass: StringConstructor;
  arrowStyle: PropType<string | import("vue").CSSProperties>;
  arrowWrapperClass: StringConstructor;
  arrowWrapperStyle: PropType<string | import("vue").CSSProperties>;
  flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  animated: {
    type: BooleanConstructor;
    default: boolean;
  };
  overlap: BooleanConstructor;
  keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  onClickoutside: PropType<(e: MouseEvent) => void>;
  'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  internalDeactivateImmediately: BooleanConstructor;
  internalSyncTargetWithParent: BooleanConstructor;
  internalInheritedEventHandlers: {
    type: PropType<TriggerEventHandlers[]>;
    default: () => never[];
  };
  internalTrapFocus: BooleanConstructor;
  internalExtraClass: {
    type: PropType<string[]>;
    default: () => never[];
  };
  onShow: PropType<MaybeArray<(value: boolean) => void> | undefined>;
  onHide: PropType<MaybeArray<(value: boolean) => void> | undefined>;
  minWidth: NumberConstructor;
  maxWidth: NumberConstructor;
  theme: PropType<PopselectTheme>;
  themeOverrides: PropType<PopselectThemeOverrides>;
  builtinThemeOverrides: PropType<PopselectThemeOverrides>;
}>> & Readonly<{}>, {
  to: string | boolean | HTMLElement;
  raw: boolean;
  value: Value | null;
  show: boolean | undefined;
  disabled: boolean;
  width: number | "trigger";
  duration: number;
  scrollable: boolean;
  trigger: PopoverTrigger;
  placement: import("vueuc").FollowerPlacement;
  options: SelectMixedOption[];
  defaultShow: boolean;
  delay: number;
  arrowPointToCenter: boolean;
  displayDirective: "show" | "if";
  flip: boolean;
  animated: boolean;
  overlap: boolean;
  keepAliveOnHover: boolean;
  internalDeactivateImmediately: boolean;
  internalSyncTargetWithParent: boolean;
  internalInheritedEventHandlers: TriggerEventHandlers[];
  internalTrapFocus: boolean;
  internalExtraClass: string[];
  multiple: boolean;
  virtualScroll: boolean;
  showCheckmark: boolean;
  cancelable: boolean;
}, SlotsType<PopselectSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { PopselectProps, PopselectSetupProps, PopselectSlots, _default as default, popselectProps };