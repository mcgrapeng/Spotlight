const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../../_internal/icon/src/Icon.js");
const require__internal_icon_switch_transition_src_IconSwitchTransition = require("../../../_internal/icon-switch-transition/src/IconSwitchTransition.js");
const require__internal_icons_ChevronRight = require("../../../_internal/icons/ChevronRight.js");
const require__internal_loading_src_Loading = require("../../../_internal/loading/src/Loading.js");
let vue = require("vue");
//#region src/data-table/src/TableParts/ExpandTrigger.tsx
const _hoisted_1 = ["onClick"];
var ExpandTrigger_default = (0, vue.defineComponent)({
	name: "DataTableExpandTrigger",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		expanded: Boolean,
		loading: Boolean,
		onClick: {
			type: Function,
			required: true
		},
		renderExpandIcon: { type: Function },
		rowData: {
			type: Object,
			required: true
		}
	},
	render() {
		const { clsPrefix } = this;
		return (() => {
			const _cache = require_vdom.createVNodeCache("82f30e69bbec5134");
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass([`${clsPrefix}-data-table-expand-trigger`, this.expanded && `${clsPrefix}-data-table-expand-trigger--expanded`]),
				onClick: this.onClick,
				onMousedown: _cache[0] || (_cache[0] = (e) => {
					e.preventDefault();
				})
			}, [(0, vue.createVNode)(require__internal_icon_switch_transition_src_IconSwitchTransition, null, { default: () => {
				return this.loading ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_loading_src_Loading.default, {
					key: "loading",
					clsPrefix: this.clsPrefix,
					radius: 85,
					strokeWidth: 15,
					scale: .88
				}, null, 8, ["clsPrefix"])) : this.renderExpandIcon ? this.renderExpandIcon({
					expanded: this.expanded,
					rowData: this.rowData
				}) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
					clsPrefix,
					key: "base-icon"
				}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronRight)) }, 1032, ["clsPrefix"]));
			} }, 1024)], 42, _hoisted_1);
		})();
	}
});
//#endregion
module.exports = ExpandTrigger_default;
