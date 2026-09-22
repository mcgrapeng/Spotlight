const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require_ellipsis_src_Ellipsis = require("../../../ellipsis/src/Ellipsis.js");
const require_ellipsis_src_PerformantEllipsis = require("../../../ellipsis/src/PerformantEllipsis.js");
let vue = require("vue");
let lodash_es = require("lodash");
//#region src/data-table/src/TableParts/Cell.tsx
var Cell_default = (0, vue.defineComponent)({
	name: "DataTableCell",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		row: {
			type: Object,
			required: true
		},
		index: {
			type: Number,
			required: true
		},
		column: {
			type: Object,
			required: true
		},
		isSummary: Boolean,
		mergedTheme: {
			type: Object,
			required: true
		},
		renderCell: Function
	},
	render() {
		const { isSummary, column, row, renderCell } = this;
		let cell;
		const { render, key, ellipsis } = column;
		if (render && !isSummary) cell = render(row, this.index);
		else if (isSummary) cell = row[key]?.value;
		else cell = renderCell ? renderCell((0, lodash_es.get)(row, key), row, column) : (0, lodash_es.get)(row, key);
		if (ellipsis) {
			if (typeof ellipsis === "object") {
				const { mergedTheme } = this;
				if (column.ellipsisComponent === "performant-ellipsis") return (0, vue.openBlock)(), (0, vue.createBlock)(require_ellipsis_src_PerformantEllipsis.NPerformantEllipsis, (0, vue.mergeProps)({ key: 1 }, ellipsis, {
					theme: mergedTheme.peers.Ellipsis,
					themeOverrides: mergedTheme.peerOverrides.Ellipsis
				}), { default: () => cell }, 1040, ["theme", "themeOverrides"]);
				return (0, vue.openBlock)(), (0, vue.createBlock)(require_ellipsis_src_Ellipsis.default, (0, vue.mergeProps)({ key: 2 }, ellipsis, {
					theme: mergedTheme.peers.Ellipsis,
					themeOverrides: mergedTheme.peerOverrides.Ellipsis
				}), { default: () => cell }, 1040, ["theme", "themeOverrides"]);
			} else return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				key: 3,
				class: require_vdom.normalizeClass(`${this.clsPrefix}-data-table-td__ellipsis`)
			}, [require_vdom.normalizeVNode(() => cell)], 2);
		}
		return cell;
	}
});
//#endregion
module.exports = Cell_default;
