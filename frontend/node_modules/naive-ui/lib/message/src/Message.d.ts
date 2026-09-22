import { MessageSpinProps } from "./public-types.js";
import { MessageRenderMessage, MessageType } from "./types.js";
import { MessageProviderSetupProps } from "./MessageProvider.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, VNodeChild } from "vue";
//#region src/message/src/Message.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  render: PropType<MessageRenderMessage>;
  icon: PropType<() => VNodeChild>;
  type: {
    readonly type: PropType<MessageType>;
    readonly default: "info";
  };
  content: PropType<string | number | (() => VNodeChild)>;
  showIcon: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  closable: BooleanConstructor;
  keepAliveOnHover: BooleanConstructor;
  spinProps: PropType<MessageSpinProps>;
  onClose: PropType<() => void>;
  onMouseenter: PropType<(e: MouseEvent) => void>;
  onMouseleave: PropType<(e: MouseEvent) => void>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  messageProviderProps: MessageProviderSetupProps;
  handleClose(): void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  placement: "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  render: PropType<MessageRenderMessage>;
  icon: PropType<() => VNodeChild>;
  type: {
    readonly type: PropType<MessageType>;
    readonly default: "info";
  };
  content: PropType<string | number | (() => VNodeChild)>;
  showIcon: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  closable: BooleanConstructor;
  keepAliveOnHover: BooleanConstructor;
  spinProps: PropType<MessageSpinProps>;
  onClose: PropType<() => void>;
  onMouseenter: PropType<(e: MouseEvent) => void>;
  onMouseleave: PropType<(e: MouseEvent) => void>;
}>> & Readonly<{}>, {
  type: MessageType;
  showIcon: boolean;
  closable: boolean;
  keepAliveOnHover: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export = _default;