//#region src/dropdown/src/utils.ts
function isSubmenuNode(rawNode, childrenField) {
  return rawNode.type === "submenu" || rawNode.type === void 0 && rawNode[childrenField] !== void 0;
}
function isGroupNode(rawNode) {
  return rawNode.type === "group";
}
function isDividerNode(rawNode) {
  return rawNode.type === "divider";
}
function isRenderNode(rawNode) {
  return rawNode.type === "render";
}
//#endregion
export { isDividerNode, isGroupNode, isRenderNode, isSubmenuNode };