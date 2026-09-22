import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ButtonProps } from "../../button/src/Button.js";
import { CardTheme } from "../../card/styles/light.js";
import "../../card/styles/index.js";
import { CardSize } from "../../card/src/public-types.js";
import { CardSegmented } from "../../card/src/Card.js";
import { IconPlacement } from "../../dialog/src/interface.js";
import { DialogTheme } from "../../dialog/styles/light.js";
import "../../dialog/styles/index.js";
import { ModalThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { ModalDraggableOptions } from "./interface.js";
import { ModalSlots } from "./Modal.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType, SlotsType, VNode } from "vue";
//#region src/modal/src/BodyWrapper.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  onClickoutside: {
    type: PropType<(e: MouseEvent) => void>;
    required: true;
  };
  onBeforeLeave: {
    type: FunctionConstructor;
    required: true;
  };
  onAfterLeave: {
    type: FunctionConstructor;
    required: true;
  };
  onPositiveClick: {
    type: FunctionConstructor;
    required: true;
  };
  onNegativeClick: {
    type: FunctionConstructor;
    required: true;
  };
  onClose: {
    type: FunctionConstructor;
    required: true;
  };
  onAfterEnter: PropType<(el: HTMLElement) => void>;
  onEsc: PropType<(e: KeyboardEvent) => void>;
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
  show: {
    type: BooleanConstructor;
    required: true;
  };
  preset: PropType<"confirm" | "dialog" | "card">;
  displayDirective: {
    type: PropType<"if" | "show">;
    required: true;
  };
  trapFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  autoFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  blockScroll: BooleanConstructor;
  draggable: {
    type: PropType<boolean | ModalDraggableOptions>;
    default: boolean;
  };
  maskHidden: BooleanConstructor;
}>, {
  mergedTheme: import("vue").Ref<{
    common: ThemeCommonVars;
    self: ModalThemeVars;
    peers: {
      Scrollbar: ScrollbarTheme;
      Dialog: DialogTheme;
      Card: CardTheme;
    };
    peerOverrides: {
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Dialog?: {
        peers?: {
          Button?: ExtractThemeOverrides<ButtonTheme> | undefined;
        } | undefined;
      } | undefined;
      Card?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }, {
    common: ThemeCommonVars;
    self: ModalThemeVars;
    peers: {
      Scrollbar: ScrollbarTheme;
      Dialog: DialogTheme;
      Card: CardTheme;
    };
    peerOverrides: {
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Dialog?: {
        peers?: {
          Button?: ExtractThemeOverrides<ButtonTheme> | undefined;
        } | undefined;
      } | undefined;
      Card?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  appear: import("vue").Ref<boolean | undefined, boolean | undefined>;
  isMounted: import("vue").Ref<boolean, boolean>;
  mergedClsPrefix: import("vue").Ref<string, string>;
  bodyRef: unknown;
  scrollbarRef: unknown;
  draggableClass: import("vue").ComputedRef<"" | "n-draggable">;
  displayed: import("vue").Ref<boolean, boolean>;
  childNodeRef: import("vue").Ref<VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
  }> | null, VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
  }> | null>;
  cardHeaderClass: import("vue").ComputedRef<string>;
  dialogTitleClass: import("vue").ComputedRef<string>;
  handlePositiveClick: () => void;
  handleNegativeClick: () => void;
  handleCloseClick: () => void;
  handleAfterEnter: (el: Element) => void;
  handleAfterLeave: () => void;
  handleBeforeLeave: (el: HTMLElement) => void;
  handleEnter: (el: HTMLElement) => void;
  dragX: import("vue").Ref<number | null, number | null>;
  dragY: import("vue").Ref<number | null, number | null>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  onClickoutside: {
    type: PropType<(e: MouseEvent) => void>;
    required: true;
  };
  onBeforeLeave: {
    type: FunctionConstructor;
    required: true;
  };
  onAfterLeave: {
    type: FunctionConstructor;
    required: true;
  };
  onPositiveClick: {
    type: FunctionConstructor;
    required: true;
  };
  onNegativeClick: {
    type: FunctionConstructor;
    required: true;
  };
  onClose: {
    type: FunctionConstructor;
    required: true;
  };
  onAfterEnter: PropType<(el: HTMLElement) => void>;
  onEsc: PropType<(e: KeyboardEvent) => void>;
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
  show: {
    type: BooleanConstructor;
    required: true;
  };
  preset: PropType<"confirm" | "dialog" | "card">;
  displayDirective: {
    type: PropType<"if" | "show">;
    required: true;
  };
  trapFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  autoFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  blockScroll: BooleanConstructor;
  draggable: {
    type: PropType<boolean | ModalDraggableOptions>;
    default: boolean;
  };
  maskHidden: BooleanConstructor;
}>> & Readonly<{}>, {
  showIcon: boolean;
  type: "error" | "info" | "success" | "warning" | "default";
  bordered: boolean;
  closable: boolean;
  loading: boolean;
  contentScrollable: boolean;
  embedded: boolean;
  segmented: boolean | CardSegmented;
  hoverable: boolean;
  tag: keyof HTMLElementTagNameMap;
  closeFocusable: boolean;
  draggable: boolean | ModalDraggableOptions;
  blockScroll: boolean;
  autoFocus: boolean;
  trapFocus: boolean;
  maskHidden: boolean;
}, SlotsType<ModalSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };