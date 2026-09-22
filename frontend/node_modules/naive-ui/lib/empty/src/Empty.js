Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Empty = require("../../_internal/icons/Empty.js");
const require_empty_styles_light = require("../styles/light.js");
const require_empty_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/empty/src/Empty.tsx
const emptyProps = {
	...require__mixins_use_theme.default.props,
	description: String,
	showDescription: {
		type: Boolean,
		default: true
	},
	showIcon: {
		type: Boolean,
		default: true
	},
	size: {
		type: String,
		default: "medium"
	},
	renderIcon: Function
};
var Empty_default = (0, vue.defineComponent)({
	name: "Empty",
	props: emptyProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Empty", "-empty", require_empty_src_styles_index_cssr, require_empty_styles_light.default, props, mergedClsPrefixRef);
		const { localeRef } = require__mixins_use_locale("Empty");
		const mergedDescriptionRef = (0, vue.computed)(() => {
			return props.description ?? mergedComponentPropsRef?.value?.Empty?.description;
		});
		const mergedRenderIconRef = (0, vue.computed)(() => mergedComponentPropsRef?.value?.Empty?.renderIcon || (() => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Empty))));
		const cssVarsRef = (0, vue.computed)(() => {
			const { size } = props;
			const { common: { cubicBezierEaseInOut }, self: { [require__utils_cssr_index.createKey("iconSize", size)]: iconSize, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize, textColor, iconColor, extraTextColor } } = themeRef.value;
			return {
				"--n-icon-size": iconSize,
				"--n-font-size": fontSize,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-text-color": textColor,
				"--n-icon-color": iconColor,
				"--n-extra-text-color": extraTextColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("empty", (0, vue.computed)(() => {
			let hash = "";
			const { size } = props;
			hash += size[0];
			return hash;
		}), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedRenderIcon: mergedRenderIconRef,
			localizedDescription: (0, vue.computed)(() => {
				return mergedDescriptionRef.value || localeRef.value.description;
			}),
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { $slots, mergedClsPrefix, onRender } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-empty`, this.themeClass]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [
			this.showIcon ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-empty__icon`)
			}, [$slots.icon ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => $slots.icon())], 64)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
				key: 1,
				clsPrefix: mergedClsPrefix
			}, { default: this.mergedRenderIcon }, 1032, ["clsPrefix"]))], 2)) : require_vdom.normalizeVNode(() => null),
			this.showDescription ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-empty__description`)
			}, [$slots.default ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => $slots.default())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => this.localizedDescription)], 64))], 2)) : require_vdom.normalizeVNode(() => null),
			$slots.extra ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 4,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-empty__extra`)
			}, [require_vdom.normalizeVNode(() => $slots.extra())], 2)) : require_vdom.normalizeVNode(() => null)
		], 6);
	}
});
//#endregion
exports.default = Empty_default;
exports.emptyProps = emptyProps;
