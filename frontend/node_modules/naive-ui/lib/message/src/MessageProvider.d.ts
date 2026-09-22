import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { MessageTheme, MessageThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { MessageOptions, MessageType } from "./types.js";
import { CSSProperties, ExtractPropTypes, PropType, VNodeChild } from "vue";
//#region src/message/src/MessageProvider.d.ts
type ContentType = string | (() => VNodeChild);
interface MessageApiInjection {
  create: (content: ContentType, options?: MessageOptions) => MessageReactive;
  info: (content: ContentType, options?: MessageOptions) => MessageReactive;
  success: (content: ContentType, options?: MessageOptions) => MessageReactive;
  warning: (content: ContentType, options?: MessageOptions) => MessageReactive;
  error: (content: ContentType, options?: MessageOptions) => MessageReactive;
  loading: (content: ContentType, options?: MessageOptions) => MessageReactive;
  destroyAll: () => void;
}
interface MessageReactive {
  content?: ContentType;
  duration?: number;
  closable?: boolean;
  keepAliveOnHover?: boolean;
  type: MessageType;
  icon?: () => VNodeChild;
  showIcon?: boolean;
  onClose?: () => void;
  destroy: () => void;
}
interface PrivateMessageReactive extends MessageReactive {
  key: string;
}
interface PrivateMessageRef extends MessageReactive {
  key: string;
  hide: () => void;
}
type MessageProviderInst = MessageApiInjection;
declare const messageProviderProps: {
  to: PropType<string | HTMLElement>;
  duration: {
    type: NumberConstructor;
    default: number;
  };
  keepAliveOnHover: BooleanConstructor;
  max: NumberConstructor;
  placement: {
    type: PropType<"top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right">;
    default: string;
  };
  closable: BooleanConstructor;
  containerClass: StringConstructor;
  containerStyle: PropType<string | CSSProperties>;
  theme: PropType<MessageTheme>;
  themeOverrides: PropType<MessageThemeOverrides>;
  builtinThemeOverrides: PropType<MessageThemeOverrides>;
};
type MessageProviderProps = ExtractPublicPropTypes<typeof messageProviderProps>;
type MessageProviderSetupProps = ExtractPropTypes<typeof messageProviderProps>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  to: PropType<string | HTMLElement>;
  duration: {
    type: NumberConstructor;
    default: number;
  };
  keepAliveOnHover: BooleanConstructor;
  max: NumberConstructor;
  placement: {
    type: PropType<"top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right">;
    default: string;
  };
  closable: BooleanConstructor;
  containerClass: StringConstructor;
  containerStyle: PropType<string | CSSProperties>;
  theme: PropType<MessageTheme>;
  themeOverrides: PropType<MessageThemeOverrides>;
  builtinThemeOverrides: PropType<MessageThemeOverrides>;
}>, {
  mergedClsPrefix: import("vue").Ref<string, string>;
  messageRefs: import("vue").Ref<Record<string, PrivateMessageRef>, Record<string, PrivateMessageRef>>;
  messageList: import("vue").Ref<{
    key: string;
    content?: ContentType | undefined;
    duration?: number | undefined;
    closable?: boolean | undefined;
    keepAliveOnHover?: boolean | undefined;
    type: MessageType;
    icon?: (() => VNodeChild) | undefined;
    showIcon?: boolean | undefined;
    onClose?: (() => void) | undefined;
    destroy: () => void;
  }[], PrivateMessageReactive[] | {
    key: string;
    content?: ContentType | undefined;
    duration?: number | undefined;
    closable?: boolean | undefined;
    keepAliveOnHover?: boolean | undefined;
    type: MessageType;
    icon?: (() => VNodeChild) | undefined;
    showIcon?: boolean | undefined;
    onClose?: (() => void) | undefined;
    destroy: () => void;
  }[]>;
  handleAfterLeave: (key: string) => void;
} & MessageApiInjection, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  to: PropType<string | HTMLElement>;
  duration: {
    type: NumberConstructor;
    default: number;
  };
  keepAliveOnHover: BooleanConstructor;
  max: NumberConstructor;
  placement: {
    type: PropType<"top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right">;
    default: string;
  };
  closable: BooleanConstructor;
  containerClass: StringConstructor;
  containerStyle: PropType<string | CSSProperties>;
  theme: PropType<MessageTheme>;
  themeOverrides: PropType<MessageThemeOverrides>;
  builtinThemeOverrides: PropType<MessageThemeOverrides>;
}>> & Readonly<{}>, {
  closable: boolean;
  duration: number;
  placement: "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  keepAliveOnHover: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { MessageApiInjection, MessageProviderInst, MessageProviderProps, MessageProviderSetupProps, MessageReactive, _default as default, messageProviderProps };