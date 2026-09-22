Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_style = require("../../_mixins/use-style.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_legacy_grid_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/legacy-grid/src/Row.tsx
const rowInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-row");
const rowProps = {
	gutter: {
		type: [
			Array,
			Number,
			String
		],
		default: 0
	},
	alignItems: String,
	justifyContent: String
};
const rowPropKeys = require__utils_vue_keysOf.keysOf(rowProps);
var Row_default = (0, vue.defineComponent)({
	name: "Row",
	props: rowProps,
	setup(props) {
		const { mergedClsPrefixRef, mergedRtlRef } = require__mixins_use_config.default(props);
		require__mixins_use_style("-legacy-grid", require_legacy_grid_src_styles_index_cssr, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Row", mergedRtlRef, mergedClsPrefixRef);
		const verticalGutterRef = (0, vooks.useMemo)(() => {
			const { gutter } = props;
			if (Array.isArray(gutter)) return gutter[1] || 0;
			return 0;
		});
		const horizontalGutterRef = (0, vooks.useMemo)(() => {
			const { gutter } = props;
			if (Array.isArray(gutter)) return gutter[0];
			return Number(gutter);
		});
		(0, vue.provide)(rowInjectionKey, {
			mergedClsPrefixRef,
			gutterRef: (0, vue.toRef)(props, "gutter"),
			verticalGutterRef,
			horizontalGutterRef
		});
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			rtlEnabled: rtlEnabledRef,
			styleMargin: (0, vooks.useMemo)(() => `-${require__utils_css_format_length.formatLength(verticalGutterRef.value, { c: .5 })} -${require__utils_css_format_length.formatLength(horizontalGutterRef.value, { c: .5 })}`),
			styleWidth: (0, vooks.useMemo)(() => `calc(100% + ${require__utils_css_format_length.formatLength(horizontalGutterRef.value)})`)
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${this.mergedClsPrefix}-row`, this.rtlEnabled && `${this.mergedClsPrefix}-row--rtl`]),
			style: (0, vue.normalizeStyle)({
				margin: this.styleMargin,
				width: this.styleWidth,
				alignItems: this.alignItems,
				justifyContent: this.justifyContent
			})
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.default = Row_default;
exports.rowInjectionKey = rowInjectionKey;
exports.rowPropKeys = rowPropKeys;
exports.rowProps = rowProps;
