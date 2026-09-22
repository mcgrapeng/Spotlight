import { omit } from "../../_utils/vue/omit.mjs";
import { dialogApiInjectionKey, dialogProviderInjectionKey, dialogReactiveListInjectionKey } from "./context.mjs";
import { NDialogEnvironment } from "./DialogEnvironment.mjs";
import { createId } from "seemly";
import { Fragment, defineComponent, h, provide, reactive, ref } from "vue";
import { useClickPosition, useClicked } from "vooks";
//#region src/dialog/src/DialogProvider.ts
const dialogProviderProps = {
  injectionKey: String,
  to: [String, Object]
};
const NDialogProvider = defineComponent({
  name: "DialogProvider",
  props: dialogProviderProps,
  setup() {
    const dialogListRef = ref([]);
    const dialogInstRefs = {};
    function create(options = {}) {
      const key = createId();
      const dialogReactive = reactive({
        ...options,
        key,
        destroy: () => {
          dialogInstRefs[`n-dialog-${key}`]?.hide();
        }
      });
      dialogListRef.value.push(dialogReactive);
      return dialogReactive;
    }
    const typedApi = ["info", "success", "warning", "error"].map(type => options => {
      return create({
        ...options,
        type
      });
    });
    function handleAfterLeave(key) {
      const {
        value: dialogList
      } = dialogListRef;
      dialogList.splice(dialogList.findIndex(dialog => dialog.key === key), 1);
    }
    function destroyAll() {
      Object.values(dialogInstRefs).forEach(dialogInstRef => {
        dialogInstRef?.hide();
      });
    }
    const api = {
      create,
      destroyAll,
      info: typedApi[0],
      success: typedApi[1],
      warning: typedApi[2],
      error: typedApi[3]
    };
    provide(dialogApiInjectionKey, api);
    provide(dialogProviderInjectionKey, {
      clickedRef: useClicked(64),
      clickedPositionRef: useClickPosition()
    });
    provide(dialogReactiveListInjectionKey, dialogListRef);
    return {
      ...api,
      dialogList: dialogListRef,
      dialogInstRefs,
      handleAfterLeave
    };
  },
  render() {
    return h(Fragment, null, [this.dialogList.map(dialog => h(NDialogEnvironment, omit(dialog, ["destroy", "style"], {
      internalStyle: dialog.style,
      to: this.to,
      ref: inst => {
        if (inst === null) delete this.dialogInstRefs[`n-dialog-${dialog.key}`];else this.dialogInstRefs[`n-dialog-${dialog.key}`] = inst;
      },
      internalKey: dialog.key,
      onInternalAfterLeave: this.handleAfterLeave
    }))), this.$slots.default?.()]);
  }
});
//#endregion
export { NDialogProvider, dialogProviderProps };