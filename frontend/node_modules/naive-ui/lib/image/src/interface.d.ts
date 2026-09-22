import { ImageRenderToolbar } from "./public-types.js";
import { ImageTheme, ImageThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { ImgHTMLAttributes, PropType, Ref } from "vue";
//#region src/image/src/interface.d.ts
interface MoveStrategy {
  moveVerticalDirection: 'verticalTop' | 'verticalBottom';
  moveHorizontalDirection: 'horizontalLeft' | 'horizontalRight';
  deltaHorizontal: number;
  deltaVertical: number;
}
declare const imagePreviewSharedProps: {
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
interface ImageContext {
  previewedImgPropsRef: Ref<ImgHTMLAttributes | undefined>;
}
declare const imageContextKey: import("vue").InjectionKey<ImageContext>;
//#endregion
export { ImageContext, MoveStrategy, imageContextKey, imagePreviewSharedProps };