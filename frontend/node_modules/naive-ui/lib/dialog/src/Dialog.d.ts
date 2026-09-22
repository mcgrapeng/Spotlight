import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ButtonProps } from "../../button/src/Button.js";
import { IconPlacement } from "./interface.js";
import { DialogTheme, DialogThemeOverrides, DialogThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, Ref, SlotsType, VNode } from "vue";
//#region src/dialog/src/Dialog.d.ts
interface DialogSlots {
  action?: () => VNode[];
  default?: () => VNode[];
  header?: () => VNode[];
  icon?: () => VNode[];
  close?: () => VNode[];
}
declare const NDialog: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
  titleStyle: import("vue").PropType<string | CSSProperties>;
  contentClass: import("vue").PropType<string | Array<string | undefined>>;
  contentStyle: import("vue").PropType<string | CSSProperties>;
  actionClass: import("vue").PropType<string | Array<string | undefined>>;
  actionStyle: import("vue").PropType<string | CSSProperties>;
  onPositiveClick: import("vue").PropType<(e: MouseEvent) => void>;
  onNegativeClick: import("vue").PropType<(e: MouseEvent) => void>;
  onClose: import("vue").PropType<() => void>;
  closeFocusable: BooleanConstructor;
  theme: import("vue").PropType<DialogTheme>;
  themeOverrides: import("vue").PropType<DialogThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<DialogThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedIconPlacement: import("vue").ComputedRef<IconPlacement>;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: DialogThemeVars;
    peers: {
      Button: ButtonTheme;
    };
    peerOverrides: {
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  handlePositiveClick: (e: MouseEvent) => void;
  handleNegativeClick: (e: MouseEvent) => void;
  handleCloseClick: () => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
  titleStyle: import("vue").PropType<string | CSSProperties>;
  contentClass: import("vue").PropType<string | Array<string | undefined>>;
  contentStyle: import("vue").PropType<string | CSSProperties>;
  actionClass: import("vue").PropType<string | Array<string | undefined>>;
  actionStyle: import("vue").PropType<string | CSSProperties>;
  onPositiveClick: import("vue").PropType<(e: MouseEvent) => void>;
  onNegativeClick: import("vue").PropType<(e: MouseEvent) => void>;
  onClose: import("vue").PropType<() => void>;
  closeFocusable: BooleanConstructor;
  theme: import("vue").PropType<DialogTheme>;
  themeOverrides: import("vue").PropType<DialogThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<DialogThemeOverrides>;
}>> & Readonly<{}>, {
  loading: boolean;
  type: "error" | "info" | "success" | "warning" | "default";
  showIcon: boolean;
  bordered: boolean;
  closable: boolean;
  closeFocusable: boolean;
}, SlotsType<DialogSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { DialogSlots, NDialog };