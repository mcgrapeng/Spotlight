import { isColumnResizable } from "./utils.mjs";
import { ref } from "vue";
//#region src/data-table/src/use-resizable.ts
function useResizable() {
  const resizableWidthsRef = ref({});
  function getResizableWidth(key) {
    return resizableWidthsRef.value[key];
  }
  function doUpdateResizableWidth(column, width) {
    if (isColumnResizable(column) && "key" in column) resizableWidthsRef.value[column.key] = width;
  }
  function clearResizableWidth() {
    resizableWidthsRef.value = {};
  }
  return {
    getResizableWidth,
    doUpdateResizableWidth,
    clearResizableWidth
  };
}
//#endregion
export { useResizable };