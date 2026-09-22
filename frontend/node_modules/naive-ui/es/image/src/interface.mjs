import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
//#region src/image/src/interface.ts
const imagePreviewSharedProps = {
  ...useTheme.props,
  onPreviewPrev: Function,
  onPreviewNext: Function,
  showToolbar: {
    type: Boolean,
    default: true
  },
  showToolbarTooltip: Boolean,
  keepDragOffset: Boolean,
  renderToolbar: Function
};
const imageContextKey = createInjectionKey("n-image");
//#endregion
export { imageContextKey, imagePreviewSharedProps };