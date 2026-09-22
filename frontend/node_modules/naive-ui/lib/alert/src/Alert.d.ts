import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { AlertTheme, AlertThemeOverrides, AlertThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/alert/src/Alert.d.ts
declare const alertProps: {
  title: StringConstructor;
  showIcon: {
    type: BooleanConstructor;
    default: boolean;
  };
  type: {
    type: PropType<"info" | "warning" | "error" | "success" | "default">;
    default: string;
  };
  bordered: {
    type: BooleanConstructor;
    default: boolean;
  };
  closable: BooleanConstructor;
  onClose: FunctionConstructor;
  onAfterLeave: FunctionConstructor;
  /** @deprecated */
  onAfterHide: FunctionConstructor;
  theme: PropType<AlertTheme>;
  themeOverrides: PropType<AlertThemeOverrides>;
  builtinThemeOverrides: PropType<AlertThemeOverrides>;
};
type AlertProps = ExtractPublicPropTypes<typeof alertProps>;
interface AlertSlots {
  default?: () => VNode[];
  icon?: () => VNode[];
  header?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  title: StringConstructor;
  showIcon: {
    type: BooleanConstructor;
    default: boolean;
  };
  type: {
    type: PropType<"info" | "warning" | "error" | "success" | "default">;
    default: string;
  };
  bordered: {
    type: BooleanConstructor;
    default: boolean;
  };
  closable: BooleanConstructor;
  onClose: FunctionConstructor;
  onAfterLeave: FunctionConstructor;
  /** @deprecated */
  onAfterHide: FunctionConstructor;
  theme: PropType<AlertTheme>;
  themeOverrides: PropType<AlertThemeOverrides>;
  builtinThemeOverrides: PropType<AlertThemeOverrides>;
}>, {
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: Ref<string, string>;
  mergedBordered: import("vue").ComputedRef<boolean>;
  visible: Ref<boolean, boolean>;
  handleCloseClick: () => void;
  handleAfterLeave: () => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: AlertThemeVars;
    peers: any;
    peerOverrides: {
      [x: string]: any;
    };
  }>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  title: StringConstructor;
  showIcon: {
    type: BooleanConstructor;
    default: boolean;
  };
  type: {
    type: PropType<"info" | "warning" | "error" | "success" | "default">;
    default: string;
  };
  bordered: {
    type: BooleanConstructor;
    default: boolean;
  };
  closable: BooleanConstructor;
  onClose: FunctionConstructor;
  onAfterLeave: FunctionConstructor;
  /** @deprecated */
  onAfterHide: FunctionConstructor;
  theme: PropType<AlertTheme>;
  themeOverrides: PropType<AlertThemeOverrides>;
  builtinThemeOverrides: PropType<AlertThemeOverrides>;
}>> & Readonly<{}>, {
  type: "error" | "info" | "success" | "warning" | "default";
  showIcon: boolean;
  bordered: boolean;
  closable: boolean;
}, SlotsType<AlertSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { AlertProps, AlertSlots, alertProps, _default as default };