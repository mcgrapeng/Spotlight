Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_checkbox_src_Checkbox = require("./Checkbox.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/checkbox/src/CheckboxGroup.tsx
const checkboxGroupInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-checkbox-group");
const checkboxGroupProps = {
	min: Number,
	max: Number,
	size: String,
	options: Array,
	labelField: {
		type: String,
		default: "label"
	},
	valueField: {
		type: String,
		default: "value"
	},
	value: Array,
	defaultValue: {
		type: Array,
		default: null
	},
	disabled: {
		type: Boolean,
		default: void 0
	},
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	onChange: [Function, Array]
};
var CheckboxGroup_default = (0, vue.defineComponent)({
	name: "CheckboxGroup",
	props: checkboxGroupProps,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onChange !== void 0) require__utils_naive_warn.warnOnce("checkbox-group", "`on-change` is deprecated, please use `on-update:value` instead.");
		});
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const formItem = require__mixins_use_form_item.default(props);
		const { mergedSizeRef, mergedDisabledRef } = formItem;
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const controlledValueRef = (0, vue.computed)(() => props.value);
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		const checkedCount = (0, vue.computed)(() => {
			return mergedValueRef.value?.length || 0;
		});
		const valueSetRef = (0, vue.computed)(() => {
			if (Array.isArray(mergedValueRef.value)) return new Set(mergedValueRef.value);
			return /* @__PURE__ */ new Set();
		});
		function toggleCheckbox(checked, checkboxValue) {
			const { nTriggerFormInput, nTriggerFormChange } = formItem;
			const { onChange, "onUpdate:value": _onUpdateValue, onUpdateValue } = props;
			if (Array.isArray(mergedValueRef.value)) {
				const groupValue = Array.from(mergedValueRef.value);
				const index = groupValue.findIndex((value) => value === checkboxValue);
				if (checked) {
					if (!~index) {
						groupValue.push(checkboxValue);
						if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, groupValue, {
							actionType: "check",
							value: checkboxValue
						});
						if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, groupValue, {
							actionType: "check",
							value: checkboxValue
						});
						nTriggerFormInput();
						nTriggerFormChange();
						uncontrolledValueRef.value = groupValue;
						if (onChange) require__utils_vue_call.call(onChange, groupValue);
					}
				} else if (~index) {
					groupValue.splice(index, 1);
					if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, groupValue, {
						actionType: "uncheck",
						value: checkboxValue
					});
					if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, groupValue, {
						actionType: "uncheck",
						value: checkboxValue
					});
					if (onChange) require__utils_vue_call.call(onChange, groupValue);
					uncontrolledValueRef.value = groupValue;
					nTriggerFormInput();
					nTriggerFormChange();
				}
			} else if (checked) {
				if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, [checkboxValue], {
					actionType: "check",
					value: checkboxValue
				});
				if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, [checkboxValue], {
					actionType: "check",
					value: checkboxValue
				});
				if (onChange) require__utils_vue_call.call(onChange, [checkboxValue]);
				uncontrolledValueRef.value = [checkboxValue];
				nTriggerFormInput();
				nTriggerFormChange();
			} else {
				if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, [], {
					actionType: "uncheck",
					value: checkboxValue
				});
				if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, [], {
					actionType: "uncheck",
					value: checkboxValue
				});
				if (onChange) require__utils_vue_call.call(onChange, []);
				uncontrolledValueRef.value = [];
				nTriggerFormInput();
				nTriggerFormChange();
			}
		}
		(0, vue.provide)(checkboxGroupInjectionKey, {
			checkedCountRef: checkedCount,
			maxRef: (0, vue.toRef)(props, "max"),
			minRef: (0, vue.toRef)(props, "min"),
			valueSetRef,
			disabledRef: mergedDisabledRef,
			mergedSizeRef,
			toggleCheckbox
		});
		return { mergedClsPrefix: mergedClsPrefixRef };
	},
	render() {
		const { options, labelField, valueField } = this.$props;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${this.mergedClsPrefix}-checkbox-group`),
			role: "group"
		}, [options ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => options.map((option) => {
			const value = option[valueField];
			return (0, vue.openBlock)(), (0, vue.createBlock)(require_checkbox_src_Checkbox.default, {
				key: value,
				value,
				disabled: option.disabled,
				label: option[labelField]
			}, null, 8, [
				"value",
				"disabled",
				"label"
			]);
		}))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 64))], 2);
	}
});
//#endregion
exports.checkboxGroupInjectionKey = checkboxGroupInjectionKey;
exports.checkboxGroupProps = checkboxGroupProps;
exports.default = CheckboxGroup_default;
