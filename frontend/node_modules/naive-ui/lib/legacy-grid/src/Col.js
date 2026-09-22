Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_legacy_grid_src_Row = require("./Row.js");
let vue = require("vue");
//#region src/legacy-grid/src/Col.tsx
const colProps = {
	span: {
		type: [String, Number],
		default: 1
	},
	push: {
		type: [String, Number],
		default: 0
	},
	pull: {
		type: [String, Number],
		default: 0
	},
	offset: {
		type: [String, Number],
		default: 0
	}
};
const colPropKeys = require__utils_vue_keysOf.keysOf(colProps);
var Col_default = (0, vue.defineComponent)({
	name: "Col",
	props: colProps,
	setup(props) {
		const NRow = (0, vue.inject)(require_legacy_grid_src_Row.rowInjectionKey, null);
		if (!NRow) require__utils_naive_warn.throwError("col", "`n-col` must be placed inside `n-row`.");
		return {
			mergedClsPrefix: NRow.mergedClsPrefixRef,
			gutter: NRow.gutterRef,
			stylePadding: (0, vue.computed)(() => `${require__utils_css_format_length.formatLength(NRow.verticalGutterRef.value, { c: .5 })} ${require__utils_css_format_length.formatLength(NRow.horizontalGutterRef.value, { c: .5 })}`),
			mergedPush: (0, vue.computed)(() => Number(props.push) - Number(props.pull))
		};
	},
	render() {
		const { $slots, span, mergedPush, offset, stylePadding, gutter, mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-col`, {
				[`${mergedClsPrefix}-col--${span}-span`]: true,
				[`${mergedClsPrefix}-col--${mergedPush}-push`]: mergedPush > 0,
				[`${mergedClsPrefix}-col--${-mergedPush}-pull`]: mergedPush < 0,
				[`${mergedClsPrefix}-col--${offset}-offset`]: offset
			}]),
			style: (0, vue.normalizeStyle)({ padding: stylePadding })
		}, [gutter ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: 0 }, [require_vdom.normalizeVNode(() => $slots.default?.())])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => $slots.default?.())], 64))], 6);
	}
});
//#endregion
exports.colPropKeys = colPropKeys;
exports.colProps = colProps;
exports.default = Col_default;
