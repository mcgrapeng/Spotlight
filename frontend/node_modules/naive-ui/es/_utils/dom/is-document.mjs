//#region src/_utils/dom/is-document.ts
function isDocument(node) {
  return node.nodeName === "#document";
}
//#endregion
export { isDocument };