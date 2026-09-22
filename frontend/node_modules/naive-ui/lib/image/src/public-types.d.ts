import { VNode, VNodeChild } from "vue";
//#region src/image/src/public-types.d.ts
interface ImageRenderToolbarProps {
  nodes: {
    prev: VNode;
    next: VNode;
    rotateCounterclockwise: VNode;
    rotateClockwise: VNode;
    resizeToOriginalSize: VNode;
    zoomOut: VNode;
    zoomIn: VNode;
    download: VNode;
    close: VNode;
  };
}
type ImageRenderToolbar = (props: ImageRenderToolbarProps) => VNodeChild;
type ImageGroupRenderToolbarProps = ImageRenderToolbarProps;
type ImageGroupRenderToolbar = ImageRenderToolbar;
interface ImageInst {
  /** @deprecated Use `showPreview` instead */
  click: () => void;
  showPreview: () => void;
}
interface ImageSlots {
  placeholder?: ImagePlaceholderSlot;
  error?: ImageErrorSlot;
}
type ImagePlaceholderSlot = () => VNode[];
type ImageErrorSlot = () => VNode[];
interface ImagePreviewInst {
  setThumbnailEl: (e: HTMLImageElement | null) => void;
}
//#endregion
export { ImageErrorSlot, ImageGroupRenderToolbar, ImageGroupRenderToolbarProps, ImageInst, ImagePlaceholderSlot, ImagePreviewInst, ImageRenderToolbar, ImageRenderToolbarProps, ImageSlots };