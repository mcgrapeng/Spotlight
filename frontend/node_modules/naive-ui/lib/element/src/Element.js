Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_element_styles_light = require("../styles/light.js");
let vue = require("vue");
let lodash_es = require("lodash");
//#region src/element/src/Element.ts
const elementProps = {
	...require__mixins_use_theme.default.props,
	tag: {
		type: String,
		default: "div"
	}
};
var Element_default = (0, vue.defineComponent)({
	name: "Element",
	alias: ["El"],
	props: elementProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Element", "-element", void 0, require_element_styles_light, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common } = themeRef.value;
			return Object.keys(common).reduce((prevValue, key) => {
				prevValue[`--${(0, lodash_es.kebabCase)(key)}`] = common[key];
				return prevValue;
			}, {});
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("element", void 0, cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { tag, mergedClsPrefix, cssVars, themeClass, onRender, $slots } = this;
		onRender?.();
		return (0, vue.h)(tag, {
			role: "none",
			class: [`${mergedClsPrefix}-element`, themeClass],
			style: cssVars
		}, $slots.default?.());
	}
});
//#endregion
exports.default = Element_default;
exports.elementProps = elementProps;
