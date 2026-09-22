import { FormValidationStatus } from "../../form/src/public-types.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { InputTheme, InputThemeOverrides, InputThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { OnUpdateValue } from "./interface.js";
import { InputSize } from "./public-types.js";
import "../../index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, InputHTMLAttributes, PropType, Ref, SlotsType, TextareaHTMLAttributes, VNode, VNodeChild } from "vue";
//#region src/input/src/Input.d.ts
declare const inputProps: {
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  type: {
    type: PropType<"text" | "textarea" | "password">;
    default: string;
  };
  placeholder: PropType<string | [string, string]>;
  defaultValue: {
    type: PropType<null | string | [string, string]>;
    default: null;
  };
  value: PropType<null | string | [string, string]>;
  disabled: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  size: PropType<InputSize>;
  rows: {
    type: PropType<number | string>;
    default: number;
  };
  round: BooleanConstructor;
  minlength: PropType<number | string>;
  maxlength: PropType<number | string>;
  clearable: BooleanConstructor;
  autosize: {
    type: PropType<boolean | {
      minRows?: number;
      maxRows?: number;
    }>;
    default: boolean;
  };
  pair: BooleanConstructor;
  separator: StringConstructor;
  readonly: {
    type: (BooleanConstructor | StringConstructor)[];
    default: boolean;
  };
  passivelyActivated: BooleanConstructor;
  showPasswordOn: PropType<"mousedown" | "click">;
  stateful: {
    type: BooleanConstructor;
    default: boolean;
  };
  autofocus: BooleanConstructor;
  inputProps: PropType<TextareaHTMLAttributes | InputHTMLAttributes>;
  resizable: {
    type: BooleanConstructor;
    default: boolean;
  };
  showCount: BooleanConstructor;
  loading: {
    type: BooleanConstructor;
    default: undefined;
  };
  allowInput: PropType<(value: string) => boolean>;
  renderCount: PropType<(props: {
    value: string;
  }) => VNodeChild>;
  onMousedown: PropType<(e: MouseEvent) => void>;
  onKeydown: PropType<(e: KeyboardEvent) => void>;
  onKeyup: PropType<(e: KeyboardEvent) => void>;
  onInput: PropType<OnUpdateValue>;
  onFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onClick: PropType<MaybeArray<(e: MouseEvent) => void>>;
  onChange: PropType<OnUpdateValue>;
  onClear: PropType<MaybeArray<(e: MouseEvent) => void>>;
  countGraphemes: PropType<(value: string) => number>;
  status: PropType<FormValidationStatus>;
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  /** private */
  textDecoration: PropType<string | [string, string]>;
  attrSize: {
    type: NumberConstructor;
    default: number;
  };
  onInputBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onInputFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onDeactivate: PropType<MaybeArray<() => void>>;
  onActivate: PropType<MaybeArray<() => void>>;
  onWrapperFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onWrapperBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  internalDeactivateOnEnter: BooleanConstructor;
  internalForceFocus: BooleanConstructor;
  internalLoadingBeforeSuffix: {
    type: BooleanConstructor;
    default: boolean;
  };
  /** deprecated */
  showPasswordToggle: BooleanConstructor;
  theme: PropType<InputTheme>;
  themeOverrides: PropType<InputThemeOverrides>;
  builtinThemeOverrides: PropType<InputThemeOverrides>;
};
type InputProps = ExtractPublicPropTypes<typeof inputProps>;
interface InputSlots {
  'clear-icon'?: () => VNode[];
  count?: (props: {
    value: string;
  }) => VNode[];
  'password-invisible-icon'?: () => VNode[];
  'password-visible-icon'?: () => VNode[];
  prefix?: () => VNode[];
  separator?: () => VNode[];
  suffix?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  type: {
    type: PropType<"text" | "textarea" | "password">;
    default: string;
  };
  placeholder: PropType<string | [string, string]>;
  defaultValue: {
    type: PropType<null | string | [string, string]>;
    default: null;
  };
  value: PropType<null | string | [string, string]>;
  disabled: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  size: PropType<InputSize>;
  rows: {
    type: PropType<number | string>;
    default: number;
  };
  round: BooleanConstructor;
  minlength: PropType<number | string>;
  maxlength: PropType<number | string>;
  clearable: BooleanConstructor;
  autosize: {
    type: PropType<boolean | {
      minRows?: number;
      maxRows?: number;
    }>;
    default: boolean;
  };
  pair: BooleanConstructor;
  separator: StringConstructor;
  readonly: {
    type: (BooleanConstructor | StringConstructor)[];
    default: boolean;
  };
  passivelyActivated: BooleanConstructor;
  showPasswordOn: PropType<"mousedown" | "click">;
  stateful: {
    type: BooleanConstructor;
    default: boolean;
  };
  autofocus: BooleanConstructor;
  inputProps: PropType<TextareaHTMLAttributes | InputHTMLAttributes>;
  resizable: {
    type: BooleanConstructor;
    default: boolean;
  };
  showCount: BooleanConstructor;
  loading: {
    type: BooleanConstructor;
    default: undefined;
  };
  allowInput: PropType<(value: string) => boolean>;
  renderCount: PropType<(props: {
    value: string;
  }) => VNodeChild>;
  onMousedown: PropType<(e: MouseEvent) => void>;
  onKeydown: PropType<(e: KeyboardEvent) => void>;
  onKeyup: PropType<(e: KeyboardEvent) => void>;
  onInput: PropType<OnUpdateValue>;
  onFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onClick: PropType<MaybeArray<(e: MouseEvent) => void>>;
  onChange: PropType<OnUpdateValue>;
  onClear: PropType<MaybeArray<(e: MouseEvent) => void>>;
  countGraphemes: PropType<(value: string) => number>;
  status: PropType<FormValidationStatus>;
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  /** private */
  textDecoration: PropType<string | [string, string]>;
  attrSize: {
    type: NumberConstructor;
    default: number;
  };
  onInputBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onInputFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onDeactivate: PropType<MaybeArray<() => void>>;
  onActivate: PropType<MaybeArray<() => void>>;
  onWrapperFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onWrapperBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  internalDeactivateOnEnter: BooleanConstructor;
  internalForceFocus: BooleanConstructor;
  internalLoadingBeforeSuffix: {
    type: BooleanConstructor;
    default: boolean;
  };
  /** deprecated */
  showPasswordToggle: BooleanConstructor;
  theme: PropType<InputTheme>;
  themeOverrides: PropType<InputThemeOverrides>;
  builtinThemeOverrides: PropType<InputThemeOverrides>;
}>, {
  wrapperElRef: Ref<HTMLElement | null, HTMLElement | null>;
  inputElRef: Ref<HTMLInputElement | null, HTMLInputElement | null>;
  inputMirrorElRef: Ref<HTMLElement | null, HTMLElement | null>;
  inputEl2Ref: Ref<HTMLInputElement | null, HTMLInputElement | null>;
  textareaElRef: Ref<HTMLTextAreaElement | null, HTMLTextAreaElement | null>;
  textareaMirrorElRef: Ref<HTMLElement | null, HTMLElement | null>;
  textareaScrollbarInstRef: unknown;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  uncontrolledValue: Ref<string | [string, string] | null, string | [string, string] | null>;
  mergedValue: import("vue").ComputedRef<string | [string, string] | null>;
  passwordVisible: Ref<boolean, boolean>;
  mergedPlaceholder: import("vue").ComputedRef<[string, string] | [string]>;
  showPlaceholder1: import("vue").ComputedRef<string | false>;
  showPlaceholder2: import("vue").ComputedRef<boolean | "" | undefined>;
  mergedFocus: import("vue").ComputedRef<boolean>;
  isComposing: Ref<boolean, boolean>;
  activated: Ref<boolean, boolean>;
  showClearButton: import("vue").ComputedRef<boolean>;
  mergedSize: import("vue").ComputedRef<InputSize>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  textDecorationStyle: import("vue").ComputedRef<string[] | {
    textDecoration: string;
  }[]>;
  mergedClsPrefix: Ref<string, string>;
  mergedBordered: import("vue").ComputedRef<boolean>;
  mergedShowPasswordOn: import("vue").ComputedRef<"click" | "mousedown" | undefined>;
  placeholderStyle: Ref<{
    top: string;
  }, {
    top: string;
  } | {
    top: string;
  }>;
  mergedStatus: import("vue").ComputedRef<FormValidationStatus | undefined>;
  textAreaScrollContainerWidth: Ref<number | undefined, number | undefined>;
  handleTextAreaScroll: (e: Event) => void;
  handleCompositionStart: () => void;
  handleCompositionEnd: (e: CompositionEvent) => void;
  handleInput: (e: InputEvent | CompositionEvent | Event, index?: 0 | 1, event?: string) => void;
  handleInputBlur: (e: FocusEvent) => void;
  handleInputFocus: (e: FocusEvent, index: number) => void;
  handleWrapperBlur: (e: FocusEvent) => void;
  handleWrapperFocus: (e: FocusEvent) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleMouseDown: (e: MouseEvent) => void;
  handleChange: (e: Event, index?: 0 | 1) => void;
  handleClick: (e: MouseEvent) => void;
  handleClear: (e: MouseEvent) => void;
  handlePasswordToggleClick: () => void;
  handlePasswordToggleMousedown: (e: MouseEvent) => void;
  handleWrapperKeydown: (e: KeyboardEvent) => void;
  handleWrapperKeyup: (e: KeyboardEvent) => void;
  handleTextAreaMirrorResize: () => void;
  getTextareaScrollContainer: () => HTMLTextAreaElement | null;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: InputThemeVars;
    peers: {
      Scrollbar: ScrollbarTheme;
    };
    peerOverrides: {
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  isCompositing: Ref<boolean>;
  blur: () => void;
  clear: () => void;
  focus: () => void;
  select: () => void;
  activate: () => void;
  deactivate: () => void;
  scrollTo: (options: ScrollToOptions) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  type: {
    type: PropType<"text" | "textarea" | "password">;
    default: string;
  };
  placeholder: PropType<string | [string, string]>;
  defaultValue: {
    type: PropType<null | string | [string, string]>;
    default: null;
  };
  value: PropType<null | string | [string, string]>;
  disabled: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  size: PropType<InputSize>;
  rows: {
    type: PropType<number | string>;
    default: number;
  };
  round: BooleanConstructor;
  minlength: PropType<number | string>;
  maxlength: PropType<number | string>;
  clearable: BooleanConstructor;
  autosize: {
    type: PropType<boolean | {
      minRows?: number;
      maxRows?: number;
    }>;
    default: boolean;
  };
  pair: BooleanConstructor;
  separator: StringConstructor;
  readonly: {
    type: (BooleanConstructor | StringConstructor)[];
    default: boolean;
  };
  passivelyActivated: BooleanConstructor;
  showPasswordOn: PropType<"mousedown" | "click">;
  stateful: {
    type: BooleanConstructor;
    default: boolean;
  };
  autofocus: BooleanConstructor;
  inputProps: PropType<TextareaHTMLAttributes | InputHTMLAttributes>;
  resizable: {
    type: BooleanConstructor;
    default: boolean;
  };
  showCount: BooleanConstructor;
  loading: {
    type: BooleanConstructor;
    default: undefined;
  };
  allowInput: PropType<(value: string) => boolean>;
  renderCount: PropType<(props: {
    value: string;
  }) => VNodeChild>;
  onMousedown: PropType<(e: MouseEvent) => void>;
  onKeydown: PropType<(e: KeyboardEvent) => void>;
  onKeyup: PropType<(e: KeyboardEvent) => void>;
  onInput: PropType<OnUpdateValue>;
  onFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onClick: PropType<MaybeArray<(e: MouseEvent) => void>>;
  onChange: PropType<OnUpdateValue>;
  onClear: PropType<MaybeArray<(e: MouseEvent) => void>>;
  countGraphemes: PropType<(value: string) => number>;
  status: PropType<FormValidationStatus>;
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  /** private */
  textDecoration: PropType<string | [string, string]>;
  attrSize: {
    type: NumberConstructor;
    default: number;
  };
  onInputBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onInputFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onDeactivate: PropType<MaybeArray<() => void>>;
  onActivate: PropType<MaybeArray<() => void>>;
  onWrapperFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onWrapperBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  internalDeactivateOnEnter: BooleanConstructor;
  internalForceFocus: BooleanConstructor;
  internalLoadingBeforeSuffix: {
    type: BooleanConstructor;
    default: boolean;
  };
  /** deprecated */
  showPasswordToggle: BooleanConstructor;
  theme: PropType<InputTheme>;
  themeOverrides: PropType<InputThemeOverrides>;
  builtinThemeOverrides: PropType<InputThemeOverrides>;
}>> & Readonly<{}>, {
  type: "textarea" | "text" | "password";
  bordered: boolean | undefined;
  loading: boolean;
  clearable: boolean;
  defaultValue: string | [string, string] | null;
  disabled: boolean | undefined;
  round: boolean;
  stateful: boolean;
  resizable: boolean;
  rows: string | number;
  autosize: boolean | {
    minRows?: number;
    maxRows?: number;
  };
  pair: boolean;
  readonly: string | boolean;
  passivelyActivated: boolean;
  autofocus: boolean;
  showCount: boolean;
  attrSize: number;
  internalDeactivateOnEnter: boolean;
  internalForceFocus: boolean;
  internalLoadingBeforeSuffix: boolean;
  showPasswordToggle: boolean;
}, SlotsType<InputSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { InputProps, InputSlots, _default as default, inputProps };