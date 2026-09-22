import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { PopoverInst, PopoverTrigger } from "../../popover/src/interface.js";
import { PopoverSlots, TriggerEventHandlers } from "../../popover/src/Popover.js";
import "../../popover/index.js";
import { TooltipTheme, TooltipThemeOverrides, TooltipThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { SlotsType } from "vue";
//#region src/tooltip/src/Tooltip.d.ts
type TooltipInst = PopoverInst;
declare const tooltipProps: {
  theme: import("vue").PropType<TooltipTheme>;
  themeOverrides: import("vue").PropType<TooltipThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<TooltipThemeOverrides>;
  show: {
    type: import("vue").PropType<boolean | undefined>;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  showArrow: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: import("vue").PropType<PopoverTrigger>;
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
    type: import("vue").PropType<import("vueuc").FollowerPlacement>;
    default: string;
  };
  x: NumberConstructor;
  y: NumberConstructor;
  arrowPointToCenter: BooleanConstructor;
  disabled: BooleanConstructor;
  getDisabled: import("vue").PropType<() => boolean>;
  displayDirective: {
    type: import("vue").PropType<"if" | "show">;
    default: string;
  };
  arrowClass: StringConstructor;
  arrowStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  arrowWrapperClass: StringConstructor;
  arrowWrapperStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  animated: {
    type: BooleanConstructor;
    default: boolean;
  };
  width: {
    type: import("vue").PropType<number | "trigger">;
    default: undefined;
  };
  overlap: BooleanConstructor;
  keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  zIndex: NumberConstructor;
  to: {
    type: import("vue").PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  scrollable: BooleanConstructor;
  contentClass: StringConstructor;
  contentStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  onClickoutside: import("vue").PropType<(e: MouseEvent) => void>;
  'onUpdate:show': import("vue").PropType<MaybeArray<(value: boolean) => void>>;
  onUpdateShow: import("vue").PropType<MaybeArray<(value: boolean) => void>>;
  internalDeactivateImmediately: BooleanConstructor;
  internalSyncTargetWithParent: BooleanConstructor;
  internalInheritedEventHandlers: {
    type: import("vue").PropType<TriggerEventHandlers[]>;
    default: () => never[];
  };
  internalTrapFocus: BooleanConstructor;
  internalExtraClass: {
    type: import("vue").PropType<string[]>;
    default: () => never[];
  };
  onShow: import("vue").PropType<MaybeArray<(value: boolean) => void> | undefined>;
  onHide: import("vue").PropType<MaybeArray<(value: boolean) => void> | undefined>;
  arrow: {
    type: import("vue").PropType<boolean | undefined>;
    default: undefined;
  };
  minWidth: NumberConstructor;
  maxWidth: NumberConstructor;
};
type TooltipProps = ExtractPublicPropTypes<typeof tooltipProps>;
interface TooltipSlots extends PopoverSlots {}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  theme: import("vue").PropType<TooltipTheme>;
  themeOverrides: import("vue").PropType<TooltipThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<TooltipThemeOverrides>;
  show: {
    type: import("vue").PropType<boolean | undefined>;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  showArrow: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: import("vue").PropType<PopoverTrigger>;
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
    type: import("vue").PropType<import("vueuc").FollowerPlacement>;
    default: string;
  };
  x: NumberConstructor;
  y: NumberConstructor;
  arrowPointToCenter: BooleanConstructor;
  disabled: BooleanConstructor;
  getDisabled: import("vue").PropType<() => boolean>;
  displayDirective: {
    type: import("vue").PropType<"if" | "show">;
    default: string;
  };
  arrowClass: StringConstructor;
  arrowStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  arrowWrapperClass: StringConstructor;
  arrowWrapperStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  animated: {
    type: BooleanConstructor;
    default: boolean;
  };
  width: {
    type: import("vue").PropType<number | "trigger">;
    default: undefined;
  };
  overlap: BooleanConstructor;
  keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  zIndex: NumberConstructor;
  to: {
    type: import("vue").PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  scrollable: BooleanConstructor;
  contentClass: StringConstructor;
  contentStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  onClickoutside: import("vue").PropType<(e: MouseEvent) => void>;
  'onUpdate:show': import("vue").PropType<MaybeArray<(value: boolean) => void>>;
  onUpdateShow: import("vue").PropType<MaybeArray<(value: boolean) => void>>;
  internalDeactivateImmediately: BooleanConstructor;
  internalSyncTargetWithParent: BooleanConstructor;
  internalInheritedEventHandlers: {
    type: import("vue").PropType<TriggerEventHandlers[]>;
    default: () => never[];
  };
  internalTrapFocus: BooleanConstructor;
  internalExtraClass: {
    type: import("vue").PropType<string[]>;
    default: () => never[];
  };
  onShow: import("vue").PropType<MaybeArray<(value: boolean) => void> | undefined>;
  onHide: import("vue").PropType<MaybeArray<(value: boolean) => void> | undefined>;
  arrow: {
    type: import("vue").PropType<boolean | undefined>;
    default: undefined;
  };
  minWidth: NumberConstructor;
  maxWidth: NumberConstructor;
}>, {
  popoverRef: unknown;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: TooltipThemeVars;
    peers: {
      Popover: PopoverTheme;
    };
    peerOverrides: {
      Popover?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  popoverThemeOverrides: import("vue").ComputedRef<TooltipThemeVars>;
  syncPosition: () => void;
  setShow: (value: boolean) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  theme: import("vue").PropType<TooltipTheme>;
  themeOverrides: import("vue").PropType<TooltipThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<TooltipThemeOverrides>;
  show: {
    type: import("vue").PropType<boolean | undefined>;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  showArrow: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: import("vue").PropType<PopoverTrigger>;
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
    type: import("vue").PropType<import("vueuc").FollowerPlacement>;
    default: string;
  };
  x: NumberConstructor;
  y: NumberConstructor;
  arrowPointToCenter: BooleanConstructor;
  disabled: BooleanConstructor;
  getDisabled: import("vue").PropType<() => boolean>;
  displayDirective: {
    type: import("vue").PropType<"if" | "show">;
    default: string;
  };
  arrowClass: StringConstructor;
  arrowStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  arrowWrapperClass: StringConstructor;
  arrowWrapperStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  animated: {
    type: BooleanConstructor;
    default: boolean;
  };
  width: {
    type: import("vue").PropType<number | "trigger">;
    default: undefined;
  };
  overlap: BooleanConstructor;
  keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  zIndex: NumberConstructor;
  to: {
    type: import("vue").PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  scrollable: BooleanConstructor;
  contentClass: StringConstructor;
  contentStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  onClickoutside: import("vue").PropType<(e: MouseEvent) => void>;
  'onUpdate:show': import("vue").PropType<MaybeArray<(value: boolean) => void>>;
  onUpdateShow: import("vue").PropType<MaybeArray<(value: boolean) => void>>;
  internalDeactivateImmediately: BooleanConstructor;
  internalSyncTargetWithParent: BooleanConstructor;
  internalInheritedEventHandlers: {
    type: import("vue").PropType<TriggerEventHandlers[]>;
    default: () => never[];
  };
  internalTrapFocus: BooleanConstructor;
  internalExtraClass: {
    type: import("vue").PropType<string[]>;
    default: () => never[];
  };
  onShow: import("vue").PropType<MaybeArray<(value: boolean) => void> | undefined>;
  onHide: import("vue").PropType<MaybeArray<(value: boolean) => void> | undefined>;
  arrow: {
    type: import("vue").PropType<boolean | undefined>;
    default: undefined;
  };
  minWidth: NumberConstructor;
  maxWidth: NumberConstructor;
}>> & Readonly<{}>, {
  to: string | boolean | HTMLElement;
  raw: boolean;
  show: boolean | undefined;
  disabled: boolean;
  width: number | "trigger";
  duration: number;
  scrollable: boolean;
  trigger: PopoverTrigger;
  placement: import("vueuc").FollowerPlacement;
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
}, SlotsType<TooltipSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TooltipInst, TooltipProps, TooltipSlots, _default as default, tooltipProps };