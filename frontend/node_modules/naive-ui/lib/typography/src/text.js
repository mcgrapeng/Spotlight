Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_typography_styles_light = require("../styles/light.js");
const require_typography_src_styles_text_cssr = require("./styles/text.cssr.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/typography/src/text.tsx
const textProps = {
	...require__mixins_use_theme.default.props,
	code: Boolean,
	type: {
		type: String,
		default: "default"
	},
	delete: Boolean,
	strong: Boolean,
	italic: Boolean,
	underline: Boolean,
	depth: [String, Number],
	tag: String,
	as: {
		type: String,
		validator: () => {
			if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("text", "`as` is deprecated, please use `tag` instead.");
			return true;
		},
		default: void 0
	}
};
var text_default = (0, vue.defineComponent)({
	name: "Text",
	props: textProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Typography", "-text", require_typography_src_styles_text_cssr, require_typography_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { depth, type } = props;
			const textColorKey = type === "default" ? depth === void 0 ? "textColor" : `textColor${depth}Depth` : require__utils_cssr_index.createKey("textColor", type);
			const { common: { fontWeightStrong, fontFamilyMono, cubicBezierEaseInOut }, self: { codeTextColor, codeBorderRadius, codeColor, codeBorder, [textColorKey]: textColor } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-text-color": textColor,
				"--n-font-weight-strong": fontWeightStrong,
				"--n-font-famliy-mono": fontFamilyMono,
				"--n-code-border-radius": codeBorderRadius,
				"--n-code-text-color": codeTextColor,
				"--n-code-color": codeColor,
				"--n-code-border": codeBorder
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("text", (0, vue.computed)(() => `${props.type[0]}${props.depth || ""}`), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			compitableTag: (0, vooks.useCompitable)(props, ["as", "tag"]),
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		this.onRender?.();
		const textClass = [
			`${mergedClsPrefix}-text`,
			this.themeClass,
			{
				[`${mergedClsPrefix}-text--code`]: this.code,
				[`${mergedClsPrefix}-text--delete`]: this.delete,
				[`${mergedClsPrefix}-text--strong`]: this.strong,
				[`${mergedClsPrefix}-text--italic`]: this.italic,
				[`${mergedClsPrefix}-text--underline`]: this.underline
			}
		];
		const children = this.$slots.default?.();
		return this.code ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("code", {
			key: 1,
			class: require_vdom.normalizeClass(textClass),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [this.delete ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("del", { key: 0 }, [require_vdom.normalizeVNode(() => children)])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => children)], 64))], 6)) : this.delete ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("del", {
			key: 2,
			class: require_vdom.normalizeClass(textClass),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => children)], 6)) : (0, vue.h)(this.compitableTag || "span", {
			class: textClass,
			style: this.cssVars
		}, children);
	}
});
//#endregion
exports.default = text_default;
exports.textProps = textProps;
