import { ThemeCommonVars } from "../../_styles/common/light.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { PopoverProps } from "../../popover/src/Popover.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { TooltipTheme } from "../../tooltip/styles/light.js";
import "../../tooltip/styles/index.js";
import { EllipsisTheme } from "../../ellipsis/styles/light.js";
import "../../ellipsis/styles/index.js";
import { PopselectTheme } from "../../popselect/styles/light.js";
import "../../popselect/styles/index.js";
import { SelectTheme } from "../../select/styles/light.js";
import "../../select/styles/index.js";
import { PaginationTheme } from "../../pagination/styles/light.js";
import "../../pagination/styles/index.js";
import { PaginationProps } from "../../pagination/src/Pagination.js";
import { ScrollbarProps } from "../../scrollbar/src/Scrollbar.js";
import { DropdownTheme } from "../../dropdown/styles/light.js";
import "../../dropdown/styles/index.js";
import { RadioTheme } from "../../radio/styles/light.js";
import "../../radio/styles/index.js";
import { DataTableTheme, DataTableThemeOverrides, DataTableThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { DataTableGetCsvCell, DataTableGetCsvHeader, DataTableSize, DataTableSpinProps } from "./public-types.js";
import { ColumnKey, CreateRowClassName, CreateRowKey, CreateRowProps, CreateSummary, CsvOptionsType, DataTableHeightForRow, DataTableOnLoad, DataTableScrollTo, DataTableSlots, FilterState, InternalRowData, OnUpdateCheckedRowKeys, OnUpdateExpandedRowKeys, OnUpdateFilters, OnUpdateSorter, RenderExpandIcon, RowData, RowKey, SortOrder, TableBaseColumn, TableColumns, TmNode } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, Ref, SlotsType } from "vue";
//#region src/data-table/src/DataTable.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly onUnstableColumnResize: import("vue").PropType<(resizedWidth: number, limitedWidth: number, column: TableBaseColumn, getColumnWidth: (key: ColumnKey) => number | undefined) => void>;
  readonly pagination: {
    readonly type: import("vue").PropType<false | PaginationProps>;
    readonly default: false;
  };
  readonly paginateSinglePage: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly minHeight: import("vue").PropType<string | number>;
  readonly maxHeight: import("vue").PropType<string | number>;
  readonly columns: {
    readonly type: import("vue").PropType<TableColumns<any>>;
    readonly default: () => never[];
  };
  readonly rowClassName: import("vue").PropType<string | CreateRowClassName<any>>;
  readonly rowProps: import("vue").PropType<CreateRowProps<any>>;
  readonly rowKey: import("vue").PropType<CreateRowKey<any>>;
  readonly summary: import("vue").PropType<CreateSummary<any>>;
  readonly data: {
    readonly type: import("vue").PropType<RowData[]>;
    readonly default: () => never[];
  };
  readonly loading: BooleanConstructor;
  readonly bordered: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly bottomBordered: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly striped: BooleanConstructor;
  readonly scrollX: import("vue").PropType<string | number>;
  readonly defaultCheckedRowKeys: {
    readonly type: import("vue").PropType<RowKey[]>;
    readonly default: () => never[];
  };
  readonly checkedRowKeys: import("vue").PropType<RowKey[]>;
  readonly singleLine: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly singleColumn: BooleanConstructor;
  readonly size: import("vue").PropType<DataTableSize>;
  readonly remote: BooleanConstructor;
  readonly defaultExpandedRowKeys: {
    readonly type: import("vue").PropType<RowKey[]>;
    readonly default: readonly [];
  };
  readonly defaultExpandAll: BooleanConstructor;
  readonly expandedRowKeys: import("vue").PropType<RowKey[]>;
  readonly stickyExpandedRows: BooleanConstructor;
  readonly virtualScroll: BooleanConstructor;
  readonly virtualScrollX: BooleanConstructor;
  readonly virtualScrollHeader: BooleanConstructor;
  readonly headerHeight: {
    readonly type: NumberConstructor;
    readonly default: 28;
  };
  readonly heightForRow: import("vue").PropType<DataTableHeightForRow>;
  readonly minRowHeight: {
    readonly type: NumberConstructor;
    readonly default: 28;
  };
  readonly tableLayout: {
    readonly type: import("vue").PropType<"auto" | "fixed">;
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
    readonly type: import("vue").PropType<"top" | "bottom">;
    readonly default: "bottom";
  };
  readonly paginationBehaviorOnFilter: {
    readonly type: import("vue").PropType<"first" | "current">;
    readonly default: "current";
  };
  readonly filterIconPopoverProps: import("vue").PropType<PopoverProps>;
  readonly scrollbarProps: import("vue").PropType<ScrollbarProps>;
  readonly renderCell: import("vue").PropType<(value: any, rowData: object, column: TableBaseColumn) => import("vue").VNodeChild>;
  readonly renderExpandIcon: import("vue").PropType<RenderExpandIcon>;
  readonly spinProps: import("vue").PropType<DataTableSpinProps>;
  readonly getCsvCell: import("vue").PropType<DataTableGetCsvCell>;
  readonly getCsvHeader: import("vue").PropType<DataTableGetCsvHeader>;
  readonly onLoad: import("vue").PropType<DataTableOnLoad>;
  readonly 'onUpdate:page': import("vue").PropType<PaginationProps["onUpdate:page"]>;
  readonly onUpdatePage: import("vue").PropType<PaginationProps["onUpdate:page"]>;
  readonly 'onUpdate:pageSize': import("vue").PropType<PaginationProps["onUpdate:pageSize"]>;
  readonly onUpdatePageSize: import("vue").PropType<PaginationProps["onUpdate:pageSize"]>;
  readonly 'onUpdate:sorter': import("vue").PropType<MaybeArray<OnUpdateSorter>>;
  readonly onUpdateSorter: import("vue").PropType<MaybeArray<OnUpdateSorter>>;
  readonly 'onUpdate:filters': import("vue").PropType<MaybeArray<OnUpdateFilters>>;
  readonly onUpdateFilters: import("vue").PropType<MaybeArray<OnUpdateFilters>>;
  readonly 'onUpdate:checkedRowKeys': import("vue").PropType<MaybeArray<OnUpdateCheckedRowKeys>>;
  readonly onUpdateCheckedRowKeys: import("vue").PropType<MaybeArray<OnUpdateCheckedRowKeys>>;
  readonly 'onUpdate:expandedRowKeys': import("vue").PropType<MaybeArray<OnUpdateExpandedRowKeys>>;
  readonly onUpdateExpandedRowKeys: import("vue").PropType<MaybeArray<OnUpdateExpandedRowKeys>>;
  readonly onScroll: import("vue").PropType<(e: Event) => void>;
  readonly onPageChange: import("vue").PropType<PaginationProps["onUpdate:page"]>;
  readonly onPageSizeChange: import("vue").PropType<PaginationProps["onUpdate:pageSize"]>;
  readonly onSorterChange: import("vue").PropType<MaybeArray<OnUpdateSorter> | undefined>;
  readonly onFiltersChange: import("vue").PropType<MaybeArray<OnUpdateFilters> | undefined>;
  readonly onCheckedRowKeysChange: import("vue").PropType<MaybeArray<OnUpdateCheckedRowKeys> | undefined>;
  readonly theme: import("vue").PropType<DataTableTheme>;
  readonly themeOverrides: import("vue").PropType<DataTableThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<DataTableThemeOverrides>;
}>, {
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
  clearFilter: () => void;
  mainTableInstRef: unknown;
  mergedClsPrefix: Ref<string, string>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: DataTableThemeVars;
    peers: {
      Button: ButtonTheme;
      Checkbox: CheckboxTheme;
      Radio: RadioTheme;
      Pagination: PaginationTheme;
      Scrollbar: ScrollbarTheme;
      Empty: EmptyTheme;
      Popover: PopoverTheme;
      Ellipsis: EllipsisTheme;
      Dropdown: DropdownTheme;
    };
    peerOverrides: {
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Checkbox?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Radio?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Pagination?: {
        peers?: {
          Select?: ExtractThemeOverrides<SelectTheme> | undefined;
          Input?: ExtractThemeOverrides<InputTheme> | undefined;
          Popselect?: ExtractThemeOverrides<PopselectTheme> | undefined;
        } | undefined;
      } | undefined;
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Empty?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Popover?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
      Ellipsis?: {
        peers?: {
          Tooltip?: ExtractThemeOverrides<TooltipTheme> | undefined;
        } | undefined;
      } | undefined;
      Dropdown?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  paginatedData: import("vue").ComputedRef<TmNode[]>;
  mergedBordered: import("vue").ComputedRef<boolean>;
  mergedBottomBordered: import("vue").ComputedRef<boolean>;
  mergedPagination: import("vue").ComputedRef<PaginationProps>;
  mergedShowPagination: import("vue").ComputedRef<boolean | 0 | undefined>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  mergedEmpty: import("vue").ComputedRef<boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly onUnstableColumnResize: import("vue").PropType<(resizedWidth: number, limitedWidth: number, column: TableBaseColumn, getColumnWidth: (key: ColumnKey) => number | undefined) => void>;
  readonly pagination: {
    readonly type: import("vue").PropType<false | PaginationProps>;
    readonly default: false;
  };
  readonly paginateSinglePage: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly minHeight: import("vue").PropType<string | number>;
  readonly maxHeight: import("vue").PropType<string | number>;
  readonly columns: {
    readonly type: import("vue").PropType<TableColumns<any>>;
    readonly default: () => never[];
  };
  readonly rowClassName: import("vue").PropType<string | CreateRowClassName<any>>;
  readonly rowProps: import("vue").PropType<CreateRowProps<any>>;
  readonly rowKey: import("vue").PropType<CreateRowKey<any>>;
  readonly summary: import("vue").PropType<CreateSummary<any>>;
  readonly data: {
    readonly type: import("vue").PropType<RowData[]>;
    readonly default: () => never[];
  };
  readonly loading: BooleanConstructor;
  readonly bordered: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly bottomBordered: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly striped: BooleanConstructor;
  readonly scrollX: import("vue").PropType<string | number>;
  readonly defaultCheckedRowKeys: {
    readonly type: import("vue").PropType<RowKey[]>;
    readonly default: () => never[];
  };
  readonly checkedRowKeys: import("vue").PropType<RowKey[]>;
  readonly singleLine: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly singleColumn: BooleanConstructor;
  readonly size: import("vue").PropType<DataTableSize>;
  readonly remote: BooleanConstructor;
  readonly defaultExpandedRowKeys: {
    readonly type: import("vue").PropType<RowKey[]>;
    readonly default: readonly [];
  };
  readonly defaultExpandAll: BooleanConstructor;
  readonly expandedRowKeys: import("vue").PropType<RowKey[]>;
  readonly stickyExpandedRows: BooleanConstructor;
  readonly virtualScroll: BooleanConstructor;
  readonly virtualScrollX: BooleanConstructor;
  readonly virtualScrollHeader: BooleanConstructor;
  readonly headerHeight: {
    readonly type: NumberConstructor;
    readonly default: 28;
  };
  readonly heightForRow: import("vue").PropType<DataTableHeightForRow>;
  readonly minRowHeight: {
    readonly type: NumberConstructor;
    readonly default: 28;
  };
  readonly tableLayout: {
    readonly type: import("vue").PropType<"auto" | "fixed">;
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
    readonly type: import("vue").PropType<"top" | "bottom">;
    readonly default: "bottom";
  };
  readonly paginationBehaviorOnFilter: {
    readonly type: import("vue").PropType<"first" | "current">;
    readonly default: "current";
  };
  readonly filterIconPopoverProps: import("vue").PropType<PopoverProps>;
  readonly scrollbarProps: import("vue").PropType<ScrollbarProps>;
  readonly renderCell: import("vue").PropType<(value: any, rowData: object, column: TableBaseColumn) => import("vue").VNodeChild>;
  readonly renderExpandIcon: import("vue").PropType<RenderExpandIcon>;
  readonly spinProps: import("vue").PropType<DataTableSpinProps>;
  readonly getCsvCell: import("vue").PropType<DataTableGetCsvCell>;
  readonly getCsvHeader: import("vue").PropType<DataTableGetCsvHeader>;
  readonly onLoad: import("vue").PropType<DataTableOnLoad>;
  readonly 'onUpdate:page': import("vue").PropType<PaginationProps["onUpdate:page"]>;
  readonly onUpdatePage: import("vue").PropType<PaginationProps["onUpdate:page"]>;
  readonly 'onUpdate:pageSize': import("vue").PropType<PaginationProps["onUpdate:pageSize"]>;
  readonly onUpdatePageSize: import("vue").PropType<PaginationProps["onUpdate:pageSize"]>;
  readonly 'onUpdate:sorter': import("vue").PropType<MaybeArray<OnUpdateSorter>>;
  readonly onUpdateSorter: import("vue").PropType<MaybeArray<OnUpdateSorter>>;
  readonly 'onUpdate:filters': import("vue").PropType<MaybeArray<OnUpdateFilters>>;
  readonly onUpdateFilters: import("vue").PropType<MaybeArray<OnUpdateFilters>>;
  readonly 'onUpdate:checkedRowKeys': import("vue").PropType<MaybeArray<OnUpdateCheckedRowKeys>>;
  readonly onUpdateCheckedRowKeys: import("vue").PropType<MaybeArray<OnUpdateCheckedRowKeys>>;
  readonly 'onUpdate:expandedRowKeys': import("vue").PropType<MaybeArray<OnUpdateExpandedRowKeys>>;
  readonly onUpdateExpandedRowKeys: import("vue").PropType<MaybeArray<OnUpdateExpandedRowKeys>>;
  readonly onScroll: import("vue").PropType<(e: Event) => void>;
  readonly onPageChange: import("vue").PropType<PaginationProps["onUpdate:page"]>;
  readonly onPageSizeChange: import("vue").PropType<PaginationProps["onUpdate:pageSize"]>;
  readonly onSorterChange: import("vue").PropType<MaybeArray<OnUpdateSorter> | undefined>;
  readonly onFiltersChange: import("vue").PropType<MaybeArray<OnUpdateFilters> | undefined>;
  readonly onCheckedRowKeysChange: import("vue").PropType<MaybeArray<OnUpdateCheckedRowKeys> | undefined>;
  readonly theme: import("vue").PropType<DataTableTheme>;
  readonly themeOverrides: import("vue").PropType<DataTableThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<DataTableThemeOverrides>;
}>> & Readonly<{}>, {
  readonly bordered: boolean | undefined;
  readonly loading: boolean;
  readonly data: RowData[];
  readonly allowCheckingNotLoaded: boolean;
  readonly remote: boolean;
  readonly cascade: boolean;
  readonly virtualScroll: boolean;
  readonly columns: TableColumns<any>;
  readonly pagination: false | PaginationProps;
  readonly paginateSinglePage: boolean;
  readonly bottomBordered: boolean | undefined;
  readonly striped: boolean;
  readonly defaultCheckedRowKeys: RowKey[];
  readonly singleLine: boolean;
  readonly singleColumn: boolean;
  readonly defaultExpandedRowKeys: RowKey[];
  readonly defaultExpandAll: boolean;
  readonly stickyExpandedRows: boolean;
  readonly virtualScrollX: boolean;
  readonly virtualScrollHeader: boolean;
  readonly headerHeight: number;
  readonly minRowHeight: number;
  readonly tableLayout: "auto" | "fixed";
  readonly childrenKey: string;
  readonly indent: number;
  readonly flexHeight: boolean;
  readonly summaryPlacement: "top" | "bottom";
  readonly paginationBehaviorOnFilter: "current" | "first";
}, SlotsType<DataTableSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };