import { normalizeSlot } from "../../vue-jsx-vapor/vdom.mjs";
import FadeInExpandTransition_default from "../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.mjs";
import { messageProps } from "./message-props.mjs";
import Message_default from "./Message.mjs";
import { createBlock, defineComponent, onMounted, openBlock, ref } from "vue";
//#region src/message/src/MessageEnvironment.tsx
var MessageEnvironment_default = defineComponent({
  name: "MessageEnvironment",
  props: {
    ...messageProps,
    duration: {
      type: Number,
      default: 3e3
    },
    onAfterLeave: Function,
    onLeave: Function,
    internalKey: {
      type: String,
      required: true
    },
    onInternalAfterLeave: Function,
    onHide: Function,
    onAfterHide: Function
  },
  setup(props) {
    let timerId = null;
    const showRef = ref(true);
    onMounted(() => {
      setHideTimeout();
    });
    function setHideTimeout() {
      const {
        duration
      } = props;
      if (duration) timerId = window.setTimeout(hide, duration);
    }
    function handleMouseenter(e) {
      if (e.currentTarget !== e.target) return;
      if (timerId !== null) {
        window.clearTimeout(timerId);
        timerId = null;
      }
    }
    function handleMouseleave(e) {
      if (e.currentTarget !== e.target) return;
      setHideTimeout();
    }
    function hide() {
      const {
        onHide
      } = props;
      showRef.value = false;
      if (timerId) {
        window.clearTimeout(timerId);
        timerId = null;
      }
      if (onHide) onHide();
    }
    function handleClose() {
      const {
        onClose
      } = props;
      if (onClose) onClose();
      hide();
    }
    function handleAfterLeave() {
      const {
        onAfterLeave,
        onInternalAfterLeave,
        onAfterHide,
        internalKey
      } = props;
      if (onAfterLeave) onAfterLeave();
      if (onInternalAfterLeave) onInternalAfterLeave(internalKey);
      if (onAfterHide) onAfterHide();
    }
    function deactivate() {
      hide();
    }
    return {
      show: showRef,
      hide,
      handleClose,
      handleAfterLeave,
      handleMouseleave,
      handleMouseenter,
      deactivate
    };
  },
  render() {
    return openBlock(), createBlock(FadeInExpandTransition_default, {
      appear: true,
      onAfterLeave: this.handleAfterLeave,
      onLeave: this.onLeave
    }, {
      _: 1,
      default: normalizeSlot(() => [this.show ? (openBlock(), createBlock(Message_default, {
        key: 1,
        content: this.content,
        type: this.type,
        icon: this.icon,
        showIcon: this.showIcon,
        closable: this.closable,
        spinProps: this.spinProps,
        onClose: this.handleClose,
        onMouseenter: this.keepAliveOnHover ? this.handleMouseenter : void 0,
        onMouseleave: this.keepAliveOnHover ? this.handleMouseleave : void 0
      }, null, 8, ["content", "type", "icon", "showIcon", "closable", "spinProps", "onClose", "onMouseenter", "onMouseleave"])) : null])
    }, 8, ["onAfterLeave", "onLeave"]);
  }
});
//#endregion
export { MessageEnvironment_default as default };