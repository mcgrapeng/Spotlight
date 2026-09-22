const require__mixins_use_config = require("../../../_mixins/use-config.js");
const require__mixins_use_rtl = require("../../../_mixins/use-rtl.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../../_internal/scrollbar/src/Scrollbar.js");
const require_button_src_Button = require("../../../button/src/Button.js");
const require_checkbox_src_CheckboxGroup = require("../../../checkbox/src/CheckboxGroup.js");
const require_checkbox_src_Checkbox = require("../../../checkbox/src/Checkbox.js");
const require_data_table_src_interface = require("../interface.js");
const require_data_table_src_utils = require("../utils.js");
const require_radio_src_Radio = require("../../../radio/src/Radio.js");
const require_radio_src_RadioGroup = require("../../../radio/src/RadioGroup.js");
let vue = require("vue");
//#region src/data-table/src/HeaderButton/FilterMenu.tsx
var FilterMenu_default = (0, vue.defineComponent)({
	name: "DataTableFilterMenu",
	props: {
		column: {
			type: Object,
			required: true
		},
		radioGroupName: {
			type: String,
			required: true
		},
		multiple: {
			type: Boolean,
			required: true
		},
		value: {
			type: [
				Array,
				String,
				Number
			],
			default: null
		},
		options: {
			type: Array,
			required: true
		},
		onConfirm: {
			type: Function,
			required: true
		},
		onClear: {
			type: Function,
			required: true
		},
		onChange: {
			type: Function,
			required: true
		}
	},
	setup(props) {
		const { mergedClsPrefixRef: mergedClsPrefixRefRtl, mergedRtlRef } = require__mixins_use_config.default(props);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("DataTable", mergedRtlRef, mergedClsPrefixRefRtl);
		const { mergedClsPrefixRef, mergedThemeRef, localeRef } = (0, vue.inject)(require_data_table_src_interface.dataTableInjectionKey);
		const temporalValueRef = (0, vue.ref)(props.value);
		const checkboxGroupValueRef = (0, vue.computed)(() => {
			const { value: temporalValue } = temporalValueRef;
			if (!Array.isArray(temporalValue)) return null;
			return temporalValue;
		});
		const radioGroupValueRef = (0, vue.computed)(() => {
			const { value: temporalValue } = temporalValueRef;
			if (require_data_table_src_utils.shouldUseArrayInSingleMode(props.column)) return Array.isArray(temporalValue) && temporalValue.length && temporalValue[0] || null;
			if (!Array.isArray(temporalValue)) return temporalValue;
			return null;
		});
		function doChange(value) {
			props.onChange(value);
		}
		function handleChange(value) {
			if (props.multiple && Array.isArray(value)) temporalValueRef.value = value;
			else if (require_data_table_src_utils.shouldUseArrayInSingleMode(props.column) && !Array.isArray(value))
 /** this branch is for compatibility */
			temporalValueRef.value = [value];
			else temporalValueRef.value = value;
		}
		function handleConfirmClick() {
			doChange(temporalValueRef.value);
			props.onConfirm();
		}
		function handleClearClick() {
			if (props.multiple || require_data_table_src_utils.shouldUseArrayInSingleMode(props.column)) doChange([]);
			else doChange(null);
			props.onClear();
		}
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			rtlEnabled: rtlEnabledRef,
			mergedTheme: mergedThemeRef,
			locale: localeRef,
			checkboxGroupValue: checkboxGroupValueRef,
			radioGroupValue: radioGroupValueRef,
			handleChange,
			handleConfirmClick,
			handleClearClick
		};
	},
	render() {
		const { mergedTheme, locale, mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass([`${mergedClsPrefix}-data-table-filter-menu`, this.rtlEnabled && `${mergedClsPrefix}-data-table-filter-menu--rtl`]) }, [(0, vue.createVNode)(require__internal_scrollbar_src_Scrollbar.default, null, { default: () => {
			const { checkboxGroupValue, handleChange } = this;
			return this.multiple ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_checkbox_src_CheckboxGroup.default, {
				key: 1,
				value: checkboxGroupValue,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-filter-menu__group`),
				onUpdateValue: handleChange
			}, { default: () => this.options.map((option) => {
				return (0, vue.openBlock)(), (0, vue.createBlock)(require_checkbox_src_Checkbox.default, {
					key: option.value,
					theme: mergedTheme.peers.Checkbox,
					themeOverrides: mergedTheme.peerOverrides.Checkbox,
					value: option.value
				}, { default: () => option.label }, 1032, [
					"theme",
					"themeOverrides",
					"value"
				]);
			}) }, 1032, [
				"value",
				"class",
				"onUpdateValue"
			])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_radio_src_RadioGroup.default, {
				key: 2,
				name: this.radioGroupName,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-filter-menu__group`),
				value: this.radioGroupValue,
				onUpdateValue: this.handleChange
			}, { default: () => this.options.map((option) => ((0, vue.openBlock)(), (0, vue.createBlock)(require_radio_src_Radio.default, {
				key: option.value,
				value: option.value,
				theme: mergedTheme.peers.Radio,
				themeOverrides: mergedTheme.peerOverrides.Radio
			}, { default: () => option.label }, 1032, [
				"value",
				"theme",
				"themeOverrides"
			]))) }, 1032, [
				"name",
				"class",
				"value",
				"onUpdateValue"
			]));
		} }, 1024), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-filter-menu__action`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
			size: "tiny",
			theme: mergedTheme.peers.Button,
			themeOverrides: mergedTheme.peerOverrides.Button,
			onClick: this.handleClearClick
		}, { default: () => locale.clear }, 1032, [
			"theme",
			"themeOverrides",
			"onClick"
		])), ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
			theme: mergedTheme.peers.Button,
			themeOverrides: mergedTheme.peerOverrides.Button,
			type: "primary",
			size: "tiny",
			onClick: this.handleConfirmClick
		}, { default: () => locale.confirm }, 1032, [
			"theme",
			"themeOverrides",
			"onClick"
		]))], 2)], 2);
	}
});
//#endregion
module.exports = FilterMenu_default;
