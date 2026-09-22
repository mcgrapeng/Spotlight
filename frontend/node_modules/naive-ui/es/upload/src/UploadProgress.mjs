import { normalizeSlot } from "../../vue-jsx-vapor/vdom.mjs";
import FadeInExpandTransition_default from "../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.mjs";
import Progress_default from "../../progress/src/Progress.mjs";
import { uploadInjectionKey } from "./interface.mjs";
import { createBlock, defineComponent, inject, openBlock } from "vue";
//#region src/upload/src/UploadProgress.tsx
var UploadProgress_default = defineComponent({
  name: "UploadProgress",
  props: {
    show: Boolean,
    percentage: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  setup() {
    return {
      mergedTheme: inject(uploadInjectionKey).mergedThemeRef
    };
  },
  render() {
    return openBlock(), createBlock(FadeInExpandTransition_default, null, {
      _: 1,
      default: normalizeSlot(() => this.show ? (openBlock(), createBlock(Progress_default, {
        key: 1,
        type: "line",
        showIndicator: false,
        percentage: this.percentage,
        status: this.status,
        height: 2,
        theme: this.mergedTheme.peers.Progress,
        themeOverrides: this.mergedTheme.peerOverrides.Progress
      }, null, 8, ["percentage", "status", "theme", "themeOverrides"])) : null)
    });
  }
});
//#endregion
export { UploadProgress_default as default };