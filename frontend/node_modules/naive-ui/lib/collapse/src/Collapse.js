Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_collapse_styles_light = require("../styles/light.js");
const require_collapse_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/collapse/src/Collapse.tsx
const collapseProps = {
	...require__mixins_use_theme.default.props,
	defaultExpandedNames: {
		type: [Array, String],
		default: null
	},
	expandedNames: [Array, String],
	arrowPlacement: {
		type: String,
		default: "left"
	},
	accordion: Boolean,
	displayDirective: {
		type: String,
		default: "if"
	},
	triggerAreas: {
		type: Array,
		default: () => [
			"main",
			"extra",
			"arrow"
		]
	},
	onItemHeaderClick: [Function, Array],
	"onUpdate:expandedNames": [Function, Array],
	onUpdateExpandedNames: [Function, Array],
	onExpandedNamesChange: {
		type: [Function, Array],
		validator: () => {
			if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("collapse", "`on-expanded-names-change` is deprecated, please use `on-update:expanded-names` instead.");
			return true;
		},
		default: void 0
	}
};
const collapseInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-collapse");
var Collapse_default = (0, vue.defineComponent)({
	name: "Collapse",
	props: collapseProps,
	slots: Object,
	setup(props, { slots }) {
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const uncontrolledExpandedNamesRef = (0, vue.ref)(props.defaultExpandedNames);
		const controlledExpandedNamesRef = (0, vue.computed)(() => props.expandedNames);
		const mergedExpandedNamesRef = (0, vooks.useMergedState)(controlledExpandedNamesRef, uncontrolledExpandedNamesRef);
		const themeRef = require__mixins_use_theme.default("Collapse", "-collapse", require_collapse_src_styles_index_cssr, require_collapse_styles_light.default, props, mergedClsPrefixRef);
		function doUpdateExpandedNames(names) {
			const { "onUpdate:expandedNames": _onUpdateExpandedNames, onUpdateExpandedNames, onExpandedNamesChange } = props;
			if (onUpdateExpandedNames) require__utils_vue_call.call(onUpdateExpandedNames, names);
			if (_onUpdateExpandedNames) require__utils_vue_call.call(_onUpdateExpandedNames, names);
			if (onExpandedNamesChange) require__utils_vue_call.call(onExpandedNamesChange, names);
			uncontrolledExpandedNamesRef.value = names;
		}
		function doItemHeaderClick(info) {
			const { onItemHeaderClick } = props;
			if (onItemHeaderClick) require__utils_vue_call.call(onItemHeaderClick, info);
		}
		function toggleItem(collapse, name, event) {
			const { accordion } = props;
			const { value: expandedNames } = mergedExpandedNamesRef;
			if (accordion) {
				if (collapse) {
					doUpdateExpandedNames([name]);
					doItemHeaderClick({
						name,
						expanded: true,
						event
					});
				} else {
					doUpdateExpandedNames([]);
					doItemHeaderClick({
						name,
						expanded: false,
						event
					});
				}
			} else if (!Array.isArray(expandedNames)) {
				doUpdateExpandedNames([name]);
				doItemHeaderClick({
					name,
					expanded: true,
					event
				});
			} else {
				const activeNames = expandedNames.slice();
				const index = activeNames.findIndex((activeName) => name === activeName);
				if (~index) {
					activeNames.splice(index, 1);
					doUpdateExpandedNames(activeNames);
					doItemHeaderClick({
						name,
						expanded: false,
						event
					});
				} else {
					activeNames.push(name);
					doUpdateExpandedNames(activeNames);
					doItemHeaderClick({
						name,
						expanded: true,
						event
					});
				}
			}
		}
		(0, vue.provide)(collapseInjectionKey, {
			props,
			mergedClsPrefixRef,
			expandedNamesRef: mergedExpandedNamesRef,
			slots,
			toggleItem
		});
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Collapse", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { titleFontWeight, dividerColor, titlePadding, titleTextColor, titleTextColorDisabled, textColor, arrowColor, fontSize, titleFontSize, arrowColorDisabled, itemMargin } } = themeRef.value;
			return {
				"--n-font-size": fontSize,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-text-color": textColor,
				"--n-divider-color": dividerColor,
				"--n-title-padding": titlePadding,
				"--n-title-font-size": titleFontSize,
				"--n-title-text-color": titleTextColor,
				"--n-title-text-color-disabled": titleTextColorDisabled,
				"--n-title-font-weight": titleFontWeight,
				"--n-arrow-color": arrowColor,
				"--n-arrow-color-disabled": arrowColorDisabled,
				"--n-item-margin": itemMargin
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("collapse", void 0, cssVarsRef, props) : void 0;
		return {
			rtlEnabled: rtlEnabledRef,
			mergedTheme: themeRef,
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${this.mergedClsPrefix}-collapse`,
				this.rtlEnabled && `${this.mergedClsPrefix}-collapse--rtl`,
				this.themeClass
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.collapseInjectionKey = collapseInjectionKey;
exports.collapseProps = collapseProps;
exports.default = Collapse_default;
