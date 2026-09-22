import { ThemeCommonVars } from "../../../_styles/common/light.js";
import { EmptyTheme } from "../../../empty/styles/light.js";
import "../../../empty/styles/index.js";
import { InputTheme } from "../../../input/styles/light.js";
import "../../../input/styles/index.js";
import { PopoverTheme } from "../../../popover/styles/light.js";
import "../../../popover/styles/index.js";
import { ButtonTheme } from "../../../button/styles/light.js";
import "../../../button/styles/index.js";
import { CheckboxTheme } from "../../../checkbox/styles/light.js";
import "../../../checkbox/styles/index.js";
import { TooltipTheme } from "../../../tooltip/styles/light.js";
import "../../../tooltip/styles/index.js";
import { EllipsisTheme } from "../../../ellipsis/styles/light.js";
import "../../../ellipsis/styles/index.js";
import { PopselectTheme } from "../../../popselect/styles/light.js";
import "../../../popselect/styles/index.js";
import { SelectTheme } from "../../../select/styles/light.js";
import "../../../select/styles/index.js";
import { PaginationTheme } from "../../../pagination/styles/light.js";
import "../../../pagination/styles/index.js";
import { ScrollbarProps } from "../../../scrollbar/src/Scrollbar.js";
import { DropdownTheme } from "../../../dropdown/styles/light.js";
import "../../../dropdown/styles/index.js";
import { RadioTheme } from "../../../radio/styles/light.js";
import "../../../radio/styles/index.js";
import { DataTableThemeVars } from "../../styles/light.js";
import "../../styles/index.js";
import { ColItem } from "../use-group-header.js";
import { ColumnKey, CreateRowClassName, CreateRowProps, CreateSummary, DataTableHeightForRow, DataTableScrollTo, DataTableSlots, Expandable, InternalRowData, RenderExpand, RenderExpandIcon, RowData, RowKey, SortState, TableBaseColumn, TmNode } from "../interface.js";
import "../../../index.js";
import { ExtractThemeOverrides } from "../../../_mixins/use-theme.js";
import "../../../_mixins/index.js";
import { ScrollbarTheme } from "../../../_internal/scrollbar/styles/light.js";
import "../../../_internal/scrollbar/styles/index.js";
import { CSSProperties, PropType, VNodeChild } from "vue";
//#region src/data-table/src/TableParts/Body.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  onResize: PropType<(e: ResizeObserverEntry) => void>;
  showHeader: BooleanConstructor;
  flexHeight: BooleanConstructor;
  bodyStyle: PropType<CSSProperties>;
}>, {
  getScrollContainer: () => HTMLElement | null;
  scrollTo: DataTableScrollTo;
  bodyWidth: import("vue").Ref<number | null, number | null>;
  summaryPlacement: import("vue").Ref<"top" | "bottom", "top" | "bottom">;
  dataTableSlots: DataTableSlots;
  componentId: string;
  scrollbarInstRef: unknown;
  virtualListRef: unknown;
  emptyElRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
  summary: import("vue").Ref<CreateSummary<InternalRowData> | undefined, CreateSummary<InternalRowData> | undefined>;
  mergedClsPrefix: import("vue").Ref<string, string>;
  mergedTheme: import("vue").Ref<{
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
  }, {
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
  mergedRenderEmpty: import("vue").ComputedRef<(() => VNodeChild) | undefined>;
  scrollX: import("vue").Ref<string | number | undefined, string | number | undefined>;
  cols: import("vue").Ref<ColItem[], ColItem[]>;
  loading: import("vue").Ref<boolean, boolean>;
  shouldDisplayVirtualList: import("vue").ComputedRef<boolean>;
  empty: import("vue").ComputedRef<boolean>;
  paginatedDataAndInfo: import("vue").ComputedRef<{
    data: {
      tmNode: TmNode;
      key: import("treemate").Key;
      striped: boolean;
      index: number;
    }[];
    hasChildren: boolean;
  }>;
  rawPaginatedData: import("vue").Ref<InternalRowData[], InternalRowData[]>;
  fixedColumnLeftMap: import("vue").Ref<Record<ColumnKey, {
    start: number;
    end: number;
  } | undefined>, Record<ColumnKey, {
    start: number;
    end: number;
  } | undefined>>;
  fixedColumnRightMap: import("vue").Ref<Record<ColumnKey, {
    start: number;
    end: number;
  } | undefined>, Record<ColumnKey, {
    start: number;
    end: number;
  } | undefined>>;
  currentPage: import("vue").Ref<number, number>;
  rowClassName: import("vue").Ref<string | CreateRowClassName<InternalRowData> | undefined, string | CreateRowClassName<InternalRowData> | undefined>;
  renderExpand: import("vue").Ref<RenderExpand<InternalRowData> | undefined, RenderExpand<InternalRowData> | undefined>;
  mergedExpandedRowKeySet: import("vue").ComputedRef<Set<RowKey>>;
  hoverKey: import("vue").Ref<RowKey | null, RowKey | null>;
  mergedSortState: import("vue").Ref<SortState[], SortState[]>;
  virtualScroll: import("vue").Ref<boolean, boolean>;
  virtualScrollX: import("vue").Ref<boolean, boolean>;
  heightForRow: import("vue").Ref<DataTableHeightForRow<RowData> | undefined, DataTableHeightForRow<RowData> | undefined>;
  minRowHeight: import("vue").Ref<number, number>;
  mergedTableLayout: import("vue").Ref<"fixed" | "auto", "fixed" | "auto">;
  childTriggerColIndex: import("vue").Ref<number, number>;
  indent: import("vue").Ref<number, number>;
  rowProps: import("vue").Ref<CreateRowProps<InternalRowData> | undefined, CreateRowProps<InternalRowData> | undefined>;
  loadingKeySet: import("vue").Ref<Set<RowKey>, Set<RowKey>>;
  expandable: import("vue").Ref<Expandable<any> | undefined, Expandable<any> | undefined>;
  stickyExpandedRows: import("vue").Ref<boolean, boolean>;
  renderExpandIcon: import("vue").Ref<RenderExpandIcon | undefined, RenderExpandIcon | undefined>;
  scrollbarProps: import("vue").Ref<ScrollbarProps | undefined, ScrollbarProps | undefined>;
  setHeaderScrollLeft: (scrollLeft: number) => void;
  handleVirtualListScroll: (e: Event) => void;
  handleVirtualListResize: (e: ResizeObserverEntry) => void;
  handleMouseleaveTable: () => void;
  virtualListContainer: () => HTMLElement | null;
  virtualListContent: () => HTMLElement | null;
  handleTableBodyScroll: (e: Event) => void;
  handleCheckboxUpdateChecked: (tmNode: {
    key: RowKey;
  }, checked: boolean, shiftKey: boolean) => void;
  handleRadioUpdateChecked: (tmNode: {
    key: RowKey;
  }) => void;
  handleUpdateExpanded: (key: RowKey, tmNode: TmNode | null) => void;
  renderCell: import("vue").Ref<((value: any, rowData: object, column: TableBaseColumn) => VNodeChild) | undefined, ((value: any, rowData: object, column: TableBaseColumn) => VNodeChild) | undefined>;
  explicitlyScrollable: import("vue").Ref<boolean, boolean>;
  xScrollable: import("vue").Ref<boolean, boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  onResize: PropType<(e: ResizeObserverEntry) => void>;
  showHeader: BooleanConstructor;
  flexHeight: BooleanConstructor;
  bodyStyle: PropType<CSSProperties>;
}>> & Readonly<{}>, {
  flexHeight: boolean;
  showHeader: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export = _default;