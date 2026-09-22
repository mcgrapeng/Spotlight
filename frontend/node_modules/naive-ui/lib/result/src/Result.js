Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Error = require("../../_internal/icons/Error.js");
const require__internal_icons_Info = require("../../_internal/icons/Info.js");
const require__internal_icons_Success = require("../../_internal/icons/Success.js");
const require__internal_icons_Warning = require("../../_internal/icons/Warning.js");
const require_result_styles_light = require("../styles/light.js");
const require_result_src_403 = require("./403.js");
const require_result_src_404 = require("./404.js");
const require_result_src_418 = require("./418.js");
const require_result_src_500 = require("./500.js");
const require_result_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/result/src/Result.tsx
const iconRenderMap = {
	403: require_result_src_403.render403,
	404: require_result_src_404.render404,
	418: require_result_src_418.render418,
	500: require_result_src_500.render500,
	info: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Info)),
	success: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Success)),
	warning: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Warning)),
	error: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Error))
};
const resultProps = {
	...require__mixins_use_theme.default.props,
	size: String,
	status: {
		type: String,
		default: "info"
	},
	title: String,
	description: String
};
var Result_default = (0, vue.defineComponent)({
	name: "Result",
	props: resultProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const mergedSizeRef = (0, vue.computed)(() => {
			return props.size || mergedComponentPropsRef?.value?.Result?.size || "medium";
		});
		const themeRef = require__mixins_use_theme.default("Result", "-result", require_result_src_styles_index_cssr, require_result_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { status } = props;
			const size = mergedSizeRef.value;
			const { common: { cubicBezierEaseInOut }, self: { textColor, lineHeight, titleTextColor, titleFontWeight, [require__utils_cssr_index.createKey("iconColor", status)]: iconColor, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize, [require__utils_cssr_index.createKey("titleFontSize", size)]: titleFontSize, [require__utils_cssr_index.createKey("iconSize", size)]: iconSize } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-font-size": fontSize,
				"--n-icon-size": iconSize,
				"--n-line-height": lineHeight,
				"--n-text-color": textColor,
				"--n-title-font-size": titleFontSize,
				"--n-title-font-weight": titleFontWeight,
				"--n-title-text-color": titleTextColor,
				"--n-icon-color": iconColor || ""
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("result", (0, vue.computed)(() => {
			const { status } = props;
			const size = mergedSizeRef.value;
			let hash = "";
			if (size) hash += size[0];
			if (status) hash += status[0];
			return hash;
		}), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { status, $slots, mergedClsPrefix, onRender } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-result`, this.themeClass]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-result-icon`) }, [require_vdom.normalizeVNode(() => $slots.icon?.() || ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => iconRenderMap[status]() }, 1032, ["clsPrefix"])))], 2),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-result-header`) }, [this.title ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-result-header__title`)
			}, [require_vdom.normalizeVNode(() => this.title)], 2)) : require_vdom.normalizeVNode(() => null), this.description ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-result-header__description`)
			}, [require_vdom.normalizeVNode(() => this.description)], 2)) : require_vdom.normalizeVNode(() => null)], 2),
			require_vdom.normalizeVNode(() => $slots.default && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-result-content`) }, [require_vdom.normalizeVNode(() => $slots.default())], 2))),
			require_vdom.normalizeVNode(() => $slots.footer && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-result-footer`) }, [require_vdom.normalizeVNode(() => $slots.footer())], 2)))
		], 6);
	}
});
//#endregion
exports.default = Result_default;
exports.resultProps = resultProps;
