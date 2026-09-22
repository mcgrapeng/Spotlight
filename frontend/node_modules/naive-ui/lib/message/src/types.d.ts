import { MessageSpinProps } from "./public-types.js";
import { MessageSetupProps } from "./message-props.js";
import { VNodeChild } from "vue";
//#region src/message/src/types.d.ts
type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading' | 'default';
type RenderMessageProps = Pick<MessageSetupProps, 'closable' | 'content' | 'icon' | 'onClose' | 'type'>;
type MessageRenderMessage = (props: RenderMessageProps) => VNodeChild;
interface MessageOptions {
  type?: MessageType;
  render?: MessageRenderMessage;
  duration?: number;
  closable?: boolean;
  keepAliveOnHover?: boolean;
  icon?: () => VNodeChild;
  showIcon?: boolean;
  spinProps?: MessageSpinProps;
  onClose?: () => void;
  onLeave?: () => void;
  onAfterLeave?: () => void;
}
//#endregion
export { MessageOptions, MessageRenderMessage, MessageType, RenderMessageProps };