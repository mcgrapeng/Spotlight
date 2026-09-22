const require__mixins_use_config = require("../../../_mixins/use-config.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../../_internal/icon/src/Icon.js");
const require__internal_icons_ArrowDown = require("../../../_internal/icons/ArrowDown.js");
const require_data_table_src_interface = require("../interface.js");
const require_data_table_src_HeaderButton_RenderSorter = require("./RenderSorter.js");
let vue = require("vue");
//#region src/data-table/src/HeaderButton/SortButton.tsx
var SortButton_default = (0, vue.defineComponent)({
	name: "SortIcon",
	props: { column: {
		type: Object,
		required: true
	} },
	setup(props) {
		const { mergedComponentPropsRef } = require__mixins_use_config.default();
		const { mergedSortStateRef, mergedClsPrefixRef } = (0, vue.inject)(require_data_table_src_interface.dataTableInjectionKey);
		const sortStateRef = (0, vue.computed)(() => mergedSortStateRef.value.find((state) => state.columnKey === props.column.key));
		const activeRef = (0, vue.computed)(() => {
			return sortStateRef.value !== void 0;
		});
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			active: activeRef,
			mergedSortOrder: (0, vue.computed)(() => {
				const { value: sortState } = sortStateRef;
				if (sortState && activeRef.value) return sortState.order;
				return false;
			}),
			mergedRenderSorter: (0, vue.computed)(() => {
				return mergedComponentPropsRef?.value?.DataTable?.renderSorter || props.column.renderSorter;
			})
		};
	},
	render() {
		const { mergedRenderSorter, mergedSortOrder, mergedClsPrefix } = this;
		const { renderSorterIcon } = this.column;
		return mergedRenderSorter ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_HeaderButton_RenderSorter, {
			key: 1,
			render: mergedRenderSorter,
			order: mergedSortOrder
		}, null, 8, ["render", "order"])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
			key: 2,
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-data-table-sorter`,
				mergedSortOrder === "ascend" && `${mergedClsPrefix}-data-table-sorter--asc`,
				mergedSortOrder === "descend" && `${mergedClsPrefix}-data-table-sorter--desc`
			])
		}, [renderSorterIcon ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderSorterIcon({ order: mergedSortOrder }))], 64)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			key: 1,
			clsPrefix: mergedClsPrefix
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ArrowDown)) }, 1032, ["clsPrefix"]))], 2));
	}
});
//#endregion
module.exports = SortButton_default;
