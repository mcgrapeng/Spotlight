const require_checkbox_src_Checkbox = require("../../../checkbox/src/Checkbox.js");
const require_data_table_src_interface = require("../interface.js");
let vue = require("vue");
//#region src/data-table/src/TableParts/BodyCheckbox.tsx
var BodyCheckbox_default = (0, vue.defineComponent)({
	name: "DataTableBodyCheckbox",
	props: {
		rowKey: {
			type: [String, Number],
			required: true
		},
		disabled: {
			type: Boolean,
			required: true
		},
		onUpdateChecked: {
			type: Function,
			required: true
		}
	},
	setup(props) {
		const { mergedCheckedRowKeySetRef, mergedInderminateRowKeySetRef } = (0, vue.inject)(require_data_table_src_interface.dataTableInjectionKey);
		return () => {
			const { rowKey } = props;
			return (0, vue.openBlock)(), (0, vue.createBlock)(require_checkbox_src_Checkbox.default, {
				privateInsideTable: true,
				disabled: props.disabled,
				indeterminate: mergedInderminateRowKeySetRef.value.has(rowKey),
				checked: mergedCheckedRowKeySetRef.value.has(rowKey),
				onUpdateChecked: props.onUpdateChecked
			}, null, 8, [
				"disabled",
				"indeterminate",
				"checked",
				"onUpdateChecked"
			]);
		};
	}
});
//#endregion
module.exports = BodyCheckbox_default;
