import useConfig from "../../../_mixins/use-config.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../../_internal/icon/src/Icon.mjs";
import ArrowDown_default from "../../../_internal/icons/ArrowDown.mjs";
import { dataTableInjectionKey } from "../interface.mjs";
import RenderSorter_default from "./RenderSorter.mjs";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, inject, openBlock } from "vue";
//#region src/data-table/src/HeaderButton/SortButton.tsx
var SortButton_default = defineComponent({
  name: "SortIcon",
  props: {
    column: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {
      mergedComponentPropsRef
    } = useConfig();
    const {
      mergedSortStateRef,
      mergedClsPrefixRef
    } = inject(dataTableInjectionKey);
    const sortStateRef = computed(() => mergedSortStateRef.value.find(state => state.columnKey === props.column.key));
    const activeRef = computed(() => {
      return sortStateRef.value !== void 0;
    });
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      active: activeRef,
      mergedSortOrder: computed(() => {
        const {
          value: sortState
        } = sortStateRef;
        if (sortState && activeRef.value) return sortState.order;
        return false;
      }),
      mergedRenderSorter: computed(() => {
        return mergedComponentPropsRef?.value?.DataTable?.renderSorter || props.column.renderSorter;
      })
    };
  },
  render() {
    const {
      mergedRenderSorter,
      mergedSortOrder,
      mergedClsPrefix
    } = this;
    const {
      renderSorterIcon
    } = this.column;
    return mergedRenderSorter ? (openBlock(), createBlock(RenderSorter_default, {
      key: 1,
      render: mergedRenderSorter,
      order: mergedSortOrder
    }, null, 8, ["render", "order"])) : (openBlock(), createElementBlock("span", {
      key: 2,
      class: normalizeClass$1([`${mergedClsPrefix}-data-table-sorter`, mergedSortOrder === "ascend" && `${mergedClsPrefix}-data-table-sorter--asc`, mergedSortOrder === "descend" && `${mergedClsPrefix}-data-table-sorter--desc`])
    }, [renderSorterIcon ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderSorterIcon({
      order: mergedSortOrder
    }))], 64)) : (openBlock(), createBlock(Icon_default, {
      key: 1,
      clsPrefix: mergedClsPrefix
    }, {
      default: () => (openBlock(), createBlock(ArrowDown_default))
    }, 1032, ["clsPrefix"]))], 2));
  }
});
//#endregion
export { SortButton_default as default };