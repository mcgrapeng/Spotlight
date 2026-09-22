import { resolveSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { isImageSupportNativeLazy } from "../../_utils/env/is-native-lazy-load.mjs";
import { observeIntersection } from "./utils.mjs";
import { imageContextKey, imagePreviewSharedProps } from "./interface.mjs";
import ImagePreview_default from "./ImagePreview.mjs";
import { imageGroupInjectionKey } from "./ImageGroup.mjs";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, h, inject, mergeProps, onBeforeUnmount, onMounted, openBlock, provide, ref, toRef, watchEffect } from "vue";
//#region src/image/src/Image.tsx
const imageProps = {
  alt: String,
  height: [String, Number],
  imgProps: Object,
  previewedImgProps: Object,
  lazy: Boolean,
  intersectionObserverOptions: Object,
  objectFit: {
    type: String,
    default: "fill"
  },
  previewSrc: String,
  fallbackSrc: String,
  width: [String, Number],
  src: String,
  previewDisabled: Boolean,
  loadDescription: String,
  onError: Function,
  onLoad: Function,
  ...imagePreviewSharedProps
};
let uuid = 0;
var Image_default = defineComponent({
  name: "Image",
  props: imageProps,
  slots: Object,
  inheritAttrs: false,
  setup(props) {
    const imageRef = ref(null);
    const showErrorRef = ref(false);
    const previewInstRef = ref(null);
    const imageGroupHandle = inject(imageGroupInjectionKey, null);
    const {
      mergedClsPrefixRef
    } = imageGroupHandle || useConfig(props);
    const mergedPreviewSrcRef = computed(() => {
      return props.previewSrc || props.src;
    });
    const previewShowRef = ref(false);
    const imageId = uuid++;
    const showPreview = () => {
      if (props.previewDisabled || showErrorRef.value) return;
      if (imageGroupHandle) {
        imageGroupHandle.setThumbnailEl(imageRef.value);
        imageGroupHandle.toggleShow(`r${imageId}`);
        return;
      }
      const {
        value: previewInst
      } = previewInstRef;
      if (!previewInst) return;
      previewInst.setThumbnailEl(imageRef.value);
      previewShowRef.value = true;
    };
    const exposedMethods = {
      click: () => {
        showPreview();
      },
      showPreview
    };
    const shouldStartLoadingRef = ref(!props.lazy);
    onMounted(() => {
      imageRef.value?.setAttribute("data-group-id", imageGroupHandle?.groupId || "");
    });
    onMounted(() => {
      if (props.lazy && props.intersectionObserverOptions) {
        let unobserve;
        const stopWatchHandle = watchEffect(() => {
          unobserve?.();
          unobserve = void 0;
          unobserve = observeIntersection(imageRef.value, props.intersectionObserverOptions, shouldStartLoadingRef);
        });
        onBeforeUnmount(() => {
          stopWatchHandle();
          unobserve?.();
        });
      }
    });
    watchEffect(() => {
      props.src || props.imgProps?.src;
      showErrorRef.value = false;
    });
    watchEffect(onInvalidate => {
      const unregister = imageGroupHandle?.registerImageUrl?.(imageId, mergedPreviewSrcRef.value || "");
      onInvalidate(() => {
        unregister?.();
      });
    });
    function onImgClick(e) {
      exposedMethods.showPreview();
      props.imgProps?.onClick?.(e);
    }
    function onPreviewClose() {
      previewShowRef.value = false;
    }
    const loadedRef = ref(false);
    provide(imageContextKey, {
      previewedImgPropsRef: toRef(props, "previewedImgProps")
    });
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      groupId: imageGroupHandle?.groupId,
      previewInstRef,
      imageRef,
      mergedPreviewSrc: mergedPreviewSrcRef,
      showError: showErrorRef,
      shouldStartLoading: shouldStartLoadingRef,
      loaded: loadedRef,
      mergedOnClick: e => {
        onImgClick(e);
      },
      onPreviewClose,
      mergedOnError: e => {
        if (props.intersectionObserverOptions && !shouldStartLoadingRef.value) return;
        showErrorRef.value = true;
        loadedRef.value = true;
        const {
          onError,
          imgProps: {
            onError: imgPropsOnError
          } = {}
        } = props;
        onError?.(e);
        imgPropsOnError?.(e);
      },
      mergedOnLoad: e => {
        const {
          onLoad,
          imgProps: {
            onLoad: imgPropsOnLoad
          } = {}
        } = props;
        onLoad?.(e);
        imgPropsOnLoad?.(e);
        loadedRef.value = true;
      },
      previewShow: previewShowRef,
      ...exposedMethods
    };
  },
  render() {
    const {
      mergedClsPrefix,
      imgProps = {},
      loaded,
      $attrs,
      lazy
    } = this;
    const errorNode = resolveSlot(this.$slots.error, () => []);
    const placeholderNode = this.$slots.placeholder?.();
    const loadSrc = this.src || imgProps.src;
    const imgNode = this.showError && errorNode.length ? errorNode : h("img", {
      ...imgProps,
      ref: "imageRef",
      width: this.width || imgProps.width,
      height: this.height || imgProps.height,
      src: this.showError ? this.fallbackSrc : lazy && this.intersectionObserverOptions ? this.shouldStartLoading ? loadSrc : void 0 : loadSrc,
      alt: this.alt || imgProps.alt,
      "aria-label": this.alt || imgProps.alt,
      onClick: this.mergedOnClick,
      onError: this.mergedOnError,
      onLoad: this.mergedOnLoad,
      loading: isImageSupportNativeLazy && lazy && !this.intersectionObserverOptions ? "lazy" : "eager",
      style: [imgProps.style || "", placeholderNode && !loaded ? {
        height: "0",
        width: "0",
        visibility: "hidden"
      } : "", {
        objectFit: this.objectFit
      }],
      "data-error": this.showError,
      "data-preview-src": this.previewSrc || this.src
    });
    return openBlock(), createElementBlock("div", mergeProps($attrs, {
      role: "none",
      class: [$attrs.class, `${mergedClsPrefix}-image`, (this.previewDisabled || this.showError) && `${mergedClsPrefix}-image--preview-disabled`]
    }), [this.groupId ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => imgNode)], 64)) : (openBlock(), createBlock(ImagePreview_default, {
      key: 1,
      theme: this.theme,
      themeOverrides: this.themeOverrides,
      ref: "previewInstRef",
      showToolbar: this.showToolbar,
      showToolbarTooltip: this.showToolbarTooltip,
      renderToolbar: this.renderToolbar,
      keepDragOffset: this.keepDragOffset,
      src: this.mergedPreviewSrc,
      show: !this.previewDisabled && this.previewShow,
      onClose: this.onPreviewClose
    }, {
      default: () => imgNode
    }, 1032, ["theme", "themeOverrides", "showToolbar", "showToolbarTooltip", "renderToolbar", "keepDragOffset", "src", "show", "onClose"])), normalizeVNode(() => !loaded && placeholderNode)], 16);
  }
});
//#endregion
export { Image_default as default, imageProps };