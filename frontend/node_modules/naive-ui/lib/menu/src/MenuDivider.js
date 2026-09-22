const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_menu_src_context = require("./context.js");
let vue = require("vue");
//#region src/menu/src/MenuDivider.tsx
var MenuDivider_default = (0, vue.defineComponent)({
	name: "MenuDivider",
	setup() {
		const { mergedClsPrefixRef, isHorizontalRef } = (0, vue.inject)(require_menu_src_context.menuInjectionKey);
		return () => isHorizontalRef.value ? null : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 1,
			class: require_vdom.normalizeClass(`${mergedClsPrefixRef.value}-menu-divider`)
		}, null, 2));
	}
});
//#endregion
module.exports = MenuDivider_default;
