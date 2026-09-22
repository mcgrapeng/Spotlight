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
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_switch_transition_src_IconSwitchTransition = require("../../_internal/icon-switch-transition/src/IconSwitchTransition.js");
const require__internal_loading_src_Loading = require("../../_internal/loading/src/Loading.js");
const require_switch_styles_light = require("../styles/light.js");
const require_switch_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/switch/src/Switch.tsx
const _hoisted_1 = [
	"aria-checked",
	"tabindex",
	"onClick",
	"onFocus",
	"onBlur",
	"onKeyup",
	"onKeydown"
];
const switchProps = {
	...require__mixins_use_theme.default.props,
	size: String,
	value: {
		type: [
			String,
			Number,
			Boolean
		],
		default: void 0
	},
	loading: Boolean,
	defaultValue: {
		type: [
			String,
			Number,
			Boolean
		],
		default: false
	},
	disabled: {
		type: Boolean,
		default: void 0
	},
	round: {
		type: Boolean,
		default: true
	},
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	checkedValue: {
		type: [
			String,
			Number,
			Boolean
		],
		default: true
	},
	uncheckedValue: {
		type: [
			String,
			Number,
			Boolean
		],
		default: false
	},
	railStyle: Function,
	rubberBand: {
		type: Boolean,
		default: true
	},
	spinProps: Object,
	/** @deprecated */
	onChange: [Function, Array]
};
let supportCssMax;
var Switch_default = (0, vue.defineComponent)({
	name: "Switch",
	props: switchProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onChange) require__utils_naive_warn.warnOnce("switch", "`on-change` is deprecated, please use `on-update:value` instead.");
		});
		if (supportCssMax === void 0) {
			if (typeof CSS !== "undefined") {
				if (typeof CSS.supports !== "undefined") supportCssMax = CSS.supports("width", "max(1px)");
				else supportCssMax = false;
			} else supportCssMax = true;
		}
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Switch", "-switch", require_switch_src_styles_index_cssr, require_switch_styles_light, props, mergedClsPrefixRef);
		const formItem = require__mixins_use_form_item.default(props, { mergedSize(NFormItem) {
			if (props.size !== void 0) return props.size;
			if (NFormItem) return NFormItem.mergedSize.value;
			const configSize = mergedComponentPropsRef?.value?.Switch?.size;
			if (configSize) return configSize;
			return "medium";
		} });
		const { mergedSizeRef, mergedDisabledRef } = formItem;
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const controlledValueRef = (0, vue.toRef)(props, "value");
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		const checkedRef = (0, vue.computed)(() => {
			return mergedValueRef.value === props.checkedValue;
		});
		const pressedRef = (0, vue.ref)(false);
		const focusedRef = (0, vue.ref)(false);
		const mergedRailStyleRef = (0, vue.computed)(() => {
			const { railStyle } = props;
			if (!railStyle) return void 0;
			return railStyle({
				focused: focusedRef.value,
				checked: checkedRef.value
			});
		});
		function doUpdateValue(value) {
			const { "onUpdate:value": _onUpdateValue, onChange, onUpdateValue } = props;
			const { nTriggerFormInput, nTriggerFormChange } = formItem;
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value);
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value);
			if (onChange) require__utils_vue_call.call(onChange, value);
			uncontrolledValueRef.value = value;
			nTriggerFormInput();
			nTriggerFormChange();
		}
		function doFocus() {
			const { nTriggerFormFocus } = formItem;
			nTriggerFormFocus();
		}
		function doBlur() {
			const { nTriggerFormBlur } = formItem;
			nTriggerFormBlur();
		}
		function handleClick() {
			if (props.loading || mergedDisabledRef.value) return;
			if (mergedValueRef.value !== props.checkedValue) doUpdateValue(props.checkedValue);
			else doUpdateValue(props.uncheckedValue);
		}
		function handleFocus() {
			focusedRef.value = true;
			doFocus();
		}
		function handleBlur() {
			focusedRef.value = false;
			doBlur();
			pressedRef.value = false;
		}
		function handleKeyup(e) {
			if (props.loading || mergedDisabledRef.value) return;
			if (e.key === " ") {
				if (mergedValueRef.value !== props.checkedValue) doUpdateValue(props.checkedValue);
				else doUpdateValue(props.uncheckedValue);
				pressedRef.value = false;
			}
		}
		function handleKeydown(e) {
			if (props.loading || mergedDisabledRef.value) return;
			if (e.key === " ") {
				e.preventDefault();
				pressedRef.value = true;
			}
		}
		const cssVarsRef = (0, vue.computed)(() => {
			const { value: size } = mergedSizeRef;
			const { self: { opacityDisabled, railColor, railColorActive, buttonBoxShadow, buttonColor, boxShadowFocus, loadingColor, textColor, iconColor, [require__utils_cssr_index.createKey("buttonHeight", size)]: buttonHeight, [require__utils_cssr_index.createKey("buttonWidth", size)]: buttonWidth, [require__utils_cssr_index.createKey("buttonWidthPressed", size)]: buttonWidthPressed, [require__utils_cssr_index.createKey("railHeight", size)]: railHeight, [require__utils_cssr_index.createKey("railWidth", size)]: railWidth, [require__utils_cssr_index.createKey("railBorderRadius", size)]: railBorderRadius, [require__utils_cssr_index.createKey("buttonBorderRadius", size)]: buttonBorderRadius }, common: { cubicBezierEaseInOut } } = themeRef.value;
			let offset;
			let height;
			let width;
			if (supportCssMax) {
				offset = `calc((${railHeight} - ${buttonHeight}) / 2)`;
				height = `max(${railHeight}, ${buttonHeight})`;
				width = `max(${railWidth}, calc(${railWidth} + ${buttonHeight} - ${railHeight}))`;
			} else {
				offset = (0, seemly.pxfy)(((0, seemly.depx)(railHeight) - (0, seemly.depx)(buttonHeight)) / 2);
				height = (0, seemly.pxfy)(Math.max((0, seemly.depx)(railHeight), (0, seemly.depx)(buttonHeight)));
				width = (0, seemly.depx)(railHeight) > (0, seemly.depx)(buttonHeight) ? railWidth : (0, seemly.pxfy)((0, seemly.depx)(railWidth) + (0, seemly.depx)(buttonHeight) - (0, seemly.depx)(railHeight));
			}
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-button-border-radius": buttonBorderRadius,
				"--n-button-box-shadow": buttonBoxShadow,
				"--n-button-color": buttonColor,
				"--n-button-width": buttonWidth,
				"--n-button-width-pressed": buttonWidthPressed,
				"--n-button-height": buttonHeight,
				"--n-height": height,
				"--n-offset": offset,
				"--n-opacity-disabled": opacityDisabled,
				"--n-rail-border-radius": railBorderRadius,
				"--n-rail-color": railColor,
				"--n-rail-color-active": railColorActive,
				"--n-rail-height": railHeight,
				"--n-rail-width": railWidth,
				"--n-width": width,
				"--n-box-shadow-focus": boxShadowFocus,
				"--n-loading-color": loadingColor,
				"--n-text-color": textColor,
				"--n-icon-color": iconColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("switch", (0, vue.computed)(() => {
			return mergedSizeRef.value[0];
		}), cssVarsRef, props) : void 0;
		return {
			handleClick,
			handleBlur,
			handleFocus,
			handleKeyup,
			handleKeydown,
			mergedRailStyle: mergedRailStyleRef,
			pressed: pressedRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedValue: mergedValueRef,
			checked: checkedRef,
			mergedDisabled: mergedDisabledRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix, mergedDisabled, checked, mergedRailStyle, onRender, $slots } = this;
		onRender?.();
		const { checked: checkedSlot, unchecked: uncheckedSlot, icon: iconSlot, "checked-icon": checkedIconSlot, "unchecked-icon": uncheckedIconSlot } = $slots;
		const hasIcon = !(require__utils_vue_resolve_slot.isSlotEmpty(iconSlot) && require__utils_vue_resolve_slot.isSlotEmpty(checkedIconSlot) && require__utils_vue_resolve_slot.isSlotEmpty(uncheckedIconSlot));
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			role: "switch",
			"aria-checked": checked,
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-switch`,
				this.themeClass,
				hasIcon && `${mergedClsPrefix}-switch--icon`,
				checked && `${mergedClsPrefix}-switch--active`,
				mergedDisabled && `${mergedClsPrefix}-switch--disabled`,
				this.round && `${mergedClsPrefix}-switch--round`,
				this.loading && `${mergedClsPrefix}-switch--loading`,
				this.pressed && `${mergedClsPrefix}-switch--pressed`,
				this.rubberBand && `${mergedClsPrefix}-switch--rubber-band`
			]),
			tabindex: !this.mergedDisabled ? 0 : void 0,
			style: (0, vue.normalizeStyle)(this.cssVars),
			onClick: this.handleClick,
			onFocus: this.handleFocus,
			onBlur: this.handleBlur,
			onKeyup: this.handleKeyup,
			onKeydown: this.handleKeydown
		}, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-switch__rail`),
			"aria-hidden": "true",
			style: (0, vue.normalizeStyle)(mergedRailStyle)
		}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(checkedSlot, (checkedSlotChildren) => require__utils_vue_resolve_slot.resolveWrappedSlot(uncheckedSlot, (uncheckedSlotChildren) => {
			if (checkedSlotChildren || uncheckedSlotChildren) return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 4,
				"aria-hidden": true,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-switch__children-placeholder`)
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-switch__rail-placeholder`) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-switch__button-placeholder`) }, null, 2), require_vdom.normalizeVNode(() => checkedSlotChildren)], 2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-switch__rail-placeholder`) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-switch__button-placeholder`) }, null, 2), require_vdom.normalizeVNode(() => uncheckedSlotChildren)], 2)], 2);
			return null;
		}))), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-switch__button`) }, [
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(iconSlot, (icon) => require__utils_vue_resolve_slot.resolveWrappedSlot(checkedIconSlot, (checkedIcon) => require__utils_vue_resolve_slot.resolveWrappedSlot(uncheckedIconSlot, (uncheckedIcon) => {
				return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_switch_transition_src_IconSwitchTransition, null, { default: () => this.loading ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_loading_src_Loading.default, (0, vue.mergeProps)({
					key: "loading",
					clsPrefix: mergedClsPrefix,
					strokeWidth: 20
				}, this.spinProps), null, 16, ["clsPrefix"])) : this.checked && (checkedIcon || icon) ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-switch__button-icon`),
					key: checkedIcon ? "checked-icon" : "icon"
				}, [require_vdom.normalizeVNode(() => checkedIcon || icon)], 2)) : !this.checked && (uncheckedIcon || icon) ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-switch__button-icon`),
					key: uncheckedIcon ? "unchecked-icon" : "icon"
				}, [require_vdom.normalizeVNode(() => uncheckedIcon || icon)], 2)) : null }, 1024);
			})))),
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(checkedSlot, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: "checked",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-switch__checked`)
			}, [require_vdom.normalizeVNode(() => children)], 2)))),
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(uncheckedSlot, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: "unchecked",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-switch__unchecked`)
			}, [require_vdom.normalizeVNode(() => children)], 2))))
		], 2)], 6)], 46, _hoisted_1);
	}
});
//#endregion
exports.default = Switch_default;
exports.switchProps = switchProps;
