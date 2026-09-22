import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { IntersectionObserverOptions } from "../../image/src/utils.js";
import { AvatarTheme, AvatarThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { ObjectFit, Size } from "./interface.js";
import { CSSProperties, ImgHTMLAttributes, PropType, Ref, SlotsType, VNode, VNodeChild } from "vue";
//#region src/avatar/src/Avatar.d.ts
declare const avatarProps: {
  readonly size: PropType<Size>;
  readonly src: StringConstructor;
  readonly circle: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly objectFit: PropType<ObjectFit>;
  readonly round: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly bordered: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly onError: PropType<(e: Event) => void>;
  readonly fallbackSrc: StringConstructor;
  readonly intersectionObserverOptions: PropType<IntersectionObserverOptions>;
  readonly lazy: BooleanConstructor;
  readonly onLoad: PropType<(e: Event) => void>;
  readonly renderPlaceholder: PropType<() => VNodeChild>;
  readonly renderFallback: PropType<() => VNodeChild>;
  readonly imgProps: PropType<ImgHTMLAttributes>;
  /** @deprecated */
  readonly color: StringConstructor;
  readonly theme: PropType<AvatarTheme>;
  readonly themeOverrides: PropType<AvatarThemeOverrides>;
  readonly builtinThemeOverrides: PropType<AvatarThemeOverrides>;
};
type AvatarProps = ExtractPublicPropTypes<typeof avatarProps>;
interface AvatarSlots {
  default?: () => VNode[];
  placeholder?: () => VNode[];
  fallback?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly size: PropType<Size>;
  readonly src: StringConstructor;
  readonly circle: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly objectFit: PropType<ObjectFit>;
  readonly round: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly bordered: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly onError: PropType<(e: Event) => void>;
  readonly fallbackSrc: StringConstructor;
  readonly intersectionObserverOptions: PropType<IntersectionObserverOptions>;
  readonly lazy: BooleanConstructor;
  readonly onLoad: PropType<(e: Event) => void>;
  readonly renderPlaceholder: PropType<() => VNodeChild>;
  readonly renderFallback: PropType<() => VNodeChild>;
  readonly imgProps: PropType<ImgHTMLAttributes>;
  /** @deprecated */
  readonly color: StringConstructor;
  readonly theme: PropType<AvatarTheme>;
  readonly themeOverrides: PropType<AvatarThemeOverrides>;
  readonly builtinThemeOverrides: PropType<AvatarThemeOverrides>;
}>, {
  textRef: Ref<HTMLElement | null, HTMLElement | null>;
  selfRef: Ref<HTMLElement | null, HTMLElement | null>;
  mergedRoundRef: import("vue").ComputedRef<boolean | undefined>;
  mergedClsPrefix: Ref<string, string>;
  fitTextTransform: () => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  hasLoadError: Ref<boolean, boolean>;
  shouldStartLoading: Ref<boolean, boolean>;
  loaded: Ref<boolean, boolean>;
  mergedOnError: (e: Event) => void;
  mergedOnLoad: (e: Event) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly size: PropType<Size>;
  readonly src: StringConstructor;
  readonly circle: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly objectFit: PropType<ObjectFit>;
  readonly round: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly bordered: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly onError: PropType<(e: Event) => void>;
  readonly fallbackSrc: StringConstructor;
  readonly intersectionObserverOptions: PropType<IntersectionObserverOptions>;
  readonly lazy: BooleanConstructor;
  readonly onLoad: PropType<(e: Event) => void>;
  readonly renderPlaceholder: PropType<() => VNodeChild>;
  readonly renderFallback: PropType<() => VNodeChild>;
  readonly imgProps: PropType<ImgHTMLAttributes>;
  /** @deprecated */
  readonly color: StringConstructor;
  readonly theme: PropType<AvatarTheme>;
  readonly themeOverrides: PropType<AvatarThemeOverrides>;
  readonly builtinThemeOverrides: PropType<AvatarThemeOverrides>;
}>> & Readonly<{}>, {
  readonly bordered: boolean;
  readonly circle: boolean;
  readonly round: boolean;
  readonly lazy: boolean;
}, SlotsType<AvatarSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { AvatarProps, AvatarSlots, avatarProps, _default as default };