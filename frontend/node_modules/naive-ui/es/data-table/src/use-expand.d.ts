import { DataTableSetupProps, Expandable, InternalRowData, RenderExpand, RowKey } from "./interface.js";
import { Ref } from "vue";
import { TreeMate } from "treemate";
//#region src/data-table/src/use-expand.d.ts
declare function useExpand(props: DataTableSetupProps, treeMateRef: Ref<TreeMate<InternalRowData, InternalRowData, InternalRowData>>): {
  stickyExpandedRowsRef: Ref<boolean, boolean>;
  mergedExpandedRowKeysRef: import("vue").ComputedRef<import("treemate").Key[]>;
  renderExpandRef: import("vue").ComputedRef<RenderExpand<any> | undefined>;
  expandableRef: import("vue").ComputedRef<Expandable<any> | undefined>;
  doUpdateExpandedRowKeys: (expandedKeys: RowKey[]) => void;
};
//#endregion
export { useExpand };