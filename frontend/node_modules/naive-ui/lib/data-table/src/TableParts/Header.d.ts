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
import { DropdownTheme } from "../../../dropdown/styles/light.js";
import "../../../dropdown/styles/index.js";
import { RadioTheme } from "../../../radio/styles/light.js";
import "../../../radio/styles/index.js";
import { DataTableThemeVars } from "../../styles/light.js";
import "../../styles/index.js";
import { ColItem, RowItem } from "../use-group-header.js";
import { ColumnKey, DataTableSelectionOptions, InternalRowData, SortState, TableBaseColumn } from "../interface.js";
import "../../../index.js";
import { ExtractThemeOverrides } from "../../../_mixins/use-theme.js";
import "../../../_mixins/index.js";
import { ScrollbarTheme } from "../../../_internal/scrollbar/styles/light.js";
import "../../../_internal/scrollbar/styles/index.js";
//#region src/data-table/src/TableParts/Header.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  discrete: {
    type: BooleanConstructor;
    default: boolean;
  };
}>, {
  cellElsRef: import("vue").Ref<Record<ColumnKey, HTMLTableCellElement>, Record<ColumnKey, HTMLTableCellElement>>;
  componentId: string;
  mergedSortState: import("vue").Ref<SortState[], SortState[]>;
  mergedClsPrefix: import("vue").Ref<string, string>;
  scrollX: import("vue").Ref<string | number | undefined, string | number | undefined>;
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
  allRowsChecked: import("vue").Ref<boolean, boolean>;
  someRowsChecked: import("vue").Ref<boolean, boolean>;
  rows: import("vue").Ref<RowItem[][], RowItem[][]>;
  cols: import("vue").Ref<ColItem[], ColItem[]>;
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
  checkOptions: import("vue").Ref<DataTableSelectionOptions<InternalRowData> | undefined, DataTableSelectionOptions<InternalRowData> | undefined>;
  mergedTableLayout: import("vue").Ref<"fixed" | "auto", "fixed" | "auto">;
  headerCheckboxDisabled: import("vue").Ref<boolean, boolean>;
  headerHeight: import("vue").Ref<number, number>;
  virtualScrollHeader: import("vue").Ref<boolean, boolean>;
  virtualListRef: unknown;
  handleCheckboxUpdateChecked: () => void;
  handleColHeaderClick: (e: MouseEvent, column: TableBaseColumn) => void;
  handleTableHeaderScroll: (e: Event) => void;
  handleColumnResizeStart: (column: TableBaseColumn) => void;
  handleColumnResize: (column: TableBaseColumn, displacementX: number) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  discrete: {
    type: BooleanConstructor;
    default: boolean;
  };
}>> & Readonly<{}>, {
  discrete: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export = _default;