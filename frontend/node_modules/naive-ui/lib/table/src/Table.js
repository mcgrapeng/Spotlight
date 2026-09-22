Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_table_styles_light = require("../styles/light.js");
const require_table_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/table/src/Table.tsx
const tableProps = {
	...require__mixins_use_theme.default.props,
	bordered: {
		type: Boolean,
		default: true
	},
	bottomBordered: {
		type: Boolean,
		default: true
	},
	singleLine: {
		type: Boolean,
		default: true
	},
	striped: Boolean,
	singleColumn: Boolean,
	size: String
};
var Table_default = (0, vue.defineComponent)({
	name: "Table",
	props: tableProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const mergedSizeRef = (0, vue.computed)(() => {
			return props.size || mergedComponentPropsRef?.value?.Table?.size || "medium";
		});
		const themeRef = require__mixins_use_theme.default("Table", "-table", require_table_src_styles_index_cssr, require_table_styles_light.default, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Table", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const size = mergedSizeRef.value;
			const { self: { borderColor, tdColor, tdColorModal, tdColorPopover, thColor, thColorModal, thColorPopover, thTextColor, tdTextColor, borderRadius, thFontWeight, lineHeight, borderColorModal, borderColorPopover, tdColorStriped, tdColorStripedModal, tdColorStripedPopover, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize, [require__utils_cssr_index.createKey("tdPadding", size)]: tdPadding, [require__utils_cssr_index.createKey("thPadding", size)]: thPadding }, common: { cubicBezierEaseInOut } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-td-color": tdColor,
				"--n-td-color-modal": tdColorModal,
				"--n-td-color-popover": tdColorPopover,
				"--n-td-text-color": tdTextColor,
				"--n-border-color": borderColor,
				"--n-border-color-modal": borderColorModal,
				"--n-border-color-popover": borderColorPopover,
				"--n-border-radius": borderRadius,
				"--n-font-size": fontSize,
				"--n-th-color": thColor,
				"--n-th-color-modal": thColorModal,
				"--n-th-color-popover": thColorPopover,
				"--n-th-font-weight": thFontWeight,
				"--n-th-text-color": thTextColor,
				"--n-line-height": lineHeight,
				"--n-td-padding": tdPadding,
				"--n-th-padding": thPadding,
				"--n-td-color-striped": tdColorStriped,
				"--n-td-color-striped-modal": tdColorStripedModal,
				"--n-td-color-striped-popover": tdColorStripedPopover
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("table", (0, vue.computed)(() => {
			return mergedSizeRef.value[0];
		}), cssVarsRef, props) : void 0;
		return {
			rtlEnabled: rtlEnabledRef,
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("table", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-table`,
				this.themeClass,
				{
					[`${mergedClsPrefix}-table--rtl`]: this.rtlEnabled,
					[`${mergedClsPrefix}-table--bottom-bordered`]: this.bottomBordered,
					[`${mergedClsPrefix}-table--bordered`]: this.bordered,
					[`${mergedClsPrefix}-table--single-line`]: this.singleLine,
					[`${mergedClsPrefix}-table--single-column`]: this.singleColumn,
					[`${mergedClsPrefix}-table--striped`]: this.striped
				}
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.default = Table_default;
exports.tableProps = tableProps;
