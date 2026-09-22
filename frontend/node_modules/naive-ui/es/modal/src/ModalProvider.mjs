import { omit } from "../../_utils/vue/omit.mjs";
import { modalApiInjectionKey, modalProviderInjectionKey, modalReactiveListInjectionKey } from "./context.mjs";
import { NModalEnvironment } from "./ModalEnvironment.mjs";
import { createId } from "seemly";
import { Fragment, defineComponent, h, provide, reactive, ref } from "vue";
import { useClickPosition, useClicked } from "vooks";
//#region src/modal/src/ModalProvider.ts
const modalProviderProps = {
  to: [String, Object]
};
const NModalProvider = defineComponent({
  name: "ModalProvider",
  props: modalProviderProps,
  setup() {
    const modalListRef = ref([]);
    const modalInstRefs = {};
    function create(options = {}) {
      const key = createId();
      const modalReactive = reactive({
        ...options,
        key,
        destroy: () => {
          modalInstRefs[`n-modal-${key}`]?.hide();
        }
      });
      modalListRef.value.push(modalReactive);
      return modalReactive;
    }
    function handleAfterLeave(key) {
      const {
        value: modalList
      } = modalListRef;
      modalList.splice(modalList.findIndex(modal => modal.key === key), 1);
    }
    function destroyAll() {
      Object.values(modalInstRefs).forEach(modalInstRef => {
        modalInstRef?.hide();
      });
    }
    const api = {
      create,
      destroyAll
    };
    provide(modalApiInjectionKey, api);
    provide(modalProviderInjectionKey, {
      clickedRef: useClicked(64),
      clickedPositionRef: useClickPosition()
    });
    provide(modalReactiveListInjectionKey, modalListRef);
    return {
      ...api,
      modalList: modalListRef,
      modalInstRefs,
      handleAfterLeave
    };
  },
  render() {
    return h(Fragment, null, [this.modalList.map(modal => h(NModalEnvironment, omit(modal, ["destroy", "render"], {
      to: modal.to ?? this.to,
      ref: inst => {
        if (inst === null) delete this.modalInstRefs[`n-modal-${modal.key}`];else this.modalInstRefs[`n-modal-${modal.key}`] = inst;
      },
      internalKey: modal.key,
      onInternalAfterLeave: this.handleAfterLeave
    }), {
      default: modal.render
    })), this.$slots.default?.()]);
  }
});
//#endregion
export { NModalProvider, modalProviderProps };