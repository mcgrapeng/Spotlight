import { useAdjustedTo } from "../../_utils/composable/use-adjusted-to.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { getFirstSlotVNode } from "../../_utils/vue/get-first-slot-vnode.mjs";
import { keep } from "../../_utils/vue/keep.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import PopoverBody_default, { popoverBodyProps } from "./PopoverBody.mjs";
import { Text, cloneVNode, computed, createBlock, createElementBlock, defineComponent, h, openBlock, provide, ref, toRef, watchEffect, withDirectives } from "vue";
import { useCompitable, useIsMounted, useMemo, useMergedState } from "vooks";
import { VBinder, VTarget } from "vueuc";
import { zindexable } from "vdirs";
//#region src/popover/src/Popover.tsx
const _hoisted_1 = {
  key: 1,
  style: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
};
const bodyPropKeys = Object.keys(popoverBodyProps);
const triggerEventMap = {
  focus: ["onFocus", "onBlur"],
  click: ["onClick"],
  hover: ["onMouseenter", "onMouseleave"],
  manual: [],
  nested: ["onFocus", "onBlur", "onMouseenter", "onMouseleave", "onClick"]
};
function appendEvents(vNode, trigger, events) {
  triggerEventMap[trigger].forEach(eventName => {
    if (!vNode.props) vNode.props = {};else vNode.props = Object.assign({}, vNode.props);
    const originalHandler = vNode.props[eventName];
    const handler = events[eventName];
    if (!originalHandler) vNode.props[eventName] = handler;else vNode.props[eventName] = (...args) => {
      originalHandler(...args);
      handler(...args);
    };
  });
}
const popoverBaseProps = {
  show: {
    type: Boolean,
    default: void 0
  },
  defaultShow: Boolean,
  showArrow: {
    type: Boolean,
    default: true
  },
  trigger: {
    type: String,
    default: "hover"
  },
  delay: {
    type: Number,
    default: 100
  },
  duration: {
    type: Number,
    default: 100
  },
  raw: Boolean,
  placement: {
    type: String,
    default: "top"
  },
  x: Number,
  y: Number,
  arrowPointToCenter: Boolean,
  disabled: Boolean,
  getDisabled: Function,
  displayDirective: {
    type: String,
    default: "if"
  },
  arrowClass: String,
  arrowStyle: [String, Object],
  arrowWrapperClass: String,
  arrowWrapperStyle: [String, Object],
  flip: {
    type: Boolean,
    default: true
  },
  animated: {
    type: Boolean,
    default: true
  },
  width: {
    type: [Number, String],
    default: void 0
  },
  overlap: Boolean,
  keepAliveOnHover: {
    type: Boolean,
    default: true
  },
  zIndex: Number,
  to: useAdjustedTo.propTo,
  scrollable: Boolean,
  contentClass: String,
  contentStyle: [Object, String],
  headerClass: String,
  headerStyle: [Object, String],
  footerClass: String,
  footerStyle: [Object, String],
  onClickoutside: Function,
  "onUpdate:show": [Function, Array],
  onUpdateShow: [Function, Array],
  internalDeactivateImmediately: Boolean,
  internalSyncTargetWithParent: Boolean,
  internalInheritedEventHandlers: {
    type: Array,
    default: () => []
  },
  internalTrapFocus: Boolean,
  internalExtraClass: {
    type: Array,
    default: () => []
  },
  onShow: [Function, Array],
  onHide: [Function, Array],
  arrow: {
    type: Boolean,
    default: void 0
  },
  minWidth: Number,
  maxWidth: Number
};
const popoverProps = {
  ...useTheme.props,
  ...popoverBaseProps,
  internalOnAfterLeave: Function,
  internalRenderBody: Function
};
var Popover_default = defineComponent({
  name: "Popover",
  inheritAttrs: false,
  props: popoverProps,
  slots: Object,
  __popover__: true,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.maxWidth !== void 0) warnOnce("popover", "`max-width` is deprecated, please use `style` instead.");
      if (props.minWidth !== void 0) warnOnce("popover", "`min-width` is deprecated, please use `style` instead.");
      if (props.arrow !== void 0) warnOnce("popover", "`arrow` is deprecated, please use `showArrow` instead.");
      if (props.onHide !== void 0) warnOnce("popover", "`on-hide` is deprecated, please use `on-update:show` instead.");
      if (props.onShow !== void 0) warnOnce("popover", "`on-show` is deprecated, please use `on-update:show` instead.");
    });
    const isMountedRef = useIsMounted();
    const binderInstRef = ref(null);
    const controlledShowRef = computed(() => props.show);
    const uncontrolledShowRef = ref(props.defaultShow);
    const mergedShowWithoutDisabledRef = useMergedState(controlledShowRef, uncontrolledShowRef);
    const mergedShowConsideringDisabledPropRef = useMemo(() => {
      if (props.disabled) return false;
      return mergedShowWithoutDisabledRef.value;
    });
    const getMergedDisabled = () => {
      if (props.disabled) return true;
      const {
        getDisabled
      } = props;
      if (getDisabled?.()) return true;
      return false;
    };
    const getMergedShow = () => {
      if (getMergedDisabled()) return false;
      return mergedShowWithoutDisabledRef.value;
    };
    const compatibleShowArrowRef = useCompitable(props, ["arrow", "showArrow"]);
    const mergedShowArrowRef = computed(() => {
      if (props.overlap) return false;
      return compatibleShowArrowRef.value;
    });
    let bodyInstance = null;
    const showTimerIdRef = ref(null);
    const hideTimerIdRef = ref(null);
    const positionManuallyRef = useMemo(() => {
      return props.x !== void 0 && props.y !== void 0;
    });
    function doUpdateShow(value) {
      const {
        "onUpdate:show": _onUpdateShow,
        onUpdateShow,
        onShow,
        onHide
      } = props;
      uncontrolledShowRef.value = value;
      if (_onUpdateShow) call(_onUpdateShow, value);
      if (onUpdateShow) call(onUpdateShow, value);
      if (value && onShow) call(onShow, true);
      if (value && onHide) call(onHide, false);
    }
    function syncPosition() {
      if (bodyInstance) bodyInstance.syncPosition();
    }
    function clearShowTimer() {
      const {
        value: showTimerId
      } = showTimerIdRef;
      if (showTimerId) {
        window.clearTimeout(showTimerId);
        showTimerIdRef.value = null;
      }
    }
    function clearHideTimer() {
      const {
        value: hideTimerId
      } = hideTimerIdRef;
      if (hideTimerId) {
        window.clearTimeout(hideTimerId);
        hideTimerIdRef.value = null;
      }
    }
    function handleFocus() {
      const mergedDisabled = getMergedDisabled();
      if (props.trigger === "focus" && !mergedDisabled) {
        if (getMergedShow()) return;
        doUpdateShow(true);
      }
    }
    function handleBlur() {
      const mergedDisabled = getMergedDisabled();
      if (props.trigger === "focus" && !mergedDisabled) {
        if (!getMergedShow()) return;
        doUpdateShow(false);
      }
    }
    function handleMouseEnter() {
      const mergedDisabled = getMergedDisabled();
      if (props.trigger === "hover" && !mergedDisabled) {
        clearHideTimer();
        if (showTimerIdRef.value !== null) return;
        if (getMergedShow()) return;
        const delayCallback = () => {
          doUpdateShow(true);
          showTimerIdRef.value = null;
        };
        const {
          delay
        } = props;
        if (delay === 0) delayCallback();else showTimerIdRef.value = window.setTimeout(delayCallback, delay);
      }
    }
    function handleMouseLeave() {
      const mergedDisabled = getMergedDisabled();
      if (props.trigger === "hover" && !mergedDisabled) {
        clearShowTimer();
        if (hideTimerIdRef.value !== null) return;
        if (!getMergedShow()) return;
        const delayedCallback = () => {
          doUpdateShow(false);
          hideTimerIdRef.value = null;
        };
        const {
          duration
        } = props;
        if (duration === 0) delayedCallback();else hideTimerIdRef.value = window.setTimeout(delayedCallback, duration);
      }
    }
    function handleMouseMoveOutside() {
      handleMouseLeave();
    }
    function handleClickOutside(e) {
      if (!getMergedShow()) return;
      if (props.trigger === "click") {
        clearShowTimer();
        clearHideTimer();
        doUpdateShow(false);
      }
      props.onClickoutside?.(e);
    }
    function handleClick() {
      if (props.trigger === "click" && !getMergedDisabled()) {
        clearShowTimer();
        clearHideTimer();
        doUpdateShow(!getMergedShow());
      }
    }
    function handleKeydown(e) {
      if (!props.internalTrapFocus) return;
      if (e.key === "Escape") {
        clearShowTimer();
        clearHideTimer();
        doUpdateShow(false);
      }
    }
    function setShow(value) {
      uncontrolledShowRef.value = value;
    }
    function getTriggerElement() {
      return binderInstRef.value?.targetRef;
    }
    function setBodyInstance(value) {
      bodyInstance = value;
    }
    provide("NPopover", {
      getTriggerElement,
      handleKeydown,
      handleMouseEnter,
      handleMouseLeave,
      handleClickOutside,
      handleMouseMoveOutside,
      setBodyInstance,
      positionManuallyRef,
      isMountedRef,
      zIndexRef: toRef(props, "zIndex"),
      extraClassRef: toRef(props, "internalExtraClass"),
      internalRenderBodyRef: toRef(props, "internalRenderBody")
    });
    watchEffect(() => {
      if (mergedShowWithoutDisabledRef.value && getMergedDisabled()) doUpdateShow(false);
    });
    return {
      binderInstRef,
      positionManually: positionManuallyRef,
      mergedShowConsideringDisabledProp: mergedShowConsideringDisabledPropRef,
      uncontrolledShow: uncontrolledShowRef,
      mergedShowArrow: mergedShowArrowRef,
      getMergedShow,
      setShow,
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
      handleFocus,
      handleBlur,
      syncPosition
    };
  },
  render() {
    const {
      positionManually,
      $slots: slots
    } = this;
    let triggerVNode;
    let popoverInside = false;
    if (!positionManually) {
      triggerVNode = getFirstSlotVNode(slots, "trigger");
      if (triggerVNode) {
        triggerVNode = cloneVNode(triggerVNode);
        triggerVNode = triggerVNode.type === Text ? h("span", [triggerVNode]) : triggerVNode;
        const handlers = {
          onClick: this.handleClick,
          onMouseenter: this.handleMouseEnter,
          onMouseleave: this.handleMouseLeave,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur
        };
        if (triggerVNode.type?.__popover__) {
          popoverInside = true;
          if (!triggerVNode.props) triggerVNode.props = {
            internalSyncTargetWithParent: true,
            internalInheritedEventHandlers: []
          };
          triggerVNode.props.internalSyncTargetWithParent = true;
          if (!triggerVNode.props.internalInheritedEventHandlers) triggerVNode.props.internalInheritedEventHandlers = [handlers];else triggerVNode.props.internalInheritedEventHandlers = [handlers, ...triggerVNode.props.internalInheritedEventHandlers];
        } else {
          const {
            internalInheritedEventHandlers
          } = this;
          const ascendantAndCurrentHandlers = [handlers, ...internalInheritedEventHandlers];
          appendEvents(triggerVNode, internalInheritedEventHandlers ? "nested" : positionManually ? "manual" : this.trigger, {
            onBlur: e => {
              ascendantAndCurrentHandlers.forEach(_handlers => {
                _handlers.onBlur(e);
              });
            },
            onFocus: e => {
              ascendantAndCurrentHandlers.forEach(_handlers => {
                _handlers.onFocus(e);
              });
            },
            onClick: e => {
              ascendantAndCurrentHandlers.forEach(_handlers => {
                _handlers.onClick(e);
              });
            },
            onMouseenter: e => {
              ascendantAndCurrentHandlers.forEach(_handlers => {
                _handlers.onMouseenter(e);
              });
            },
            onMouseleave: e => {
              ascendantAndCurrentHandlers.forEach(_handlers => {
                _handlers.onMouseleave(e);
              });
            }
          });
        }
      }
    }
    return openBlock(), createBlock(VBinder, {
      ref: "binderInstRef",
      syncTarget: !popoverInside,
      syncTargetWithParent: this.internalSyncTargetWithParent
    }, {
      default: () => {
        this.mergedShowConsideringDisabledProp;
        const mergedShow = this.getMergedShow();
        return [this.internalTrapFocus && mergedShow ? withDirectives((openBlock(), createElementBlock("div", _hoisted_1)), [[zindexable, {
          enabled: mergedShow,
          zIndex: this.zIndex
        }]]) : null, positionManually ? null : h(VTarget, null, {
          default: () => triggerVNode
        }), h(PopoverBody_default, keep(this.$props, bodyPropKeys, {
          ...this.$attrs,
          showArrow: this.mergedShowArrow,
          show: mergedShow
        }), {
          default: () => this.$slots.default?.(),
          header: () => this.$slots.header?.(),
          footer: () => this.$slots.footer?.()
        })];
      }
    }, 1032, ["syncTarget", "syncTargetWithParent"]);
  }
});
//#endregion
export { Popover_default as default, popoverBaseProps, popoverProps };