import useConfig from "../../../_mixins/use-config.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../../_internal/icon/src/Icon.mjs";
import Filter_default from "../../../_internal/icons/Filter.mjs";
import Popover_default from "../../../popover/src/Popover.mjs";
import { dataTableInjectionKey } from "../interface.mjs";
import FilterMenu_default from "./FilterMenu.mjs";
import RenderFilter_default from "./RenderFilter.mjs";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, inject, mergeProps, normalizeStyle, openBlock, ref } from "vue";
//#region src/data-table/src/HeaderButton/FilterButton.tsx
function createFilterState(currentFilterState, columnKey, mergedFilterValue) {
  const nextFilterState = Object.assign({}, currentFilterState);
  nextFilterState[columnKey] = mergedFilterValue;
  return nextFilterState;
}
var FilterButton_default = defineComponent({
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
    const {
      mergedComponentPropsRef
    } = useConfig();
    const {
      mergedThemeRef,
      mergedClsPrefixRef,
      mergedFilterStateRef,
      filterMenuCssVarsRef,
      paginationBehaviorOnFilterRef,
      doUpdatePage,
      doUpdateFilters,
      filterIconPopoverPropsRef
    } = inject(dataTableInjectionKey);
    const showPopoverRef = ref(false);
    const filterStateRef = mergedFilterStateRef;
    const filterMultipleRef = computed(() => {
      return props.column.filterMultiple !== false;
    });
    const mergedFilterValueRef = computed(() => {
      const filterValue = filterStateRef.value[props.column.key];
      if (filterValue === void 0) {
        const {
          value: multiple
        } = filterMultipleRef;
        if (multiple) return [];else return null;
      }
      return filterValue;
    });
    const activeRef = computed(() => {
      const {
        value: filterValue
      } = mergedFilterValueRef;
      if (Array.isArray(filterValue)) return filterValue.length > 0;
      return filterValue !== null;
    });
    const mergedRenderFilterRef = computed(() => {
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
    const {
      mergedTheme,
      mergedClsPrefix,
      handleFilterMenuCancel,
      filterIconPopoverProps
    } = this;
    return openBlock(), createBlock(Popover_default, mergeProps({
      show: this.showPopover,
      onUpdateShow: v => this.showPopover = v,
      trigger: "click",
      theme: mergedTheme.peers.Popover,
      themeOverrides: mergedTheme.peerOverrides.Popover,
      placement: "bottom"
    }, filterIconPopoverProps, {
      style: {
        padding: 0
      }
    }), {
      trigger: () => {
        const {
          mergedRenderFilter
        } = this;
        if (mergedRenderFilter) return openBlock(), createBlock(RenderFilter_default, {
          key: 1,
          "data-data-table-filter": true,
          render: mergedRenderFilter,
          active: this.active,
          show: this.showPopover
        }, null, 8, ["render", "active", "show"]);
        const {
          renderFilterIcon
        } = this.column;
        return openBlock(), createElementBlock("div", {
          "data-data-table-filter": true,
          class: normalizeClass$1([`${mergedClsPrefix}-data-table-filter`, {
            [`${mergedClsPrefix}-data-table-filter--active`]: this.active,
            [`${mergedClsPrefix}-data-table-filter--show`]: this.showPopover
          }])
        }, [renderFilterIcon ? (openBlock(), createElementBlock(Fragment, {
          key: 0
        }, [normalizeVNode(() => renderFilterIcon({
          active: this.active,
          show: this.showPopover
        }))], 64)) : (openBlock(), createBlock(Icon_default, {
          key: 1,
          clsPrefix: mergedClsPrefix
        }, {
          default: () => (openBlock(), createBlock(Filter_default))
        }, 1032, ["clsPrefix"]))], 2);
      },
      default: () => {
        const {
          renderFilterMenu
        } = this.column;
        return renderFilterMenu ? renderFilterMenu({
          hide: handleFilterMenuCancel
        }) : (openBlock(), createBlock(FilterMenu_default, {
          key: 2,
          style: normalizeStyle(this.filterMenuCssVars),
          radioGroupName: String(this.column.key),
          multiple: this.filterMultiple,
          value: this.mergedFilterValue,
          options: this.options,
          column: this.column,
          onChange: this.handleFilterChange,
          onClear: this.handleFilterMenuCancel,
          onConfirm: this.handleFilterMenuConfirm
        }, null, 8, ["style", "radioGroupName", "multiple", "value", "options", "column", "onChange", "onClear", "onConfirm"]));
      }
    }, 1040, ["show", "onUpdateShow", "theme", "themeOverrides"]);
  }
});
//#endregion
export { FilterButton_default as default };