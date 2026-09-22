import { onBeforeUnmount, onMounted, watch } from "vue";
import { resizeObserverManager } from "vueuc";
//#region src/_utils/composable/use-resize.ts
function useOnResize(elRef, onResize) {
  if (onResize) {
    onMounted(() => {
      const {
        value: el
      } = elRef;
      if (el) resizeObserverManager.registerHandler(el, onResize);
    });
    watch(elRef, (_, oldEl) => {
      if (oldEl) resizeObserverManager.unregisterHandler(oldEl);
    }, {
      deep: false
    });
    onBeforeUnmount(() => {
      const {
        value: el
      } = elRef;
      if (el) resizeObserverManager.unregisterHandler(el);
    });
  }
}
//#endregion
export { useOnResize };