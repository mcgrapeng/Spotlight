//#region src/message/src/message-props.ts
const messageProps = {
  icon: Function,
  type: {
    type: String,
    default: "info"
  },
  content: [String, Number, Function],
  showIcon: {
    type: Boolean,
    default: true
  },
  closable: Boolean,
  keepAliveOnHover: Boolean,
  spinProps: Object,
  onClose: Function,
  onMouseenter: Function,
  onMouseleave: Function
};
//#endregion
export { messageProps };