import { call } from "../../_utils/vue/call.mjs";
import { omit } from "../../_utils/vue/omit.mjs";
import { normalizeSlots } from "../../vue-jsx-vapor/vdom.mjs";
import Modal_default, { modalProps } from "./Modal.mjs";
import { createBlock, defineComponent, mergeProps, openBlock, ref } from "vue";
//#region src/modal/src/ModalEnvironment.tsx
const NModalEnvironment = defineComponent({
  name: "ModalEnvironment",
  props: {
    ...modalProps,
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
      const {
        onUpdateShow,
        "onUpdate:show": _onUpdateShow
      } = props;
      if (onUpdateShow) call(onUpdateShow, value);
      if (_onUpdateShow) call(_onUpdateShow, value);
      showRef.value = value;
    }
    return {
      show: showRef,
      hide,
      handleUpdateShow,
      handleAfterLeave,
      handleMaskClick,
      handleEsc
    };
  },
  render() {
    const {
      handleUpdateShow,
      handleAfterLeave,
      handleMaskClick,
      handleEsc,
      show
    } = this;
    return openBlock(), createBlock(Modal_default, mergeProps(omit(this.$props, ["onUpdateShow", "onUpdate:show", "onMaskClick", "onEsc", "onAfterLeave"]), {
      show,
      onUpdateShow: handleUpdateShow,
      onMaskClick: handleMaskClick,
      onEsc: handleEsc,
      onAfterLeave: handleAfterLeave,
      internalAppear: true,
      internalModal: true
    }), normalizeSlots(this.$slots), 1040, ["show", "onUpdateShow", "onMaskClick", "onEsc", "onAfterLeave", "internalAppear", "internalModal"]);
  }
});
//#endregion
export { NModalEnvironment };