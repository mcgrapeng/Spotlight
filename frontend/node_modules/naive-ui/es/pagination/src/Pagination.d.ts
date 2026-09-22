import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { InternalSelectionTheme } from "../../_internal/selection/styles/light.js";
import "../../_internal/selection/styles/index.js";
import { PaginationInfo, PaginationLabelInfo, PaginationRenderLabel, PaginationSizeOption, RenderGoto, RenderNext, RenderPrefix, RenderPrev, RenderSuffix } from "./interface.js";
import { PopselectTheme } from "../../popselect/styles/light.js";
import "../../popselect/styles/index.js";
import { SelectTheme } from "../../select/styles/light.js";
import "../../select/styles/index.js";
import { PaginationTheme, PaginationThemeOverrides, PaginationThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { InputSize } from "../../input/src/public-types.js";
import { SelectSize } from "../../select/src/public-types.js";
import { SelectProps } from "../../select/src/Select.js";
import "../../select/index.js";
import { PaginationSize } from "./public-types.js";
import { PageItem } from "./utils.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/pagination/src/Pagination.d.ts
declare const paginationProps: {
  readonly simple: BooleanConstructor;
  readonly page: NumberConstructor;
  readonly defaultPage: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly itemCount: NumberConstructor;
  readonly pageCount: NumberConstructor;
  readonly defaultPageCount: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly showSizePicker: BooleanConstructor;
  readonly pageSize: NumberConstructor;
  readonly defaultPageSize: NumberConstructor;
  readonly pageSizes: {
    readonly type: PropType<Array<number | PaginationSizeOption>>;
    readonly default: () => number[];
  };
  readonly showQuickJumper: BooleanConstructor;
  readonly size: PropType<PaginationSize>;
  readonly disabled: BooleanConstructor;
  readonly pageSlot: {
    readonly type: NumberConstructor;
    readonly default: 9;
  };
  readonly selectProps: PropType<SelectProps>;
  readonly prev: PropType<RenderPrev>;
  readonly next: PropType<RenderNext>;
  readonly goto: PropType<RenderGoto>;
  readonly prefix: PropType<RenderPrefix>;
  readonly suffix: PropType<RenderSuffix>;
  readonly label: PropType<PaginationRenderLabel>;
  readonly displayOrder: {
    readonly type: PropType<Array<"pages" | "size-picker" | "quick-jumper">>;
    readonly default: readonly ["pages", "size-picker", "quick-jumper"];
  };
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly showQuickJumpDropdown: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly 'onUpdate:page': PropType<MaybeArray<(page: number) => void>>;
  readonly onUpdatePage: PropType<MaybeArray<(page: number) => void>>;
  readonly 'onUpdate:pageSize': PropType<MaybeArray<(pageSize: number) => void>>;
  readonly onUpdatePageSize: PropType<MaybeArray<(pageSize: number) => void>>;
  /** @deprecated */
  readonly onPageSizeChange: PropType<MaybeArray<(pageSize: number) => void>>;
  /** @deprecated */
  readonly onChange: PropType<MaybeArray<(page: number) => void>>;
  readonly theme: PropType<PaginationTheme>;
  readonly themeOverrides: PropType<PaginationThemeOverrides>;
  readonly builtinThemeOverrides: PropType<PaginationThemeOverrides>;
};
type PaginationProps = ExtractPublicPropTypes<typeof paginationProps>;
interface PaginationSlots {
  default?: () => VNode[];
  goto?: () => VNode[];
  label?: (props: PaginationLabelInfo) => VNode[];
  next?: (props: PaginationInfo) => VNode;
  prev?: (props: PaginationInfo) => VNode;
  prefix?: (props: PaginationInfo) => VNode;
  suffix?: (props: PaginationInfo) => VNode;
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly simple: BooleanConstructor;
  readonly page: NumberConstructor;
  readonly defaultPage: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly itemCount: NumberConstructor;
  readonly pageCount: NumberConstructor;
  readonly defaultPageCount: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly showSizePicker: BooleanConstructor;
  readonly pageSize: NumberConstructor;
  readonly defaultPageSize: NumberConstructor;
  readonly pageSizes: {
    readonly type: PropType<Array<number | PaginationSizeOption>>;
    readonly default: () => number[];
  };
  readonly showQuickJumper: BooleanConstructor;
  readonly size: PropType<PaginationSize>;
  readonly disabled: BooleanConstructor;
  readonly pageSlot: {
    readonly type: NumberConstructor;
    readonly default: 9;
  };
  readonly selectProps: PropType<SelectProps>;
  readonly prev: PropType<RenderPrev>;
  readonly next: PropType<RenderNext>;
  readonly goto: PropType<RenderGoto>;
  readonly prefix: PropType<RenderPrefix>;
  readonly suffix: PropType<RenderSuffix>;
  readonly label: PropType<PaginationRenderLabel>;
  readonly displayOrder: {
    readonly type: PropType<Array<"pages" | "size-picker" | "quick-jumper">>;
    readonly default: readonly ["pages", "size-picker", "quick-jumper"];
  };
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly showQuickJumpDropdown: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly 'onUpdate:page': PropType<MaybeArray<(page: number) => void>>;
  readonly onUpdatePage: PropType<MaybeArray<(page: number) => void>>;
  readonly 'onUpdate:pageSize': PropType<MaybeArray<(pageSize: number) => void>>;
  readonly onUpdatePageSize: PropType<MaybeArray<(pageSize: number) => void>>;
  /** @deprecated */
  readonly onPageSizeChange: PropType<MaybeArray<(pageSize: number) => void>>;
  /** @deprecated */
  readonly onChange: PropType<MaybeArray<(page: number) => void>>;
  readonly theme: PropType<PaginationTheme>;
  readonly themeOverrides: PropType<PaginationThemeOverrides>;
  readonly builtinThemeOverrides: PropType<PaginationThemeOverrides>;
}>, {
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: Ref<string, string>;
  locale: Ref<{
    goto: string;
    selectionSuffix: string;
  }, {
    goto: string;
    selectionSuffix: string;
  }>;
  selfRef: Ref<HTMLElement | null, HTMLElement | null>;
  mergedPage: import("vue").ComputedRef<number>;
  pageItems: import("vue").ComputedRef<PageItem[]>;
  mergedItemCount: import("vue").ComputedRef<number>;
  jumperValue: Ref<string, string>;
  pageSizeOptions: import("vue").ComputedRef<PaginationSizeOption[]>;
  mergedPageSize: import("vue").ComputedRef<number>;
  inputSize: import("vue").ComputedRef<InputSize>;
  selectSize: import("vue").ComputedRef<SelectSize>;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: PaginationThemeVars;
    peers: {
      Select: SelectTheme;
      Input: InputTheme;
      Popselect: PopselectTheme;
    };
    peerOverrides: {
      Select?: {
        peers?: {
          InternalSelection?: ExtractThemeOverrides<InternalSelectionTheme> | undefined;
          InternalSelectMenu?: ExtractThemeOverrides<InternalSelectMenuTheme> | undefined;
        } | undefined;
      } | undefined;
      Input?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
      Popselect?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
          InternalSelectMenu?: ExtractThemeOverrides<InternalSelectMenuTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  mergedPageCount: import("vue").ComputedRef<number>;
  startIndex: import("vue").ComputedRef<number>;
  endIndex: import("vue").ComputedRef<number>;
  showFastForwardMenu: Ref<boolean, boolean>;
  showFastBackwardMenu: Ref<boolean, boolean>;
  fastForwardActive: Ref<boolean, boolean>;
  fastBackwardActive: Ref<boolean, boolean>;
  handleMenuSelect: (value: number) => void;
  handleFastForwardMouseenter: () => void;
  handleFastForwardMouseleave: () => void;
  handleFastBackwardMouseenter: () => void;
  handleFastBackwardMouseleave: () => void;
  handleJumperInput: (value: string) => void;
  handleBackwardClick: () => void;
  handleForwardClick: () => void;
  handlePageItemClick: (pageItem: PageItem) => void;
  handleSizePickerChange: (value: number) => void;
  handleQuickJumperChange: () => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly simple: BooleanConstructor;
  readonly page: NumberConstructor;
  readonly defaultPage: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly itemCount: NumberConstructor;
  readonly pageCount: NumberConstructor;
  readonly defaultPageCount: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly showSizePicker: BooleanConstructor;
  readonly pageSize: NumberConstructor;
  readonly defaultPageSize: NumberConstructor;
  readonly pageSizes: {
    readonly type: PropType<Array<number | PaginationSizeOption>>;
    readonly default: () => number[];
  };
  readonly showQuickJumper: BooleanConstructor;
  readonly size: PropType<PaginationSize>;
  readonly disabled: BooleanConstructor;
  readonly pageSlot: {
    readonly type: NumberConstructor;
    readonly default: 9;
  };
  readonly selectProps: PropType<SelectProps>;
  readonly prev: PropType<RenderPrev>;
  readonly next: PropType<RenderNext>;
  readonly goto: PropType<RenderGoto>;
  readonly prefix: PropType<RenderPrefix>;
  readonly suffix: PropType<RenderSuffix>;
  readonly label: PropType<PaginationRenderLabel>;
  readonly displayOrder: {
    readonly type: PropType<Array<"pages" | "size-picker" | "quick-jumper">>;
    readonly default: readonly ["pages", "size-picker", "quick-jumper"];
  };
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly showQuickJumpDropdown: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly 'onUpdate:page': PropType<MaybeArray<(page: number) => void>>;
  readonly onUpdatePage: PropType<MaybeArray<(page: number) => void>>;
  readonly 'onUpdate:pageSize': PropType<MaybeArray<(pageSize: number) => void>>;
  readonly onUpdatePageSize: PropType<MaybeArray<(pageSize: number) => void>>;
  /** @deprecated */
  readonly onPageSizeChange: PropType<MaybeArray<(pageSize: number) => void>>;
  /** @deprecated */
  readonly onChange: PropType<MaybeArray<(page: number) => void>>;
  readonly theme: PropType<PaginationTheme>;
  readonly themeOverrides: PropType<PaginationThemeOverrides>;
  readonly builtinThemeOverrides: PropType<PaginationThemeOverrides>;
}>> & Readonly<{}>, {
  readonly to: string | boolean | HTMLElement;
  readonly disabled: boolean;
  readonly simple: boolean;
  readonly defaultPage: number;
  readonly defaultPageCount: number;
  readonly showSizePicker: boolean;
  readonly pageSizes: (number | PaginationSizeOption)[];
  readonly showQuickJumper: boolean;
  readonly pageSlot: number;
  readonly displayOrder: ("pages" | "size-picker" | "quick-jumper")[];
  readonly showQuickJumpDropdown: boolean;
}, SlotsType<PaginationSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { PaginationProps, PaginationSlots, _default as default, paginationProps };