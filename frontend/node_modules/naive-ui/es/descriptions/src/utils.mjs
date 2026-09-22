//#region src/descriptions/src/utils.ts
const DESCRIPTION_ITEM_FLAG = "DESCRIPTION_ITEM_FLAG";
function isDescriptionsItem(vNode) {
  if (typeof vNode === "object" && vNode && !Array.isArray(vNode)) return vNode.type && vNode.type["DESCRIPTION_ITEM_FLAG"];
  return false;
}
//#endregion
export { DESCRIPTION_ITEM_FLAG, isDescriptionsItem };