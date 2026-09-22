import { vShow } from "vue";
//#region src/_utils/vue/is-node-v-show-false.ts
function isNodeVShowFalse(vNode) {
  const showDir = vNode.dirs?.find(({
    dir
  }) => dir === vShow);
  return !!(showDir && showDir.value === false);
}
//#endregion
export { isNodeVShowFalse };