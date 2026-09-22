import { FormValidationStatus } from "../../form/src/public-types.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { InputOtpTheme, InputOtpThemeOverrides, InputOtpThemeVars } from "../styles/light.js";
import { InputOtpAllowInput, InputOtpOnBlur, InputOtpOnFinish, InputOtpOnFocus, InputOtpOnUpdateValue, InputOtpSize, InputOtpSlots } from "./public-types.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, SlotsType } from "vue";
//#region src/input-otp/src/InputOtp.d.ts
declare const inputOtpProps: {
  defaultValue: {
    type: PropType<string[]>;
    default: never[];
  };
  value: PropType<null | string[]>;
  length: {
    type: NumberConstructor;
    default: number;
  };
  block: BooleanConstructor;
  size: PropType<InputOtpSize>;
  disabled: BooleanConstructor;
  mask: BooleanConstructor;
  readonly: BooleanConstructor;
  status: PropType<FormValidationStatus>;
  gap: PropType<string | number>;
  placeholder: {
    type: StringConstructor;
    default: string;
  };
  allowInput: PropType<InputOtpAllowInput>;
  onBlur: PropType<MaybeArray<InputOtpOnBlur>>;
  onFocus: PropType<MaybeArray<InputOtpOnFocus>>;
  'onUpdate:value': PropType<MaybeArray<InputOtpOnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<InputOtpOnUpdateValue>>;
  onFinish: PropType<MaybeArray<InputOtpOnFinish>>;
  theme: PropType<InputOtpTheme>;
  themeOverrides: PropType<InputOtpThemeOverrides>;
  builtinThemeOverrides: PropType<InputOtpThemeOverrides>;
};
type InputOtpProps = ExtractPublicPropTypes<typeof inputOtpProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  defaultValue: {
    type: PropType<string[]>;
    default: never[];
  };
  value: PropType<null | string[]>;
  length: {
    type: NumberConstructor;
    default: number;
  };
  block: BooleanConstructor;
  size: PropType<InputOtpSize>;
  disabled: BooleanConstructor;
  mask: BooleanConstructor;
  readonly: BooleanConstructor;
  status: PropType<FormValidationStatus>;
  gap: PropType<string | number>;
  placeholder: {
    type: StringConstructor;
    default: string;
  };
  allowInput: PropType<InputOtpAllowInput>;
  onBlur: PropType<MaybeArray<InputOtpOnBlur>>;
  onFocus: PropType<MaybeArray<InputOtpOnFocus>>;
  'onUpdate:value': PropType<MaybeArray<InputOtpOnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<InputOtpOnUpdateValue>>;
  onFinish: PropType<MaybeArray<InputOtpOnFinish>>;
  theme: PropType<InputOtpTheme>;
  themeOverrides: PropType<InputOtpThemeOverrides>;
  builtinThemeOverrides: PropType<InputOtpThemeOverrides>;
}>, {
  focusOnChar: (charIndex: number) => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: InputOtpThemeVars;
    peers: {
      Input: InputTheme;
    };
    peerOverrides: {
      Input?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  perItemValueArray: import("vue").ComputedRef<string[]>;
  mergedClsPrefix: Ref<string, string>;
  inputRefList: Ref<{
    wrapperElRef: HTMLElement | null;
    textareaElRef: HTMLTextAreaElement | null;
    inputElRef: HTMLInputElement | null;
    isCompositing: boolean;
    blur: () => void;
    clear: () => void;
    focus: () => void;
    select: () => void;
    activate: () => void;
    deactivate: () => void;
    scrollTo: (options: ScrollToOptions) => void;
  }[], {
    wrapperElRef: HTMLElement | null;
    textareaElRef: HTMLTextAreaElement | null;
    inputElRef: HTMLInputElement | null;
    isCompositing: boolean;
    blur: () => void;
    clear: () => void;
    focus: () => void;
    select: () => void;
    activate: () => void;
    deactivate: () => void;
    scrollTo: (options: ScrollToOptions) => void;
  }[] | {
    wrapperElRef: HTMLElement | null;
    textareaElRef: HTMLTextAreaElement | null;
    inputElRef: HTMLInputElement | null;
    isCompositing: boolean;
    blur: () => void;
    clear: () => void;
    focus: () => void;
    select: () => void;
    activate: () => void;
    deactivate: () => void;
    scrollTo: (options: ScrollToOptions) => void;
  }[]>;
  inputType: import("vue").ComputedRef<"text" | "password">;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedStatus: import("vue").ComputedRef<FormValidationStatus | undefined>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  getTemplateEvents: (index: number) => {
    onInput: (value: string) => void;
    onPaste: (event: ClipboardEvent) => void;
    onKeydown: (event: KeyboardEvent) => void;
    onFocus: (event: FocusEvent) => void;
    onBlur: (event: FocusEvent) => void;
  };
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  defaultValue: {
    type: PropType<string[]>;
    default: never[];
  };
  value: PropType<null | string[]>;
  length: {
    type: NumberConstructor;
    default: number;
  };
  block: BooleanConstructor;
  size: PropType<InputOtpSize>;
  disabled: BooleanConstructor;
  mask: BooleanConstructor;
  readonly: BooleanConstructor;
  status: PropType<FormValidationStatus>;
  gap: PropType<string | number>;
  placeholder: {
    type: StringConstructor;
    default: string;
  };
  allowInput: PropType<InputOtpAllowInput>;
  onBlur: PropType<MaybeArray<InputOtpOnBlur>>;
  onFocus: PropType<MaybeArray<InputOtpOnFocus>>;
  'onUpdate:value': PropType<MaybeArray<InputOtpOnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<InputOtpOnUpdateValue>>;
  onFinish: PropType<MaybeArray<InputOtpOnFinish>>;
  theme: PropType<InputOtpTheme>;
  themeOverrides: PropType<InputOtpThemeOverrides>;
  builtinThemeOverrides: PropType<InputOtpThemeOverrides>;
}>> & Readonly<{}>, {
  length: number;
  block: boolean;
  disabled: boolean;
  defaultValue: string[];
  placeholder: string;
  mask: boolean;
  readonly: boolean;
}, SlotsType<InputOtpSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { InputOtpProps, _default as default, inputOtpProps };