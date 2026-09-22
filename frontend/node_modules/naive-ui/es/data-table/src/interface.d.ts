import { NLocale } from "../../locales/common/enUS.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ScrollTo } from "../../_internal/scrollbar/src/Scrollbar.js";
import { PopoverProps } from "../../popover/src/Popover.js";
import "../../popover/index.js";
import { EllipsisProps } from "../../ellipsis/src/Ellipsis.js";
import { PaginationProps } from "../../pagination/src/Pagination.js";
import "../../pagination/index.js";
import { ScrollbarProps } from "../../scrollbar/src/Scrollbar.js";
import { DataTableTheme, DataTableThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { DataTableGetCsvCell, DataTableGetCsvHeader, DataTableSize, DataTableSpinProps } from "./public-types.js";
import { ColItem, RowItem } from "./use-group-header.js";
import "../../locales/index.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { CSSProperties, ExtractPropTypes, HTMLAttributes, PropType, Ref, VNode, VNodeChild } from "vue";
import { VirtualListInst, VirtualListScrollTo } from "vueuc";
import { TreeMate, TreeNode } from "treemate";
//#region src/data-table/src/interface.d.ts
declare const dataTableProps: {
  readonly onUnstableColumnResize: PropType<(resizedWidth: number, limitedWidth: number, column: TableBaseColumn, getColumnWidth: (key: ColumnKey) => number | undefined) => void>;
  readonly pagination: {
    readonly type: PropType<false | PaginationProps>;
    readonly default: false;
  };
  readonly paginateSinglePage: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly minHeight: PropType<string | number>;
  readonly maxHeight: PropType<string | number>;
  readonly columns: {
    readonly type: PropType<TableColumns<any>>;
    readonly default: () => never[];
  };
  readonly rowClassName: PropType<string | CreateRowClassName<any>>;
  readonly rowProps: PropType<CreateRowProps<any>>;
  readonly rowKey: PropType<CreateRowKey<any>>;
  readonly summary: PropType<CreateSummary<any>>;
  readonly data: {
    readonly type: PropType<RowData[]>;
    readonly default: () => never[];
  };
  readonly loading: BooleanConstructor;
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly bottomBordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly striped: BooleanConstructor;
  readonly scrollX: PropType<string | number>;
  readonly defaultCheckedRowKeys: {
    readonly type: PropType<RowKey[]>;
    readonly default: () => never[];
  };
  readonly checkedRowKeys: PropType<RowKey[]>;
  readonly singleLine: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly singleColumn: BooleanConstructor;
  readonly size: PropType<DataTableSize>;
  readonly remote: BooleanConstructor;
  readonly defaultExpandedRowKeys: {
    readonly type: PropType<RowKey[]>;
    readonly default: readonly [];
  };
  readonly defaultExpandAll: BooleanConstructor;
  readonly expandedRowKeys: PropType<RowKey[]>;
  readonly stickyExpandedRows: BooleanConstructor;
  readonly virtualScroll: BooleanConstructor;
  readonly virtualScrollX: BooleanConstructor;
  readonly virtualScrollHeader: BooleanConstructor;
  readonly headerHeight: {
    readonly type: NumberConstructor;
    readonly default: 28;
  };
  readonly heightForRow: PropType<DataTableHeightForRow>;
  readonly minRowHeight: {
    readonly type: NumberConstructor;
    readonly default: 28;
  };
  readonly tableLayout: {
    readonly type: PropType<"auto" | "fixed">;
    readonly default: "auto";
  };
  readonly allowCheckingNotLoaded: BooleanConstructor;
  readonly cascade: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly childrenKey: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly indent: {
    readonly type: NumberConstructor;
    readonly default: 16;
  };
  readonly flexHeight: BooleanConstructor;
  readonly summaryPlacement: {
    readonly type: PropType<"top" | "bottom">;
    readonly default: "bottom";
  };
  readonly paginationBehaviorOnFilter: {
    readonly type: PropType<"first" | "current">;
    readonly default: "current";
  };
  readonly filterIconPopoverProps: PropType<PopoverProps>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly renderCell: PropType<(value: any, rowData: object, column: TableBaseColumn) => VNodeChild>;
  readonly renderExpandIcon: PropType<RenderExpandIcon>;
  readonly spinProps: PropType<DataTableSpinProps>;
  readonly getCsvCell: PropType<DataTableGetCsvCell>;
  readonly getCsvHeader: PropType<DataTableGetCsvHeader>;
  readonly onLoad: PropType<DataTableOnLoad>;
  readonly 'onUpdate:page': PropType<PaginationProps["onUpdate:page"]>;
  readonly onUpdatePage: PropType<PaginationProps["onUpdate:page"]>;
  readonly 'onUpdate:pageSize': PropType<PaginationProps["onUpdate:pageSize"]>;
  readonly onUpdatePageSize: PropType<PaginationProps["onUpdate:pageSize"]>;
  readonly 'onUpdate:sorter': PropType<MaybeArray<OnUpdateSorter>>;
  readonly onUpdateSorter: PropType<MaybeArray<OnUpdateSorter>>;
  readonly 'onUpdate:filters': PropType<MaybeArray<OnUpdateFilters>>;
  readonly onUpdateFilters: PropType<MaybeArray<OnUpdateFilters>>;
  readonly 'onUpdate:checkedRowKeys': PropType<MaybeArray<OnUpdateCheckedRowKeys>>;
  readonly onUpdateCheckedRowKeys: PropType<MaybeArray<OnUpdateCheckedRowKeys>>;
  readonly 'onUpdate:expandedRowKeys': PropType<MaybeArray<OnUpdateExpandedRowKeys>>;
  readonly onUpdateExpandedRowKeys: PropType<MaybeArray<OnUpdateExpandedRowKeys>>;
  readonly onScroll: PropType<(e: Event) => void>;
  readonly onPageChange: PropType<PaginationProps["onUpdate:page"]>;
  readonly onPageSizeChange: PropType<PaginationProps["onUpdate:pageSize"]>;
  readonly onSorterChange: PropType<MaybeArray<OnUpdateSorter> | undefined>;
  readonly onFiltersChange: PropType<MaybeArray<OnUpdateFilters> | undefined>;
  readonly onCheckedRowKeysChange: PropType<MaybeArray<OnUpdateCheckedRowKeys> | undefined>;
  readonly theme: PropType<DataTableTheme>;
  readonly themeOverrides: PropType<DataTableThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DataTableThemeOverrides>;
};
interface DataTableSlots {
  default?: () => VNode[];
  empty?: () => VNode[];
  loading?: () => VNode[];
}
type FilterOptionValue = string | number;
type ColumnKey = string | number;
type RowKey = string | number;
type SortOrderFlag = 1 | -1 | 0;
type RowData = Record<string, any>;
type InternalRowData = Record<string, unknown>;
type CreateRowKey<T = InternalRowData> = (row: T) => RowKey;
type CreateRowClassName<T = InternalRowData> = (row: T, index: number) => string;
type CreateRowProps<T = InternalRowData> = (row: T, index: number) => HTMLAttributes;
type CreateCellProps<T = InternalRowData> = (row: T, index: number) => HTMLAttributes;
type CompareFn<T = InternalRowData> = (row1: T, row2: T) => number;
type Sorter<T = InternalRowData> = CompareFn<T> | SorterMultiple<T>;
interface SorterMultiple<T = InternalRowData> {
  multiple: number;
  compare?: CompareFn<T> | 'default';
}
type Filter<T = InternalRowData> = (filterOptionValue: FilterOptionValue, row: T) => boolean;
interface FilterOption {
  label: string;
  value: FilterOptionValue;
}
type TmNode = TreeNode<InternalRowData>;
type SortOrder = 'ascend' | 'descend' | false;
type Ellipsis = boolean | EllipsisProps;
interface CommonColumnInfo<T = InternalRowData> {
  fixed?: 'left' | 'right';
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  className?: string;
  align?: 'left' | 'center' | 'right';
  titleAlign?: 'left' | 'center' | 'right';
  ellipsis?: Ellipsis;
  ellipsisComponent?: 'ellipsis' | 'performant-ellipsis';
  allowExport?: boolean;
  cellProps?: (rowData: T, rowIndex: number) => HTMLAttributes;
}
type DataTableHeightForRow<T = RowData> = (rowData: T, rowIndex: number) => number;
type TableColumnTitle = string | ((column: TableBaseColumn) => VNodeChild);
type TableExpandColumnTitle = string | ((column: TableExpandColumn) => VNodeChild);
type TableColumnGroupTitle = string | ((column: TableColumnGroup) => VNodeChild);
type TableColumnGroup<T = InternalRowData> = {
  title?: TableColumnGroupTitle;
  type?: never;
  key: ColumnKey;
  children: Array<TableBaseColumn<T>>;
  resizable?: boolean;
  filterOptions?: never;
} & CommonColumnInfo<T>;
type TableBaseColumn<T = InternalRowData> = {
  title?: TableColumnTitle;
  titleColSpan?: number;
  type?: never;
  key: ColumnKey;
  tree?: boolean;
  sorter?: boolean | Sorter<T> | 'default';
  defaultSortOrder?: SortOrder;
  sortOrder?: SortOrder;
  customNextSortOrder?: (order: SortOrder) => SortOrder;
  resizable?: boolean;
  minWidth?: string | number;
  maxWidth?: string | number;
  filter?: 'default' | boolean | Filter<T>;
  filterOptions?: FilterOption[];
  filterOptionValues?: FilterOptionValue[] | null;
  filterOptionValue?: FilterOptionValue | null;
  filterMode?: 'or' | 'and';
  defaultFilterOptionValues?: FilterOptionValue[] | null;
  defaultFilterOptionValue?: FilterOptionValue | null;
  filterMultiple?: boolean;
  render?: (rowData: T, rowIndex: number) => VNodeChild;
  renderFilter?: RenderFilter;
  renderFilterIcon?: RenderFilterIcon;
  renderSorter?: RenderSorter;
  renderSorterIcon?: RenderSorterIcon;
  renderFilterMenu?: RenderFilterMenu;
  colSpan?: (rowData: T, rowIndex: number) => number;
  rowSpan?: (rowData: T, rowIndex: number) => number;
} & CommonColumnInfo<T>;
type TableSelectionColumn<T = InternalRowData> = {
  type: 'selection';
  multiple?: boolean;
  disabled?: (row: T) => boolean;
  options?: DataTableSelectionOptions<T>;
  sorter?: never;
  resizable?: boolean;
  filter?: never;
  filterOptions?: never;
  filterOptionValues?: never;
  filterOptionValue?: never;
  colSpan?: never;
  rowSpan?: never;
} & CommonColumnInfo<T>;
type RenderExpand<T = InternalRowData> = (row: T, index: number) => VNodeChild;
type RenderExpandIcon = ({ expanded, rowData }: {
  expanded: boolean;
  rowData: RowData;
}) => VNodeChild;
type Expandable<T = InternalRowData> = (row: T) => boolean;
interface TableExpandColumn<T = InternalRowData> extends Omit<TableSelectionColumn<T>, 'type'> {
  type: 'expand';
  title?: TableExpandColumnTitle;
  renderExpand: RenderExpand<T>;
  expandable?: Expandable<T>;
}
type TableColumn<T = InternalRowData> = TableColumnGroup<T> | TableBaseColumn<T> | TableSelectionColumn<T> | TableExpandColumn<T>;
type TableColumns<T = InternalRowData> = Array<TableColumn<T>>;
type DataTableSelectionOptions<T = InternalRowData> = Array<DataTableSelectionOption | {
  label: string;
  key: string | number;
  onSelect: (pageData: T[]) => void;
}>;
interface DataTableInjection {
  props: DataTableSetupProps;
  slots: DataTableSlots;
  indentRef: Ref<number>;
  childTriggerColIndexRef: Ref<number>;
  componentId: string;
  checkOptionsRef: Ref<DataTableSelectionOptions | undefined>;
  hoverKeyRef: Ref<RowKey | null>;
  mergedClsPrefixRef: Ref<string>;
  mergedThemeRef: Ref<MergedTheme<DataTableTheme>>;
  scrollXRef: Ref<string | number | undefined>;
  rowsRef: Ref<RowItem[][]>;
  colsRef: Ref<ColItem[]>;
  paginatedDataRef: Ref<TmNode[]>;
  leftFixedColumnsRef: Ref<TableColumns>;
  rightFixedColumnsRef: Ref<TableColumns>;
  leftActiveFixedColKeyRef: Ref<ColumnKey | null>;
  leftActiveFixedChildrenColKeysRef: Ref<ColumnKey[]>;
  rightActiveFixedColKeyRef: Ref<ColumnKey | null>;
  rightActiveFixedChildrenColKeysRef: Ref<ColumnKey[]>;
  fixedColumnLeftMapRef: Ref<Record<ColumnKey, {
    start: number;
    end: number;
  } | undefined>>;
  fixedColumnRightMapRef: Ref<Record<ColumnKey, {
    start: number;
    end: number;
  } | undefined>>;
  mergedCurrentPageRef: Ref<number>;
  someRowsCheckedRef: Ref<boolean>;
  allRowsCheckedRef: Ref<boolean>;
  mergedSortStateRef: Ref<SortState[]>;
  mergedFilterStateRef: Ref<FilterState>;
  loadingRef: Ref<boolean>;
  rowClassNameRef: Ref<string | CreateRowClassName | undefined>;
  mergedCheckedRowKeySetRef: Ref<Set<RowKey>>;
  mergedInderminateRowKeySetRef: Ref<Set<RowKey>>;
  localeRef: Ref<NLocale['DataTable']>;
  filterMenuCssVarsRef: Ref<CSSProperties>;
  mergedExpandedRowKeysRef: Ref<RowKey[]>;
  rowKeyRef: Ref<CreateRowKey | undefined>;
  renderExpandRef: Ref<undefined | RenderExpand>;
  summaryRef: Ref<undefined | CreateSummary>;
  rawPaginatedDataRef: Ref<InternalRowData[]>;
  virtualScrollRef: Ref<boolean>;
  virtualScrollXRef: Ref<boolean>;
  minRowHeightRef: Ref<number>;
  heightForRowRef: Ref<DataTableHeightForRow | undefined>;
  virtualScrollHeaderRef: Ref<boolean>;
  headerHeightRef: Ref<number>;
  bodyWidthRef: Ref<number | null>;
  mergedTableLayoutRef: Ref<'auto' | 'fixed'>;
  maxHeightRef: Ref<string | number | undefined>;
  minHeightRef: Ref<string | number | undefined>;
  xScrollableRef: Ref<boolean>;
  explicitlyScrollableRef: Ref<boolean>;
  rowPropsRef: Ref<CreateRowProps | undefined>;
  flexHeightRef: Ref<boolean>;
  headerCheckboxDisabledRef: Ref<boolean>;
  stripedRef: Ref<boolean>;
  onLoadRef: Ref<DataTableOnLoad | undefined>;
  loadingKeySetRef: Ref<Set<RowKey>>;
  paginationBehaviorOnFilterRef: Ref<'current' | 'first'>;
  expandableRef: Ref<Expandable<any> | undefined>;
  stickyExpandedRowsRef: Ref<boolean>;
  renderExpandIconRef: Ref<undefined | RenderExpandIcon>;
  summaryPlacementRef: Ref<'top' | 'bottom'>;
  filterIconPopoverPropsRef: Ref<PopoverProps | undefined>;
  treeMateRef: Ref<TreeMate<InternalRowData, InternalRowData, InternalRowData>>;
  scrollbarPropsRef: Ref<ScrollbarProps | undefined>;
  doUpdatePage: (page: number) => void;
  doUpdateExpandedRowKeys: (keys: RowKey[]) => void;
  doUpdateFilters: (filters: FilterState, sourceColumn: TableBaseColumn) => void;
  onUnstableColumnResize: (resizedWidth: number, limitedWidth: number, column: TableBaseColumn, getColumnWidth: (key: ColumnKey) => number | undefined) => void;
  getResizableWidth: (key: ColumnKey) => number | undefined;
  clearResizableWidth: () => void;
  doUpdateResizableWidth: (column: TableColumn, width: number) => void;
  deriveNextSorter: (sorter: SortState | null) => void;
  doUncheckAll: (checkWholeTable?: boolean) => void;
  doCheckAll: (checkWholeTable?: boolean) => void;
  doCheck: (rowKey: RowKey | RowKey[], single: boolean, rowInfo: RowData) => void;
  doUncheck: (rowKey: RowKey | RowKey[], rowInfo: RowData) => void;
  handleTableHeaderScroll: (e: Event) => void;
  handleTableBodyScroll: (e: Event) => void;
  syncScrollState: (source: 'head' | 'body' | 'layout') => void;
  setHeaderScrollLeft: (scrollLeft: number) => void;
  renderCell: Ref<undefined | ((value: any, rowData: object, column: TableBaseColumn) => VNodeChild)>;
}
declare const dataTableInjectionKey: import("vue").InjectionKey<DataTableInjection>;
interface MainTableInjection {
  leftActiveFixedColKey: ColumnKey | null;
  rightActiveFixedColKey: ColumnKey | null;
}
type RenderFilter = (props: {
  active: boolean;
  show: boolean;
}) => VNodeChild;
type RenderFilterIcon = RenderFilter;
type RenderSorter = (props: {
  order: SortOrder;
}) => VNodeChild;
type RenderSorterIcon = RenderSorter;
type RenderFilterMenu = (actions: {
  hide: () => void;
}) => VNodeChild;
type OnUpdateExpandedRowKeys = (keys: RowKey[]) => void;
type OnUpdateCheckedRowKeys = (keys: RowKey[], rows: InternalRowData[], meta: {
  row: InternalRowData | undefined;
  action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll';
}) => void;
type OnUpdateSorter = (sortState: SortState & SortState[] & null) => void;
type OnUpdateSorterImpl = (sortState: SortState | SortState[] | null) => void;
type OnUpdateFilters = (filterState: FilterState, sourceColumn: TableBaseColumn) => void;
interface SortState {
  columnKey: ColumnKey;
  order: SortOrder;
  sorter: Sorter | boolean | 'default';
}
type FilterState = Record<string, FilterOptionValue[] | FilterOptionValue | null | undefined>;
type DataTableScrollTo = ScrollTo & VirtualListScrollTo;
interface MainTableRef {
  getHeaderElement: () => HTMLElement | null;
  getBodyElement: () => HTMLElement | null;
  scrollTo: DataTableScrollTo;
}
interface MainTableBodyRef {
  getScrollContainer: () => HTMLElement | null;
  scrollTo: DataTableScrollTo;
}
interface MainTableHeaderRef {
  $el: HTMLElement | null;
  virtualListRef: Ref<VirtualListInst | null>;
}
type OnFilterMenuChange = <T extends FilterOptionValue[] & (FilterOptionValue | null)>(value: T) => void;
type OnFilterMenuChangeImpl = (value: FilterOptionValue[] | FilterOptionValue | null) => void;
interface DataTableInst {
  filter: (filters: FilterState | null) => void;
  filters: (filters: FilterState | null) => void;
  clearFilters: () => void;
  clearSorter: () => void;
  page: (page: number) => void;
  sort: (columnKey: ColumnKey, order: SortOrder) => void;
  scrollTo: DataTableScrollTo;
  downloadCsv: (options?: CsvOptionsType) => void;
  getFilteredAndSortedData: () => InternalRowData[];
  getCurrentPageData: () => InternalRowData[];
  /** @deprecated it but just leave it here, it does no harm */
  clearFilter: () => void;
}
type CreateSummary<T = InternalRowData> = (pageData: T[]) => SummaryRowData | SummaryRowData[];
interface SummaryCell {
  value?: VNodeChild;
  colSpan?: number;
  rowSpan?: number;
}
type SummaryRowData = Record<string, SummaryCell>;
type DataTableOnLoad = (node: RowData) => Promise<void>;
type DataTableSelectionOption = 'all' | 'none';
type DataTableProps = ExtractPublicPropTypes<typeof dataTableProps>;
type DataTableSetupProps = ExtractPropTypes<typeof dataTableProps>;
interface CsvOptionsType {
  fileName?: string;
  keepOriginalData?: boolean;
}
//#endregion
export { ColumnKey, CommonColumnInfo, CompareFn, CreateCellProps, CreateRowClassName, CreateRowKey, CreateRowProps, CreateSummary, CsvOptionsType, DataTableHeightForRow, DataTableInjection, DataTableInst, DataTableOnLoad, DataTableProps, DataTableScrollTo, DataTableSelectionOption, DataTableSelectionOptions, DataTableSetupProps, DataTableSlots, Ellipsis, Expandable, Filter, FilterOption, FilterOptionValue, FilterState, InternalRowData, MainTableBodyRef, MainTableHeaderRef, MainTableInjection, MainTableRef, OnFilterMenuChange, OnFilterMenuChangeImpl, OnUpdateCheckedRowKeys, OnUpdateExpandedRowKeys, OnUpdateFilters, OnUpdateSorter, OnUpdateSorterImpl, RenderExpand, RenderExpandIcon, RenderFilter, RenderFilterIcon, RenderFilterMenu, RenderSorter, RenderSorterIcon, RowData, RowKey, SortOrder, SortOrderFlag, SortState, Sorter, SorterMultiple, SummaryCell, SummaryRowData, TableBaseColumn, TableColumn, TableColumnGroup, TableColumnGroupTitle, TableColumnTitle, TableColumns, TableExpandColumn, TableExpandColumnTitle, TableSelectionColumn, TmNode, dataTableInjectionKey, dataTableProps };