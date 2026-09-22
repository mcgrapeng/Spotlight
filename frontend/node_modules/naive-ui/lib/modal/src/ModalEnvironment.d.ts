import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ButtonProps } from "../../button/src/Button.js";
import { CardSize } from "../../card/src/public-types.js";
import { CardSegmented } from "../../card/src/Card.js";
import { IconPlacement } from "../../dialog/src/interface.js";
import { ModalTheme, ModalThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { ModalDraggableOptions } from "./interface.js";
import "../../index.js";
import { PropType } from "vue";
//#region src/modal/src/ModalEnvironment.d.ts
declare const NModalEnvironment: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  internalKey: {
    type: StringConstructor;
    required: true;
  };
  onInternalAfterLeave: {
    type: PropType<(key: string) => void>;
    required: true;
  };
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
  overlayStyle: PropType<string | import("vue").CSSProperties>;
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
  titleStyle: PropType<string | import("vue").CSSProperties>;
  contentClass: PropType<string | Array<string | undefined>>;
  contentStyle: PropType<string | import("vue").CSSProperties>;
  actionClass: PropType<string | Array<string | undefined>>;
  actionStyle: PropType<string | import("vue").CSSProperties>;
  closeFocusable: BooleanConstructor;
  contentScrollable: BooleanConstructor;
  headerClass: StringConstructor;
  headerStyle: PropType<import("vue").CSSProperties | string>;
  headerExtraClass: StringConstructor;
  headerExtraStyle: PropType<import("vue").CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<import("vue").CSSProperties | string>;
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
  show: import("vue").Ref<boolean, boolean>;
  hide: () => void;
  handleUpdateShow: (value: boolean) => void;
  handleAfterLeave: () => void;
  handleMaskClick: (e: MouseEvent) => void;
  handleEsc: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  internalKey: {
    type: StringConstructor;
    required: true;
  };
  onInternalAfterLeave: {
    type: PropType<(key: string) => void>;
    required: true;
  };
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
  overlayStyle: PropType<string | import("vue").CSSProperties>;
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
  titleStyle: PropType<string | import("vue").CSSProperties>;
  contentClass: PropType<string | Array<string | undefined>>;
  contentStyle: PropType<string | import("vue").CSSProperties>;
  actionClass: PropType<string | Array<string | undefined>>;
  actionStyle: PropType<string | import("vue").CSSProperties>;
  closeFocusable: BooleanConstructor;
  contentScrollable: BooleanConstructor;
  headerClass: StringConstructor;
  headerStyle: PropType<import("vue").CSSProperties | string>;
  headerExtraClass: StringConstructor;
  headerExtraStyle: PropType<import("vue").CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: PropType<import("vue").CSSProperties | string>;
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
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { NModalEnvironment };