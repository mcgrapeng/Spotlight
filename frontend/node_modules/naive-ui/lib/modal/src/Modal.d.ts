import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ButtonProps } from "../../button/src/Button.js";
import { CardSize } from "../../card/src/public-types.js";
import { CardSegmented, CardSlots } from "../../card/src/Card.js";
import "../../card/index.js";
import { IconPlacement } from "../../dialog/src/interface.js";
import { ModalTheme, ModalThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { ModalDraggableOptions } from "./interface.js";
import { DialogSlots } from "../../dialog/src/Dialog.js";
import "../../dialog/index.js";
import "../../index.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/modal/src/Modal.d.ts
declare const modalProps: {
  draggable: PropType<boolean | ModalDraggableOptions>;
  onEsc: PropType<() => void>;
  'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  onAfterEnter: PropType<() => void>;
  onBeforeLeave: PropType<() => void>;
  onAfterLeave: PropType<() => void>;
  onClose: PropType<() => Promise<boolean> | boolean | any>;
  onPositiveClick: PropType<() => Promise<boolean> | boolean | any>;
  onNegativeClick: PropType<() => Promise<boolean> | boolean | any>;
  onMaskClick: PropType<(e: MouseEvent) => void>;
  internalDialog: BooleanConstructor;
  internalModal: BooleanConstructor;
  internalAppear: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  overlayStyle: PropType<string | CSSProperties>;
  onBeforeHide: PropType<() => void>;
  onAfterHide: PropType<() => void>;
  onHide: PropType<(value: false) => void>;
  unstableShowMask: {
    type: BooleanConstructor;
    default: undefined;
  };
  icon: PropType<() => import("vue").VNodeChild>;
  type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "default">;
    readonly default: "default";
  };
  title: PropType<string | (() => import("vue").VNodeChild)>;
  closable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  negativeText: StringConstructor;
  positiveText: StringConstructor;
  positiveButtonProps: PropType<ButtonProps>;
  negativeButtonProps: PropType<ButtonProps>;
  content: PropType<string | (() => import("vue").VNodeChild)>;
  action: PropType<() => import("vue").VNodeChild>;
  showIcon: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  loading: BooleanConstructor;
  bordered: BooleanConstructor;
  iconPlacement: PropType<IconPlacement>;
  titleClass: PropType<string | Array<string | undefined>>;
  titleStyle: PropType<string | CSSProperties>;
  contentClass: PropType<string | Array<string | undefined>>;
  contentStyle: PropType<string | CSSProperties>;
  actionClass: PropType<string | Array<string | undefined>>;
  actionStyle: PropType<string | CSSProperties>;
  closeFocusable: BooleanConstructor;
  contentScrollable: BooleanConstructor;
  headerClass: StringConstructor;
  headerStyle: PropType<CSSProperties | string>;
  headerExtraClass: StringConstructor;
  headerExtraStyle: PropType<CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<CSSProperties | string>;
  embedded: BooleanConstructor;
  segmented: {
    readonly type: PropType<boolean | CardSegmented>;
    readonly default: false;
  };
  size: PropType<CardSize>;
  hoverable: BooleanConstructor;
  role: StringConstructor;
  tag: {
    readonly type: PropType<keyof HTMLElementTagNameMap>;
    readonly default: "div";
  };
  cover: PropType<() => import("vue").VNodeChild>;
  footer: PropType<() => import("vue").VNodeChild>;
  headerExtra: PropType<() => import("vue").VNodeChild>;
  show: BooleanConstructor;
  showMask: {
    type: BooleanConstructor;
    default: boolean;
  };
  maskClosable: {
    type: BooleanConstructor;
    default: boolean;
  };
  preset: PropType<"confirm" | "dialog" | "card">;
  to: PropType<string | HTMLElement>;
  displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  transformOrigin: {
    type: PropType<"center" | "mouse">;
    default: string;
  };
  zIndex: NumberConstructor;
  autoFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  trapFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  closeOnEsc: {
    type: BooleanConstructor;
    default: boolean;
  };
  blockScroll: {
    type: BooleanConstructor;
    default: boolean;
  };
  theme: PropType<ModalTheme>;
  themeOverrides: PropType<ModalThemeOverrides>;
  builtinThemeOverrides: PropType<ModalThemeOverrides>;
};
type ModalProps = ExtractPublicPropTypes<typeof modalProps>;
type ModalSlots = Omit<CardSlots & DialogSlots, 'default'> & {
  default?: (props: {
    draggableClass: string;
  }) => VNode[];
};
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  draggable: PropType<boolean | ModalDraggableOptions>;
  onEsc: PropType<() => void>;
  'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  onAfterEnter: PropType<() => void>;
  onBeforeLeave: PropType<() => void>;
  onAfterLeave: PropType<() => void>;
  onClose: PropType<() => Promise<boolean> | boolean | any>;
  onPositiveClick: PropType<() => Promise<boolean> | boolean | any>;
  onNegativeClick: PropType<() => Promise<boolean> | boolean | any>;
  onMaskClick: PropType<(e: MouseEvent) => void>;
  internalDialog: BooleanConstructor;
  internalModal: BooleanConstructor;
  internalAppear: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  overlayStyle: PropType<string | CSSProperties>;
  onBeforeHide: PropType<() => void>;
  onAfterHide: PropType<() => void>;
  onHide: PropType<(value: false) => void>;
  unstableShowMask: {
    type: BooleanConstructor;
    default: undefined;
  };
  icon: PropType<() => import("vue").VNodeChild>;
  type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "default">;
    readonly default: "default";
  };
  title: PropType<string | (() => import("vue").VNodeChild)>;
  closable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  negativeText: StringConstructor;
  positiveText: StringConstructor;
  positiveButtonProps: PropType<ButtonProps>;
  negativeButtonProps: PropType<ButtonProps>;
  content: PropType<string | (() => import("vue").VNodeChild)>;
  action: PropType<() => import("vue").VNodeChild>;
  showIcon: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  loading: BooleanConstructor;
  bordered: BooleanConstructor;
  iconPlacement: PropType<IconPlacement>;
  titleClass: PropType<string | Array<string | undefined>>;
  titleStyle: PropType<string | CSSProperties>;
  contentClass: PropType<string | Array<string | undefined>>;
  contentStyle: PropType<string | CSSProperties>;
  actionClass: PropType<string | Array<string | undefined>>;
  actionStyle: PropType<string | CSSProperties>;
  closeFocusable: BooleanConstructor;
  contentScrollable: BooleanConstructor;
  headerClass: StringConstructor;
  headerStyle: PropType<CSSProperties | string>;
  headerExtraClass: StringConstructor;
  headerExtraStyle: PropType<CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<CSSProperties | string>;
  embedded: BooleanConstructor;
  segmented: {
    readonly type: PropType<boolean | CardSegmented>;
    readonly default: false;
  };
  size: PropType<CardSize>;
  hoverable: BooleanConstructor;
  role: StringConstructor;
  tag: {
    readonly type: PropType<keyof HTMLElementTagNameMap>;
    readonly default: "div";
  };
  cover: PropType<() => import("vue").VNodeChild>;
  footer: PropType<() => import("vue").VNodeChild>;
  headerExtra: PropType<() => import("vue").VNodeChild>;
  show: BooleanConstructor;
  showMask: {
    type: BooleanConstructor;
    default: boolean;
  };
  maskClosable: {
    type: BooleanConstructor;
    default: boolean;
  };
  preset: PropType<"confirm" | "dialog" | "card">;
  to: PropType<string | HTMLElement>;
  displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  transformOrigin: {
    type: PropType<"center" | "mouse">;
    default: string;
  };
  zIndex: NumberConstructor;
  autoFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  trapFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  closeOnEsc: {
    type: BooleanConstructor;
    default: boolean;
  };
  blockScroll: {
    type: BooleanConstructor;
    default: boolean;
  };
  theme: PropType<ModalTheme>;
  themeOverrides: PropType<ModalThemeOverrides>;
  builtinThemeOverrides: PropType<ModalThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  namespace: import("vue").ComputedRef<string | undefined>;
  isMounted: Readonly<Ref<boolean, boolean>>;
  containerRef: Ref<HTMLElement | null, HTMLElement | null>;
  presetProps: import("vue").ComputedRef<any>;
  handleEsc: (e: KeyboardEvent) => void;
  handleAfterLeave: () => void;
  handleClickoutside: (e: MouseEvent) => void;
  handleBeforeLeave: () => void;
  doUpdateShow: (show: boolean) => void;
  handleNegativeClick: () => void;
  handlePositiveClick: () => void;
  handleCloseClick: () => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  draggable: PropType<boolean | ModalDraggableOptions>;
  onEsc: PropType<() => void>;
  'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  onAfterEnter: PropType<() => void>;
  onBeforeLeave: PropType<() => void>;
  onAfterLeave: PropType<() => void>;
  onClose: PropType<() => Promise<boolean> | boolean | any>;
  onPositiveClick: PropType<() => Promise<boolean> | boolean | any>;
  onNegativeClick: PropType<() => Promise<boolean> | boolean | any>;
  onMaskClick: PropType<(e: MouseEvent) => void>;
  internalDialog: BooleanConstructor;
  internalModal: BooleanConstructor;
  internalAppear: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  overlayStyle: PropType<string | CSSProperties>;
  onBeforeHide: PropType<() => void>;
  onAfterHide: PropType<() => void>;
  onHide: PropType<(value: false) => void>;
  unstableShowMask: {
    type: BooleanConstructor;
    default: undefined;
  };
  icon: PropType<() => import("vue").VNodeChild>;
  type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "default">;
    readonly default: "default";
  };
  title: PropType<string | (() => import("vue").VNodeChild)>;
  closable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  negativeText: StringConstructor;
  positiveText: StringConstructor;
  positiveButtonProps: PropType<ButtonProps>;
  negativeButtonProps: PropType<ButtonProps>;
  content: PropType<string | (() => import("vue").VNodeChild)>;
  action: PropType<() => import("vue").VNodeChild>;
  showIcon: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  loading: BooleanConstructor;
  bordered: BooleanConstructor;
  iconPlacement: PropType<IconPlacement>;
  titleClass: PropType<string | Array<string | undefined>>;
  titleStyle: PropType<string | CSSProperties>;
  contentClass: PropType<string | Array<string | undefined>>;
  contentStyle: PropType<string | CSSProperties>;
  actionClass: PropType<string | Array<string | undefined>>;
  actionStyle: PropType<string | CSSProperties>;
  closeFocusable: BooleanConstructor;
  contentScrollable: BooleanConstructor;
  headerClass: StringConstructor;
  headerStyle: PropType<CSSProperties | string>;
  headerExtraClass: StringConstructor;
  headerExtraStyle: PropType<CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<CSSProperties | string>;
  embedded: BooleanConstructor;
  segmented: {
    readonly type: PropType<boolean | CardSegmented>;
    readonly default: false;
  };
  size: PropType<CardSize>;
  hoverable: BooleanConstructor;
  role: StringConstructor;
  tag: {
    readonly type: PropType<keyof HTMLElementTagNameMap>;
    readonly default: "div";
  };
  cover: PropType<() => import("vue").VNodeChild>;
  footer: PropType<() => import("vue").VNodeChild>;
  headerExtra: PropType<() => import("vue").VNodeChild>;
  show: BooleanConstructor;
  showMask: {
    type: BooleanConstructor;
    default: boolean;
  };
  maskClosable: {
    type: BooleanConstructor;
    default: boolean;
  };
  preset: PropType<"confirm" | "dialog" | "card">;
  to: PropType<string | HTMLElement>;
  displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  transformOrigin: {
    type: PropType<"center" | "mouse">;
    default: string;
  };
  zIndex: NumberConstructor;
  autoFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  trapFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  closeOnEsc: {
    type: BooleanConstructor;
    default: boolean;
  };
  blockScroll: {
    type: BooleanConstructor;
    default: boolean;
  };
  theme: PropType<ModalTheme>;
  themeOverrides: PropType<ModalThemeOverrides>;
  builtinThemeOverrides: PropType<ModalThemeOverrides>;
}>> & Readonly<{}>, {
  loading: boolean;
  type: "error" | "info" | "success" | "warning" | "default";
  showIcon: boolean;
  bordered: boolean;
  closable: boolean;
  show: boolean;
  transformOrigin: "center" | "mouse";
  tag: keyof HTMLElementTagNameMap;
  contentScrollable: boolean;
  embedded: boolean;
  segmented: boolean | CardSegmented;
  hoverable: boolean;
  closeFocusable: boolean;
  displayDirective: "show" | "if";
  blockScroll: boolean;
  closeOnEsc: boolean;
  autoFocus: boolean;
  maskClosable: boolean;
  showMask: boolean;
  trapFocus: boolean;
  internalDialog: boolean;
  internalModal: boolean;
  internalAppear: boolean | undefined;
  unstableShowMask: boolean;
}, SlotsType<ModalSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ModalProps, ModalSlots, _default as default, modalProps };