const require_data_table_src_interface = require("../interface.js");
const require_radio_src_Radio = require("../../../radio/src/Radio.js");
let vue = require("vue");
//#region src/data-table/src/TableParts/BodyRadio.tsx
var BodyRadio_default = (0, vue.defineComponent)({
	name: "DataTableBodyRadio",
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
		const { mergedCheckedRowKeySetRef, componentId } = (0, vue.inject)(require_data_table_src_interface.dataTableInjectionKey);
		return () => {
			const { rowKey } = props;
			return (0, vue.openBlock)(), (0, vue.createBlock)(require_radio_src_Radio.default, {
				name: componentId,
				disabled: props.disabled,
				checked: mergedCheckedRowKeySetRef.value.has(rowKey),
				onUpdateChecked: props.onUpdateChecked
			}, null, 8, [
				"name",
				"disabled",
				"checked",
				"onUpdateChecked"
			]);
		};
	}
});
//#endregion
module.exports = BodyRadio_default;
