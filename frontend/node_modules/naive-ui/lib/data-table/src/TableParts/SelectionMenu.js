const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../../_internal/icon/src/Icon.js");
const require__internal_icons_ChevronDown = require("../../../_internal/icons/ChevronDown.js");
const require_data_table_src_interface = require("../interface.js");
const require_dropdown_src_Dropdown = require("../../../dropdown/src/Dropdown.js");
let vue = require("vue");
//#region src/data-table/src/TableParts/SelectionMenu.tsx
const allKey = "_n_all__";
const noneKey = "_n_none__";
function createSelectHandler(options, rawPaginatedDataRef, doCheckAll, doUncheckAll) {
	if (!options) return () => {};
	return (key) => {
		for (const option of options) switch (key) {
			case allKey:
				doCheckAll(true);
				return;
			case noneKey:
				doUncheckAll(true);
				return;
			default: if (typeof option === "object" && option.key === key) {
				option.onSelect(rawPaginatedDataRef.value);
				return;
			}
		}
	};
}
function createDropdownOptions(options, localeRef) {
	if (!options) return [];
	return options.map((option) => {
		switch (option) {
			case "all": return {
				label: localeRef.checkTableAll,
				key: allKey
			};
			case "none": return {
				label: localeRef.uncheckTableAll,
				key: noneKey
			};
			default: return option;
		}
	});
}
var SelectionMenu_default = (0, vue.defineComponent)({
	name: "DataTableSelectionMenu",
	props: { clsPrefix: {
		type: String,
		required: true
	} },
	setup(props) {
		const { props: dataTableProps, localeRef, checkOptionsRef, rawPaginatedDataRef, doCheckAll, doUncheckAll } = (0, vue.inject)(require_data_table_src_interface.dataTableInjectionKey);
		const handleSelectRef = (0, vue.computed)(() => createSelectHandler(checkOptionsRef.value, rawPaginatedDataRef, doCheckAll, doUncheckAll));
		const optionsRef = (0, vue.computed)(() => createDropdownOptions(checkOptionsRef.value, localeRef.value));
		return () => {
			const { clsPrefix } = props;
			return (0, vue.openBlock)(), (0, vue.createBlock)(require_dropdown_src_Dropdown.default, {
				theme: dataTableProps.theme?.peers?.Dropdown,
				themeOverrides: dataTableProps.themeOverrides?.peers?.Dropdown,
				options: optionsRef.value,
				onSelect: handleSelectRef.value
			}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
				clsPrefix,
				class: require_vdom.normalizeClass(`${clsPrefix}-data-table-check-extra`)
			}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronDown)) }, 1032, ["clsPrefix", "class"])) }, 1032, [
				"theme",
				"themeOverrides",
				"options",
				"onSelect"
			]);
		};
	}
});
//#endregion
module.exports = SelectionMenu_default;
