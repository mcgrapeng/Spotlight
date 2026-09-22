import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { MessageSpinProps } from "./public-types.js";
import { MessageType } from "./types.js";
import { ExtractPropTypes, PropType, VNodeChild } from "vue";
//#region src/message/src/message-props.d.ts
declare const messageProps: {
  readonly icon: PropType<() => VNodeChild>;
  readonly type: {
    readonly type: PropType<MessageType>;
    readonly default: "info";
  };
  readonly content: PropType<string | number | (() => VNodeChild)>;
  readonly showIcon: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly closable: BooleanConstructor;
  readonly keepAliveOnHover: BooleanConstructor;
  readonly spinProps: PropType<MessageSpinProps>;
  readonly onClose: PropType<() => void>;
  readonly onMouseenter: PropType<(e: MouseEvent) => void>;
  readonly onMouseleave: PropType<(e: MouseEvent) => void>;
};
type MessageProps = ExtractPublicPropTypes<typeof messageProps>;
type MessageSetupProps = ExtractPropTypes<typeof messageProps>;
//#endregion
export { MessageProps, MessageSetupProps, messageProps };