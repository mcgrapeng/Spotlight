import { MessageSpinProps } from "./public-types.js";
import { MessageType } from "./types.js";
import { PropType } from "vue";
//#region src/message/src/MessageEnvironment.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  duration: {
    type: NumberConstructor;
    default: number;
  };
  onAfterLeave: FunctionConstructor;
  onLeave: FunctionConstructor;
  internalKey: {
    type: StringConstructor;
    required: true;
  };
  onInternalAfterLeave: PropType<(key: string) => void>;
  onHide: FunctionConstructor;
  onAfterHide: FunctionConstructor;
  icon: PropType<() => import("vue").VNodeChild>;
  type: {
    readonly type: PropType<MessageType>;
    readonly default: "info";
  };
  content: PropType<string | number | (() => import("vue").VNodeChild)>;
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
  show: import("vue").Ref<boolean, boolean>;
  hide: () => void;
  handleClose: () => void;
  handleAfterLeave: () => void;
  handleMouseleave: (e: MouseEvent) => void;
  handleMouseenter: (e: MouseEvent) => void;
  deactivate: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  duration: {
    type: NumberConstructor;
    default: number;
  };
  onAfterLeave: FunctionConstructor;
  onLeave: FunctionConstructor;
  internalKey: {
    type: StringConstructor;
    required: true;
  };
  onInternalAfterLeave: PropType<(key: string) => void>;
  onHide: FunctionConstructor;
  onAfterHide: FunctionConstructor;
  icon: PropType<() => import("vue").VNodeChild>;
  type: {
    readonly type: PropType<MessageType>;
    readonly default: "info";
  };
  content: PropType<string | number | (() => import("vue").VNodeChild)>;
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
  duration: number;
  keepAliveOnHover: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export = _default;