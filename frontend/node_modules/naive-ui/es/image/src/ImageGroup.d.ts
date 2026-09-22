import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ImagePreviewInst, ImageRenderToolbar } from "./public-types.js";
import { ImageTheme, ImageThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { PropType, Ref } from "vue";
//#region src/image/src/ImageGroup.d.ts
declare const imageGroupInjectionKey: import("vue").InjectionKey<ImagePreviewInst & {
  groupId: string;
  mergedClsPrefixRef: Ref<string>;
  renderToolbarRef: Ref<ImageRenderToolbar | undefined>;
  registerImageUrl: (id: number, url: string) => () => void;
  toggleShow: (imageId: string) => void;
}>;
declare const imageGroupProps: {
  srcList: PropType<string[]>;
  current: NumberConstructor;
  defaultCurrent: {
    type: NumberConstructor;
    default: number;
  };
  show: {
    type: BooleanConstructor;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  onUpdateCurrent: PropType<MaybeArray<(current: number) => void>>;
  'onUpdate:current': PropType<MaybeArray<(current: number) => void>>;
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
type ImageGroupProps = ExtractPublicPropTypes<typeof imageGroupProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  srcList: PropType<string[]>;
  current: NumberConstructor;
  defaultCurrent: {
    type: NumberConstructor;
    default: number;
  };
  show: {
    type: BooleanConstructor;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  onUpdateCurrent: PropType<MaybeArray<(current: number) => void>>;
  'onUpdate:current': PropType<MaybeArray<(current: number) => void>>;
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
  mergedClsPrefix: Ref<string, string>;
  previewInstRef: unknown;
  mergedShow: import("vue").ComputedRef<boolean>;
  src: import("vue").ComputedRef<string | undefined>;
  onClose: () => void;
  next: () => void;
  prev: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  srcList: PropType<string[]>;
  current: NumberConstructor;
  defaultCurrent: {
    type: NumberConstructor;
    default: number;
  };
  show: {
    type: BooleanConstructor;
    default: undefined;
  };
  defaultShow: BooleanConstructor;
  onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  onUpdateCurrent: PropType<MaybeArray<(current: number) => void>>;
  'onUpdate:current': PropType<MaybeArray<(current: number) => void>>;
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
  defaultCurrent: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ImageGroupProps, _default as default, imageGroupInjectionKey, imageGroupProps };