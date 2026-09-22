import { throwError } from "../../_utils/naive/warn.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { uploadInjectionKey } from "./interface.mjs";
import { createElementBlock, defineComponent, inject, openBlock } from "vue";
//#region src/upload/src/UploadDragger.tsx
const uploadDraggerKey = "__UPLOAD_DRAGGER__";
var UploadDragger_default = defineComponent({
  name: "UploadDragger",
  [uploadDraggerKey]: true,
  setup(_, {
    slots
  }) {
    const NUpload = inject(uploadInjectionKey, null);
    if (!NUpload) throwError("upload-dragger", "`n-upload-dragger` must be placed inside `n-upload`.");
    return () => {
      const {
        mergedClsPrefixRef: {
          value: mergedClsPrefix
        },
        mergedDisabledRef: {
          value: mergedDisabled
        },
        maxReachedRef: {
          value: maxReached
        }
      } = NUpload;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1([`${mergedClsPrefix}-upload-dragger`, (mergedDisabled || maxReached) && `${mergedClsPrefix}-upload-dragger--disabled`])
      }, [normalizeVNode(() => slots.default?.())], 2);
    };
  }
});
//#endregion
export { UploadDragger_default as default, uploadDraggerKey };