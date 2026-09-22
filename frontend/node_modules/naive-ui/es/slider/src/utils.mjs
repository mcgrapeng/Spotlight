import { onBeforeUpdate } from "vue";
//#region src/slider/src/utils.ts
function isTouchEvent(e) {
  return window.TouchEvent && e instanceof window.TouchEvent;
}
function useRefs() {
  const refs = /* @__PURE__ */new Map();
  const setRefs = index => el => {
    refs.set(index, el);
  };
  onBeforeUpdate(() => {
    refs.clear();
  });
  return [refs, setRefs];
}
//#endregion
export { isTouchEvent, useRefs };