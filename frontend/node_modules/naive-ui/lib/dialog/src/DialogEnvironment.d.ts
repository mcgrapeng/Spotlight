import { ButtonProps } from "../../button/src/Button.js";
import { IconPlacement } from "./interface.js";
import { ModalDraggableOptions } from "../../modal/src/interface.js";
import "../../index.js";
import { CSSProperties, PropType } from "vue";
//#region src/dialog/src/DialogEnvironment.d.ts
declare const exposedDialogEnvProps: {
  readonly onAfterEnter: PropType<() => void>;
  readonly onAfterLeave: PropType<() => void>;
  readonly transformOrigin: PropType<"center" | "mouse">;
  readonly blockScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly closeOnEsc: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onEsc: PropType<() => void>;
  readonly autoFocus: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly internalStyle: PropType<string | CSSProperties>;
  readonly maskClosable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly zIndex: NumberConstructor;
  readonly onPositiveClick: PropType<(e: MouseEvent) => Promise<unknown> | unknown>;
  readonly onNegativeClick: PropType<(e: MouseEvent) => Promise<unknown> | unknown>;
  readonly onClose: PropType<() => Promise<unknown> | unknown>;
  readonly onMaskClick: PropType<(e: MouseEvent) => void>;
  readonly draggable: PropType<boolean | ModalDraggableOptions>;
  readonly icon: PropType<() => import("vue").VNodeChild>;
  readonly type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "default">;
    readonly default: "default";
  };
  readonly title: PropType<string | (() => import("vue").VNodeChild)>;
  readonly closable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly negativeText: StringConstructor;
  readonly positiveText: StringConstructor;
  readonly positiveButtonProps: PropType<ButtonProps>;
  readonly negativeButtonProps: PropType<ButtonProps>;
  readonly content: PropType<string | (() => import("vue").VNodeChild)>;
  readonly action: PropType<() => import("vue").VNodeChild>;
  readonly showIcon: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly loading: BooleanConstructor;
  readonly bordered: BooleanConstructor;
  readonly iconPlacement: PropType<IconPlacement>;
  readonly titleClass: PropType<string | Array<string | undefined>>;
  readonly titleStyle: PropType<string | CSSProperties>;
  readonly contentClass: PropType<string | Array<string | undefined>>;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly actionClass: PropType<string | Array<string | undefined>>;
  readonly actionStyle: PropType<string | CSSProperties>;
  readonly closeFocusable: BooleanConstructor;
};
declare const NDialogEnvironment: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  internalKey: {
    type: StringConstructor;
    required: true;
  };
  to: PropType<string | HTMLElement>;
  onInternalAfterLeave: {
    type: PropType<(key: string) => void>;
    required: true;
  };
  onAfterEnter: PropType<() => void>;
  onAfterLeave: PropType<() => void>;
  transformOrigin: PropType<"center" | "mouse">;
  blockScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  closeOnEsc: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  onEsc: PropType<() => void>;
  autoFocus: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  internalStyle: PropType<string | CSSProperties>;
  maskClosable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  zIndex: NumberConstructor;
  onPositiveClick: PropType<(e: MouseEvent) => Promise<unknown> | unknown>;
  onNegativeClick: PropType<(e: MouseEvent) => Promise<unknown> | unknown>;
  onClose: PropType<() => Promise<unknown> | unknown>;
  onMaskClick: PropType<(e: MouseEvent) => void>;
  draggable: PropType<boolean | ModalDraggableOptions>;
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
}>, {
  show: import("vue").Ref<boolean, boolean>;
  hide: () => void;
  handleUpdateShow: (value: boolean) => void;
  handleAfterLeave: () => void;
  handleCloseClick: () => void;
  handleNegativeClick: (e: MouseEvent) => void;
  handlePositiveClick: (e: MouseEvent) => void;
  handleMaskClick: (e: MouseEvent) => void;
  handleEsc: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  internalKey: {
    type: StringConstructor;
    required: true;
  };
  to: PropType<string | HTMLElement>;
  onInternalAfterLeave: {
    type: PropType<(key: string) => void>;
    required: true;
  };
  onAfterEnter: PropType<() => void>;
  onAfterLeave: PropType<() => void>;
  transformOrigin: PropType<"center" | "mouse">;
  blockScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  closeOnEsc: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  onEsc: PropType<() => void>;
  autoFocus: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  internalStyle: PropType<string | CSSProperties>;
  maskClosable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  zIndex: NumberConstructor;
  onPositiveClick: PropType<(e: MouseEvent) => Promise<unknown> | unknown>;
  onNegativeClick: PropType<(e: MouseEvent) => Promise<unknown> | unknown>;
  onClose: PropType<() => Promise<unknown> | unknown>;
  onMaskClick: PropType<(e: MouseEvent) => void>;
  draggable: PropType<boolean | ModalDraggableOptions>;
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
}>> & Readonly<{}>, {
  loading: boolean;
  type: "error" | "info" | "success" | "warning" | "default";
  showIcon: boolean;
  bordered: boolean;
  closable: boolean;
  closeFocusable: boolean;
  blockScroll: boolean;
  closeOnEsc: boolean;
  autoFocus: boolean;
  maskClosable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { NDialogEnvironment, exposedDialogEnvProps };