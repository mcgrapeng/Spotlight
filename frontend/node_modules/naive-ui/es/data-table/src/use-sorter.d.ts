import { ColumnKey, DataTableSetupProps, InternalRowData, SortOrder, SortState, Sorter, TableBaseColumn, TableExpandColumn, TableSelectionColumn, TmNode } from "./interface.js";
import { ComputedRef } from "vue";
//#region src/data-table/src/use-sorter.d.ts
declare function useSorter(props: DataTableSetupProps, { dataRelatedColsRef, filteredDataRef }: {
  dataRelatedColsRef: ComputedRef<Array<TableSelectionColumn | TableBaseColumn | TableExpandColumn>>;
  filteredDataRef: ComputedRef<TmNode[]>;
}): {
  clearSorter: () => void;
  sort: (columnKey: ColumnKey, order?: SortOrder) => void;
  sortedDataRef: ComputedRef<TmNode[]>;
  mergedSortStateRef: ComputedRef<{
    columnKey: ColumnKey;
    order: SortOrder;
    sorter: boolean | "default" | Sorter<InternalRowData>;
  }[]>;
  deriveNextSorter: (sortState: SortState | null) => void;
};
//#endregion
export { useSorter };