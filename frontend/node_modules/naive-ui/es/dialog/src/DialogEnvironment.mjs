import { keep } from "../../_utils/vue/keep.mjs";
import { dialogPropKeys, dialogProps } from "./dialogProps.mjs";
import { NDialog } from "./Dialog.mjs";
import Modal_default from "../../modal/src/Modal.mjs";
import { createBlock, defineComponent, normalizeClass, openBlock, ref } from "vue";
//#region src/dialog/src/DialogEnvironment.tsx
const exposedDialogEnvProps = {
  ...dialogProps,
  onAfterEnter: Function,
  onAfterLeave: Function,
  transformOrigin: String,
  blockScroll: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  onEsc: Function,
  autoFocus: {
    type: Boolean,
    default: true
  },
  internalStyle: [String, Object],
  maskClosable: {
    type: Boolean,
    default: true
  },
  zIndex: Number,
  onPositiveClick: Function,
  onNegativeClick: Function,
  onClose: Function,
  onMaskClick: Function,
  draggable: [Boolean, Object]
};
const NDialogEnvironment = defineComponent({
  name: "DialogEnvironment",
  props: {
    ...exposedDialogEnvProps,
    internalKey: {
      type: String,
      required: true
    },
    to: [String, Object],
    onInternalAfterLeave: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const showRef = ref(true);
    function handleAfterLeave() {
      const {
        onInternalAfterLeave,
        internalKey,
        onAfterLeave
      } = props;
      if (onInternalAfterLeave) onInternalAfterLeave(internalKey);
      if (onAfterLeave) onAfterLeave();
    }
    function handlePositiveClick(e) {
      const {
        onPositiveClick
      } = props;
      if (onPositiveClick) Promise.resolve(onPositiveClick(e)).then(result => {
        if (result === false) return;
        hide();
      });else hide();
    }
    function handleNegativeClick(e) {
      const {
        onNegativeClick
      } = props;
      if (onNegativeClick) Promise.resolve(onNegativeClick(e)).then(result => {
        if (result === false) return;
        hide();
      });else hide();
    }
    function handleCloseClick() {
      const {
        onClose
      } = props;
      if (onClose) Promise.resolve(onClose()).then(result => {
        if (result === false) return;
        hide();
      });else hide();
    }
    function handleMaskClick(e) {
      const {
        onMaskClick,
        maskClosable
      } = props;
      if (onMaskClick) {
        onMaskClick(e);
        if (maskClosable) hide();
      }
    }
    function handleEsc() {
      const {
        onEsc
      } = props;
      if (onEsc) onEsc();
    }
    function hide() {
      showRef.value = false;
    }
    function handleUpdateShow(value) {
      showRef.value = value;
    }
    return {
      show: showRef,
      hide,
      handleUpdateShow,
      handleAfterLeave,
      handleCloseClick,
      handleNegativeClick,
      handlePositiveClick,
      handleMaskClick,
      handleEsc
    };
  },
  render() {
    const {
      handlePositiveClick,
      handleUpdateShow,
      handleNegativeClick,
      handleCloseClick,
      handleAfterLeave,
      handleMaskClick,
      handleEsc,
      to,
      zIndex,
      maskClosable,
      show
    } = this;
    return openBlock(), createBlock(Modal_default, {
      show,
      onUpdateShow: handleUpdateShow,
      onMaskClick: handleMaskClick,
      onEsc: handleEsc,
      to,
      zIndex,
      maskClosable,
      onAfterEnter: this.onAfterEnter,
      onAfterLeave: handleAfterLeave,
      closeOnEsc: this.closeOnEsc,
      blockScroll: this.blockScroll,
      autoFocus: this.autoFocus,
      transformOrigin: this.transformOrigin,
      draggable: this.draggable,
      internalAppear: true,
      internalDialog: true
    }, {
      default: ({
        draggableClass
      }) => (openBlock(), createBlock(NDialog, keep(this.$props, dialogPropKeys, {
        titleClass: normalizeClass([this.titleClass, draggableClass]),
        style: this.internalStyle,
        onClose: handleCloseClick,
        onNegativeClick: handleNegativeClick,
        onPositiveClick: handlePositiveClick
      }), null, 16))
    }, 1032, ["show", "onUpdateShow", "onMaskClick", "onEsc", "to", "zIndex", "maskClosable", "onAfterEnter", "onAfterLeave", "closeOnEsc", "blockScroll", "autoFocus", "transformOrigin", "draggable"]);
  }
});
//#endregion
export { NDialogEnvironment, exposedDialogEnvProps };