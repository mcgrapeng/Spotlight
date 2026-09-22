Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_switch_transition_src_IconSwitchTransition = require("../../_internal/icon-switch-transition/src/IconSwitchTransition.js");
const require_checkbox_styles_light = require("../styles/light.js");
const require_checkbox_src_CheckboxGroup = require("./CheckboxGroup.js");
const require_checkbox_src_CheckMark = require("./CheckMark.js");
const require_checkbox_src_LineMark = require("./LineMark.js");
const require_checkbox_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let evtd = require("evtd");
let vooks = require("vooks");
//#region src/checkbox/src/Checkbox.tsx
const _hoisted_1 = ["id"];
const _hoisted_2 = [
	"tabindex",
	"aria-checked",
	"aria-labelledby",
	"onKeyup",
	"onKeydown",
	"onClick"
];
const checkboxProps = {
	...require__mixins_use_theme.default.props,
	size: String,
	checked: {
		type: [
			Boolean,
			String,
			Number
		],
		default: void 0
	},
	defaultChecked: {
		type: [
			Boolean,
			String,
			Number
		],
		default: false
	},
	value: [String, Number],
	disabled: {
		type: Boolean,
		default: void 0
	},
	indeterminate: Boolean,
	label: String,
	focusable: {
		type: Boolean,
		default: true
	},
	checkedValue: {
		type: [
			Boolean,
			String,
			Number
		],
		default: true
	},
	uncheckedValue: {
		type: [
			Boolean,
			String,
			Number
		],
		default: false
	},
	"onUpdate:checked": [Function, Array],
	onUpdateChecked: [Function, Array],
	privateInsideTable: Boolean,
	onChange: [Function, Array]
};
var Checkbox_default = (0, vue.defineComponent)({
	name: "Checkbox",
	props: checkboxProps,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onChange) require__utils_naive_warn.warnOnce("checkbox", "`on-change` is deprecated, please use `on-update:checked` instead.");
		});
		const NCheckboxGroup = (0, vue.inject)(require_checkbox_src_CheckboxGroup.checkboxGroupInjectionKey, null);
		const selfRef = (0, vue.ref)(null);
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const uncontrolledCheckedRef = (0, vue.ref)(props.defaultChecked);
		const controlledCheckedRef = (0, vue.toRef)(props, "checked");
		const mergedCheckedRef = (0, vooks.useMergedState)(controlledCheckedRef, uncontrolledCheckedRef);
		const renderedCheckedRef = (0, vooks.useMemo)(() => {
			if (NCheckboxGroup) {
				const groupValueSet = NCheckboxGroup.valueSetRef.value;
				if (groupValueSet && props.value !== void 0) return groupValueSet.has(props.value);
				return false;
			} else return mergedCheckedRef.value === props.checkedValue;
		});
		const formItem = require__mixins_use_form_item.default(props, {
			mergedSize(NFormItem) {
				const { size } = props;
				if (size !== void 0) return size;
				if (NCheckboxGroup) {
					const { value: mergedSize } = NCheckboxGroup.mergedSizeRef;
					if (mergedSize !== void 0) return mergedSize;
				}
				if (NFormItem) {
					const { mergedSize } = NFormItem;
					if (mergedSize !== void 0) return mergedSize.value;
				}
				const configSize = mergedComponentPropsRef?.value?.Checkbox?.size;
				if (configSize) return configSize;
				return "medium";
			},
			mergedDisabled(NFormItem) {
				const { disabled } = props;
				if (disabled !== void 0) return disabled;
				if (NCheckboxGroup) {
					if (NCheckboxGroup.disabledRef.value) return true;
					const { maxRef: { value: max }, checkedCountRef } = NCheckboxGroup;
					if (max !== void 0 && checkedCountRef.value >= max && !renderedCheckedRef.value) return true;
					const { minRef: { value: min } } = NCheckboxGroup;
					if (min !== void 0 && checkedCountRef.value <= min && renderedCheckedRef.value) return true;
				}
				if (NFormItem) return NFormItem.disabled.value;
				return false;
			}
		});
		const { mergedDisabledRef, mergedSizeRef } = formItem;
		const themeRef = require__mixins_use_theme.default("Checkbox", "-checkbox", require_checkbox_src_styles_index_cssr, require_checkbox_styles_light.default, props, mergedClsPrefixRef);
		function toggle(e) {
			if (NCheckboxGroup && props.value !== void 0) NCheckboxGroup.toggleCheckbox(!renderedCheckedRef.value, props.value);
			else {
				const { onChange, "onUpdate:checked": _onUpdateCheck, onUpdateChecked } = props;
				const { nTriggerFormInput, nTriggerFormChange } = formItem;
				const nextChecked = renderedCheckedRef.value ? props.uncheckedValue : props.checkedValue;
				if (_onUpdateCheck) require__utils_vue_call.call(_onUpdateCheck, nextChecked, e);
				if (onUpdateChecked) require__utils_vue_call.call(onUpdateChecked, nextChecked, e);
				if (onChange) require__utils_vue_call.call(onChange, nextChecked, e);
				nTriggerFormInput();
				nTriggerFormChange();
				uncontrolledCheckedRef.value = nextChecked;
			}
		}
		function handleClick(e) {
			if (!mergedDisabledRef.value) toggle(e);
		}
		function handleKeyUp(e) {
			if (mergedDisabledRef.value) return;
			switch (e.key) {
				case " ":
				case "Enter": toggle(e);
			}
		}
		function handleKeyDown(e) {
			switch (e.key) {
				case " ": e.preventDefault();
			}
		}
		const exposedMethods = {
			focus: () => {
				selfRef.value?.focus();
			},
			blur: () => {
				selfRef.value?.blur();
			}
		};
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Checkbox", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { value: mergedSize } = mergedSizeRef;
			const { common: { cubicBezierEaseInOut }, self: { borderRadius, color, colorChecked, colorDisabled, colorTableHeader, colorTableHeaderModal, colorTableHeaderPopover, checkMarkColor, checkMarkColorDisabled, border, borderFocus, borderDisabled, borderChecked, boxShadowFocus, textColor, textColorDisabled, checkMarkColorDisabledChecked, colorDisabledChecked, borderDisabledChecked, labelPadding, labelLineHeight, labelFontWeight, [require__utils_cssr_index.createKey("fontSize", mergedSize)]: fontSize, [require__utils_cssr_index.createKey("size", mergedSize)]: size } } = themeRef.value;
			return {
				"--n-label-line-height": labelLineHeight,
				"--n-label-font-weight": labelFontWeight,
				"--n-size": size,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-border-radius": borderRadius,
				"--n-border": border,
				"--n-border-checked": borderChecked,
				"--n-border-focus": borderFocus,
				"--n-border-disabled": borderDisabled,
				"--n-border-disabled-checked": borderDisabledChecked,
				"--n-box-shadow-focus": boxShadowFocus,
				"--n-color": color,
				"--n-color-checked": colorChecked,
				"--n-color-table": colorTableHeader,
				"--n-color-table-modal": colorTableHeaderModal,
				"--n-color-table-popover": colorTableHeaderPopover,
				"--n-color-disabled": colorDisabled,
				"--n-color-disabled-checked": colorDisabledChecked,
				"--n-text-color": textColor,
				"--n-text-color-disabled": textColorDisabled,
				"--n-check-mark-color": checkMarkColor,
				"--n-check-mark-color-disabled": checkMarkColorDisabled,
				"--n-check-mark-color-disabled-checked": checkMarkColorDisabledChecked,
				"--n-font-size": fontSize,
				"--n-label-padding": labelPadding
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("checkbox", (0, vue.computed)(() => mergedSizeRef.value[0]), cssVarsRef, props) : void 0;
		return Object.assign(formItem, exposedMethods, {
			rtlEnabled: rtlEnabledRef,
			selfRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedDisabled: mergedDisabledRef,
			renderedChecked: renderedCheckedRef,
			mergedTheme: themeRef,
			labelId: (0, seemly.createId)(),
			handleClick,
			handleKeyUp,
			handleKeyDown,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		});
	},
	render() {
		const { $slots, renderedChecked, mergedDisabled, indeterminate, privateInsideTable, cssVars, labelId, label, mergedClsPrefix, focusable, handleKeyUp, handleKeyDown, handleClick } = this;
		this.onRender?.();
		const labelNode = require__utils_vue_resolve_slot.resolveWrappedSlot($slots.default, (children) => {
			if (label || children) return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				key: 1,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-checkbox__label`),
				id: labelId
			}, [require_vdom.normalizeVNode(() => label || children)], 10, _hoisted_1);
			return null;
		});
		return (() => {
			const _cache = require_vdom.createVNodeCache("70be6e74cd27cb50");
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				ref: "selfRef",
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-checkbox`,
					this.themeClass,
					this.rtlEnabled && `${mergedClsPrefix}-checkbox--rtl`,
					renderedChecked && `${mergedClsPrefix}-checkbox--checked`,
					mergedDisabled && `${mergedClsPrefix}-checkbox--disabled`,
					indeterminate && `${mergedClsPrefix}-checkbox--indeterminate`,
					privateInsideTable && `${mergedClsPrefix}-checkbox--inside-table`,
					labelNode && `${mergedClsPrefix}-checkbox--show-label`
				]),
				tabindex: mergedDisabled || !focusable ? void 0 : 0,
				role: "checkbox",
				"aria-checked": indeterminate ? "mixed" : renderedChecked,
				"aria-labelledby": labelId,
				style: (0, vue.normalizeStyle)(cssVars),
				onKeyup: handleKeyUp,
				onKeydown: handleKeyDown,
				onClick: handleClick,
				onMousedown: _cache[0] || (_cache[0] = () => {
					(0, evtd.on)("selectstart", window, (e) => {
						e.preventDefault();
					}, { once: true });
				})
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-checkbox-box-wrapper`) }, [_cache[1] || (_cache[1] = require_vdom.normalizeVNode("\xA0", -1)), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-checkbox-box`) }, [(0, vue.createVNode)(require__internal_icon_switch_transition_src_IconSwitchTransition, null, { default: () => this.indeterminate ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: "indeterminate",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-checkbox-icon`)
			}, [require_vdom.normalizeVNode(() => require_checkbox_src_LineMark())], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: "check",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-checkbox-icon`)
			}, [require_vdom.normalizeVNode(() => require_checkbox_src_CheckMark())], 2)) }, 1024), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-checkbox-box__border`) }, null, 2)], 2)], 2), require_vdom.normalizeVNode(() => labelNode)], 46, _hoisted_2);
		})();
	}
});
//#endregion
exports.checkboxProps = checkboxProps;
exports.default = Checkbox_default;
