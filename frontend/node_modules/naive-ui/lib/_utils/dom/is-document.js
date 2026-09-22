Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/_utils/dom/is-document.ts
function isDocument(node) {
	return node.nodeName === "#document";
}
//#endregion
exports.isDocument = isDocument;
