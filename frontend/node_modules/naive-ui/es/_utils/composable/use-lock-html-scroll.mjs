import { onBeforeUnmount, onMounted, ref, watch } from "vue";
//#region src/_utils/composable/use-lock-html-scroll.ts
let lockCount = 0;
let originalMarginRight = "";
let originalOverflow = "";
let originalOverflowX = "";
let originalOverflowY = "";
const lockHtmlScrollRightCompensationRef = ref("0px");
function useLockHtmlScroll(lockRef) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  let watchStopHandle;
  let activated = false;
  const unlock = () => {
    el.style.marginRight = originalMarginRight;
    el.style.overflow = originalOverflow;
    el.style.overflowX = originalOverflowX;
    el.style.overflowY = originalOverflowY;
    lockHtmlScrollRightCompensationRef.value = "0px";
  };
  onMounted(() => {
    watchStopHandle = watch(lockRef, value => {
      if (value) {
        if (!lockCount) {
          const scrollbarWidth = window.innerWidth - el.offsetWidth;
          if (scrollbarWidth > 0) {
            originalMarginRight = el.style.marginRight;
            el.style.marginRight = `${scrollbarWidth}px`;
            lockHtmlScrollRightCompensationRef.value = `${scrollbarWidth}px`;
          }
          originalOverflow = el.style.overflow;
          originalOverflowX = el.style.overflowX;
          originalOverflowY = el.style.overflowY;
          el.style.overflow = "hidden";
          el.style.overflowX = "hidden";
          el.style.overflowY = "hidden";
        }
        activated = true;
        lockCount++;
      } else {
        lockCount--;
        if (!lockCount) unlock();
        activated = false;
      }
    }, {
      immediate: true
    });
  });
  onBeforeUnmount(() => {
    watchStopHandle?.();
    if (activated) {
      lockCount--;
      if (!lockCount) unlock();
      activated = false;
    }
  });
}
//#endregion
export { lockHtmlScrollRightCompensationRef, useLockHtmlScroll };