import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { PopoverTrigger } from "../../popover/src/interface.js";
import { TriggerEventHandlers } from "../../popover/src/Popover.js";
import "../../popover/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ButtonProps } from "../../button/src/Button.js";
import "../../button/index.js";
import { PopconfirmTheme, PopconfirmThemeOverrides, PopconfirmThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { ExtractPropTypes, PropType, SlotsType, VNode } from "vue";
//#region src/popconfirm/src/Popconfirm.d.ts
declare const popconfirmProps: {
  positiveText: PropType<string | null>;
  negativeText: PropType<string | null>;
  showIcon: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  positiveButtonProps: PropType<ButtonProps>;
  negativeButtonProps: PropType<ButtonProps>;
  onPositiveClick: PropType<(e: MouseEvent) => Promise<boolean> | boolean | any>;
  onNegativeClick: PropType<(e: MouseEvent) => Promise<boolean> | boolean | any>;
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  showArrow: {
    type: BooleanConstructor;
    default: boolean;
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
    type: PropType<import("vueuc").FollowerPlacement>;
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
  contentStyle: PropType<import("vue").CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: PropType<import("vue").CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<import("vue").CSSProperties | string>;
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
  theme: PropType<PopconfirmTheme>;
  themeOverrides: PropType<PopconfirmThemeOverrides>;
  builtinThemeOverrides: PropType<PopconfirmThemeOverrides>;
};
type PopconfirmProps = ExtractPublicPropTypes<typeof popconfirmProps>;
type PopconfirmSetupProps = ExtractPropTypes<typeof popconfirmProps>;
interface PopconfirmSlots {
  action?: () => VNode[];
  default?: () => VNode[];
  icon?: () => VNode[];
  trigger?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  positiveText: PropType<string | null>;
  negativeText: PropType<string | null>;
  showIcon: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  positiveButtonProps: PropType<ButtonProps>;
  negativeButtonProps: PropType<ButtonProps>;
  onPositiveClick: PropType<(e: MouseEvent) => Promise<boolean> | boolean | any>;
  onNegativeClick: PropType<(e: MouseEvent) => Promise<boolean> | boolean | any>;
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  showArrow: {
    type: BooleanConstructor;
    default: boolean;
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
    type: PropType<import("vueuc").FollowerPlacement>;
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
  contentStyle: PropType<import("vue").CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: PropType<import("vue").CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<import("vue").CSSProperties | string>;
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
  theme: PropType<PopconfirmTheme>;
  themeOverrides: PropType<PopconfirmThemeOverrides>;
  builtinThemeOverrides: PropType<PopconfirmThemeOverrides>;
}>, {
  setShow(value: boolean): void;
  syncPosition(): void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: PopconfirmThemeVars;
    peers: {
      Button: ButtonTheme;
      Popover: PopoverTheme;
    };
    peerOverrides: {
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Popover?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  popoverInstRef: unknown;
  handlePositiveClick: (e: MouseEvent) => void;
  handleNegativeClick: (e: MouseEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  positiveText: PropType<string | null>;
  negativeText: PropType<string | null>;
  showIcon: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  positiveButtonProps: PropType<ButtonProps>;
  negativeButtonProps: PropType<ButtonProps>;
  onPositiveClick: PropType<(e: MouseEvent) => Promise<boolean> | boolean | any>;
  onNegativeClick: PropType<(e: MouseEvent) => Promise<boolean> | boolean | any>;
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  showArrow: {
    type: BooleanConstructor;
    default: boolean;
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
    type: PropType<import("vueuc").FollowerPlacement>;
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
  contentStyle: PropType<import("vue").CSSProperties | string>;
  headerClass: StringConstructor;
  headerStyle: PropType<import("vue").CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<import("vue").CSSProperties | string>;
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
  theme: PropType<PopconfirmTheme>;
  themeOverrides: PropType<PopconfirmThemeOverrides>;
  builtinThemeOverrides: PropType<PopconfirmThemeOverrides>;
}>> & Readonly<{}>, {
  to: string | boolean | HTMLElement;
  raw: boolean;
  showIcon: boolean;
  width: number | "trigger";
  duration: number;
  scrollable: boolean;
  trigger: PopoverTrigger;
  disabled: boolean;
  placement: import("vueuc").FollowerPlacement;
  show: boolean | undefined;
  defaultShow: boolean;
  showArrow: boolean;
  delay: number;
  arrowPointToCenter: boolean;
  displayDirective: "if" | "show";
  flip: boolean;
  animated: boolean;
  overlap: boolean;
  keepAliveOnHover: boolean;
  internalDeactivateImmediately: boolean;
  internalSyncTargetWithParent: boolean;
  internalInheritedEventHandlers: TriggerEventHandlers[];
  internalTrapFocus: boolean;
  internalExtraClass: string[];
  arrow: boolean | undefined;
}, SlotsType<PopconfirmSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { PopconfirmProps, PopconfirmSetupProps, PopconfirmSlots, _default as default, popconfirmProps };