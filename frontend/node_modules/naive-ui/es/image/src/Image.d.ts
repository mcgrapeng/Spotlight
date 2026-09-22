import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { IntersectionObserverOptions } from "./utils.js";
import { ImageRenderToolbar, ImageSlots } from "./public-types.js";
import { ImageTheme, ImageThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { ImgHTMLAttributes, PropType, SlotsType } from "vue";
//#region src/image/src/Image.d.ts
declare const imageProps: {
  onPreviewPrev: PropType<() => void>;
  onPreviewNext: PropType<() => void>;
  showToolbar: {
    type: BooleanConstructor;
    default: boolean;
  };
  showToolbarTooltip: BooleanConstructor;
  keepDragOffset: BooleanConstructor;
  renderToolbar: PropType<ImageRenderToolbar>;
  theme: PropType<ImageTheme>;
  themeOverrides: PropType<ImageThemeOverrides>;
  builtinThemeOverrides: PropType<ImageThemeOverrides>;
  alt: StringConstructor;
  height: PropType<string | number>;
  imgProps: PropType<ImgHTMLAttributes>;
  previewedImgProps: PropType<ImgHTMLAttributes>;
  lazy: BooleanConstructor;
  intersectionObserverOptions: PropType<IntersectionObserverOptions>;
  objectFit: {
    type: PropType<"fill" | "contain" | "cover" | "none" | "scale-down">;
    default: string;
  };
  previewSrc: StringConstructor;
  fallbackSrc: StringConstructor;
  width: PropType<string | number>;
  src: StringConstructor;
  previewDisabled: BooleanConstructor;
  loadDescription: StringConstructor;
  onError: PropType<(e: Event) => void>;
  onLoad: PropType<(e: Event) => void>;
};
type ImageProps = ExtractPublicPropTypes<typeof imageProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  onPreviewPrev: PropType<() => void>;
  onPreviewNext: PropType<() => void>;
  showToolbar: {
    type: BooleanConstructor;
    default: boolean;
  };
  showToolbarTooltip: BooleanConstructor;
  keepDragOffset: BooleanConstructor;
  renderToolbar: PropType<ImageRenderToolbar>;
  theme: PropType<ImageTheme>;
  themeOverrides: PropType<ImageThemeOverrides>;
  builtinThemeOverrides: PropType<ImageThemeOverrides>;
  alt: StringConstructor;
  height: PropType<string | number>;
  imgProps: PropType<ImgHTMLAttributes>;
  previewedImgProps: PropType<ImgHTMLAttributes>;
  lazy: BooleanConstructor;
  intersectionObserverOptions: PropType<IntersectionObserverOptions>;
  objectFit: {
    type: PropType<"fill" | "contain" | "cover" | "none" | "scale-down">;
    default: string;
  };
  previewSrc: StringConstructor;
  fallbackSrc: StringConstructor;
  width: PropType<string | number>;
  src: StringConstructor;
  previewDisabled: BooleanConstructor;
  loadDescription: StringConstructor;
  onError: PropType<(e: Event) => void>;
  onLoad: PropType<(e: Event) => void>;
}>, {
  click: () => void;
  showPreview: () => void;
  mergedClsPrefix: import("vue").Ref<string, string>;
  groupId: string | undefined;
  previewInstRef: unknown;
  imageRef: import("vue").Ref<HTMLImageElement | null, HTMLImageElement | null>;
  mergedPreviewSrc: import("vue").ComputedRef<string | undefined>;
  showError: import("vue").Ref<boolean, boolean>;
  shouldStartLoading: import("vue").Ref<boolean, boolean>;
  loaded: import("vue").Ref<boolean, boolean>;
  mergedOnClick: (e: PointerEvent) => void;
  onPreviewClose: () => void;
  mergedOnError: (e: Event) => void;
  mergedOnLoad: (e: Event) => void;
  previewShow: import("vue").Ref<boolean, boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  onPreviewPrev: PropType<() => void>;
  onPreviewNext: PropType<() => void>;
  showToolbar: {
    type: BooleanConstructor;
    default: boolean;
  };
  showToolbarTooltip: BooleanConstructor;
  keepDragOffset: BooleanConstructor;
  renderToolbar: PropType<ImageRenderToolbar>;
  theme: PropType<ImageTheme>;
  themeOverrides: PropType<ImageThemeOverrides>;
  builtinThemeOverrides: PropType<ImageThemeOverrides>;
  alt: StringConstructor;
  height: PropType<string | number>;
  imgProps: PropType<ImgHTMLAttributes>;
  previewedImgProps: PropType<ImgHTMLAttributes>;
  lazy: BooleanConstructor;
  intersectionObserverOptions: PropType<IntersectionObserverOptions>;
  objectFit: {
    type: PropType<"fill" | "contain" | "cover" | "none" | "scale-down">;
    default: string;
  };
  previewSrc: StringConstructor;
  fallbackSrc: StringConstructor;
  width: PropType<string | number>;
  src: StringConstructor;
  previewDisabled: BooleanConstructor;
  loadDescription: StringConstructor;
  onError: PropType<(e: Event) => void>;
  onLoad: PropType<(e: Event) => void>;
}>> & Readonly<{}>, {
  objectFit: "fill" | "none" | "contain" | "cover" | "scale-down";
  lazy: boolean;
  showToolbar: boolean;
  showToolbarTooltip: boolean;
  keepDragOffset: boolean;
  previewDisabled: boolean;
}, SlotsType<ImageSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ImageProps, _default as default, imageProps };