import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { TagSize } from "./public-types.js";
import { TagColor } from "./common-props.js";
import { TagTheme, TagThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/tag/src/Tag.d.ts
interface TagPublicMethods {
  setTextContent: (textContent: string) => void;
}
interface TagRef extends TagPublicMethods {
  $el: HTMLElement;
}
declare const tagProps: {
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  checked: BooleanConstructor;
  checkable: BooleanConstructor;
  strong: BooleanConstructor;
  triggerClickOnClose: BooleanConstructor;
  onClose: PropType<MaybeArray<(e: MouseEvent) => void>>;
  onMouseenter: PropType<(e: MouseEvent) => void>;
  onMouseleave: PropType<(e: MouseEvent) => void>;
  'onUpdate:checked': PropType<(checked: boolean) => void>;
  onUpdateChecked: PropType<(checked: boolean) => void>;
  internalCloseFocusable: {
    type: BooleanConstructor;
    default: boolean;
  };
  internalCloseIsButtonTag: {
    type: BooleanConstructor;
    default: boolean;
  };
  onCheckedChange: PropType<(checked: boolean) => void>;
  color: PropType<TagColor>;
  type: {
    readonly type: PropType<"default" | "primary" | "success" | "info" | "warning" | "error">;
    readonly default: "default";
  };
  round: BooleanConstructor;
  size: PropType<TagSize>;
  closable: BooleanConstructor;
  disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  theme: PropType<TagTheme>;
  themeOverrides: PropType<TagThemeOverrides>;
  builtinThemeOverrides: PropType<TagThemeOverrides>;
};
interface TagInjection {
  roundRef: Ref<boolean>;
}
declare const tagInjectionKey: import("vue").InjectionKey<TagInjection>;
type TagProps = ExtractPublicPropTypes<typeof tagProps>;
interface TagSlots {
  default?: () => VNode[];
  avatar?: () => VNode[];
  icon?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  checked: BooleanConstructor;
  checkable: BooleanConstructor;
  strong: BooleanConstructor;
  triggerClickOnClose: BooleanConstructor;
  onClose: PropType<MaybeArray<(e: MouseEvent) => void>>;
  onMouseenter: PropType<(e: MouseEvent) => void>;
  onMouseleave: PropType<(e: MouseEvent) => void>;
  'onUpdate:checked': PropType<(checked: boolean) => void>;
  onUpdateChecked: PropType<(checked: boolean) => void>;
  internalCloseFocusable: {
    type: BooleanConstructor;
    default: boolean;
  };
  internalCloseIsButtonTag: {
    type: BooleanConstructor;
    default: boolean;
  };
  onCheckedChange: PropType<(checked: boolean) => void>;
  color: PropType<TagColor>;
  type: {
    readonly type: PropType<"default" | "primary" | "success" | "info" | "warning" | "error">;
    readonly default: "default";
  };
  round: BooleanConstructor;
  size: PropType<TagSize>;
  closable: BooleanConstructor;
  disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  theme: PropType<TagTheme>;
  themeOverrides: PropType<TagThemeOverrides>;
  builtinThemeOverrides: PropType<TagThemeOverrides>;
}>, {
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: Ref<string, string>;
  contentRef: Ref<HTMLElement | null, HTMLElement | null>;
  mergedBordered: import("vue").ComputedRef<boolean>;
  handleClick: () => void;
  handleCloseClick: (e: MouseEvent) => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  setTextContent: (textContent: string) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  checked: BooleanConstructor;
  checkable: BooleanConstructor;
  strong: BooleanConstructor;
  triggerClickOnClose: BooleanConstructor;
  onClose: PropType<MaybeArray<(e: MouseEvent) => void>>;
  onMouseenter: PropType<(e: MouseEvent) => void>;
  onMouseleave: PropType<(e: MouseEvent) => void>;
  'onUpdate:checked': PropType<(checked: boolean) => void>;
  onUpdateChecked: PropType<(checked: boolean) => void>;
  internalCloseFocusable: {
    type: BooleanConstructor;
    default: boolean;
  };
  internalCloseIsButtonTag: {
    type: BooleanConstructor;
    default: boolean;
  };
  onCheckedChange: PropType<(checked: boolean) => void>;
  color: PropType<TagColor>;
  type: {
    readonly type: PropType<"default" | "primary" | "success" | "info" | "warning" | "error">;
    readonly default: "default";
  };
  round: BooleanConstructor;
  size: PropType<TagSize>;
  closable: BooleanConstructor;
  disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  theme: PropType<TagTheme>;
  themeOverrides: PropType<TagThemeOverrides>;
  builtinThemeOverrides: PropType<TagThemeOverrides>;
}>> & Readonly<{}>, {
  strong: boolean;
  type: "error" | "info" | "success" | "warning" | "default" | "primary";
  bordered: boolean | undefined;
  closable: boolean;
  disabled: boolean | undefined;
  round: boolean;
  checked: boolean;
  checkable: boolean;
  triggerClickOnClose: boolean;
  internalCloseFocusable: boolean;
  internalCloseIsButtonTag: boolean;
}, SlotsType<TagSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TagProps, TagPublicMethods, TagRef, TagSlots, _default as default, tagInjectionKey, tagProps };