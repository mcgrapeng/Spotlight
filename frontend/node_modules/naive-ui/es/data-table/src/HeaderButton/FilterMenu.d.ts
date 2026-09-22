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
import { FilterOption, FilterOptionValue, OnFilterMenuChange, TableBaseColumn } from "../interface.js";
import "../../../index.js";
import { ExtractThemeOverrides } from "../../../_mixins/use-theme.js";
import "../../../_mixins/index.js";
import { ScrollbarTheme } from "../../../_internal/scrollbar/styles/light.js";
import "../../../_internal/scrollbar/styles/index.js";
import { RtlItem } from "../../../config-provider/src/internal-interface.js";
import { PropType } from "vue";
//#region src/data-table/src/HeaderButton/FilterMenu.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  column: {
    type: PropType<TableBaseColumn>;
    required: true;
  };
  radioGroupName: {
    type: StringConstructor;
    required: true;
  };
  multiple: {
    type: BooleanConstructor;
    required: true;
  };
  value: {
    type: PropType<FilterOptionValue | FilterOptionValue[] | null>;
    default: null;
  };
  options: {
    type: PropType<FilterOption[]>;
    required: true;
  };
  onConfirm: {
    type: PropType<() => void>;
    required: true;
  };
  onClear: {
    type: PropType<() => void>;
    required: true;
  };
  onChange: {
    type: PropType<OnFilterMenuChange>;
    required: true;
  };
}>, {
  mergedClsPrefix: import("vue").Ref<string, string>;
  rtlEnabled: import("vue").Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
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
  locale: import("vue").Ref<{
    checkTableAll: string;
    uncheckTableAll: string;
    confirm: string;
    clear: string;
  }, {
    checkTableAll: string;
    uncheckTableAll: string;
    confirm: string;
    clear: string;
  }>;
  checkboxGroupValue: import("vue").ComputedRef<FilterOptionValue[] | null>;
  radioGroupValue: import("vue").ComputedRef<FilterOptionValue | null>;
  handleChange: (value: FilterOptionValue | FilterOptionValue[]) => void;
  handleConfirmClick: () => void;
  handleClearClick: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  column: {
    type: PropType<TableBaseColumn>;
    required: true;
  };
  radioGroupName: {
    type: StringConstructor;
    required: true;
  };
  multiple: {
    type: BooleanConstructor;
    required: true;
  };
  value: {
    type: PropType<FilterOptionValue | FilterOptionValue[] | null>;
    default: null;
  };
  options: {
    type: PropType<FilterOption[]>;
    required: true;
  };
  onConfirm: {
    type: PropType<() => void>;
    required: true;
  };
  onClear: {
    type: PropType<() => void>;
    required: true;
  };
  onChange: {
    type: PropType<OnFilterMenuChange>;
    required: true;
  };
}>> & Readonly<{}>, {
  value: FilterOptionValue | FilterOptionValue[] | null;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };