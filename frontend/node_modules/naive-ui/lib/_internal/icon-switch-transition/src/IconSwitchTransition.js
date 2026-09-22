const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/_internal/icon-switch-transition/src/IconSwitchTransition.tsx
var IconSwitchTransition_default = (0, vue.defineComponent)({
	name: "BaseIconSwitchTransition",
	setup(_, { slots }) {
		const isMountedRef = (0, vooks.useIsMounted)();
		return () => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "icon-switch-transition",
			appear: isMountedRef.value
		}, require_vdom.normalizeSlots(slots), 1032, ["appear"]));
	}
});
//#endregion
module.exports = IconSwitchTransition_default;
