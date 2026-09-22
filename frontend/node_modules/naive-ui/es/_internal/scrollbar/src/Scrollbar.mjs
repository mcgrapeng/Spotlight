import { useReactivated } from "../../../_utils/composable/use-reactivated.mjs";
import { rtlInset } from "../../../_utils/css/rtl-inset.mjs";
import { Wrapper } from "../../../_utils/vue/wrapper.mjs";
import useConfig from "../../../_mixins/use-config.mjs";
import { useThemeClass } from "../../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../../_mixins/use-rtl.mjs";
import useTheme from "../../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import scrollbarLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { depx, getPadding, getPreciseEventTarget, pxfy } from "seemly";
import { Fragment, Transition, computed, createBlock, createElementBlock, defineComponent, h, mergeProps, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref, watchEffect } from "vue";
import { off, on } from "evtd";
import { useIsIos } from "vooks";
import { VResizeObserver } from "vueuc";
//#region src/_internal/scrollbar/src/Scrollbar.tsx
const _hoisted_1 = ["onMousedown"];
const _hoisted_2 = ["onScroll", "onWheel"];
const _hoisted_3 = ["onMousedown"];
const scrollbarProps = {
  ...useTheme.props,
  duration: {
    type: Number,
    default: 0
  },
  scrollable: {
    type: Boolean,
    default: true
  },
  xScrollable: Boolean,
  trigger: {
    type: String,
    default: "hover"
  },
  useUnifiedContainer: Boolean,
  triggerDisplayManually: Boolean,
  container: Function,
  content: Function,
  containerClass: String,
  containerStyle: [String, Object],
  contentClass: [String, Array],
  contentStyle: [String, Object],
  horizontalRailStyle: [String, Object],
  verticalRailStyle: [String, Object],
  onScroll: Function,
  onWheel: Function,
  onResize: Function,
  internalOnUpdateScrollLeft: Function,
  internalHoistYRail: Boolean,
  internalExposeWidthCssVar: Boolean,
  yPlacement: {
    type: String,
    default: "right"
  },
  xPlacement: {
    type: String,
    default: "bottom"
  }
};
const Scrollbar = defineComponent({
  name: "Scrollbar",
  props: scrollbarProps,
  inheritAttrs: false,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("Scrollbar", mergedRtlRef, mergedClsPrefixRef);
    const wrapperRef = ref(null);
    const containerRef = ref(null);
    const contentRef = ref(null);
    const yRailRef = ref(null);
    const xRailRef = ref(null);
    const contentHeightRef = ref(null);
    const contentWidthRef = ref(null);
    const containerHeightRef = ref(null);
    const containerWidthRef = ref(null);
    const yRailSizeRef = ref(null);
    const xRailSizeRef = ref(null);
    const containerScrollTopRef = ref(0);
    const containerScrollLeftRef = ref(0);
    const isShowXBarRef = ref(false);
    const isShowYBarRef = ref(false);
    let yBarPressed = false;
    let xBarPressed = false;
    let xBarVanishTimerId;
    let yBarVanishTimerId;
    let memoYTop = 0;
    let memoXLeft = 0;
    let memoMouseX = 0;
    let memoMouseY = 0;
    const isIos = useIsIos();
    const themeRef = useTheme("Scrollbar", "-scrollbar", index_cssr_default, scrollbarLight, props, mergedClsPrefixRef);
    const yBarSizeRef = computed(() => {
      const {
        value: containerHeight
      } = containerHeightRef;
      const {
        value: contentHeight
      } = contentHeightRef;
      const {
        value: yRailSize
      } = yRailSizeRef;
      if (containerHeight === null || contentHeight === null || yRailSize === null) return 0;else return Math.min(containerHeight, yRailSize * containerHeight / contentHeight + depx(themeRef.value.self.width) * 1.5);
    });
    const yBarSizePxRef = computed(() => {
      return `${yBarSizeRef.value}px`;
    });
    const xBarSizeRef = computed(() => {
      const {
        value: containerWidth
      } = containerWidthRef;
      const {
        value: contentWidth
      } = contentWidthRef;
      const {
        value: xRailSize
      } = xRailSizeRef;
      if (containerWidth === null || contentWidth === null || xRailSize === null) return 0;else return xRailSize * containerWidth / contentWidth + depx(themeRef.value.self.height) * 1.5;
    });
    const xBarSizePxRef = computed(() => {
      return `${xBarSizeRef.value}px`;
    });
    const yBarTopRef = computed(() => {
      const {
        value: containerHeight
      } = containerHeightRef;
      const {
        value: containerScrollTop
      } = containerScrollTopRef;
      const {
        value: contentHeight
      } = contentHeightRef;
      const {
        value: yRailSize
      } = yRailSizeRef;
      if (containerHeight === null || contentHeight === null || yRailSize === null) return 0;else {
        const heightDiff = contentHeight - containerHeight;
        if (!heightDiff) return 0;
        return containerScrollTop / heightDiff * (yRailSize - yBarSizeRef.value);
      }
    });
    const yBarTopPxRef = computed(() => {
      return `${yBarTopRef.value}px`;
    });
    const xBarLeftRef = computed(() => {
      const {
        value: containerWidth
      } = containerWidthRef;
      const {
        value: containerScrollLeft
      } = containerScrollLeftRef;
      const {
        value: contentWidth
      } = contentWidthRef;
      const {
        value: xRailSize
      } = xRailSizeRef;
      if (containerWidth === null || contentWidth === null || xRailSize === null) return 0;else {
        const widthDiff = contentWidth - containerWidth;
        if (!widthDiff) return 0;
        return containerScrollLeft / widthDiff * (xRailSize - xBarSizeRef.value);
      }
    });
    const xBarLeftPxRef = computed(() => {
      return `${xBarLeftRef.value}px`;
    });
    const needYBarRef = computed(() => {
      const {
        value: containerHeight
      } = containerHeightRef;
      const {
        value: contentHeight
      } = contentHeightRef;
      return containerHeight !== null && contentHeight !== null && contentHeight > containerHeight;
    });
    const needXBarRef = computed(() => {
      const {
        value: containerWidth
      } = containerWidthRef;
      const {
        value: contentWidth
      } = contentWidthRef;
      return containerWidth !== null && contentWidth !== null && contentWidth > containerWidth;
    });
    const mergedShowXBarRef = computed(() => {
      const {
        trigger
      } = props;
      return trigger === "none" || isShowXBarRef.value;
    });
    const mergedShowYBarRef = computed(() => {
      const {
        trigger
      } = props;
      return trigger === "none" || isShowYBarRef.value;
    });
    const mergedContainerRef = computed(() => {
      const {
        container
      } = props;
      if (container) return container();
      return containerRef.value;
    });
    const mergedContentRef = computed(() => {
      const {
        content
      } = props;
      if (content) return content();
      return contentRef.value;
    });
    const scrollTo = (options, y) => {
      if (!props.scrollable) return;
      if (typeof options === "number") {
        scrollToPosition(options, y ?? 0, 0, false, "auto");
        return;
      }
      const {
        left,
        top,
        index,
        elSize,
        position,
        behavior,
        el,
        debounce = true
      } = options;
      if (left !== void 0 || top !== void 0) scrollToPosition(left ?? 0, top ?? 0, 0, false, behavior);
      if (el !== void 0) scrollToPosition(0, el.offsetTop, el.offsetHeight, debounce, behavior);else if (index !== void 0 && elSize !== void 0) scrollToPosition(0, index * elSize, elSize, debounce, behavior);else if (position === "bottom") scrollToPosition(0, Number.MAX_SAFE_INTEGER, 0, false, behavior);else if (position === "top") scrollToPosition(0, 0, 0, false, behavior);
    };
    const activateState = useReactivated(() => {
      if (!props.container) scrollTo({
        top: containerScrollTopRef.value,
        left: containerScrollLeftRef.value
      });
    });
    const handleContentResize = () => {
      if (activateState.isDeactivated) return;
      sync();
    };
    const handleContainerResize = e => {
      if (activateState.isDeactivated) return;
      const {
        onResize
      } = props;
      if (onResize) onResize(e);
      sync();
    };
    const scrollBy = (options, y) => {
      if (!props.scrollable) return;
      const {
        value: container
      } = mergedContainerRef;
      if (!container) return;
      if (typeof options === "object") container.scrollBy(options);else container.scrollBy(options, y || 0);
    };
    function scrollToPosition(left, top, elSize, debounce, behavior) {
      const {
        value: container
      } = mergedContainerRef;
      if (!container) return;
      if (debounce) {
        const {
          scrollTop,
          offsetHeight
        } = container;
        if (top > scrollTop) {
          if (top + elSize <= scrollTop + offsetHeight) {} else container.scrollTo({
            left,
            top: top + elSize - offsetHeight,
            behavior
          });
          return;
        }
      }
      container.scrollTo({
        left,
        top,
        behavior
      });
    }
    function handleMouseEnterWrapper() {
      showXBar();
      showYBar();
      sync();
    }
    function handleMouseLeaveWrapper() {
      hideBar();
    }
    function hideBar() {
      hideYBar();
      hideXBar();
    }
    function hideYBar() {
      if (yBarVanishTimerId !== void 0) window.clearTimeout(yBarVanishTimerId);
      yBarVanishTimerId = window.setTimeout(() => {
        isShowYBarRef.value = false;
      }, props.duration);
    }
    function hideXBar() {
      if (xBarVanishTimerId !== void 0) window.clearTimeout(xBarVanishTimerId);
      xBarVanishTimerId = window.setTimeout(() => {
        isShowXBarRef.value = false;
      }, props.duration);
    }
    function showXBar() {
      if (xBarVanishTimerId !== void 0) window.clearTimeout(xBarVanishTimerId);
      isShowXBarRef.value = true;
    }
    function showYBar() {
      if (yBarVanishTimerId !== void 0) window.clearTimeout(yBarVanishTimerId);
      isShowYBarRef.value = true;
    }
    function handleScroll(e) {
      const {
        onScroll
      } = props;
      if (onScroll) onScroll(e);
      syncScrollState();
    }
    function syncScrollState() {
      const {
        value: container
      } = mergedContainerRef;
      if (container) {
        containerScrollTopRef.value = container.scrollTop;
        containerScrollLeftRef.value = container.scrollLeft * (rtlEnabledRef?.value ? -1 : 1);
      }
    }
    function syncPositionState() {
      const {
        value: content
      } = mergedContentRef;
      if (content) {
        contentHeightRef.value = content.offsetHeight;
        contentWidthRef.value = content.offsetWidth;
      }
      const {
        value: container
      } = mergedContainerRef;
      if (container) {
        containerHeightRef.value = container.offsetHeight;
        containerWidthRef.value = container.offsetWidth;
      }
      const {
        value: xRailEl
      } = xRailRef;
      const {
        value: yRailEl
      } = yRailRef;
      if (xRailEl) xRailSizeRef.value = xRailEl.offsetWidth;
      if (yRailEl) yRailSizeRef.value = yRailEl.offsetHeight;
    }
    /**
    * Sometimes there's only one element that we can scroll,
    * For example for textarea, there won't be a content element.
    */
    function syncUnifiedContainer() {
      const {
        value: container
      } = mergedContainerRef;
      if (container) {
        containerScrollTopRef.value = container.scrollTop;
        containerScrollLeftRef.value = container.scrollLeft * (rtlEnabledRef?.value ? -1 : 1);
        containerHeightRef.value = container.offsetHeight;
        containerWidthRef.value = container.offsetWidth;
        contentHeightRef.value = container.scrollHeight;
        contentWidthRef.value = container.scrollWidth;
      }
      const {
        value: xRailEl
      } = xRailRef;
      const {
        value: yRailEl
      } = yRailRef;
      if (xRailEl) xRailSizeRef.value = xRailEl.offsetWidth;
      if (yRailEl) yRailSizeRef.value = yRailEl.offsetHeight;
    }
    function sync() {
      if (!props.scrollable) return;
      if (props.useUnifiedContainer) syncUnifiedContainer();else {
        syncPositionState();
        syncScrollState();
      }
    }
    function isMouseUpAway(e) {
      return !wrapperRef.value?.contains(getPreciseEventTarget(e));
    }
    function handleXScrollMouseDown(e) {
      e.preventDefault();
      e.stopPropagation();
      xBarPressed = true;
      on("mousemove", window, handleXScrollMouseMove, true);
      on("mouseup", window, handleXScrollMouseUp, true);
      memoXLeft = containerScrollLeftRef.value;
      memoMouseX = rtlEnabledRef?.value ? window.innerWidth - e.clientX : e.clientX;
    }
    function handleXScrollMouseMove(e) {
      if (!xBarPressed) return;
      if (xBarVanishTimerId !== void 0) window.clearTimeout(xBarVanishTimerId);
      if (yBarVanishTimerId !== void 0) window.clearTimeout(yBarVanishTimerId);
      const {
        value: containerWidth
      } = containerWidthRef;
      const {
        value: contentWidth
      } = contentWidthRef;
      const {
        value: xBarSize
      } = xBarSizeRef;
      if (containerWidth === null || contentWidth === null) return;
      const dScrollLeft = (rtlEnabledRef?.value ? window.innerWidth - e.clientX - memoMouseX : e.clientX - memoMouseX) * (contentWidth - containerWidth) / (containerWidth - xBarSize);
      const toScrollLeftUpperBound = contentWidth - containerWidth;
      let toScrollLeft = memoXLeft + dScrollLeft;
      toScrollLeft = Math.min(toScrollLeftUpperBound, toScrollLeft);
      toScrollLeft = Math.max(toScrollLeft, 0);
      const {
        value: container
      } = mergedContainerRef;
      if (container) {
        container.scrollLeft = toScrollLeft * (rtlEnabledRef?.value ? -1 : 1);
        const {
          internalOnUpdateScrollLeft
        } = props;
        if (internalOnUpdateScrollLeft) internalOnUpdateScrollLeft(toScrollLeft);
      }
    }
    function handleXScrollMouseUp(e) {
      e.preventDefault();
      e.stopPropagation();
      off("mousemove", window, handleXScrollMouseMove, true);
      off("mouseup", window, handleXScrollMouseUp, true);
      xBarPressed = false;
      sync();
      if (isMouseUpAway(e)) hideBar();
    }
    function handleYScrollMouseDown(e) {
      e.preventDefault();
      e.stopPropagation();
      yBarPressed = true;
      on("mousemove", window, handleYScrollMouseMove, true);
      on("mouseup", window, handleYScrollMouseUp, true);
      memoYTop = containerScrollTopRef.value;
      memoMouseY = e.clientY;
    }
    function handleYScrollMouseMove(e) {
      if (!yBarPressed) return;
      if (xBarVanishTimerId !== void 0) window.clearTimeout(xBarVanishTimerId);
      if (yBarVanishTimerId !== void 0) window.clearTimeout(yBarVanishTimerId);
      const {
        value: containerHeight
      } = containerHeightRef;
      const {
        value: contentHeight
      } = contentHeightRef;
      const {
        value: yBarSize
      } = yBarSizeRef;
      if (containerHeight === null || contentHeight === null) return;
      const dScrollTop = (e.clientY - memoMouseY) * (contentHeight - containerHeight) / (containerHeight - yBarSize);
      const toScrollTopUpperBound = contentHeight - containerHeight;
      let toScrollTop = memoYTop + dScrollTop;
      toScrollTop = Math.min(toScrollTopUpperBound, toScrollTop);
      toScrollTop = Math.max(toScrollTop, 0);
      const {
        value: container
      } = mergedContainerRef;
      if (container) container.scrollTop = toScrollTop;
    }
    function handleYScrollMouseUp(e) {
      e.preventDefault();
      e.stopPropagation();
      off("mousemove", window, handleYScrollMouseMove, true);
      off("mouseup", window, handleYScrollMouseUp, true);
      yBarPressed = false;
      sync();
      if (isMouseUpAway(e)) hideBar();
    }
    watchEffect(() => {
      const {
        value: needXBar
      } = needXBarRef;
      const {
        value: needYBar
      } = needYBarRef;
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      const {
        value: xRailEl
      } = xRailRef;
      const {
        value: yRailEl
      } = yRailRef;
      if (xRailEl) {
        if (!needXBar) xRailEl.classList.add(`${mergedClsPrefix}-scrollbar-rail--disabled`);else xRailEl.classList.remove(`${mergedClsPrefix}-scrollbar-rail--disabled`);
      }
      if (yRailEl) {
        if (!needYBar) yRailEl.classList.add(`${mergedClsPrefix}-scrollbar-rail--disabled`);else yRailEl.classList.remove(`${mergedClsPrefix}-scrollbar-rail--disabled`);
      }
    });
    onMounted(() => {
      if (props.container) return;
      sync();
    });
    onBeforeUnmount(() => {
      if (xBarVanishTimerId !== void 0) window.clearTimeout(xBarVanishTimerId);
      if (yBarVanishTimerId !== void 0) window.clearTimeout(yBarVanishTimerId);
      off("mousemove", window, handleYScrollMouseMove, true);
      off("mouseup", window, handleYScrollMouseUp, true);
    });
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          color,
          colorHover,
          height,
          width,
          borderRadius,
          railInsetHorizontalTop,
          railInsetHorizontalBottom,
          railInsetVerticalRight,
          railInsetVerticalLeft,
          railColor
        }
      } = themeRef.value;
      const {
        top: railTopHorizontalTop,
        right: railRightHorizontalTop,
        bottom: railBottomHorizontalTop,
        left: railLeftHorizontalTop
      } = getPadding(railInsetHorizontalTop);
      const {
        top: railTopHorizontalBottom,
        right: railRightHorizontalBottom,
        bottom: railBottomHorizontalBottom,
        left: railLeftHorizontalBottom
      } = getPadding(railInsetHorizontalBottom);
      const {
        top: railTopVerticalRight,
        right: railRightVerticalRight,
        bottom: railBottomVerticalRight,
        left: railLeftVerticalRight
      } = getPadding(rtlEnabledRef?.value ? rtlInset(railInsetVerticalRight) : railInsetVerticalRight);
      const {
        top: railTopVerticalLeft,
        right: railRightVerticalLeft,
        bottom: railBottomVerticalLeft,
        left: railLeftVerticalLeft
      } = getPadding(rtlEnabledRef?.value ? rtlInset(railInsetVerticalLeft) : railInsetVerticalLeft);
      return {
        "--n-scrollbar-bezier": cubicBezierEaseInOut,
        "--n-scrollbar-color": color,
        "--n-scrollbar-color-hover": colorHover,
        "--n-scrollbar-border-radius": borderRadius,
        "--n-scrollbar-width": width,
        "--n-scrollbar-height": height,
        "--n-scrollbar-rail-top-horizontal-top": railTopHorizontalTop,
        "--n-scrollbar-rail-right-horizontal-top": railRightHorizontalTop,
        "--n-scrollbar-rail-bottom-horizontal-top": railBottomHorizontalTop,
        "--n-scrollbar-rail-left-horizontal-top": railLeftHorizontalTop,
        "--n-scrollbar-rail-top-horizontal-bottom": railTopHorizontalBottom,
        "--n-scrollbar-rail-right-horizontal-bottom": railRightHorizontalBottom,
        "--n-scrollbar-rail-bottom-horizontal-bottom": railBottomHorizontalBottom,
        "--n-scrollbar-rail-left-horizontal-bottom": railLeftHorizontalBottom,
        "--n-scrollbar-rail-top-vertical-right": railTopVerticalRight,
        "--n-scrollbar-rail-right-vertical-right": railRightVerticalRight,
        "--n-scrollbar-rail-bottom-vertical-right": railBottomVerticalRight,
        "--n-scrollbar-rail-left-vertical-right": railLeftVerticalRight,
        "--n-scrollbar-rail-top-vertical-left": railTopVerticalLeft,
        "--n-scrollbar-rail-right-vertical-left": railRightVerticalLeft,
        "--n-scrollbar-rail-bottom-vertical-left": railBottomVerticalLeft,
        "--n-scrollbar-rail-left-vertical-left": railLeftVerticalLeft,
        "--n-scrollbar-rail-color": railColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("scrollbar", void 0, cssVarsRef, props) : void 0;
    return {
      scrollTo,
      scrollBy,
      sync,
      syncUnifiedContainer,
      handleMouseEnterWrapper,
      handleMouseLeaveWrapper,
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      containerScrollTop: containerScrollTopRef,
      wrapperRef,
      containerRef,
      contentRef,
      yRailRef,
      xRailRef,
      needYBar: needYBarRef,
      needXBar: needXBarRef,
      yBarSizePx: yBarSizePxRef,
      xBarSizePx: xBarSizePxRef,
      yBarTopPx: yBarTopPxRef,
      xBarLeftPx: xBarLeftPxRef,
      isShowXBar: mergedShowXBarRef,
      isShowYBar: mergedShowYBarRef,
      isIos,
      handleScroll,
      handleContentResize,
      handleContainerResize,
      handleYScrollMouseDown,
      handleXScrollMouseDown,
      containerWidth: containerWidthRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      $slots,
      mergedClsPrefix,
      triggerDisplayManually,
      rtlEnabled,
      internalHoistYRail,
      yPlacement,
      xPlacement,
      xScrollable
    } = this;
    if (!this.scrollable) return $slots.default?.();
    const triggerIsNone = this.trigger === "none";
    const createYRail = (className, style) => {
      return openBlock(), createElementBlock("div", {
        ref: "yRailRef",
        class: normalizeClass$1([`${mergedClsPrefix}-scrollbar-rail`, `${mergedClsPrefix}-scrollbar-rail--vertical`, `${mergedClsPrefix}-scrollbar-rail--vertical--${yPlacement}`, className]),
        "data-scrollbar-rail": true,
        style: normalizeStyle([style || "", this.verticalRailStyle]),
        "aria-hidden": true
      }, [normalizeVNode(() => h(triggerIsNone ? Wrapper : Transition, triggerIsNone ? null : {
        name: "fade-in-transition"
      }, {
        default: () => this.needYBar && this.isShowYBar && !this.isIos ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass$1(`${mergedClsPrefix}-scrollbar-rail__scrollbar`),
          style: normalizeStyle({
            height: this.yBarSizePx,
            top: this.yBarTopPx
          }),
          onMousedown: this.handleYScrollMouseDown
        }, null, 46, _hoisted_1)) : null
      }))], 6);
    };
    const createChildren = () => {
      this.onRender?.();
      return h("div", mergeProps(this.$attrs, {
        role: "none",
        ref: "wrapperRef",
        class: [`${mergedClsPrefix}-scrollbar`, this.themeClass, rtlEnabled && `${mergedClsPrefix}-scrollbar--rtl`],
        style: this.cssVars,
        onMouseenter: triggerDisplayManually ? void 0 : this.handleMouseEnterWrapper,
        onMouseleave: triggerDisplayManually ? void 0 : this.handleMouseLeaveWrapper
      }), [this.container ? $slots.default?.() : (openBlock(), createElementBlock("div", {
        key: 2,
        role: "none",
        ref: "containerRef",
        class: normalizeClass$1([`${mergedClsPrefix}-scrollbar-container`, this.containerClass]),
        style: normalizeStyle([this.containerStyle, this.internalExposeWidthCssVar ? {
          "--n-scrollbar-current-width": pxfy(this.containerWidth)
        } : void 0]),
        onScroll: this.handleScroll,
        onWheel: this.onWheel
      }, [(openBlock(), createBlock(VResizeObserver, {
        onResize: this.handleContentResize
      }, {
        default: () => (openBlock(), createElementBlock("div", {
          ref: "contentRef",
          role: "none",
          style: normalizeStyle([{
            width: this.xScrollable ? "fit-content" : null
          }, this.contentStyle]),
          class: normalizeClass$1([`${mergedClsPrefix}-scrollbar-content`, this.contentClass])
        }, [normalizeVNode(() => $slots.default?.())], 6))
      }, 1032, ["onResize"]))], 46, _hoisted_2)), internalHoistYRail ? null : createYRail(void 0, void 0), xScrollable && (openBlock(), createElementBlock("div", {
        ref: "xRailRef",
        class: normalizeClass$1([`${mergedClsPrefix}-scrollbar-rail`, `${mergedClsPrefix}-scrollbar-rail--horizontal`, `${mergedClsPrefix}-scrollbar-rail--horizontal--${xPlacement}`]),
        style: normalizeStyle(this.horizontalRailStyle),
        "data-scrollbar-rail": true,
        "aria-hidden": true
      }, [normalizeVNode(() => h(triggerIsNone ? Wrapper : Transition, triggerIsNone ? null : {
        name: "fade-in-transition"
      }, {
        default: () => this.needXBar && this.isShowXBar && !this.isIos ? (openBlock(), createElementBlock("div", {
          key: 3,
          class: normalizeClass$1(`${mergedClsPrefix}-scrollbar-rail__scrollbar`),
          style: normalizeStyle({
            width: this.xBarSizePx,
            right: rtlEnabled ? this.xBarLeftPx : void 0,
            left: rtlEnabled ? void 0 : this.xBarLeftPx
          }),
          onMousedown: this.handleXScrollMouseDown
        }, null, 46, _hoisted_3)) : null
      }))], 6))]);
    };
    const scrollbarNode = this.container ? createChildren() : (openBlock(), createBlock(VResizeObserver, {
      key: 4,
      onResize: this.handleContainerResize
    }, {
      default: createChildren
    }, 1032, ["onResize"]));
    if (internalHoistYRail) return openBlock(), createElementBlock(Fragment, {
      key: 5
    }, [normalizeVNode(() => scrollbarNode), normalizeVNode(() => createYRail(this.themeClass, this.cssVars))], 64);else return scrollbarNode;
  }
});
const XScrollbar = Scrollbar;
//#endregion
export { XScrollbar, Scrollbar as default };