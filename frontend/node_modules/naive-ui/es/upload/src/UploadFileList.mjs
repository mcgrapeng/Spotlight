import { throwError } from "../../_utils/naive/warn.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlots, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import FadeInExpandTransition_default from "../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.mjs";
import ImageGroup_default from "../../image/src/ImageGroup.mjs";
import { uploadInjectionKey } from "./interface.mjs";
import UploadFile_default from "./UploadFile.mjs";
import UploadTrigger_default from "./UploadTrigger.mjs";
import { computed, createBlock, createElementBlock, defineComponent, inject, mergeProps, normalizeStyle, openBlock } from "vue";
//#region src/upload/src/UploadFileList.tsx
var UploadFileList_default = defineComponent({
  name: "UploadFileList",
  setup(_, {
    slots
  }) {
    const NUpload = inject(uploadInjectionKey, null);
    if (!NUpload) throwError("upload-file-list", "`n-upload-file-list` must be placed inside `n-upload`.");
    const {
      abstractRef,
      mergedClsPrefixRef,
      listTypeRef,
      mergedFileListRef,
      fileListClassRef,
      fileListStyleRef,
      cssVarsRef,
      themeClassRef,
      maxReachedRef,
      showTriggerRef,
      imageGroupPropsRef
    } = NUpload;
    const isImageCardTypeRef = computed(() => listTypeRef.value === "image-card");
    const renderFileList = () => mergedFileListRef.value.map((file, index) => (openBlock(), createBlock(UploadFile_default, {
      clsPrefix: mergedClsPrefixRef.value,
      key: file.id,
      file,
      index,
      listType: listTypeRef.value
    }, null, 8, ["clsPrefix", "file", "index", "listType"])));
    const renderUploadFileList = () => isImageCardTypeRef.value ? (openBlock(), createBlock(ImageGroup_default, mergeProps({
      key: 1
    }, imageGroupPropsRef.value), {
      default: renderFileList
    }, 1040)) : (openBlock(), createBlock(FadeInExpandTransition_default, {
      key: 2,
      group: true
    }, {
      default: renderFileList
    }, 1024));
    return () => {
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      const {
        value: abstract
      } = abstractRef;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1([`${mergedClsPrefix}-upload-file-list`, isImageCardTypeRef.value && `${mergedClsPrefix}-upload-file-list--grid`, abstract ? themeClassRef?.value : void 0, fileListClassRef.value]),
        style: normalizeStyle([abstract && cssVarsRef ? cssVarsRef.value : "", fileListStyleRef.value])
      }, [normalizeVNode(() => renderUploadFileList()), normalizeVNode(() => showTriggerRef.value && !maxReachedRef.value && isImageCardTypeRef.value && (openBlock(), createBlock(UploadTrigger_default, null, normalizeSlots(slots), 1024)))], 6);
    };
  }
});
//#endregion
export { UploadFileList_default as default };