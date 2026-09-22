import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ImageRenderToolbar } from "./public-types.js";
import { ImageTheme, ImageThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref, VNode } from "vue";
//#region src/image/src/ImagePreview.d.ts
declare const imagePreviewProps: {
  src: StringConstructor;
  show: {
    type: BooleanConstructor;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  onNext: PropType<() => void>;
  onPrev: PropType<() => void>;
  onClose: PropType<MaybeArray<() => void>>;
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
};
type ImagePreviewProps = ExtractPublicPropTypes<typeof imagePreviewProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  src: StringConstructor;
  show: {
    type: BooleanConstructor;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  onNext: PropType<() => void>;
  onPrev: PropType<() => void>;
  onClose: PropType<MaybeArray<() => void>>;
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
}>, {
  setThumbnailEl: (e: HTMLImageElement | null) => void;
  clsPrefix: Ref<string, string>;
  previewRef: Ref<HTMLImageElement | null, HTMLImageElement | null>;
  previewWrapperRef: Ref<HTMLDivElement | null, HTMLDivElement | null>;
  previewSrc: Ref<string | undefined, string | undefined>;
  mergedShow: import("vue").ComputedRef<boolean>;
  appear: Readonly<Ref<boolean, boolean>>;
  displayed: Ref<boolean, boolean>;
  previewedImgProps: Ref<import("vue").ImgHTMLAttributes | undefined, import("vue").ImgHTMLAttributes | undefined> | undefined;
  handleWheel: (event: WheelEvent) => void;
  handlePreviewMousedown: (e: MouseEvent) => void;
  handlePreviewDblclick: (e: MouseEvent) => void;
  syncTransformOrigin: () => void;
  handleAfterLeave: () => void;
  handleDragStart: (e: DragEvent) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  handleDownloadClick: () => void;
  rotateCounterclockwise: () => void;
  rotateClockwise: () => void;
  handleSwitchPrev: () => void;
  handleSwitchNext: () => void;
  withTooltip: (node: VNode, tooltipKey: "tipPrevious" | "tipNext" | "tipCounterclockwise" | "tipClockwise" | "tipZoomOut" | "tipZoomIn" | "tipDownload" | "tipClose" | "tipOriginalSize") => VNode;
  resizeToOrignalImageSize: () => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  doUpdateShow: (value: boolean) => void;
  close: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  src: StringConstructor;
  show: {
    type: BooleanConstructor;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  onNext: PropType<() => void>;
  onPrev: PropType<() => void>;
  onClose: PropType<MaybeArray<() => void>>;
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
}>> & Readonly<{}>, {
  show: boolean;
  defaultShow: boolean;
  showToolbar: boolean;
  showToolbarTooltip: boolean;
  keepDragOffset: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ImagePreviewProps, _default as default, imagePreviewProps };