import { keep } from "../../_utils/vue/keep.mjs";
import { mergeEventHandlers } from "../../_utils/vue/merge-handlers.mjs";
import { normalizeSlot } from "../../vue-jsx-vapor/vdom.mjs";
import { notificationProviderInjectionKey } from "./context.mjs";
import { Notification, notificationPropKeys, notificationProps } from "./Notification.mjs";
import { Transition, createBlock, defineComponent, inject, mergeProps, nextTick, onMounted, openBlock, ref } from "vue";
//#region src/notification/src/NotificationEnvironment.tsx
const notificationEnvOptions = {
  ...notificationProps,
  duration: Number,
  onClose: Function,
  onLeave: Function,
  onAfterEnter: Function,
  onAfterLeave: Function,
  /** @deprecated */
  onHide: Function,
  /** @deprecated */
  onAfterShow: Function,
  /** @deprecated */
  onAfterHide: Function
};
const NotificationEnvironment = defineComponent({
  name: "NotificationEnvironment",
  props: {
    ...notificationEnvOptions,
    internalKey: {
      type: String,
      required: true
    },
    onInternalAfterLeave: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const {
      wipTransitionCountRef
    } = inject(notificationProviderInjectionKey);
    const showRef = ref(true);
    let timerId = null;
    function hide() {
      showRef.value = false;
      if (timerId) window.clearTimeout(timerId);
    }
    function handleBeforeEnter(el) {
      wipTransitionCountRef.value++;
      nextTick(() => {
        el.style.height = `${el.offsetHeight}px`;
        el.style.maxHeight = "0";
        el.style.transition = "none";
        el.offsetHeight;
        el.style.transition = "";
        el.style.maxHeight = el.style.height;
      });
    }
    function handleAfterEnter(el) {
      wipTransitionCountRef.value--;
      el.style.height = "";
      el.style.maxHeight = "";
      const {
        onAfterEnter,
        onAfterShow
      } = props;
      if (onAfterEnter) onAfterEnter();
      if (onAfterShow) onAfterShow();
    }
    function handleBeforeLeave(el) {
      wipTransitionCountRef.value++;
      el.style.maxHeight = `${el.offsetHeight}px`;
      el.style.height = `${el.offsetHeight}px`;
      el.offsetHeight;
    }
    function handleLeave(el) {
      const {
        onHide
      } = props;
      if (onHide) onHide();
      el.style.maxHeight = "0";
      el.offsetHeight;
    }
    function handleAfterLeave() {
      wipTransitionCountRef.value--;
      const {
        onAfterLeave,
        onInternalAfterLeave,
        onAfterHide,
        internalKey
      } = props;
      if (onAfterLeave) onAfterLeave();
      onInternalAfterLeave(internalKey);
      if (onAfterHide) onAfterHide();
    }
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
    function handleClose() {
      const {
        onClose
      } = props;
      if (onClose) Promise.resolve(onClose()).then(feedback => {
        if (feedback === false) return;
        hide();
      });else hide();
    }
    onMounted(() => {
      if (props.duration) timerId = window.setTimeout(hide, props.duration);
    });
    return {
      show: showRef,
      hide,
      handleClose,
      handleAfterLeave,
      handleLeave,
      handleBeforeLeave,
      handleAfterEnter,
      handleBeforeEnter,
      handleMouseenter,
      handleMouseleave
    };
  },
  render() {
    return openBlock(), createBlock(Transition, {
      name: "notification-transition",
      appear: true,
      onBeforeEnter: this.handleBeforeEnter,
      onAfterEnter: this.handleAfterEnter,
      onBeforeLeave: this.handleBeforeLeave,
      onLeave: this.handleLeave,
      onAfterLeave: this.handleAfterLeave
    }, {
      _: 1,
      default: normalizeSlot(() => {
        return this.show ? (openBlock(), createBlock(Notification, mergeProps({
          key: 1
        }, keep(this.$props, notificationPropKeys, {
          onClose: this.handleClose,
          onMouseenter: this.duration && this.keepAliveOnHover ? mergeEventHandlers([this.handleMouseenter, this.onMouseenter]) : this.onMouseenter,
          onMouseleave: this.duration && this.keepAliveOnHover ? mergeEventHandlers([this.handleMouseleave, this.onMouseleave]) : this.onMouseleave
        })), null, 16)) : null;
      })
    }, 8, ["onBeforeEnter", "onAfterEnter", "onBeforeLeave", "onLeave", "onAfterLeave"]);
  }
});
//#endregion
export { NotificationEnvironment, notificationEnvOptions };