let vue = require("vue");
//#region ../../../../../vue-jsx-vapor/vdom
const cacheMap = /* @__PURE__ */ new WeakMap();
function createVNodeCache(key) {
	const i = (0, vue.getCurrentInstance)();
	if (i) {
		if (!cacheMap.has(i)) cacheMap.set(i, {});
		const caches = cacheMap.get(i);
		return caches[key] || (caches[key] = []);
	} else return [];
}
function normalizeVNode(value, flag = 1) {
	let create = vue.createVNode;
	let isBlock = false;
	if (typeof value === "function") {
		isBlock = true;
		(0, vue.openBlock)();
		create = vue.createBlock;
		value = value();
	}
	return (0, vue.isVNode)(value) ? isBlock ? (0, vue.createBlock)(cloneIfMounted(value)) : cloneIfMounted(value) : Array.isArray(value) ? isBlock ? (0, vue.createElementBlock)(vue.Fragment, null, value.map((n) => normalizeVNode(() => n)), -2) : (0, vue.createElementVNode)(vue.Fragment, null, value.slice()) : value == null || typeof value === "boolean" ? create(vue.Comment) : create(vue.Text, null, String(value), flag);
}
function cloneIfMounted(child) {
	return child.el === null && child.patchFlag !== -1 || child.memo ? child : (0, vue.cloneVNode)(child);
}
const normalizeSlotValue = (value) => Array.isArray(value) ? value.map((n) => normalizeVNode(n)) : [normalizeVNode(value)];
const normalizeSlot = (rawSlot) => {
	if (rawSlot._n) return rawSlot;
	return (0, vue.withCtx)((...args) => {
		return normalizeSlotValue(rawSlot(...args));
	});
};
const normalizeSlots = (slots) => {
	return typeof slots === "function" || Object.prototype.toString.call(slots) === "[object Object]" && !(0, vue.isVNode)(slots) ? slots : { default: (0, vue.withCtx)(() => [normalizeVNode(() => slots)]) };
};
const normalizeClass = (value) => (0, vue.normalizeClass)(value) || null;
const defineComponent = vue.defineComponent;
defineComponent((props, { slots }) => {
	const defaultSlot = slots.default;
	return () => ((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(props.in, (item, key, index) => {
		const result = defaultSlot(item, key, index);
		return Array.isArray(result) ? result.length === 1 ? result[0] : normalizeVNode(result) : result;
	}), 128));
}, { props: ["in"] });
//#endregion
exports.createVNodeCache = createVNodeCache;
exports.defineComponent = defineComponent;
exports.normalizeClass = normalizeClass;
exports.normalizeSlot = normalizeSlot;
exports.normalizeSlots = normalizeSlots;
exports.normalizeVNode = normalizeVNode;
