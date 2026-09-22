import { download } from "../../_utils/dom/download.mjs";
import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Download_default from "../../_internal/icons/Download.mjs";
import ResizeSmall_default from "../../_internal/icons/ResizeSmall.mjs";
import RotateClockwise_default from "../../_internal/icons/RotateClockwise.mjs";
import RotateCounterclockwise_default from "../../_internal/icons/RotateCounterclockwise.mjs";
import ZoomIn_default from "../../_internal/icons/ZoomIn.mjs";
import ZoomOut_default from "../../_internal/icons/ZoomOut.mjs";
import Tooltip_default from "../../tooltip/src/Tooltip.mjs";
import { imageLight } from "../styles/light.mjs";
import { renderCloseIcon, renderNextIcon, renderPrevIcon } from "./icons.mjs";
import { imageContextKey, imagePreviewSharedProps } from "./interface.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { beforeNextFrameOnce } from "seemly";
import { Fragment, Transition, computed, createBlock, createElementBlock, defineComponent, inject, mergeProps, normalizeStyle, onBeforeUnmount, openBlock, ref, toRef, toRefs, vShow, watch, withDirectives } from "vue";
import { off, on } from "evtd";
import { useIsMounted, useMergedState } from "vooks";
import { LazyTeleport } from "vueuc";
import { kebabCase } from "lodash-es";
import { zindexable } from "vdirs";
//#region src/image/src/ImagePreview.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["onMousedown", "onDblclick", "src", "onDragstart"];
const _hoisted_3 = ["onWheel"];
const BLEEDING = 32;
const imagePreviewProps = {
  ...imagePreviewSharedProps,
  src: String,
  show: {
    type: Boolean,
    default: void 0
  },
  defaultShow: Boolean,
  "onUpdate:show": [Function, Array],
  onUpdateShow: [Function, Array],
  onNext: Function,
  onPrev: Function,
  onClose: [Function, Array]
};
var ImagePreview_default = defineComponent({
  name: "ImagePreview",
  props: imagePreviewProps,
  setup(props) {
    const {
      src
    } = toRefs(props);
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const themeRef = useTheme("Image", "-image", index_cssr_default, imageLight, props, mergedClsPrefixRef);
    let thumbnailEl = null;
    const previewRef = ref(null);
    const previewWrapperRef = ref(null);
    const displayedRef = ref(false);
    const {
      localeRef
    } = useLocale("Image");
    const uncontrolledShowRef = ref(props.defaultShow);
    const controlledShowRef = toRef(props, "show");
    const mergedShowRef = useMergedState(controlledShowRef, uncontrolledShowRef);
    function syncTransformOrigin() {
      const {
        value: previewWrapper
      } = previewWrapperRef;
      if (!thumbnailEl || !previewWrapper) return;
      const {
        style
      } = previewWrapper;
      const tbox = thumbnailEl.getBoundingClientRect();
      style.transformOrigin = `${tbox.left + tbox.width / 2}px ${tbox.top + tbox.height / 2}px`;
    }
    function handleKeydown(e) {
      switch (e.key) {
        case " ":
          e.preventDefault();
          break;
        case "ArrowLeft":
          props.onPrev?.();
          break;
        case "ArrowRight":
          props.onNext?.();
          break;
        case "ArrowUp":
          e.preventDefault();
          zoomIn();
          break;
        case "ArrowDown":
          e.preventDefault();
          zoomOut();
          break;
        case "Escape":
          close();
      }
    }
    function doUpdateShow(value) {
      const {
        onUpdateShow,
        "onUpdate:show": _onUpdateShow
      } = props;
      if (onUpdateShow) call(onUpdateShow, value);
      if (_onUpdateShow) call(_onUpdateShow, value);
      uncontrolledShowRef.value = value;
      displayedRef.value = true;
    }
    watch(mergedShowRef, value => {
      if (value) on("keydown", document, handleKeydown);else off("keydown", document, handleKeydown);
    });
    onBeforeUnmount(() => {
      off("keydown", document, handleKeydown);
    });
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let startOffsetX = 0;
    let startOffsetY = 0;
    let mouseDownClientX = 0;
    let mouseDownClientY = 0;
    let dragging = false;
    function handleMouseMove(e) {
      const {
        clientX,
        clientY
      } = e;
      offsetX = clientX - startX;
      offsetY = clientY - startY;
      beforeNextFrameOnce(derivePreviewStyle);
    }
    function getMoveStrategy(opts) {
      const {
        mouseUpClientX,
        mouseUpClientY,
        mouseDownClientX,
        mouseDownClientY
      } = opts;
      const deltaHorizontal = mouseDownClientX - mouseUpClientX;
      const deltaVertical = mouseDownClientY - mouseUpClientY;
      return {
        moveVerticalDirection: `vertical${deltaVertical > 0 ? "Top" : "Bottom"}`,
        moveHorizontalDirection: `horizontal${deltaHorizontal > 0 ? "Left" : "Right"}`,
        deltaHorizontal,
        deltaVertical
      };
    }
    function getDerivedOffset(moveStrategy) {
      const {
        value: preview
      } = previewRef;
      if (!preview) return {
        offsetX: 0,
        offsetY: 0
      };
      const pbox = preview.getBoundingClientRect();
      const {
        moveVerticalDirection,
        moveHorizontalDirection,
        deltaHorizontal,
        deltaVertical
      } = moveStrategy || {};
      let nextOffsetX = 0;
      let nextOffsetY = 0;
      if (pbox.width <= window.innerWidth) nextOffsetX = 0;else if (pbox.left > 0) nextOffsetX = (pbox.width - window.innerWidth) / 2;else if (pbox.right < window.innerWidth) nextOffsetX = -(pbox.width - window.innerWidth) / 2;else if (moveHorizontalDirection === "horizontalRight") nextOffsetX = Math.min((pbox.width - window.innerWidth) / 2, startOffsetX - (deltaHorizontal ?? 0));else nextOffsetX = Math.max(-((pbox.width - window.innerWidth) / 2), startOffsetX - (deltaHorizontal ?? 0));
      if (pbox.height <= window.innerHeight) nextOffsetY = 0;else if (pbox.top > 0) nextOffsetY = (pbox.height - window.innerHeight) / 2;else if (pbox.bottom < window.innerHeight) nextOffsetY = -(pbox.height - window.innerHeight) / 2;else if (moveVerticalDirection === "verticalBottom") nextOffsetY = Math.min((pbox.height - window.innerHeight) / 2, startOffsetY - (deltaVertical ?? 0));else nextOffsetY = Math.max(-((pbox.height - window.innerHeight) / 2), startOffsetY - (deltaVertical ?? 0));
      return {
        offsetX: nextOffsetX,
        offsetY: nextOffsetY
      };
    }
    function handleMouseUp(e) {
      off("mousemove", document, handleMouseMove);
      off("mouseup", document, handleMouseUp);
      dragging = false;
      if (!props.keepDragOffset) {
        const {
          clientX: mouseUpClientX,
          clientY: mouseUpClientY
        } = e;
        const offset = getDerivedOffset(getMoveStrategy({
          mouseUpClientX,
          mouseUpClientY,
          mouseDownClientX,
          mouseDownClientY
        }));
        offsetX = offset.offsetX;
        offsetY = offset.offsetY;
      }
      derivePreviewStyle();
    }
    const imageContext = inject(imageContextKey, null);
    function handlePreviewMousedown(e) {
      imageContext?.previewedImgPropsRef.value?.onMousedown?.(e);
      if (e.button !== 0) return;
      const {
        clientX,
        clientY
      } = e;
      dragging = true;
      startX = clientX - offsetX;
      startY = clientY - offsetY;
      startOffsetX = offsetX;
      startOffsetY = offsetY;
      mouseDownClientX = clientX;
      mouseDownClientY = clientY;
      derivePreviewStyle();
      on("mousemove", document, handleMouseMove);
      on("mouseup", document, handleMouseUp);
    }
    const scaleRadix = 1.5;
    let scaleExp = 0;
    let scale = 1;
    let rotate = 0;
    function handlePreviewDblclick(e) {
      imageContext?.previewedImgPropsRef.value?.onDblclick?.(e);
      const originalImageSizeScale = getOrignalImageSizeScale();
      scale = scale === originalImageSizeScale ? 1 : originalImageSizeScale;
      derivePreviewStyle();
    }
    function resetScale() {
      scale = 1;
      scaleExp = 0;
    }
    function resetOffset() {
      offsetX = 0;
      offsetY = 0;
    }
    function handleSwitchPrev() {
      resetScale();
      resetOffset();
      rotate = 0;
      props.onPrev?.();
    }
    function handleSwitchNext() {
      resetScale();
      resetOffset();
      rotate = 0;
      props.onNext?.();
    }
    function rotateCounterclockwise() {
      rotate -= 90;
      derivePreviewStyle();
    }
    function rotateClockwise() {
      rotate += 90;
      derivePreviewStyle();
    }
    function getMaxScale() {
      const {
        value: preview
      } = previewRef;
      if (!preview) return 1;
      const {
        innerWidth,
        innerHeight
      } = window;
      const heightMaxScale = Math.max(1, preview.naturalHeight / (innerHeight - BLEEDING));
      const widthMaxScale = Math.max(1, preview.naturalWidth / (innerWidth - BLEEDING));
      return Math.max(3, heightMaxScale * 2, widthMaxScale * 2);
    }
    function getOrignalImageSizeScale() {
      const {
        value: preview
      } = previewRef;
      if (!preview) return 1;
      const {
        innerWidth,
        innerHeight
      } = window;
      const heightScale = preview.naturalHeight / (innerHeight - BLEEDING);
      const widthScale = preview.naturalWidth / (innerWidth - BLEEDING);
      if (heightScale < 1 && widthScale < 1) return 1;
      return Math.max(heightScale, widthScale);
    }
    function zoomIn() {
      const maxScale = getMaxScale();
      if (scale < maxScale) {
        scaleExp += 1;
        scale = Math.min(maxScale, scaleRadix ** scaleExp);
        derivePreviewStyle();
      }
    }
    function zoomOut() {
      if (scale > .5) {
        const originalScale = scale;
        scaleExp -= 1;
        scale = Math.max(.5, scaleRadix ** scaleExp);
        const diff = originalScale - scale;
        derivePreviewStyle(false);
        const offset = getDerivedOffset();
        scale += diff;
        derivePreviewStyle(false);
        scale -= diff;
        offsetX = offset.offsetX;
        offsetY = offset.offsetY;
        derivePreviewStyle();
      }
    }
    function handleDownloadClick() {
      const imgSrc = src.value;
      if (imgSrc) download(imgSrc, void 0);
    }
    function derivePreviewStyle(transition = true) {
      const {
        value: preview
      } = previewRef;
      if (!preview) return;
      const {
        style
      } = preview;
      const controlledStyle = normalizeStyle(imageContext?.previewedImgPropsRef.value?.style);
      let controlledStyleString = "";
      if (typeof controlledStyle === "string") controlledStyleString = `${controlledStyle};`;else for (const key in controlledStyle) controlledStyleString += `${kebabCase(key)}: ${controlledStyle[key]};`;
      const transformStyle = `transform-origin: center; transform: translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotate}deg) scale(${scale});`;
      if (dragging) style.cssText = `${controlledStyleString}cursor: grabbing; transition: none;${transformStyle}`;else style.cssText = `${controlledStyleString}cursor: grab;${transformStyle}${transition ? "" : "transition: none;"}`;
      if (!transition) preview.offsetHeight;
    }
    function close() {
      if (mergedShowRef.value) {
        const {
          onClose
        } = props;
        if (onClose) call(onClose);
        doUpdateShow(false);
        uncontrolledShowRef.value = false;
      }
    }
    function resizeToOrignalImageSize() {
      scale = getOrignalImageSizeScale();
      scaleExp = Math.ceil(Math.log(scale) / Math.log(scaleRadix));
      offsetX = 0;
      offsetY = 0;
      derivePreviewStyle();
    }
    const exposedMethods = {
      setThumbnailEl: el => {
        thumbnailEl = el;
      }
    };
    function withTooltip(node, tooltipKey) {
      if (props.showToolbarTooltip) {
        const {
          value: theme
        } = themeRef;
        return openBlock(), createBlock(Tooltip_default, {
          key: 1,
          to: false,
          theme: theme.peers.Tooltip,
          themeOverrides: theme.peerOverrides.Tooltip,
          keepAliveOnHover: false
        }, {
          default: () => {
            return localeRef.value[tooltipKey];
          },
          trigger: () => node
        }, 1032, ["theme", "themeOverrides"]);
      } else return node;
    }
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          toolbarIconColor,
          toolbarBorderRadius,
          toolbarBoxShadow,
          toolbarColor
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-toolbar-icon-color": toolbarIconColor,
        "--n-toolbar-color": toolbarColor,
        "--n-toolbar-border-radius": toolbarBorderRadius,
        "--n-toolbar-box-shadow": toolbarBoxShadow
      };
    });
    const {
      inlineThemeDisabled
    } = useConfig();
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("image-preview", void 0, cssVarsRef, props) : void 0;
    function handleWheel(event) {
      event.preventDefault();
    }
    return {
      clsPrefix: mergedClsPrefixRef,
      previewRef,
      previewWrapperRef,
      previewSrc: src,
      mergedShow: mergedShowRef,
      appear: useIsMounted(),
      displayed: displayedRef,
      previewedImgProps: imageContext?.previewedImgPropsRef,
      handleWheel,
      handlePreviewMousedown,
      handlePreviewDblclick,
      syncTransformOrigin,
      handleAfterLeave: () => {
        resetScale();
        resetOffset();
        rotate = 0;
        displayedRef.value = false;
      },
      handleDragStart: e => {
        imageContext?.previewedImgPropsRef.value?.onDragstart?.(e);
        e.preventDefault();
      },
      zoomIn,
      zoomOut,
      handleDownloadClick,
      rotateCounterclockwise,
      rotateClockwise,
      handleSwitchPrev,
      handleSwitchNext,
      withTooltip,
      resizeToOrignalImageSize,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      doUpdateShow,
      close,
      ...exposedMethods
    };
  },
  render() {
    const {
      clsPrefix,
      renderToolbar,
      withTooltip
    } = this;
    const prevNode = withTooltip((openBlock(), createBlock(Icon_default, {
      clsPrefix,
      onClick: this.handleSwitchPrev
    }, {
      default: renderPrevIcon
    }, 1032, ["clsPrefix", "onClick"])), "tipPrevious");
    const nextNode = withTooltip((openBlock(), createBlock(Icon_default, {
      clsPrefix,
      onClick: this.handleSwitchNext
    }, {
      default: renderNextIcon
    }, 1032, ["clsPrefix", "onClick"])), "tipNext");
    const rotateCounterclockwiseNode = withTooltip((openBlock(), createBlock(Icon_default, {
      clsPrefix,
      onClick: this.rotateCounterclockwise
    }, {
      default: () => (openBlock(), createBlock(RotateCounterclockwise_default))
    }, 1032, ["clsPrefix", "onClick"])), "tipCounterclockwise");
    const rotateClockwiseNode = withTooltip((openBlock(), createBlock(Icon_default, {
      clsPrefix,
      onClick: this.rotateClockwise
    }, {
      default: () => (openBlock(), createBlock(RotateClockwise_default))
    }, 1032, ["clsPrefix", "onClick"])), "tipClockwise");
    const originalSizeNode = withTooltip((openBlock(), createBlock(Icon_default, {
      clsPrefix,
      onClick: this.resizeToOrignalImageSize
    }, {
      default: () => {
        return openBlock(), createBlock(ResizeSmall_default);
      }
    }, 1032, ["clsPrefix", "onClick"])), "tipOriginalSize");
    const zoomOutNode = withTooltip((openBlock(), createBlock(Icon_default, {
      clsPrefix,
      onClick: this.zoomOut
    }, {
      default: () => (openBlock(), createBlock(ZoomOut_default))
    }, 1032, ["clsPrefix", "onClick"])), "tipZoomOut");
    const downloadNode = withTooltip((openBlock(), createBlock(Icon_default, {
      clsPrefix,
      onClick: this.handleDownloadClick
    }, {
      default: () => (openBlock(), createBlock(Download_default))
    }, 1032, ["clsPrefix", "onClick"])), "tipDownload");
    const closeNode = withTooltip((openBlock(), createBlock(Icon_default, {
      clsPrefix,
      onClick: () => this.close()
    }, {
      default: renderCloseIcon
    }, 1032, ["clsPrefix", "onClick"])), "tipClose");
    const zoomInNode = withTooltip((openBlock(), createBlock(Icon_default, {
      clsPrefix,
      onClick: this.zoomIn
    }, {
      default: () => (openBlock(), createBlock(ZoomIn_default))
    }, 1032, ["clsPrefix", "onClick"])), "tipZoomIn");
    return openBlock(), createElementBlock(Fragment, null, [normalizeVNode(() => this.$slots.default?.()), (openBlock(), createBlock(LazyTeleport, {
      show: this.mergedShow
    }, {
      default: () => {
        if (!(this.mergedShow || this.displayed)) return null;
        this.onRender?.();
        return withDirectives((openBlock(), createElementBlock("div", {
          ref: "containerRef",
          class: normalizeClass$1([`${clsPrefix}-image-preview-container`, this.themeClass]),
          style: normalizeStyle(this.cssVars),
          onWheel: this.handleWheel
        }, [(openBlock(), createBlock(Transition, {
          name: "fade-in-transition",
          appear: this.appear
        }, {
          default: () => this.mergedShow ? (openBlock(), createElementBlock("div", {
            key: 2,
            class: normalizeClass$1(`${clsPrefix}-image-preview-overlay`),
            onClick: () => this.close()
          }, null, 10, _hoisted_1)) : null
        }, 1032, ["appear"])), this.showToolbar ? (openBlock(), createBlock(Transition, {
          key: 0,
          name: "fade-in-transition",
          appear: this.appear
        }, {
          default: () => {
            if (!this.mergedShow) return null;
            return openBlock(), createElementBlock("div", {
              class: normalizeClass$1(`${clsPrefix}-image-preview-toolbar`)
            }, [renderToolbar ? (openBlock(), createElementBlock(Fragment, {
              key: 0
            }, [normalizeVNode(() => renderToolbar({
              nodes: {
                prev: prevNode,
                next: nextNode,
                rotateCounterclockwise: rotateCounterclockwiseNode,
                rotateClockwise: rotateClockwiseNode,
                resizeToOriginalSize: originalSizeNode,
                zoomOut: zoomOutNode,
                zoomIn: zoomInNode,
                download: downloadNode,
                close: closeNode
              }
            }))], 64)) : (openBlock(), createElementBlock(Fragment, {
              key: 1
            }, [this.onPrev ? (openBlock(), createElementBlock(Fragment, {
              key: 0
            }, [normalizeVNode(() => prevNode), normalizeVNode(() => nextNode)], 64)) : normalizeVNode(() => null), normalizeVNode(() => rotateCounterclockwiseNode), normalizeVNode(() => rotateClockwiseNode), normalizeVNode(() => originalSizeNode), normalizeVNode(() => zoomOutNode), normalizeVNode(() => zoomInNode), normalizeVNode(() => downloadNode), normalizeVNode(() => closeNode)], 64))], 2);
          }
        }, 1032, ["appear"])) : normalizeVNode(() => null), (openBlock(), createBlock(Transition, {
          name: "fade-in-scale-up-transition",
          onAfterLeave: this.handleAfterLeave,
          appear: this.appear,
          onEnter: this.syncTransformOrigin,
          onBeforeLeave: this.syncTransformOrigin
        }, {
          default: () => {
            const {
              previewedImgProps = {}
            } = this;
            return withDirectives((openBlock(), createElementBlock("div", {
              class: normalizeClass$1(`${clsPrefix}-image-preview-wrapper`),
              ref: "previewWrapperRef"
            }, [(openBlock(), createElementBlock("img", mergeProps(previewedImgProps, {
              draggable: false,
              onMousedown: this.handlePreviewMousedown,
              onDblclick: this.handlePreviewDblclick,
              class: [`${clsPrefix}-image-preview`, previewedImgProps.class],
              key: this.previewSrc,
              src: this.previewSrc,
              ref: "previewRef",
              onDragstart: this.handleDragStart
            }), null, 16, _hoisted_2))], 2)), [[vShow, this.mergedShow]]);
          }
        }, 1032, ["onAfterLeave", "appear", "onEnter", "onBeforeLeave"]))], 46, _hoisted_3)), [[zindexable, {
          enabled: this.mergedShow
        }]]);
      }
    }, 1032, ["show"]))], 64);
  }
});
//#endregion
export { ImagePreview_default as default, imagePreviewProps };