import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { TransferTheme, TransferThemeOverrides, TransferThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { Filter, OnUpdateValue, Option, OptionValue } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/legacy-transfer/src/Transfer.d.ts
declare const transferProps: {
  readonly value: PropType<OptionValue[] | null>;
  readonly defaultValue: {
    readonly type: PropType<OptionValue[] | null>;
    readonly default: null;
  };
  readonly options: {
    readonly type: PropType<Option[]>;
    readonly default: () => never[];
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly virtualScroll: BooleanConstructor;
  readonly sourceTitle: StringConstructor;
  readonly targetTitle: StringConstructor;
  readonly filterable: BooleanConstructor;
  readonly sourceFilterPlaceholder: StringConstructor;
  readonly targetFilterPlaceholder: StringConstructor;
  readonly filter: {
    readonly type: PropType<Filter>;
    readonly default: (pattern: string, option: Option) => number | true;
  };
  readonly size: PropType<"small" | "medium" | "large">;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onChange: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<TransferTheme>;
  readonly themeOverrides: PropType<TransferThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TransferThemeOverrides>;
};
type TransferProps = ExtractPublicPropTypes<typeof transferProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly value: PropType<OptionValue[] | null>;
  readonly defaultValue: {
    readonly type: PropType<OptionValue[] | null>;
    readonly default: null;
  };
  readonly options: {
    readonly type: PropType<Option[]>;
    readonly default: () => never[];
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly virtualScroll: BooleanConstructor;
  readonly sourceTitle: StringConstructor;
  readonly targetTitle: StringConstructor;
  readonly filterable: BooleanConstructor;
  readonly sourceFilterPlaceholder: StringConstructor;
  readonly targetFilterPlaceholder: StringConstructor;
  readonly filter: {
    readonly type: PropType<Filter>;
    readonly default: (pattern: string, option: Option) => number | true;
  };
  readonly size: PropType<"small" | "medium" | "large">;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onChange: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<TransferTheme>;
  readonly themeOverrides: PropType<TransferThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TransferThemeOverrides>;
}>, {
  locale: Ref<{
    sourceTitle: string;
    targetTitle: string;
  }, {
    sourceTitle: string;
    targetTitle: string;
  }>;
  mergedClsPrefix: Ref<string, string>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  itemSize: import("vue").ComputedRef<number>;
  isMounted: Readonly<Ref<boolean, boolean>>;
  isInputing: Ref<boolean, boolean>;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: TransferThemeVars;
    peers: {
      Checkbox: CheckboxTheme;
      Scrollbar: ScrollbarTheme;
      Input: InputTheme;
      Empty: EmptyTheme;
      Button: ButtonTheme;
    };
    peerOverrides: {
      Checkbox?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Input?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
      Empty?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  filteredSrcOpts: import("vue").ComputedRef<Option[]>;
  filteredTgtOpts: import("vue").ComputedRef<any[]>;
  srcPattern: Ref<string, string>;
  tgtPattern: Ref<string, string>;
  toButtonDisabled: import("vue").ComputedRef<boolean>;
  fromButtonDisabled: import("vue").ComputedRef<boolean>;
  handleSrcHeaderCheck: () => void;
  handleTgtHeaderCheck: () => void;
  handleToSrcClick: () => void;
  handleToTgtClick: () => void;
  handleInputFocus: () => void;
  handleInputBlur: () => void;
  handleTgtFilterUpdateValue: (value: string | null) => void;
  handleSrcFilterUpdateValue: (value: string | null) => void;
  cssVars: Ref<CSSProperties>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly value: PropType<OptionValue[] | null>;
  readonly defaultValue: {
    readonly type: PropType<OptionValue[] | null>;
    readonly default: null;
  };
  readonly options: {
    readonly type: PropType<Option[]>;
    readonly default: () => never[];
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly virtualScroll: BooleanConstructor;
  readonly sourceTitle: StringConstructor;
  readonly targetTitle: StringConstructor;
  readonly filterable: BooleanConstructor;
  readonly sourceFilterPlaceholder: StringConstructor;
  readonly targetFilterPlaceholder: StringConstructor;
  readonly filter: {
    readonly type: PropType<Filter>;
    readonly default: (pattern: string, option: Option) => number | true;
  };
  readonly size: PropType<"small" | "medium" | "large">;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onChange: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<TransferTheme>;
  readonly themeOverrides: PropType<TransferThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TransferThemeOverrides>;
}>> & Readonly<{}>, {
  readonly filter: Filter;
  readonly defaultValue: OptionValue[] | null;
  readonly disabled: boolean | undefined;
  readonly options: Option[];
  readonly filterable: boolean;
  readonly virtualScroll: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TransferProps, _default as default, transferProps };