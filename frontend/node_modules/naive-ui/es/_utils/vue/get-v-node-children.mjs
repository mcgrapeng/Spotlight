//#region src/_utils/vue/get-v-node-children.ts
function getVNodeChildren(vNode, slotName = "default", fallback = []) {
  const {
    children
  } = vNode;
  if (children !== null && typeof children === "object" && !Array.isArray(children)) {
    const slot = children[slotName];
    if (typeof slot === "function") return slot();
  }
  return fallback;
}
//#endregion
export { getVNodeChildren };