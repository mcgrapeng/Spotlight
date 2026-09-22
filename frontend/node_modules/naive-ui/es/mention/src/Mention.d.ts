import { FormValidationStatus } from "../../form/src/public-types.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import { SelectBaseOption, SelectGroupOption, SelectIgnoredOption } from "../../select/src/interface.js";
import { RenderLabel } from "../../_internal/select-menu/src/interface.js";
import "../../_internal/index.js";
import { MentionOption } from "./interface.js";
import { MentionTheme, MentionThemeOverrides, MentionThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { MentionSize } from "./public-types.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
import { FollowerPlacement } from "vueuc";
import { TreeNode } from "treemate";
//#region src/mention/src/Mention.d.ts
declare const mentionProps: {
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly autosize: PropType<boolean | {
    maxRows?: number;
    minRows?: number;
  }>;
  readonly options: {
    readonly type: PropType<MentionOption[]>;
    readonly default: readonly [];
  };
  readonly filter: {
    readonly type: PropType<(pattern: string, option: MentionOption) => boolean>;
    readonly default: (pattern: string, option: MentionOption) => boolean;
  };
  readonly type: {
    readonly type: PropType<"text" | "textarea">;
    readonly default: "text";
  };
  readonly separator: {
    readonly type: StringConstructor;
    readonly validator: (separator: string) => boolean;
    readonly default: " ";
  };
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly disabled: BooleanConstructor;
  readonly value: PropType<string | null>;
  readonly defaultValue: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly loading: BooleanConstructor;
  readonly prefix: {
    readonly type: PropType<string | string[]>;
    readonly default: "@";
  };
  readonly placeholder: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly size: PropType<MentionSize>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly status: PropType<FormValidationStatus>;
  readonly 'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  readonly 'onUpdate:value': PropType<MaybeArray<(value: string) => void>>;
  readonly onUpdateValue: PropType<MaybeArray<(value: string) => void>>;
  readonly onSearch: PropType<(pattern: string, prefix: string) => void>;
  readonly onSelect: PropType<(option: MentionOption, prefix: string) => void>;
  readonly onFocus: PropType<(e: FocusEvent) => void>;
  readonly onBlur: PropType<(e: FocusEvent) => void>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly internalDebug: BooleanConstructor;
  readonly theme: PropType<MentionTheme>;
  readonly themeOverrides: PropType<MentionThemeOverrides>;
  readonly builtinThemeOverrides: PropType<MentionThemeOverrides>;
};
type MentionProps = ExtractPublicPropTypes<typeof mentionProps>;
interface MentionSlots {
  default?: () => VNode[];
  empty?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly autosize: PropType<boolean | {
    maxRows?: number;
    minRows?: number;
  }>;
  readonly options: {
    readonly type: PropType<MentionOption[]>;
    readonly default: readonly [];
  };
  readonly filter: {
    readonly type: PropType<(pattern: string, option: MentionOption) => boolean>;
    readonly default: (pattern: string, option: MentionOption) => boolean;
  };
  readonly type: {
    readonly type: PropType<"text" | "textarea">;
    readonly default: "text";
  };
  readonly separator: {
    readonly type: StringConstructor;
    readonly validator: (separator: string) => boolean;
    readonly default: " ";
  };
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly disabled: BooleanConstructor;
  readonly value: PropType<string | null>;
  readonly defaultValue: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly loading: BooleanConstructor;
  readonly prefix: {
    readonly type: PropType<string | string[]>;
    readonly default: "@";
  };
  readonly placeholder: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly size: PropType<MentionSize>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly status: PropType<FormValidationStatus>;
  readonly 'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  readonly 'onUpdate:value': PropType<MaybeArray<(value: string) => void>>;
  readonly onUpdateValue: PropType<MaybeArray<(value: string) => void>>;
  readonly onSearch: PropType<(pattern: string, prefix: string) => void>;
  readonly onSelect: PropType<(option: MentionOption, prefix: string) => void>;
  readonly onFocus: PropType<(e: FocusEvent) => void>;
  readonly onBlur: PropType<(e: FocusEvent) => void>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly internalDebug: BooleanConstructor;
  readonly theme: PropType<MentionTheme>;
  readonly themeOverrides: PropType<MentionThemeOverrides>;
  readonly builtinThemeOverrides: PropType<MentionThemeOverrides>;
}>, {
  namespace: import("vue").ComputedRef<string | undefined>;
  mergedClsPrefix: Ref<string, string>;
  mergedBordered: import("vue").ComputedRef<boolean>;
  mergedSize: import("vue").ComputedRef<MentionSize>;
  mergedStatus: import("vue").ComputedRef<FormValidationStatus | undefined>;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: MentionThemeVars;
    peers: {
      InternalSelectMenu: InternalSelectMenuTheme;
      Input: InputTheme;
    };
    peerOverrides: {
      InternalSelectMenu?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Empty?: ExtractThemeOverrides<EmptyTheme> | undefined;
        } | undefined;
      } | undefined;
      Input?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  treeMate: import("vue").ComputedRef<import("treemate").TreeMate<SelectBaseOption<string | number, string | ((option: SelectBaseOption<string | number, string | /*elided*/ any>, selected: boolean) => import("vue").VNodeChild)>, SelectGroupOption, SelectIgnoredOption>>;
  selectMenuInstRef: unknown;
  inputInstRef: unknown;
  cursorRef: Ref<HTMLElement | null, HTMLElement | null>;
  followerRef: unknown;
  wrapperElRef: Ref<HTMLElement | null, HTMLElement | null>;
  showMenu: Ref<boolean, boolean>;
  adjustedTo: import("vue").ComputedRef<string | HTMLElement>;
  isMounted: Readonly<Ref<boolean, boolean>>;
  mergedValue: import("vue").ComputedRef<string | null>;
  handleInputFocus: (e: FocusEvent) => void;
  handleInputBlur: (e: FocusEvent) => void;
  handleInputUpdateValue: (value: string) => void;
  handleInputKeyDown: (e: KeyboardEvent) => void;
  handleSelect: (tmNode: TreeNode<SelectBaseOption>) => void;
  handleInputMouseDown: () => void;
  focus: () => void;
  blur: () => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly autosize: PropType<boolean | {
    maxRows?: number;
    minRows?: number;
  }>;
  readonly options: {
    readonly type: PropType<MentionOption[]>;
    readonly default: readonly [];
  };
  readonly filter: {
    readonly type: PropType<(pattern: string, option: MentionOption) => boolean>;
    readonly default: (pattern: string, option: MentionOption) => boolean;
  };
  readonly type: {
    readonly type: PropType<"text" | "textarea">;
    readonly default: "text";
  };
  readonly separator: {
    readonly type: StringConstructor;
    readonly validator: (separator: string) => boolean;
    readonly default: " ";
  };
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly disabled: BooleanConstructor;
  readonly value: PropType<string | null>;
  readonly defaultValue: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly loading: BooleanConstructor;
  readonly prefix: {
    readonly type: PropType<string | string[]>;
    readonly default: "@";
  };
  readonly placeholder: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly size: PropType<MentionSize>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly status: PropType<FormValidationStatus>;
  readonly 'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  readonly 'onUpdate:value': PropType<MaybeArray<(value: string) => void>>;
  readonly onUpdateValue: PropType<MaybeArray<(value: string) => void>>;
  readonly onSearch: PropType<(pattern: string, prefix: string) => void>;
  readonly onSelect: PropType<(option: MentionOption, prefix: string) => void>;
  readonly onFocus: PropType<(e: FocusEvent) => void>;
  readonly onBlur: PropType<(e: FocusEvent) => void>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly internalDebug: BooleanConstructor;
  readonly theme: PropType<MentionTheme>;
  readonly themeOverrides: PropType<MentionThemeOverrides>;
  readonly builtinThemeOverrides: PropType<MentionThemeOverrides>;
}>> & Readonly<{}>, {
  readonly to: string | boolean | HTMLElement;
  readonly filter: (pattern: string, option: MentionOption) => boolean;
  readonly type: "textarea" | "text";
  readonly bordered: boolean | undefined;
  readonly loading: boolean;
  readonly defaultValue: string;
  readonly disabled: boolean;
  readonly placeholder: string;
  readonly placement: FollowerPlacement;
  readonly options: MentionOption[];
  readonly separator: string;
  readonly prefix: string | string[];
  readonly internalDebug: boolean;
}, SlotsType<MentionSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { MentionProps, MentionSlots, _default as default, mentionProps };