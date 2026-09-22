//#region src/_utils/vue/create-data-key.ts
function createDataKey(key) {
  return typeof key === "string" ? `s-${key}` : `n-${key}`;
}
//#endregion
export { createDataKey };