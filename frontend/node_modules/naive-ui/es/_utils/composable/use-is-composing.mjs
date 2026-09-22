import { isBrowser } from "../env/is-browser.mjs";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
//#region src/_utils/composable/use-is-composing.ts
const isComposingRef = ref(false);
function compositionStartHandler() {
  isComposingRef.value = true;
}
function compositionEndHandler() {
  isComposingRef.value = false;
}
let mountedCount = 0;
function useIsComposing() {
  if (isBrowser) {
    onBeforeMount(() => {
      if (!mountedCount) {
        window.addEventListener("compositionstart", compositionStartHandler);
        window.addEventListener("compositionend", compositionEndHandler);
      }
      mountedCount++;
    });
    onBeforeUnmount(() => {
      if (mountedCount <= 1) {
        window.removeEventListener("compositionstart", compositionStartHandler);
        window.removeEventListener("compositionend", compositionEndHandler);
        mountedCount = 0;
      } else mountedCount--;
    });
  }
  return isComposingRef;
}
//#endregion
export { useIsComposing };