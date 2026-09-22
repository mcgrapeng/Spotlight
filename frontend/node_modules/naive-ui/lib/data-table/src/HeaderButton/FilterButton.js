const require__mixins_use_config = require("../../../_mixins/use-config.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../../_internal/icon/src/Icon.js");
const require__internal_icons_Filter = require("../../../_internal/icons/Filter.js");
const require_popover_src_Popover = require("../../../popover/src/Popover.js");
const require_data_table_src_interface = require("../interface.js");
const require_data_table_src_HeaderButton_FilterMenu = require("./FilterMenu.js");
const require_data_table_src_HeaderButton_RenderFilter = require("./RenderFilter.js");
let vue = require("vue");
//#region src/data-table/src/HeaderButton/FilterButton.tsx
function createFilterState(currentFilterState, columnKey, mergedFilterValue) {
	const nextFilterState = Object.assign({}, currentFilterState);
	nextFilterState[columnKey] = mergedFilterValue;
	return nextFilterState;
}
var FilterButton_default = (0, vue.defineComponent)({
	name: "DataTableFilterButton",
	props: {
		column: {
			type: Object,
			required: true
		},
		options: {
			type: Array,
			default: () => []
		}
	},
	setup(props) {
		const { mergedComponentPropsRef } = require__mixins_use_config.default();
		const { mergedThemeRef, mergedClsPrefixRef, mergedFilterStateRef, filterMenuCssVarsRef, paginationBehaviorOnFilterRef, doUpdatePage, doUpdateFilters, filterIconPopoverPropsRef } = (0, vue.inject)(require_data_table_src_interface.dataTableInjectionKey);
		const showPopoverRef = (0, vue.ref)(false);
		const filterStateRef = mergedFilterStateRef;
		const filterMultipleRef = (0, vue.computed)(() => {
			return props.column.filterMultiple !== false;
		});
		const mergedFilterValueRef = (0, vue.computed)(() => {
			const filterValue = filterStateRef.value[props.column.key];
			if (filterValue === void 0) {
				const { value: multiple } = filterMultipleRef;
				if (multiple) return [];
				else return null;
			}
			return filterValue;
		});
		const activeRef = (0, vue.computed)(() => {
			const { value: filterValue } = mergedFilterValueRef;
			if (Array.isArray(filterValue)) return filterValue.length > 0;
			return filterValue !== null;
		});
		const mergedRenderFilterRef = (0, vue.computed)(() => {
			return mergedComponentPropsRef?.value?.DataTable?.renderFilter || props.column.renderFilter;
		});
		function handleFilterChange(mergedFilterValue) {
			const nextFilterState = createFilterState(filterStateRef.value, props.column.key, mergedFilterValue);
			doUpdateFilters(nextFilterState, props.column);
			if (paginationBehaviorOnFilterRef.value === "first") doUpdatePage(1);
		}
		function handleFilterMenuCancel() {
			showPopoverRef.value = false;
		}
		function handleFilterMenuConfirm() {
			showPopoverRef.value = false;
		}
		return {
			mergedTheme: mergedThemeRef,
			mergedClsPrefix: mergedClsPrefixRef,
			active: activeRef,
			showPopover: showPopoverRef,
			mergedRenderFilter: mergedRenderFilterRef,
			filterIconPopoverProps: filterIconPopoverPropsRef,
			filterMultiple: filterMultipleRef,
			mergedFilterValue: mergedFilterValueRef,
			filterMenuCssVars: filterMenuCssVarsRef,
			handleFilterChange,
			handleFilterMenuConfirm,
			handleFilterMenuCancel
		};
	},
	render() {
		const { mergedTheme, mergedClsPrefix, handleFilterMenuCancel, filterIconPopoverProps } = this;
		return (0, vue.openBlock)(), (0, vue.createBlock)(require_popover_src_Popover.default, (0, vue.mergeProps)({
			show: this.showPopover,
			onUpdateShow: (v) => this.showPopover = v,
			trigger: "click",
			theme: mergedTheme.peers.Popover,
			themeOverrides: mergedTheme.peerOverrides.Popover,
			placement: "bottom"
		}, filterIconPopoverProps, { style: { padding: 0 } }), {
			trigger: () => {
				const { mergedRenderFilter } = this;
				if (mergedRenderFilter) return (0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_HeaderButton_RenderFilter, {
					key: 1,
					"data-data-table-filter": true,
					render: mergedRenderFilter,
					active: this.active,
					show: this.showPopover
				}, null, 8, [
					"render",
					"active",
					"show"
				]);
				const { renderFilterIcon } = this.column;
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					"data-data-table-filter": true,
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-data-table-filter`, {
						[`${mergedClsPrefix}-data-table-filter--active`]: this.active,
						[`${mergedClsPrefix}-data-table-filter--show`]: this.showPopover
					}])
				}, [renderFilterIcon ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderFilterIcon({
					active: this.active,
					show: this.showPopover
				}))], 64)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
					key: 1,
					clsPrefix: mergedClsPrefix
				}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Filter)) }, 1032, ["clsPrefix"]))], 2);
			},
			default: () => {
				const { renderFilterMenu } = this.column;
				return renderFilterMenu ? renderFilterMenu({ hide: handleFilterMenuCancel }) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_HeaderButton_FilterMenu, {
					key: 2,
					style: (0, vue.normalizeStyle)(this.filterMenuCssVars),
					radioGroupName: String(this.column.key),
					multiple: this.filterMultiple,
					value: this.mergedFilterValue,
					options: this.options,
					column: this.column,
					onChange: this.handleFilterChange,
					onClear: this.handleFilterMenuCancel,
					onConfirm: this.handleFilterMenuConfirm
				}, null, 8, [
					"style",
					"radioGroupName",
					"multiple",
					"value",
					"options",
					"column",
					"onChange",
					"onClear",
					"onConfirm"
				]));
			}
		}, 1040, [
			"show",
			"onUpdateShow",
			"theme",
			"themeOverrides"
		]);
	}
});
//#endregion
module.exports = FilterButton_default;
