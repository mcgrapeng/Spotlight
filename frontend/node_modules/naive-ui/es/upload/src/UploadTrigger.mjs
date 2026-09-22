import { throwError } from "../../_utils/naive/warn.mjs";
import { resolveSlotWithTypedProps } from "../../_utils/vue/resolve-slot.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Add_default from "../../_internal/icons/Add.mjs";
import { uploadInjectionKey } from "./interface.mjs";
import UploadDragger_default from "./UploadDragger.mjs";
import { getFilesFromEntries } from "./utils.mjs";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, inject, normalizeStyle, openBlock } from "vue";
//#region src/upload/src/UploadTrigger.tsx
const _hoisted_1 = ["onClick", "onDrop", "onDragover", "onDragenter", "onDragleave"];
var UploadTrigger_default = defineComponent({
  name: "UploadTrigger",
  props: {
    abstract: Boolean
  },
  slots: Object,
  setup(props, {
    slots
  }) {
    const NUpload = inject(uploadInjectionKey, null);
    if (!NUpload) throwError("upload-trigger", "`n-upload-trigger` must be placed inside `n-upload`.");
    const {
      mergedClsPrefixRef,
      mergedDisabledRef,
      maxReachedRef,
      listTypeRef,
      dragOverRef,
      openOpenFileDialog,
      draggerInsideRef,
      handleFileAddition,
      mergedDirectoryDndRef,
      triggerClassRef,
      triggerStyleRef
    } = NUpload;
    const isImageCardTypeRef = computed(() => listTypeRef.value === "image-card");
    function handleTriggerClick() {
      if (mergedDisabledRef.value || maxReachedRef.value) return;
      openOpenFileDialog();
    }
    function handleTriggerDragOver(e) {
      e.preventDefault();
      dragOverRef.value = true;
    }
    function handleTriggerDragEnter(e) {
      e.preventDefault();
      dragOverRef.value = true;
    }
    function handleTriggerDragLeave(e) {
      e.preventDefault();
      dragOverRef.value = false;
    }
    function handleTriggerDrop(e) {
      e.preventDefault();
      if (!draggerInsideRef.value || mergedDisabledRef.value || maxReachedRef.value) {
        dragOverRef.value = false;
        return;
      }
      const dataTransferItems = e.dataTransfer?.items;
      if (dataTransferItems?.length) getFilesFromEntries(Array.from(dataTransferItems).map(item => item.webkitGetAsEntry()), mergedDirectoryDndRef.value).then(files => {
        handleFileAddition(files);
      }).finally(() => {
        dragOverRef.value = false;
      });else dragOverRef.value = false;
    }
    return () => {
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      const options = {
        handleClick: handleTriggerClick,
        handleDrop: handleTriggerDrop,
        handleDragOver: handleTriggerDragOver,
        handleDragEnter: handleTriggerDragEnter,
        handleDragLeave: handleTriggerDragLeave
      };
      return props.abstract ? slots.default?.(options) : (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass$1([`${mergedClsPrefix}-upload-trigger`, (mergedDisabledRef.value || maxReachedRef.value) && `${mergedClsPrefix}-upload-trigger--disabled`, isImageCardTypeRef.value && `${mergedClsPrefix}-upload-trigger--image-card`, triggerClassRef.value]),
        style: normalizeStyle(triggerStyleRef.value),
        onClick: handleTriggerClick,
        onDrop: handleTriggerDrop,
        onDragover: handleTriggerDragOver,
        onDragenter: handleTriggerDragEnter,
        onDragleave: handleTriggerDragLeave
      }, [isImageCardTypeRef.value ? (openBlock(), createBlock(UploadDragger_default, {
        key: 0
      }, {
        default: () => resolveSlotWithTypedProps(slots.default, options, () => [(openBlock(), createBlock(Icon_default, {
          clsPrefix: mergedClsPrefix
        }, {
          default: () => (openBlock(), createBlock(Add_default))
        }, 1032, ["clsPrefix"]))])
      }, 1024)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => slots.default?.(options))], 64))], 46, _hoisted_1));
    };
  }
});
//#endregion
export { UploadTrigger_default as default };