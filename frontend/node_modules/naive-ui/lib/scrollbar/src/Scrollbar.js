Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
let vue = require("vue");
//#region src/scrollbar/src/Scrollbar.tsx
const scrollbarProps = {
	...require__mixins_use_theme.default.props,
	trigger: String,
	xScrollable: Boolean,
	onScroll: Function,
	contentClass: String,
	contentStyle: [Object, String],
	yPlacement: {
		type: String,
		default: "right"
	},
	xPlacement: {
		type: String,
		default: "bottom"
	}
};
const Scrollbar = (0, vue.defineComponent)({
	name: "Scrollbar",
	props: scrollbarProps,
	setup() {
		const scrollbarInstRef = (0, vue.ref)(null);
		return {
			scrollTo: (...args) => {
				scrollbarInstRef.value?.scrollTo(args[0], args[1]);
			},
			scrollBy: (...args) => {
				scrollbarInstRef.value?.scrollBy(args[0], args[1]);
			},
			scrollbarInstRef
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, (0, vue.mergeProps)({ ref: "scrollbarInstRef" }, this.$props), require_vdom.normalizeSlots(this.$slots), 1040);
	}
});
//#endregion
exports.default = Scrollbar;
exports.scrollbarProps = scrollbarProps;
