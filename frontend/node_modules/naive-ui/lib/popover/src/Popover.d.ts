import { ExtractInternalPropTypes, ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { PopoverTheme, PopoverThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { InternalRenderBody, PopoverTrigger } from "./interface.js";
import { CSSProperties, ComputedRef, PropType, Ref, SlotsType, VNode } from "vue";
import { FollowerPlacement } from "vueuc";
//#region src/popover/src/Popover.d.ts
interface TriggerEventHandlers {
  onClick: (e: MouseEvent) => void;
  onMouseenter: (e: MouseEvent) => void;
  onMouseleave: (e: MouseEvent) => void;
  onFocus: (e: FocusEvent) => void;
  onBlur: (e: FocusEvent) => void;
}
interface BodyInstance {
  syncPosition: () => void;
  [key: string]: unknown;
}
interface PopoverInjection {
  handleMouseLeave: (e: MouseEvent) => void;
  handleMouseEnter: (e: MouseEvent) => void;
  handleMouseMoveOutside: (e: MouseEvent) => void;
  handleClickOutside: (e: MouseEvent) => void;
  handleKeydown: (e: KeyboardEvent) => void;
  getTriggerElement: () => HTMLElement;
  setBodyInstance: (value: BodyInstance | null) => void;
  zIndexRef: Ref<number | undefined>;
  internalRenderBodyRef: Ref<InternalRenderBody | undefined>;
  positionManuallyRef: ComputedRef<boolean>;
  isMountedRef: Ref<boolean>;
  extraClassRef: Ref<string[]>;
}
declare const popoverBaseProps: {
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  showArrow: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  delay: {
    type: NumberConstructor;
    default: number;
  };
  duration: {
    type: NumberConstructor;
    default: number;
  };
  raw: BooleanConstructor;
  placement: {
    type: PropType<FollowerPlacement>;
    default: string;
  };
  x: NumberConstructor;
  y: NumberConstructor;
  arrowPointToCenter: BooleanConstructor;
  disabled: BooleanConstructor;
  getDisabled: PropType<() => boolean>;
  displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  arrowClass: StringConstructor;
  arrowStyle: PropType<string | CSSProperties>;
  arrowWrapperClass: StringConstructor;
  arrowWrapperStyle: PropType<string | CSSProperties>;
  flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  animated: {
    type: BooleanConstructor;
    default: boolean;
  };
  width: {
    type: PropType<number | "trigger">;
    default: undefined;
  };
  overlap: BooleanConstructor;
  keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  zIndex: NumberConstructor;
  to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  scrollable: BooleanConstructor;
  contentClass: StringConstructor;
  contentStyle: PropType<CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: PropType<CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<CSSProperties | string>;
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
  arrow: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  minWidth: NumberConstructor;
  maxWidth: NumberConstructor;
};
declare const popoverProps: {
  internalOnAfterLeave: PropType<() => void>;
  internalRenderBody: PropType<InternalRenderBody>;
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  showArrow: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  delay: {
    type: NumberConstructor;
    default: number;
  };
  duration: {
    type: NumberConstructor;
    default: number;
  };
  raw: BooleanConstructor;
  placement: {
    type: PropType<FollowerPlacement>;
    default: string;
  };
  x: NumberConstructor;
  y: NumberConstructor;
  arrowPointToCenter: BooleanConstructor;
  disabled: BooleanConstructor;
  getDisabled: PropType<() => boolean>;
  displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  arrowClass: StringConstructor;
  arrowStyle: PropType<string | CSSProperties>;
  arrowWrapperClass: StringConstructor;
  arrowWrapperStyle: PropType<string | CSSProperties>;
  flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  animated: {
    type: BooleanConstructor;
    default: boolean;
  };
  width: {
    type: PropType<number | "trigger">;
    default: undefined;
  };
  overlap: BooleanConstructor;
  keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  zIndex: NumberConstructor;
  to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  scrollable: BooleanConstructor;
  contentClass: StringConstructor;
  contentStyle: PropType<CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: PropType<CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<CSSProperties | string>;
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
  arrow: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  minWidth: NumberConstructor;
  maxWidth: NumberConstructor;
  theme: PropType<PopoverTheme>;
  themeOverrides: PropType<PopoverThemeOverrides>;
  builtinThemeOverrides: PropType<PopoverThemeOverrides>;
};
type PopoverProps = ExtractPublicPropTypes<typeof popoverBaseProps>;
type PopoverInternalProps = ExtractInternalPropTypes<typeof popoverProps>;
interface PopoverSlots {
  trigger?: () => VNode[];
  footer?: () => VNode[];
  header?: () => VNode[];
  default?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  internalOnAfterLeave: PropType<() => void>;
  internalRenderBody: PropType<InternalRenderBody>;
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  showArrow: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  delay: {
    type: NumberConstructor;
    default: number;
  };
  duration: {
    type: NumberConstructor;
    default: number;
  };
  raw: BooleanConstructor;
  placement: {
    type: PropType<FollowerPlacement>;
    default: string;
  };
  x: NumberConstructor;
  y: NumberConstructor;
  arrowPointToCenter: BooleanConstructor;
  disabled: BooleanConstructor;
  getDisabled: PropType<() => boolean>;
  displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  arrowClass: StringConstructor;
  arrowStyle: PropType<string | CSSProperties>;
  arrowWrapperClass: StringConstructor;
  arrowWrapperStyle: PropType<string | CSSProperties>;
  flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  animated: {
    type: BooleanConstructor;
    default: boolean;
  };
  width: {
    type: PropType<number | "trigger">;
    default: undefined;
  };
  overlap: BooleanConstructor;
  keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  zIndex: NumberConstructor;
  to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  scrollable: BooleanConstructor;
  contentClass: StringConstructor;
  contentStyle: PropType<CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: PropType<CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<CSSProperties | string>;
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
  arrow: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  minWidth: NumberConstructor;
  maxWidth: NumberConstructor;
  theme: PropType<PopoverTheme>;
  themeOverrides: PropType<PopoverThemeOverrides>;
  builtinThemeOverrides: PropType<PopoverThemeOverrides>;
}>, {
  binderInstRef: unknown;
  positionManually: ComputedRef<boolean>;
  mergedShowConsideringDisabledProp: ComputedRef<boolean>;
  uncontrolledShow: Ref<boolean, boolean>;
  mergedShowArrow: ComputedRef<boolean>;
  getMergedShow: () => boolean;
  setShow: (value: boolean) => void;
  handleClick: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleFocus: () => void;
  handleBlur: () => void;
  syncPosition: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  internalOnAfterLeave: PropType<() => void>;
  internalRenderBody: PropType<InternalRenderBody>;
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  showArrow: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  delay: {
    type: NumberConstructor;
    default: number;
  };
  duration: {
    type: NumberConstructor;
    default: number;
  };
  raw: BooleanConstructor;
  placement: {
    type: PropType<FollowerPlacement>;
    default: string;
  };
  x: NumberConstructor;
  y: NumberConstructor;
  arrowPointToCenter: BooleanConstructor;
  disabled: BooleanConstructor;
  getDisabled: PropType<() => boolean>;
  displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  arrowClass: StringConstructor;
  arrowStyle: PropType<string | CSSProperties>;
  arrowWrapperClass: StringConstructor;
  arrowWrapperStyle: PropType<string | CSSProperties>;
  flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  animated: {
    type: BooleanConstructor;
    default: boolean;
  };
  width: {
    type: PropType<number | "trigger">;
    default: undefined;
  };
  overlap: BooleanConstructor;
  keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  zIndex: NumberConstructor;
  to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  scrollable: BooleanConstructor;
  contentClass: StringConstructor;
  contentStyle: PropType<CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: PropType<CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<CSSProperties | string>;
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
  arrow: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  minWidth: NumberConstructor;
  maxWidth: NumberConstructor;
  theme: PropType<PopoverTheme>;
  themeOverrides: PropType<PopoverThemeOverrides>;
  builtinThemeOverrides: PropType<PopoverThemeOverrides>;
}>> & Readonly<{}>, {
  to: string | boolean | HTMLElement;
  raw: boolean;
  show: boolean | undefined;
  disabled: boolean;
  width: number | "trigger";
  duration: number;
  scrollable: boolean;
  trigger: PopoverTrigger;
  placement: FollowerPlacement;
  showArrow: boolean;
  arrow: boolean | undefined;
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
}, SlotsType<PopoverSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { PopoverInjection, PopoverInternalProps, PopoverProps, PopoverSlots, TriggerEventHandlers, _default as default, popoverBaseProps, popoverProps };