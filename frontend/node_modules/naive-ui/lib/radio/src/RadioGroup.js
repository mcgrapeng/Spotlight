Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_flatten = require("../../_utils/vue/flatten.js");
const require__utils_vue_get_slot = require("../../_utils/vue/get-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_radio_styles_light = require("../styles/light.js");
const require_radio_src_use_radio = require("./use-radio.js");
const require_radio_src_Radio = require("./Radio.js");
const require_radio_src_styles_radio_group_cssr = require("./styles/radio-group.cssr.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/radio/src/RadioGroup.tsx
const _hoisted_1 = ["onFocusin", "onFocusout"];
function mapSlot(defaultSlot, value, clsPrefix) {
	const children = [];
	let isButtonGroup = false;
	for (let i = 0; i < defaultSlot.length; ++i) {
		const wrappedInstance = defaultSlot[i];
		const name = wrappedInstance.type?.name;
		if (name === "RadioButton") isButtonGroup = true;
		if (process.env.NODE_ENV !== "production" && isButtonGroup && name !== "RadioButton") {
			require__utils_naive_warn.warn("radio-group", "`n-radio-group` in button mode only takes `n-radio-button` as children.");
			continue;
		}
		const instanceProps = wrappedInstance.props;
		if (name !== "RadioButton") {
			children.push(wrappedInstance);
			continue;
		}
		if (i === 0) children.push(wrappedInstance);
		else {
			const lastInstanceProps = children[children.length - 1].props;
			const lastInstanceChecked = value === lastInstanceProps.value;
			const lastInstanceDisabled = lastInstanceProps.disabled;
			const currentInstanceChecked = value === instanceProps.value;
			const currentInstanceDisabled = instanceProps.disabled;
			/**
			* Priority of button splitor:
			* !disabled  checked >
			*  disabled  checked >
			* !disabled !checked >
			*  disabled !checked
			*/
			const lastInstancePriority = (lastInstanceChecked ? 2 : 0) + (!lastInstanceDisabled ? 1 : 0);
			const currentInstancePriority = (currentInstanceChecked ? 2 : 0) + (!currentInstanceDisabled ? 1 : 0);
			const lastInstanceClass = {
				[`${clsPrefix}-radio-group__splitor--disabled`]: lastInstanceDisabled,
				[`${clsPrefix}-radio-group__splitor--checked`]: lastInstanceChecked
			};
			const currentInstanceClass = {
				[`${clsPrefix}-radio-group__splitor--disabled`]: currentInstanceDisabled,
				[`${clsPrefix}-radio-group__splitor--checked`]: currentInstanceChecked
			};
			const splitorClass = lastInstancePriority < currentInstancePriority ? currentInstanceClass : lastInstanceClass;
			children.push(((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 1,
				class: require_vdom.normalizeClass([`${clsPrefix}-radio-group__splitor`, splitorClass])
			}, null, 2)), wrappedInstance);
		}
	}
	return {
		children,
		isButtonGroup
	};
}
const radioGroupProps = {
	...require__mixins_use_theme.default.props,
	name: String,
	options: Array,
	labelField: {
		type: String,
		default: "label"
	},
	valueField: {
		type: String,
		default: "value"
	},
	value: [
		String,
		Number,
		Boolean
	],
	defaultValue: {
		type: [
			String,
			Number,
			Boolean
		],
		default: null
	},
	size: String,
	disabled: {
		type: Boolean,
		default: void 0
	},
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array]
};
var RadioGroup_default = (0, vue.defineComponent)({
	name: "RadioGroup",
	props: radioGroupProps,
	setup(props) {
		const selfElRef = (0, vue.ref)(null);
		const { mergedSizeRef, mergedDisabledRef, nTriggerFormChange, nTriggerFormInput, nTriggerFormBlur, nTriggerFormFocus } = require__mixins_use_form_item.default(props);
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Radio", "-radio-group", require_radio_src_styles_radio_group_cssr, require_radio_styles_light, props, mergedClsPrefixRef);
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const controlledValueRef = (0, vue.toRef)(props, "value");
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		function doUpdateValue(value) {
			const { onUpdateValue, "onUpdate:value": _onUpdateValue } = props;
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value);
			uncontrolledValueRef.value = value;
			nTriggerFormChange();
			nTriggerFormInput();
		}
		function handleFocusin(e) {
			const { value: selfEl } = selfElRef;
			if (!selfEl) return;
			if (selfEl.contains(e.relatedTarget)) return;
			nTriggerFormFocus();
		}
		function handleFocusout(e) {
			const { value: selfEl } = selfElRef;
			if (!selfEl) return;
			if (selfEl.contains(e.relatedTarget)) return;
			nTriggerFormBlur();
		}
		(0, vue.provide)(require_radio_src_use_radio.radioGroupInjectionKey, {
			mergedClsPrefixRef,
			nameRef: (0, vue.toRef)(props, "name"),
			valueRef: mergedValueRef,
			disabledRef: mergedDisabledRef,
			mergedSizeRef,
			doUpdateValue
		});
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Radio", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { value: size } = mergedSizeRef;
			const { common: { cubicBezierEaseInOut }, self: { buttonBorderColor, buttonBorderColorActive, buttonBorderRadius, buttonBoxShadow, buttonBoxShadowFocus, buttonBoxShadowHover, buttonColor, buttonColorActive, buttonTextColor, buttonTextColorActive, buttonTextColorHover, opacityDisabled, [require__utils_cssr_index.createKey("buttonHeight", size)]: height, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize } } = themeRef.value;
			return {
				"--n-font-size": fontSize,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-button-border-color": buttonBorderColor,
				"--n-button-border-color-active": buttonBorderColorActive,
				"--n-button-border-radius": buttonBorderRadius,
				"--n-button-box-shadow": buttonBoxShadow,
				"--n-button-box-shadow-focus": buttonBoxShadowFocus,
				"--n-button-box-shadow-hover": buttonBoxShadowHover,
				"--n-button-color": buttonColor,
				"--n-button-color-active": buttonColorActive,
				"--n-button-text-color": buttonTextColor,
				"--n-button-text-color-hover": buttonTextColorHover,
				"--n-button-text-color-active": buttonTextColorActive,
				"--n-height": height,
				"--n-opacity-disabled": opacityDisabled
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("radio-group", (0, vue.computed)(() => mergedSizeRef.value[0]), cssVarsRef, props) : void 0;
		return {
			selfElRef,
			rtlEnabled: rtlEnabledRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedValue: mergedValueRef,
			handleFocusout,
			handleFocusin,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedValue, mergedClsPrefix, handleFocusin, handleFocusout } = this;
		const { options, labelField, valueField } = this.$props;
		const { children, isButtonGroup } = mapSlot(options ? options.map((option) => {
			const value = option[valueField];
			return (0, vue.openBlock)(), (0, vue.createBlock)(require_radio_src_Radio.default, {
				key: typeof value === "boolean" ? `__n_${value}` : value,
				value,
				disabled: option.disabled,
				label: option[labelField]
			}, null, 8, [
				"value",
				"disabled",
				"label"
			]);
		}) : require__utils_vue_flatten.flatten(require__utils_vue_get_slot.getSlot(this)), mergedValue, mergedClsPrefix);
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			onFocusin: handleFocusin,
			onFocusout: handleFocusout,
			ref: "selfElRef",
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-radio-group`,
				this.rtlEnabled && `${mergedClsPrefix}-radio-group--rtl`,
				this.themeClass,
				isButtonGroup && `${mergedClsPrefix}-radio-group--button-group`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => children)], 46, _hoisted_1);
	}
});
//#endregion
exports.default = RadioGroup_default;
exports.radioGroupProps = radioGroupProps;
