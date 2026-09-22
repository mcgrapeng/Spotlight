import { ButtonProps } from "../../button/src/Button.js";
import { CardSize } from "../../card/src/public-types.js";
import { CardSegmented } from "../../card/src/Card.js";
import { IconPlacement } from "../../dialog/src/interface.js";
import "../../index.js";
//#region src/modal/src/presetProps.d.ts
declare const presetProps: {
  icon: import("vue").PropType<() => import("vue").VNodeChild>;
  type: {
    readonly type: import("vue").PropType<"info" | "success" | "warning" | "error" | "default">;
    readonly default: "default";
  };
  title: import("vue").PropType<string | (() => import("vue").VNodeChild)>;
  closable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  negativeText: StringConstructor;
  positiveText: StringConstructor;
  positiveButtonProps: import("vue").PropType<ButtonProps>;
  negativeButtonProps: import("vue").PropType<ButtonProps>;
  content: import("vue").PropType<string | (() => import("vue").VNodeChild)>;
  action: import("vue").PropType<() => import("vue").VNodeChild>;
  showIcon: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  loading: BooleanConstructor;
  bordered: BooleanConstructor;
  iconPlacement: import("vue").PropType<IconPlacement>;
  titleClass: import("vue").PropType<string | Array<string | undefined>>;
  titleStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  contentClass: import("vue").PropType<string | Array<string | undefined>>;
  contentStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  actionClass: import("vue").PropType<string | Array<string | undefined>>;
  actionStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  onPositiveClick: import("vue").PropType<(e: MouseEvent) => void>;
  onNegativeClick: import("vue").PropType<(e: MouseEvent) => void>;
  onClose: import("vue").PropType<() => void>;
  closeFocusable: BooleanConstructor;
  contentScrollable: BooleanConstructor;
  headerClass: StringConstructor;
  headerStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  headerExtraClass: StringConstructor;
  headerExtraStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  footerClass: StringConstructor;
  footerStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  embedded: BooleanConstructor;
  segmented: {
    readonly type: import("vue").PropType<boolean | CardSegmented>;
    readonly default: false;
  };
  size: import("vue").PropType<CardSize>;
  hoverable: BooleanConstructor;
  role: StringConstructor;
  tag: {
    readonly type: import("vue").PropType<keyof HTMLElementTagNameMap>;
    readonly default: "div";
  };
  cover: import("vue").PropType<() => import("vue").VNodeChild>;
  footer: import("vue").PropType<() => import("vue").VNodeChild>;
  headerExtra: import("vue").PropType<() => import("vue").VNodeChild>;
};
declare const presetPropsKeys: ("loading" | "footer" | "title" | "type" | "showIcon" | "bordered" | "closable" | "onClose" | "icon" | "content" | "size" | "tag" | "iconPlacement" | "contentClass" | "contentStyle" | "contentScrollable" | "headerClass" | "headerStyle" | "headerExtraClass" | "headerExtraStyle" | "footerClass" | "footerStyle" | "embedded" | "segmented" | "hoverable" | "role" | "cover" | "action" | "headerExtra" | "closeFocusable" | "onPositiveClick" | "onNegativeClick" | "negativeText" | "positiveText" | "positiveButtonProps" | "negativeButtonProps" | "titleClass" | "titleStyle" | "actionClass" | "actionStyle")[];
declare const forwardedPresetPropsKeys: ("loading" | "footer" | "title" | "type" | "showIcon" | "bordered" | "closable" | "icon" | "content" | "size" | "tag" | "iconPlacement" | "contentClass" | "contentStyle" | "contentScrollable" | "headerClass" | "headerStyle" | "headerExtraClass" | "headerExtraStyle" | "footerClass" | "footerStyle" | "embedded" | "segmented" | "hoverable" | "role" | "cover" | "action" | "headerExtra" | "closeFocusable" | "negativeText" | "positiveText" | "positiveButtonProps" | "negativeButtonProps" | "titleClass" | "titleStyle" | "actionClass" | "actionStyle")[];
//#endregion
export { forwardedPresetPropsKeys, presetProps, presetPropsKeys };