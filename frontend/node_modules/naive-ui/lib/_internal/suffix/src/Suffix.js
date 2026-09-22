const require__utils_vue_resolve_slot = require("../../../_utils/vue/resolve-slot.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../icon/src/Icon.js");
const require__internal_icons_ChevronDown = require("../../icons/ChevronDown.js");
const require__internal_clear_src_Clear = require("../../clear/src/Clear.js");
const require__internal_loading_src_Loading = require("../../loading/src/Loading.js");
let vue = require("vue");
//#region src/_internal/suffix/src/Suffix.tsx
var Suffix_default = (0, vue.defineComponent)({
	name: "InternalSelectionSuffix",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		showArrow: {
			type: Boolean,
			default: void 0
		},
		showClear: {
			type: Boolean,
			default: void 0
		},
		loading: Boolean,
		onClear: Function
	},
	setup(props, { slots }) {
		return () => {
			const { clsPrefix } = props;
			return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_loading_src_Loading.default, {
				clsPrefix,
				class: require_vdom.normalizeClass(`${clsPrefix}-base-suffix`),
				strokeWidth: 24,
				scale: .85,
				show: props.loading
			}, { default: () => props.showArrow ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_clear_src_Clear, {
				key: 1,
				clsPrefix,
				show: props.showClear,
				onClear: props.onClear
			}, { placeholder: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
				clsPrefix,
				class: require_vdom.normalizeClass(`${clsPrefix}-base-suffix__arrow`)
			}, { default: () => require__utils_vue_resolve_slot.resolveSlot(slots.default, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronDown))]) }, 1032, ["clsPrefix", "class"])) }, 1032, [
				"clsPrefix",
				"show",
				"onClear"
			])) : null }, 1032, [
				"clsPrefix",
				"class",
				"show"
			]);
		};
	}
});
//#endregion
module.exports = Suffix_default;
