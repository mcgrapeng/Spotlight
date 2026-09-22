import { FormValidationStatus } from "../../../form/src/public-types.js";
import { ThemeCommonVars } from "../../../_styles/common/light.js";
import { SelectBaseOption } from "../../../select/src/interface.js";
import { RenderLabel, RenderLabelImpl } from "../../select-menu/src/interface.js";
import { PopoverTheme } from "../../../popover/styles/light.js";
import "../../../popover/styles/index.js";
import { InternalSelectionTheme, InternalSelectionThemeOverrides, InternalSelectionThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { PopoverProps } from "../../../popover/src/Popover.js";
import "../../../popover/index.js";
import { TagRef } from "../../../tag/src/Tag.js";
import { RenderTag } from "./interface.js";
import "../../../index.js";
import { ExtractThemeOverrides } from "../../../_mixins/use-theme.js";
import "../../../_mixins/index.js";
import { ScrollbarTheme } from "../../scrollbar/styles/light.js";
import "../../scrollbar/styles/index.js";
import { RtlItem } from "../../../config-provider/src/internal-interface.js";
import { CSSProperties, InputHTMLAttributes, PropType, Ref } from "vue";
//#region src/_internal/selection/src/Selection.d.ts
interface InternalSelectionInst {
  isComposing: boolean;
  focus: () => void;
  focusInput: () => void;
  blur: () => void;
  blurInput: () => void;
  $el: HTMLElement;
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  active: BooleanConstructor;
  pattern: {
    type: StringConstructor;
    default: string;
  };
  placeholder: StringConstructor;
  selectedOption: {
    type: PropType<SelectBaseOption | null>;
    default: null;
  };
  selectedOptions: {
    type: PropType<SelectBaseOption[] | null>;
    default: null;
  };
  labelField: {
    type: StringConstructor;
    default: string;
  };
  valueField: {
    type: StringConstructor;
    default: string;
  };
  multiple: BooleanConstructor;
  filterable: BooleanConstructor;
  clearable: BooleanConstructor;
  disabled: BooleanConstructor;
  size: {
    type: PropType<"tiny" | "small" | "medium" | "large">;
    default: string;
  };
  loading: BooleanConstructor;
  autofocus: BooleanConstructor;
  showArrow: {
    type: BooleanConstructor;
    default: boolean;
  };
  inputProps: PropType<InputHTMLAttributes>;
  focused: BooleanConstructor;
  renderTag: PropType<RenderTag>;
  onKeydown: PropType<(e: KeyboardEvent) => void>;
  onClick: PropType<(e: MouseEvent) => void>;
  onBlur: PropType<(e: FocusEvent) => void>;
  onFocus: PropType<(e: FocusEvent) => void>;
  onDeleteOption: PropType<(option: SelectBaseOption) => void>;
  maxTagCount: PropType<number | "responsive">;
  ellipsisTagPopoverProps: PropType<PopoverProps>;
  onClear: PropType<(e: MouseEvent) => void>;
  onPatternInput: PropType<(e: InputEvent) => void>;
  onPatternFocus: PropType<(e: FocusEvent) => void>;
  onPatternBlur: PropType<(e: FocusEvent) => void>;
  renderLabel: PropType<RenderLabel>;
  status: PropType<FormValidationStatus>;
  inlineThemeDisabled: BooleanConstructor;
  ignoreComposition: {
    type: BooleanConstructor;
    default: boolean;
  };
  onResize: PropType<() => void>;
  theme: PropType<InternalSelectionTheme>;
  themeOverrides: PropType<InternalSelectionThemeOverrides>;
  builtinThemeOverrides: PropType<InternalSelectionThemeOverrides>;
}>, {
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: InternalSelectionThemeVars;
    peers: {
      Popover: PopoverTheme;
    };
    peerOverrides: {
      Popover?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  mergedClearable: import("vue").ComputedRef<boolean>;
  mergedClsPrefix: Ref<string, string>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  patternInputFocused: Ref<boolean, boolean>;
  filterablePlaceholder: import("vue").ComputedRef<import("vue").VNodeChild>;
  label: import("vue").ComputedRef<unknown>;
  selected: import("vue").ComputedRef<boolean>;
  showTagsPanel: Ref<boolean, boolean>;
  isComposing: Ref<boolean, boolean>;
  counterRef: Ref<{
    $el: HTMLElement;
    setTextContent: (textContent: string) => void;
  } | null, TagRef | {
    $el: HTMLElement;
    setTextContent: (textContent: string) => void;
  } | null>;
  counterWrapperRef: Ref<HTMLElement | null, HTMLElement | null>;
  patternInputMirrorRef: Ref<HTMLElement | null, HTMLElement | null>;
  patternInputRef: Ref<HTMLElement | null, HTMLElement | null>;
  selfRef: Ref<HTMLElement | null, HTMLElement | null>;
  multipleElRef: Ref<HTMLElement | null, HTMLElement | null>;
  singleElRef: Ref<HTMLElement | null, HTMLElement | null>;
  patternInputWrapperRef: Ref<HTMLElement | null, HTMLElement | null>;
  overflowRef: unknown;
  inputTagElRef: Ref<HTMLElement | null, HTMLElement | null>;
  handleMouseDown: (e: MouseEvent) => void;
  handleFocusin: (e: FocusEvent) => void;
  handleClear: (e: MouseEvent) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleDeleteOption: (option: SelectBaseOption) => void;
  handlePatternKeyDown: (e: KeyboardEvent) => void;
  handlePatternInputInput: (e: InputEvent) => void;
  handlePatternInputBlur: (e: FocusEvent) => void;
  handlePatternInputFocus: (e: FocusEvent) => void;
  handleMouseEnterCounter: () => void;
  handleMouseLeaveCounter: () => void;
  handleFocusout: (e: FocusEvent) => void;
  handleCompositionEnd: () => void;
  handleCompositionStart: () => void;
  onPopoverUpdateShow: (show: boolean) => void;
  focus: () => void;
  focusInput: () => void;
  blur: () => void;
  blurInput: () => void;
  updateCounter: (count: number) => void;
  getCounter: () => HTMLElement | null;
  getTail: () => HTMLElement | null;
  renderLabel: RenderLabelImpl;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  active: BooleanConstructor;
  pattern: {
    type: StringConstructor;
    default: string;
  };
  placeholder: StringConstructor;
  selectedOption: {
    type: PropType<SelectBaseOption | null>;
    default: null;
  };
  selectedOptions: {
    type: PropType<SelectBaseOption[] | null>;
    default: null;
  };
  labelField: {
    type: StringConstructor;
    default: string;
  };
  valueField: {
    type: StringConstructor;
    default: string;
  };
  multiple: BooleanConstructor;
  filterable: BooleanConstructor;
  clearable: BooleanConstructor;
  disabled: BooleanConstructor;
  size: {
    type: PropType<"tiny" | "small" | "medium" | "large">;
    default: string;
  };
  loading: BooleanConstructor;
  autofocus: BooleanConstructor;
  showArrow: {
    type: BooleanConstructor;
    default: boolean;
  };
  inputProps: PropType<InputHTMLAttributes>;
  focused: BooleanConstructor;
  renderTag: PropType<RenderTag>;
  onKeydown: PropType<(e: KeyboardEvent) => void>;
  onClick: PropType<(e: MouseEvent) => void>;
  onBlur: PropType<(e: FocusEvent) => void>;
  onFocus: PropType<(e: FocusEvent) => void>;
  onDeleteOption: PropType<(option: SelectBaseOption) => void>;
  maxTagCount: PropType<number | "responsive">;
  ellipsisTagPopoverProps: PropType<PopoverProps>;
  onClear: PropType<(e: MouseEvent) => void>;
  onPatternInput: PropType<(e: InputEvent) => void>;
  onPatternFocus: PropType<(e: FocusEvent) => void>;
  onPatternBlur: PropType<(e: FocusEvent) => void>;
  renderLabel: PropType<RenderLabel>;
  status: PropType<FormValidationStatus>;
  inlineThemeDisabled: BooleanConstructor;
  ignoreComposition: {
    type: BooleanConstructor;
    default: boolean;
  };
  onResize: PropType<() => void>;
  theme: PropType<InternalSelectionTheme>;
  themeOverrides: PropType<InternalSelectionThemeOverrides>;
  builtinThemeOverrides: PropType<InternalSelectionThemeOverrides>;
}>> & Readonly<{}>, {
  bordered: boolean | undefined;
  inlineThemeDisabled: boolean;
  loading: boolean;
  clearable: boolean;
  disabled: boolean;
  size: "large" | "medium" | "small" | "tiny";
  active: boolean;
  showArrow: boolean;
  multiple: boolean;
  filterable: boolean;
  valueField: string;
  labelField: string;
  pattern: string;
  selectedOption: SelectBaseOption<string | number, string | ((option: SelectBaseOption<string | number, string | /*elided*/ any>, selected: boolean) => import("vue").VNodeChild)> | null;
  selectedOptions: SelectBaseOption<string | number, string | ((option: SelectBaseOption<string | number, string | /*elided*/ any>, selected: boolean) => import("vue").VNodeChild)>[] | null;
  focused: boolean;
  ignoreComposition: boolean;
  autofocus: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { InternalSelectionInst, _default as default };