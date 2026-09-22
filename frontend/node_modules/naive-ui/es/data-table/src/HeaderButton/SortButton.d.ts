import { RenderSorter, SortOrder, TableBaseColumn } from "../interface.js";
import { PropType } from "vue";
//#region src/data-table/src/HeaderButton/SortButton.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  column: {
    type: PropType<TableBaseColumn>;
    required: true;
  };
}>, {
  mergedClsPrefix: import("vue").Ref<string, string>;
  active: import("vue").ComputedRef<boolean>;
  mergedSortOrder: import("vue").ComputedRef<SortOrder>;
  mergedRenderSorter: import("vue").ComputedRef<RenderSorter | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  column: {
    type: PropType<TableBaseColumn>;
    required: true;
  };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };