Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_statistic_styles_light = require("../styles/light.js");
const require_statistic_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/statistic/src/Statistic.tsx
const statisticProps = {
	...require__mixins_use_theme.default.props,
	tabularNums: Boolean,
	label: String,
	value: [String, Number]
};
var Statistic_default = (0, vue.defineComponent)({
	name: "Statistic",
	props: statisticProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Statistic", "-statistic", require_statistic_src_styles_index_cssr, require_statistic_styles_light.default, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Statistic", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { labelFontWeight, valueFontSize, valueFontWeight, valuePrefixTextColor, labelTextColor, valueSuffixTextColor, valueTextColor, labelFontSize }, common: { cubicBezierEaseInOut } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-label-font-size": labelFontSize,
				"--n-label-font-weight": labelFontWeight,
				"--n-label-text-color": labelTextColor,
				"--n-value-font-weight": valueFontWeight,
				"--n-value-font-size": valueFontSize,
				"--n-value-prefix-text-color": valuePrefixTextColor,
				"--n-value-suffix-text-color": valueSuffixTextColor,
				"--n-value-text-color": valueTextColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("statistic", void 0, cssVarsRef, props) : void 0;
		return {
			rtlEnabled: rtlEnabledRef,
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix, $slots: { default: defaultSlot, label: labelSlot, prefix: prefixSlot, suffix: suffixSlot } } = this;
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-statistic`,
				this.themeClass,
				this.rtlEnabled && `${mergedClsPrefix}-statistic--rtl`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(labelSlot, (children) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-statistic__label`) }, [require_vdom.normalizeVNode(() => this.label || children)], 2)))), (0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-statistic-value`),
			style: (0, vue.normalizeStyle)({ fontVariantNumeric: this.tabularNums ? "tabular-nums" : "" })
		}, [
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(prefixSlot, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-statistic-value__prefix`) }, [require_vdom.normalizeVNode(() => children)], 2)))),
			this.value !== void 0 ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-statistic-value__content`)
			}, [require_vdom.normalizeVNode(() => this.value)], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(defaultSlot, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-statistic-value__content`) }, [require_vdom.normalizeVNode(() => children)], 2))))], 64)),
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(suffixSlot, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-statistic-value__suffix`) }, [require_vdom.normalizeVNode(() => children)], 2))))
		], 6)], 6);
	}
});
//#endregion
exports.default = Statistic_default;
exports.statisticProps = statisticProps;
