//#region src/_utils/naive/attribute.ts
function getTitleAttribute(value) {
  switch (typeof value) {
    case "string":
      return value || void 0;
    case "number":
      return String(value);
    default:
      return;
  }
}
//#endregion
export { getTitleAttribute };