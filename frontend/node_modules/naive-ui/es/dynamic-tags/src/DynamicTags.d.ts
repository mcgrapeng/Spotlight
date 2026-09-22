import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { TagColor } from "../../tag/src/common-props.js";
import { TagTheme } from "../../tag/styles/light.js";
import "../../tag/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { SpaceTheme } from "../../space/styles/light.js";
import "../../space/styles/index.js";
import { DynamicTagsTheme, DynamicTagsThemeOverrides, DynamicTagsThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { InputProps } from "../../input/src/Input.js";
import "../../input/index.js";
import { DynamicTagsInputSlotProps, DynamicTagsOption, DynamicTagsTriggerSlotProps, OnCreate, OnUpdateValue } from "./interface.js";
import { DynamicTagsSize } from "./public-types.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode, VNodeChild } from "vue";
//#region src/dynamic-tags/src/DynamicTags.d.ts
declare const dynamicTagsProps: {
  size: PropType<DynamicTagsSize>;
  closable: {
    type: BooleanConstructor;
    default: boolean;
  };
  defaultValue: {
    type: PropType<Array<string | DynamicTagsOption>>;
    default: () => never[];
  };
  value: PropType<Array<string | DynamicTagsOption>>;
  inputClass: StringConstructor;
  inputStyle: PropType<string | CSSProperties>;
  inputProps: PropType<InputProps>;
  max: PropType<number>;
  tagClass: StringConstructor;
  tagStyle: PropType<string | CSSProperties>;
  renderTag: PropType<((tag: string, index: number) => VNodeChild) | ((tag: DynamicTagsOption, index: number) => VNodeChild)>;
  onCreate: {
    type: PropType<OnCreate>;
    default: (label: string) => string;
  };
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  color: PropType<TagColor>;
  type: {
    readonly type: PropType<"default" | "primary" | "success" | "info" | "warning" | "error">;
    readonly default: "default";
  };
  round: BooleanConstructor;
  disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  theme: PropType<DynamicTagsTheme>;
  themeOverrides: PropType<DynamicTagsThemeOverrides>;
  builtinThemeOverrides: PropType<DynamicTagsThemeOverrides>;
};
type DynamicTagsProps = ExtractPublicPropTypes<typeof dynamicTagsProps>;
interface DynamicTagsSlots {
  input?: (props: DynamicTagsInputSlotProps) => VNode[];
  trigger?: (props: DynamicTagsTriggerSlotProps) => VNode[];
  default?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  size: PropType<DynamicTagsSize>;
  closable: {
    type: BooleanConstructor;
    default: boolean;
  };
  defaultValue: {
    type: PropType<Array<string | DynamicTagsOption>>;
    default: () => never[];
  };
  value: PropType<Array<string | DynamicTagsOption>>;
  inputClass: StringConstructor;
  inputStyle: PropType<string | CSSProperties>;
  inputProps: PropType<InputProps>;
  max: PropType<number>;
  tagClass: StringConstructor;
  tagStyle: PropType<string | CSSProperties>;
  renderTag: PropType<((tag: string, index: number) => VNodeChild) | ((tag: DynamicTagsOption, index: number) => VNodeChild)>;
  onCreate: {
    type: PropType<OnCreate>;
    default: (label: string) => string;
  };
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  color: PropType<TagColor>;
  type: {
    readonly type: PropType<"default" | "primary" | "success" | "info" | "warning" | "error">;
    readonly default: "default";
  };
  round: BooleanConstructor;
  disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  theme: PropType<DynamicTagsTheme>;
  themeOverrides: PropType<DynamicTagsThemeOverrides>;
  builtinThemeOverrides: PropType<DynamicTagsThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  inputInstRef: unknown;
  localizedAdd: import("vue").ComputedRef<string>;
  inputSize: import("vue").ComputedRef<"medium" | "small" | "tiny">;
  mergedSize: import("vue").ComputedRef<DynamicTagsSize>;
  inputValue: Ref<string, string>;
  showInput: Ref<boolean, boolean>;
  inputForceFocused: Ref<boolean, boolean>;
  mergedValue: import("vue").ComputedRef<(string | DynamicTagsOption)[] | (string | {
    label: string;
    value: string;
  })[]>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  triggerDisabled: import("vue").ComputedRef<boolean>;
  handleInputKeyDown: (e: KeyboardEvent) => void;
  handleAddClick: () => void;
  handleInputBlur: () => void;
  handleCloseClick: (index: number) => void;
  handleInputConfirm: (externalValue?: string) => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: DynamicTagsThemeVars;
    peers: {
      Input: InputTheme;
      Button: ButtonTheme;
      Tag: TagTheme;
      Space: SpaceTheme;
    };
    peerOverrides: {
      Input?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Tag?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Space?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  size: PropType<DynamicTagsSize>;
  closable: {
    type: BooleanConstructor;
    default: boolean;
  };
  defaultValue: {
    type: PropType<Array<string | DynamicTagsOption>>;
    default: () => never[];
  };
  value: PropType<Array<string | DynamicTagsOption>>;
  inputClass: StringConstructor;
  inputStyle: PropType<string | CSSProperties>;
  inputProps: PropType<InputProps>;
  max: PropType<number>;
  tagClass: StringConstructor;
  tagStyle: PropType<string | CSSProperties>;
  renderTag: PropType<((tag: string, index: number) => VNodeChild) | ((tag: DynamicTagsOption, index: number) => VNodeChild)>;
  onCreate: {
    type: PropType<OnCreate>;
    default: (label: string) => string;
  };
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  color: PropType<TagColor>;
  type: {
    readonly type: PropType<"default" | "primary" | "success" | "info" | "warning" | "error">;
    readonly default: "default";
  };
  round: BooleanConstructor;
  disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  theme: PropType<DynamicTagsTheme>;
  themeOverrides: PropType<DynamicTagsThemeOverrides>;
  builtinThemeOverrides: PropType<DynamicTagsThemeOverrides>;
}>> & Readonly<{}>, {
  type: "error" | "info" | "success" | "warning" | "default" | "primary";
  closable: boolean;
  defaultValue: (string | DynamicTagsOption)[];
  disabled: boolean | undefined;
  round: boolean;
  onCreate: OnCreate;
}, SlotsType<DynamicTagsSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { DynamicTagsProps, DynamicTagsSlots, _default as default, dynamicTagsProps };