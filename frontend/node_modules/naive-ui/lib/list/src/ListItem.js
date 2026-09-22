const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_list_src_List = require("./List.js");
let vue = require("vue");
//#region src/list/src/ListItem.tsx
var ListItem_default = (0, vue.defineComponent)({
	name: "ListItem",
	slots: Object,
	setup() {
		const listInjection = (0, vue.inject)(require_list_src_List.listInjectionKey, null);
		if (!listInjection) require__utils_naive_warn.throwError("list-item", "`n-list-item` must be placed in `n-list`.");
		return {
			showDivider: listInjection.showDividerRef,
			mergedClsPrefix: listInjection.mergedClsPrefixRef
		};
	},
	render() {
		const { $slots, mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("li", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-list-item`) }, [
			$slots.prefix ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-list-item__prefix`)
			}, [require_vdom.normalizeVNode(() => $slots.prefix())], 2)) : require_vdom.normalizeVNode(() => null),
			$slots.default ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-list-item__main`)
			}, [require_vdom.normalizeVNode(() => $slots.default())], 2)) : require_vdom.normalizeVNode(() => null),
			$slots.suffix ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 4,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-list-item__suffix`)
			}, [require_vdom.normalizeVNode(() => $slots.suffix())], 2)) : require_vdom.normalizeVNode(() => null),
			require_vdom.normalizeVNode(() => this.showDivider && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-list-item__divider`) }, null, 2)))
		], 2);
	}
});
//#endregion
module.exports = ListItem_default;
