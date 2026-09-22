import { drawerBodyInjectionKey, drawerInjectionKey } from "./interface.mjs";
import { modalBodyInjectionKey } from "../../modal/src/interface.mjs";
import { popoverBodyInjectionKey } from "../../popover/src/interface.mjs";
import { useLockHtmlScroll } from "../../_utils/composable/use-lock-html-scroll.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlots, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import { Transition, computed, createBlock, createElementBlock, defineComponent, h, inject, mergeProps, normalizeStyle, onBeforeUnmount, openBlock, provide, ref, vShow, watch, watchEffect, withDirectives } from "vue";
import { VFocusTrap } from "vueuc";
import { clickoutside } from "vdirs";
//#region src/drawer/src/DrawerBodyWrapper.tsx
const _hoisted_1 = ["onMouseenter", "onMouseleave", "onMousedown"];
const _hoisted_2 = {
  key: 1,
  role: "none"
};
var DrawerBodyWrapper_default = defineComponent({
  name: "NDrawerContent",
  inheritAttrs: false,
  props: {
    blockScroll: Boolean,
    show: {
      type: Boolean,
      default: void 0
    },
    displayDirective: {
      type: String,
      required: true
    },
    placement: {
      type: String,
      required: true
    },
    contentClass: String,
    contentStyle: [Object, String],
    nativeScrollbar: {
      type: Boolean,
      required: true
    },
    scrollbarProps: Object,
    trapFocus: {
      type: Boolean,
      default: true
    },
    autoFocus: {
      type: Boolean,
      default: true
    },
    showMask: {
      type: [Boolean, String],
      required: true
    },
    maxWidth: Number,
    maxHeight: Number,
    minWidth: Number,
    minHeight: Number,
    resizable: Boolean,
    onClickoutside: Function,
    onAfterLeave: Function,
    onAfterEnter: Function,
    onEsc: Function
  },
  setup(props) {
    const displayedRef = ref(!!props.show);
    const bodyRef = ref(null);
    const NDrawer = inject(drawerInjectionKey);
    let startPosition = 0;
    let memoizedBodyStyleCursor = "";
    let hoverTimerId = null;
    const isHoverOnResizeTriggerRef = ref(false);
    const isDraggingRef = ref(false);
    const isVertical = computed(() => {
      return props.placement === "top" || props.placement === "bottom";
    });
    const {
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("Drawer", mergedRtlRef, mergedClsPrefixRef);
    const handleBodyMouseleave = handleBodyMouseup;
    const handleMousedownResizeTrigger = e => {
      isDraggingRef.value = true;
      startPosition = isVertical.value ? e.clientY : e.clientX;
      memoizedBodyStyleCursor = document.body.style.cursor;
      document.body.style.cursor = isVertical.value ? "ns-resize" : "ew-resize";
      document.body.addEventListener("mousemove", handleBodyMousemove);
      document.body.addEventListener("mouseleave", handleBodyMouseleave);
      document.body.addEventListener("mouseup", handleBodyMouseup);
    };
    const handleMouseenterResizeTrigger = () => {
      if (hoverTimerId !== null) {
        window.clearTimeout(hoverTimerId);
        hoverTimerId = null;
      }
      if (isDraggingRef.value) isHoverOnResizeTriggerRef.value = true;else hoverTimerId = window.setTimeout(() => {
        isHoverOnResizeTriggerRef.value = true;
      }, 300);
    };
    const handleMouseleaveResizeTrigger = () => {
      if (hoverTimerId !== null) {
        window.clearTimeout(hoverTimerId);
        hoverTimerId = null;
      }
      isHoverOnResizeTriggerRef.value = false;
    };
    const {
      doUpdateHeight,
      doUpdateWidth
    } = NDrawer;
    const regulateWidth = size => {
      const {
        maxWidth
      } = props;
      if (maxWidth && size > maxWidth) return maxWidth;
      const {
        minWidth
      } = props;
      if (minWidth && size < minWidth) return minWidth;
      return size;
    };
    const regulateHeight = size => {
      const {
        maxHeight
      } = props;
      if (maxHeight && size > maxHeight) return maxHeight;
      const {
        minHeight
      } = props;
      if (minHeight && size < minHeight) return minHeight;
      return size;
    };
    function handleBodyMousemove(e) {
      if (isDraggingRef.value) {
        if (isVertical.value) {
          let height = bodyRef.value?.offsetHeight || 0;
          const increment = startPosition - e.clientY;
          height += props.placement === "bottom" ? increment : -increment;
          height = regulateHeight(height);
          doUpdateHeight(height);
          startPosition = e.clientY;
        } else {
          let width = bodyRef.value?.offsetWidth || 0;
          const increment = startPosition - e.clientX;
          width += props.placement === "right" ? increment : -increment;
          width = regulateWidth(width);
          doUpdateWidth(width);
          startPosition = e.clientX;
        }
      }
    }
    function handleBodyMouseup() {
      if (isDraggingRef.value) {
        startPosition = 0;
        isDraggingRef.value = false;
        document.body.style.cursor = memoizedBodyStyleCursor;
        document.body.removeEventListener("mousemove", handleBodyMousemove);
        document.body.removeEventListener("mouseup", handleBodyMouseup);
        document.body.removeEventListener("mouseleave", handleBodyMouseleave);
      }
    }
    watchEffect(() => {
      if (props.show) displayedRef.value = true;
    });
    watch(() => props.show, value => {
      if (!value) handleBodyMouseup();
    });
    onBeforeUnmount(() => {
      handleBodyMouseup();
    });
    const bodyDirectivesRef = computed(() => {
      const {
        show
      } = props;
      const directives = [[vShow, show]];
      if (!props.showMask) directives.push([clickoutside, props.onClickoutside, void 0, {
        capture: true
      }]);
      return directives;
    });
    function handleAfterLeave() {
      displayedRef.value = false;
      props.onAfterLeave?.();
    }
    useLockHtmlScroll(computed(() => props.blockScroll && displayedRef.value));
    provide(drawerBodyInjectionKey, bodyRef);
    provide(popoverBodyInjectionKey, null);
    provide(modalBodyInjectionKey, null);
    return {
      bodyRef,
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: NDrawer.mergedClsPrefixRef,
      isMounted: NDrawer.isMountedRef,
      mergedTheme: NDrawer.mergedThemeRef,
      displayed: displayedRef,
      transitionName: computed(() => {
        return {
          right: "slide-in-from-right-transition",
          left: "slide-in-from-left-transition",
          top: "slide-in-from-top-transition",
          bottom: "slide-in-from-bottom-transition"
        }[props.placement];
      }),
      handleAfterLeave,
      bodyDirectives: bodyDirectivesRef,
      handleMousedownResizeTrigger,
      handleMouseenterResizeTrigger,
      handleMouseleaveResizeTrigger,
      isDragging: isDraggingRef,
      isHoverOnResizeTrigger: isHoverOnResizeTriggerRef
    };
  },
  render() {
    const {
      $slots,
      mergedClsPrefix
    } = this;
    return this.displayDirective === "show" || this.displayed || this.show ? withDirectives((openBlock(), createElementBlock("div", _hoisted_2, [(openBlock(), createBlock(VFocusTrap, {
      disabled: !this.showMask || !this.trapFocus,
      active: this.show,
      autoFocus: this.autoFocus,
      onEsc: this.onEsc
    }, {
      default: () => (openBlock(), createBlock(Transition, {
        name: this.transitionName,
        appear: this.isMounted,
        onAfterEnter: this.onAfterEnter,
        onAfterLeave: this.handleAfterLeave
      }, {
        default: () => withDirectives(h("div", mergeProps(this.$attrs, {
          role: "dialog",
          ref: "bodyRef",
          "aria-modal": "true",
          class: [`${mergedClsPrefix}-drawer`, this.rtlEnabled && `${mergedClsPrefix}-drawer--rtl`, `${mergedClsPrefix}-drawer--${this.placement}-placement`, this.isDragging && `${mergedClsPrefix}-drawer--unselectable`, this.nativeScrollbar && `${mergedClsPrefix}-drawer--native-scrollbar`]
        }), [this.resizable ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass$1([`${mergedClsPrefix}-drawer__resize-trigger`, (this.isDragging || this.isHoverOnResizeTrigger) && `${mergedClsPrefix}-drawer__resize-trigger--hover`]),
          onMouseenter: this.handleMouseenterResizeTrigger,
          onMouseleave: this.handleMouseleaveResizeTrigger,
          onMousedown: this.handleMousedownResizeTrigger
        }, null, 42, _hoisted_1)) : null, this.nativeScrollbar ? (openBlock(), createElementBlock("div", {
          key: 3,
          class: normalizeClass$1([`${mergedClsPrefix}-drawer-content-wrapper`, this.contentClass]),
          style: normalizeStyle(this.contentStyle),
          role: "none"
        }, [normalizeVNode(() => $slots.default?.())], 6)) : (openBlock(), createBlock(Scrollbar, mergeProps({
          key: 4
        }, this.scrollbarProps, {
          contentStyle: this.contentStyle,
          contentClass: [`${mergedClsPrefix}-drawer-content-wrapper`, this.contentClass],
          theme: this.mergedTheme.peers.Scrollbar,
          themeOverrides: this.mergedTheme.peerOverrides.Scrollbar
        }), normalizeSlots($slots), 1040, ["contentStyle", "contentClass", "theme", "themeOverrides"]))]), this.bodyDirectives)
      }, 1032, ["name", "appear", "onAfterEnter", "onAfterLeave"]))
    }, 1032, ["disabled", "active", "autoFocus", "onEsc"]))])), [[vShow, this.displayDirective === "if" || this.displayed || this.show]]) : null;
  }
});
//#endregion
export { DrawerBodyWrapper_default as default };