import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ButtonProps } from "../../button/src/Button.js";
import "../../button/index.js";
import { IconPlacement } from "./interface.js";
import { CSSProperties, PropType, VNodeChild } from "vue";
//#region src/dialog/src/dialogProps.d.ts
declare const dialogProps: {
  readonly icon: PropType<() => VNodeChild>;
  readonly type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "default">;
    readonly default: "default";
  };
  readonly title: PropType<string | (() => VNodeChild)>;
  readonly closable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly negativeText: StringConstructor;
  readonly positiveText: StringConstructor;
  readonly positiveButtonProps: PropType<ButtonProps>;
  readonly negativeButtonProps: PropType<ButtonProps>;
  readonly content: PropType<string | (() => VNodeChild)>;
  readonly action: PropType<() => VNodeChild>;
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
  readonly onPositiveClick: PropType<(e: MouseEvent) => void>;
  readonly onNegativeClick: PropType<(e: MouseEvent) => void>;
  readonly onClose: PropType<() => void>;
  readonly closeFocusable: BooleanConstructor;
};
type DialogProps = ExtractPublicPropTypes<typeof dialogProps>;
declare const dialogPropKeys: ("loading" | "title" | "type" | "showIcon" | "bordered" | "closable" | "onClose" | "icon" | "content" | "iconPlacement" | "contentClass" | "contentStyle" | "action" | "closeFocusable" | "onPositiveClick" | "onNegativeClick" | "negativeText" | "positiveText" | "positiveButtonProps" | "negativeButtonProps" | "titleClass" | "titleStyle" | "actionClass" | "actionStyle")[];
//#endregion
export { DialogProps, dialogPropKeys, dialogProps };