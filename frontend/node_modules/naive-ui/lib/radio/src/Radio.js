Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_radio_styles_light = require("../styles/light.js");
const require_radio_src_styles_radio_cssr = require("./styles/radio.cssr.js");
const require_radio_src_use_radio = require("./use-radio.js");
let vue = require("vue");
//#region src/radio/src/Radio.tsx
const _hoisted_1 = [
	"value",
	"name",
	"checked",
	"disabled",
	"onChange",
	"onFocus",
	"onBlur"
];
const radioProps = {
	...require__mixins_use_theme.default.props,
	...require_radio_src_use_radio.radioBaseProps
};
var Radio_default = (0, vue.defineComponent)({
	name: "Radio",
	props: radioProps,
	setup(props) {
		const radio = require_radio_src_use_radio.setup(props);
		const themeRef = require__mixins_use_theme.default("Radio", "-radio", require_radio_src_styles_radio_cssr, require_radio_styles_light, props, radio.mergedClsPrefix);
		const cssVarsRef = (0, vue.computed)(() => {
			const { mergedSize: { value: size } } = radio;
			const { common: { cubicBezierEaseInOut }, self: { boxShadow, boxShadowActive, boxShadowDisabled, boxShadowFocus, boxShadowHover, color, colorDisabled, colorActive, textColor, textColorDisabled, dotColorActive, dotColorDisabled, labelPadding, labelLineHeight, labelFontWeight, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize, [require__utils_cssr_index.createKey("radioSize", size)]: radioSize } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-label-line-height": labelLineHeight,
				"--n-label-font-weight": labelFontWeight,
				"--n-box-shadow": boxShadow,
				"--n-box-shadow-active": boxShadowActive,
				"--n-box-shadow-disabled": boxShadowDisabled,
				"--n-box-shadow-focus": boxShadowFocus,
				"--n-box-shadow-hover": boxShadowHover,
				"--n-color": color,
				"--n-color-active": colorActive,
				"--n-color-disabled": colorDisabled,
				"--n-dot-color-active": dotColorActive,
				"--n-dot-color-disabled": dotColorDisabled,
				"--n-font-size": fontSize,
				"--n-radio-size": radioSize,
				"--n-text-color": textColor,
				"--n-text-color-disabled": textColorDisabled,
				"--n-label-padding": labelPadding
			};
		});
		const { inlineThemeDisabled, mergedClsPrefixRef, mergedRtlRef } = require__mixins_use_config.default(props);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Radio", mergedRtlRef, mergedClsPrefixRef);
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("radio", (0, vue.computed)(() => radio.mergedSize.value[0]), cssVarsRef, props) : void 0;
		return Object.assign(radio, {
			rtlEnabled: rtlEnabledRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		});
	},
	render() {
		const { $slots, mergedClsPrefix, onRender, label } = this;
		onRender?.();
		return (() => {
			const _cache = require_vdom.createVNodeCache("f8c6901d8cd45c02");
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("label", {
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-radio`,
					this.themeClass,
					this.rtlEnabled && `${mergedClsPrefix}-radio--rtl`,
					this.mergedDisabled && `${mergedClsPrefix}-radio--disabled`,
					this.renderSafeChecked && `${mergedClsPrefix}-radio--checked`,
					this.focus && `${mergedClsPrefix}-radio--focus`
				]),
				style: (0, vue.normalizeStyle)(this.cssVars)
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-radio__dot-wrapper`) }, [
				_cache[0] || (_cache[0] = require_vdom.normalizeVNode("\xA0", -1)),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass([`${mergedClsPrefix}-radio__dot`, this.renderSafeChecked && `${mergedClsPrefix}-radio__dot--checked`]) }, null, 2),
				(0, vue.createElementVNode)("input", {
					ref: "inputRef",
					type: "radio",
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-radio-input`),
					value: this.value,
					name: this.mergedName,
					checked: this.renderSafeChecked,
					disabled: this.mergedDisabled,
					onChange: this.handleRadioInputChange,
					onFocus: this.handleRadioInputFocus,
					onBlur: this.handleRadioInputBlur
				}, null, 42, _hoisted_1)
			], 2), require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.default, (children) => {
				if (!children && !label) return null;
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					ref: "labelRef",
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-radio__label`)
				}, [require_vdom.normalizeVNode(() => children || label)], 2);
			}))], 6);
		})();
	}
});
//#endregion
exports.default = Radio_default;
exports.radioProps = radioProps;
