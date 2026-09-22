import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, VNodeChild } from "vue";
//#region src/notification/src/Notification.d.ts
declare const notificationProps: {
  readonly closable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "default">;
    readonly default: "default";
  };
  readonly avatar: PropType<() => VNodeChild>;
  readonly title: PropType<string | (() => VNodeChild)>;
  readonly description: PropType<string | (() => VNodeChild)>;
  readonly content: PropType<string | (() => VNodeChild)>;
  readonly meta: PropType<string | (() => VNodeChild)>;
  readonly action: PropType<string | (() => VNodeChild)>;
  readonly onClose: {
    readonly type: PropType<() => void>;
    readonly required: true;
  };
  readonly keepAliveOnHover: BooleanConstructor;
  readonly onMouseenter: PropType<(e: MouseEvent) => void>;
  readonly onMouseleave: PropType<(e: MouseEvent) => void>;
};
declare const notificationPropKeys: ("title" | "type" | "closable" | "onClose" | "content" | "meta" | "onMouseenter" | "onMouseleave" | "avatar" | "action" | "keepAliveOnHover" | "description")[];
declare const Notification: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly closable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "default">;
    readonly default: "default";
  };
  readonly avatar: PropType<() => VNodeChild>;
  readonly title: PropType<string | (() => VNodeChild)>;
  readonly description: PropType<string | (() => VNodeChild)>;
  readonly content: PropType<string | (() => VNodeChild)>;
  readonly meta: PropType<string | (() => VNodeChild)>;
  readonly action: PropType<string | (() => VNodeChild)>;
  readonly onClose: {
    readonly type: PropType<() => void>;
    readonly required: true;
  };
  readonly keepAliveOnHover: BooleanConstructor;
  readonly onMouseenter: PropType<(e: MouseEvent) => void>;
  readonly onMouseleave: PropType<(e: MouseEvent) => void>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  showAvatar: import("vue").ComputedRef<boolean | (() => VNodeChild)>;
  handleCloseClick(): void;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly closable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "default">;
    readonly default: "default";
  };
  readonly avatar: PropType<() => VNodeChild>;
  readonly title: PropType<string | (() => VNodeChild)>;
  readonly description: PropType<string | (() => VNodeChild)>;
  readonly content: PropType<string | (() => VNodeChild)>;
  readonly meta: PropType<string | (() => VNodeChild)>;
  readonly action: PropType<string | (() => VNodeChild)>;
  readonly onClose: {
    readonly type: PropType<() => void>;
    readonly required: true;
  };
  readonly keepAliveOnHover: BooleanConstructor;
  readonly onMouseenter: PropType<(e: MouseEvent) => void>;
  readonly onMouseleave: PropType<(e: MouseEvent) => void>;
}>> & Readonly<{}>, {
  readonly type: "error" | "info" | "success" | "warning" | "default";
  readonly closable: boolean;
  readonly keepAliveOnHover: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { Notification, notificationPropKeys, notificationProps };