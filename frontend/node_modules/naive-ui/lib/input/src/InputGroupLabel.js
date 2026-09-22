Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_input_styles_light = require("../styles/light.js");
const require_input_src_styles_input_group_label_cssr = require("./styles/input-group-label.cssr.js");
let vue = require("vue");
//#region src/input/src/InputGroupLabel.tsx
const inputGroupLabelProps = {
	...require__mixins_use_theme.default.props,
	size: String,
	bordered: {
		type: Boolean,
		default: void 0
	}
};
var InputGroupLabel_default = (0, vue.defineComponent)({
	name: "InputGroupLabel",
	props: inputGroupLabelProps,
	setup(props) {
		const { mergedBorderedRef, mergedClsPrefixRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Input", "-input-group-label", require_input_src_styles_input_group_label_cssr, require_input_styles_light, props, mergedClsPrefixRef);
		const { mergedSizeRef } = require__mixins_use_form_item.default(props, { mergedSize(NFormItem) {
			if (props.size !== void 0) return props.size;
			if (NFormItem) return NFormItem.mergedSize.value;
			const configSize = mergedComponentPropsRef?.value?.Input?.size;
			if (configSize) return configSize;
			return "medium";
		} });
		const cssVarsRef = (0, vue.computed)(() => {
			const { value: size } = mergedSizeRef;
			const { common: { cubicBezierEaseInOut }, self: { groupLabelColor, borderRadius, groupLabelTextColor, lineHeight, groupLabelBorder, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize, [require__utils_cssr_index.createKey("height", size)]: height } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-group-label-color": groupLabelColor,
				"--n-group-label-border": groupLabelBorder,
				"--n-border-radius": borderRadius,
				"--n-group-label-text-color": groupLabelTextColor,
				"--n-font-size": fontSize,
				"--n-line-height": lineHeight,
				"--n-height": height
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("input-group-label", (0, vue.computed)(() => mergedSizeRef.value[0]), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedBordered: mergedBorderedRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-input-group-label`, this.themeClass]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.()), this.mergedBordered ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 0,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-input-group-label__border`)
		}, null, 2)) : require_vdom.normalizeVNode(() => null)], 6);
	}
});
//#endregion
exports.default = InputGroupLabel_default;
exports.inputGroupLabelProps = inputGroupLabelProps;
