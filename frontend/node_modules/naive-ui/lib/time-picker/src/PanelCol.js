const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/time-picker/src/PanelCol.tsx
const _hoisted_1 = ["data-active", "onClick"];
var PanelCol_default = (0, vue.defineComponent)({
	name: "TimePickerPanelCol",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		data: {
			type: Array,
			required: true
		},
		activeValue: {
			type: [Number, String],
			default: null
		},
		onItemClick: Function
	},
	render() {
		const { activeValue, onItemClick, clsPrefix } = this;
		return this.data.map((item) => {
			const { label, disabled, value } = item;
			const active = activeValue === value;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: label,
				"data-active": active ? "" : null,
				class: require_vdom.normalizeClass([
					`${clsPrefix}-time-picker-col__item`,
					active && `${clsPrefix}-time-picker-col__item--active`,
					disabled && `${clsPrefix}-time-picker-col__item--disabled`
				]),
				onClick: onItemClick && !disabled ? () => {
					onItemClick(value);
				} : void 0
			}, [require_vdom.normalizeVNode(() => label)], 10, _hoisted_1);
		});
	}
});
//#endregion
module.exports = PanelCol_default;
