import { internalSelectionMenuBodyInjectionKey } from "../../_internal/select-menu/src/interface.mjs";
import { drawerBodyInjectionKey } from "../../drawer/src/interface.mjs";
import { modalBodyInjectionKey } from "../../modal/src/interface.mjs";
import { popoverBodyInjectionKey } from "../../popover/src/interface.mjs";
import { inject, onBeforeUnmount, onMounted, ref } from "vue";
import { off, on } from "evtd";
import { useMemo } from "vooks";
//#region src/_utils/composable/use-adjusted-to.ts
const teleportDisabled = "__disabled__";
function useAdjustedTo(props) {
  const modal = inject(modalBodyInjectionKey, null);
  const drawer = inject(drawerBodyInjectionKey, null);
  const popover = inject(popoverBodyInjectionKey, null);
  const selectMenu = inject(internalSelectionMenuBodyInjectionKey, null);
  const fullscreenElementRef = ref();
  if (typeof document !== "undefined") {
    fullscreenElementRef.value = document.fullscreenElement;
    const handleFullscreenChange = () => {
      fullscreenElementRef.value = document.fullscreenElement;
    };
    onMounted(() => {
      on("fullscreenchange", document, handleFullscreenChange);
    });
    onBeforeUnmount(() => {
      off("fullscreenchange", document, handleFullscreenChange);
    });
  }
  return useMemo(() => {
    const {
      to
    } = props;
    if (to !== void 0) {
      if (to === false) return teleportDisabled;
      if (to === true) return fullscreenElementRef.value || "body";
      return to;
    }
    if (modal?.value) return modal.value.$el ?? modal.value;
    if (drawer?.value) return drawer.value;
    if (popover?.value) return popover.value;
    if (selectMenu?.value) return selectMenu.value;
    return to ?? (fullscreenElementRef.value || "body");
  });
}
useAdjustedTo.tdkey = teleportDisabled;
useAdjustedTo.propTo = {
  type: [String, Object, Boolean],
  default: void 0
};
//#endregion
export { useAdjustedTo };