import { Comment, Fragment, Text, cloneVNode, createBlock, createElementBlock, createElementVNode, createVNode, defineComponent, getCurrentInstance, isVNode, normalizeClass, openBlock, renderList, withCtx } from "vue";
//#region ../../../../../vue-jsx-vapor/vdom
const cacheMap = /* @__PURE__ */new WeakMap();
function createVNodeCache(key) {
  const i = getCurrentInstance();
  if (i) {
    if (!cacheMap.has(i)) cacheMap.set(i, {});
    const caches = cacheMap.get(i);
    return caches[key] || (caches[key] = []);
  } else return [];
}
function normalizeVNode(value, flag = 1) {
  let create = createVNode;
  let isBlock = false;
  if (typeof value === "function") {
    isBlock = true;
    openBlock();
    create = createBlock;
    value = value();
  }
  return isVNode(value) ? isBlock ? createBlock(cloneIfMounted(value)) : cloneIfMounted(value) : Array.isArray(value) ? isBlock ? createElementBlock(Fragment, null, value.map(n => normalizeVNode(() => n)), -2) : createElementVNode(Fragment, null, value.slice()) : value == null || typeof value === "boolean" ? create(Comment) : create(Text, null, String(value), flag);
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
const normalizeSlotValue = value => Array.isArray(value) ? value.map(n => normalizeVNode(n)) : [normalizeVNode(value)];
const normalizeSlot = rawSlot => {
  if (rawSlot._n) return rawSlot;
  return withCtx((...args) => {
    return normalizeSlotValue(rawSlot(...args));
  });
};
const normalizeSlots = slots => {
  return typeof slots === "function" || Object.prototype.toString.call(slots) === "[object Object]" && !isVNode(slots) ? slots : {
    default: withCtx(() => [normalizeVNode(() => slots)])
  };
};
const normalizeClass$1 = value => normalizeClass(value) || null;
const defineComponent$1 = defineComponent;
defineComponent$1((props, {
  slots
}) => {
  const defaultSlot = slots.default;
  return () => (openBlock(true), createElementBlock(Fragment, null, renderList(props.in, (item, key, index) => {
    const result = defaultSlot(item, key, index);
    return Array.isArray(result) ? result.length === 1 ? result[0] : normalizeVNode(result) : result;
  }), 128));
}, {
  props: ["in"]
});
//#endregion
export { createVNodeCache, defineComponent$1 as defineComponent, normalizeClass$1 as normalizeClass, normalizeSlot, normalizeSlots, normalizeVNode };