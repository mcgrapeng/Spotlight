import { drawerBodyInjectionKey } from "../../drawer/src/interface.mjs";
import { modalBodyInjectionKey } from "../../modal/src/interface.mjs";
import { popoverBodyInjectionKey } from "./interface.mjs";
import { useAdjustedTo } from "../../_utils/composable/use-adjusted-to.mjs";
import { formatLength } from "../../_utils/css/format-length.mjs";
import { isJsdom } from "../../_utils/env/is-jsdom.mjs";
import { isSlotEmpty, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlot, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { XScrollbar } from "../../_internal/scrollbar/src/Scrollbar.mjs";
import popoverLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { getPreciseEventTarget } from "seemly";
import { Fragment, Transition, computed, createBlock, createElementBlock, createElementVNode, defineComponent, h, inject, mergeProps, normalizeStyle, onBeforeUnmount, openBlock, provide, ref, toRef, vShow, watch, watchEffect, withDirectives } from "vue";
import { VFocusTrap, VFollower } from "vueuc";
import { clickoutside, mousemoveoutside } from "vdirs";
//#region src/popover/src/PopoverBody.tsx
const popoverBodyProps = {
  ...useTheme.props,
  to: useAdjustedTo.propTo,
  show: Boolean,
  trigger: String,
  showArrow: Boolean,
  delay: Number,
  duration: Number,
  raw: Boolean,
  arrowPointToCenter: Boolean,
  arrowClass: String,
  arrowStyle: [String, Object],
  arrowWrapperClass: String,
  arrowWrapperStyle: [String, Object],
  displayDirective: String,
  x: Number,
  y: Number,
  flip: Boolean,
  overlap: Boolean,
  placement: String,
  width: [Number, String],
  keepAliveOnHover: Boolean,
  scrollable: Boolean,
  contentClass: String,
  contentStyle: [Object, String],
  headerClass: String,
  headerStyle: [Object, String],
  footerClass: String,
  footerStyle: [Object, String],
  internalDeactivateImmediately: Boolean,
  animated: Boolean,
  onClickoutside: Function,
  internalTrapFocus: Boolean,
  internalOnAfterLeave: Function,
  minWidth: Number,
  maxWidth: Number
};
function renderArrow({
  arrowClass,
  arrowStyle,
  arrowWrapperClass,
  arrowWrapperStyle,
  clsPrefix
}) {
  return openBlock(), createElementBlock("div", {
    key: "__popover-arrow__",
    style: normalizeStyle(arrowWrapperStyle),
    class: normalizeClass$1([`${clsPrefix}-popover-arrow-wrapper`, arrowWrapperClass])
  }, [createElementVNode("div", {
    class: normalizeClass$1([`${clsPrefix}-popover-arrow`, arrowClass]),
    style: normalizeStyle(arrowStyle)
  }, null, 6)], 6);
}
var PopoverBody_default = defineComponent({
  name: "PopoverBody",
  inheritAttrs: false,
  props: popoverBodyProps,
  setup(props, {
    slots,
    attrs
  }) {
    const {
      namespaceRef,
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Popover", "-popover", index_cssr_default, popoverLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Popover", mergedRtlRef, mergedClsPrefixRef);
    const followerRef = ref(null);
    const NPopover = inject("NPopover");
    const bodyRef = ref(null);
    const followerEnabledRef = ref(props.show);
    const displayedRef = ref(false);
    watchEffect(() => {
      const {
        show
      } = props;
      if (show && !isJsdom() && !props.internalDeactivateImmediately) displayedRef.value = true;
    });
    const directivesRef = computed(() => {
      const {
        trigger,
        onClickoutside
      } = props;
      const directives = [];
      const {
        positionManuallyRef: {
          value: positionManually
        }
      } = NPopover;
      if (!positionManually) {
        if (trigger === "click" && !onClickoutside) directives.push([clickoutside, handleClickOutside, void 0, {
          capture: true
        }]);
        if (trigger === "hover") directives.push([mousemoveoutside, handleMouseMoveOutside]);
      }
      if (onClickoutside) directives.push([clickoutside, handleClickOutside, void 0, {
        capture: true
      }]);
      if (props.displayDirective === "show" || props.animated && displayedRef.value) directives.push([vShow, props.show]);
      return directives;
    });
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut,
          cubicBezierEaseIn,
          cubicBezierEaseOut
        },
        self: {
          space,
          spaceArrow,
          padding,
          fontSize,
          textColor,
          dividerColor,
          color,
          boxShadow,
          borderRadius,
          arrowHeight,
          arrowOffset,
          arrowOffsetVertical
        }
      } = themeRef.value;
      return {
        "--n-box-shadow": boxShadow,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-bezier-ease-in": cubicBezierEaseIn,
        "--n-bezier-ease-out": cubicBezierEaseOut,
        "--n-font-size": fontSize,
        "--n-text-color": textColor,
        "--n-color": color,
        "--n-divider-color": dividerColor,
        "--n-border-radius": borderRadius,
        "--n-arrow-height": arrowHeight,
        "--n-arrow-offset": arrowOffset,
        "--n-arrow-offset-vertical": arrowOffsetVertical,
        "--n-padding": padding,
        "--n-space": space,
        "--n-space-arrow": spaceArrow
      };
    });
    const styleRef = computed(() => {
      const width = props.width === "trigger" ? void 0 : formatLength(props.width);
      const style = [];
      if (width) style.push({
        width
      });
      const {
        maxWidth,
        minWidth
      } = props;
      if (maxWidth) style.push({
        maxWidth: formatLength(maxWidth)
      });
      if (minWidth) style.push({
        maxWidth: formatLength(minWidth)
      });
      if (!inlineThemeDisabled) style.push(cssVarsRef.value);
      return style;
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("popover", void 0, cssVarsRef, props) : void 0;
    NPopover.setBodyInstance({
      syncPosition
    });
    onBeforeUnmount(() => {
      NPopover.setBodyInstance(null);
    });
    watch(toRef(props, "show"), value => {
      if (props.animated) return;
      if (value) followerEnabledRef.value = true;else followerEnabledRef.value = false;
    });
    function syncPosition() {
      followerRef.value?.syncPosition();
    }
    function handleMouseEnter(e) {
      if (props.trigger === "hover" && props.keepAliveOnHover && props.show) NPopover.handleMouseEnter(e);
    }
    function handleMouseLeave(e) {
      if (props.trigger === "hover" && props.keepAliveOnHover) NPopover.handleMouseLeave(e);
    }
    function handleMouseMoveOutside(e) {
      if (props.trigger === "hover" && !getTriggerElement().contains(getPreciseEventTarget(e))) NPopover.handleMouseMoveOutside(e);
    }
    function handleClickOutside(e) {
      if (props.trigger === "click" && !getTriggerElement().contains(getPreciseEventTarget(e)) || props.onClickoutside) NPopover.handleClickOutside(e);
    }
    function getTriggerElement() {
      return NPopover.getTriggerElement();
    }
    provide(popoverBodyInjectionKey, bodyRef);
    provide(drawerBodyInjectionKey, null);
    provide(modalBodyInjectionKey, null);
    function renderContentNode() {
      themeClassHandle?.onRender();
      if (!(props.displayDirective === "show" || props.show || props.animated && displayedRef.value)) return null;
      let contentNode;
      const renderBody = NPopover.internalRenderBodyRef.value;
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      if (!renderBody) {
        const {
          value: extraClass
        } = NPopover.extraClassRef;
        const {
          internalTrapFocus
        } = props;
        const hasHeaderOrFooter = !isSlotEmpty(slots.header) || !isSlotEmpty(slots.footer);
        const renderContentInnerNode = () => {
          const body = hasHeaderOrFooter ? (openBlock(), createElementBlock(Fragment, {
            key: 1
          }, [normalizeVNode(() => resolveWrappedSlot(slots.header, children => {
            return children ? (openBlock(), createElementBlock("div", {
              key: 2,
              class: normalizeClass$1([`${mergedClsPrefix}-popover__header`, props.headerClass]),
              style: normalizeStyle(props.headerStyle)
            }, [normalizeVNode(() => children)], 6)) : null;
          })), normalizeVNode(() => resolveWrappedSlot(slots.default, children => {
            return children ? (openBlock(), createElementBlock("div", {
              key: 3,
              class: normalizeClass$1([`${mergedClsPrefix}-popover__content`, props.contentClass]),
              style: normalizeStyle(props.contentStyle)
            }, [normalizeVNode(() => slots.default?.())], 6)) : null;
          })), normalizeVNode(() => resolveWrappedSlot(slots.footer, children => {
            return children ? (openBlock(), createElementBlock("div", {
              key: 4,
              class: normalizeClass$1([`${mergedClsPrefix}-popover__footer`, props.footerClass]),
              style: normalizeStyle(props.footerStyle)
            }, [normalizeVNode(() => children)], 6)) : null;
          }))], 64)) : props.scrollable ? slots.default?.() : (openBlock(), createElementBlock("div", {
            key: 5,
            class: normalizeClass$1([`${mergedClsPrefix}-popover__content`, props.contentClass]),
            style: normalizeStyle(props.contentStyle)
          }, [normalizeVNode(() => slots.default?.())], 6));
          return [props.scrollable ? (openBlock(), createBlock(XScrollbar, {
            key: 6,
            themeOverrides: themeRef.value.peerOverrides.Scrollbar,
            theme: themeRef.value.peers.Scrollbar,
            contentClass: hasHeaderOrFooter ? void 0 : `${mergedClsPrefix}-popover__content ${props.contentClass ?? ""}`,
            contentStyle: hasHeaderOrFooter ? void 0 : props.contentStyle
          }, {
            default: () => body
          }, 1032, ["themeOverrides", "theme", "contentClass", "contentStyle"])) : body, props.showArrow ? renderArrow({
            arrowClass: props.arrowClass,
            arrowStyle: props.arrowStyle,
            arrowWrapperClass: props.arrowWrapperClass,
            arrowWrapperStyle: props.arrowWrapperStyle,
            clsPrefix: mergedClsPrefix
          }) : null];
        };
        contentNode = h("div", mergeProps({
          class: [`${mergedClsPrefix}-popover`, `${mergedClsPrefix}-popover-shared`, rtlEnabledRef?.value && `${mergedClsPrefix}-popover--rtl`, themeClassHandle?.themeClass.value, extraClass.map(v => `${mergedClsPrefix}-${v}`), {
            [`${mergedClsPrefix}-popover--scrollable`]: props.scrollable,
            [`${mergedClsPrefix}-popover--show-header-or-footer`]: hasHeaderOrFooter,
            [`${mergedClsPrefix}-popover--raw`]: props.raw,
            [`${mergedClsPrefix}-popover-shared--overlap`]: props.overlap,
            [`${mergedClsPrefix}-popover-shared--show-arrow`]: props.showArrow,
            [`${mergedClsPrefix}-popover-shared--center-arrow`]: props.arrowPointToCenter
          }],
          ref: bodyRef,
          style: styleRef.value,
          onKeydown: NPopover.handleKeydown,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave
        }, attrs), internalTrapFocus ? (openBlock(), createBlock(VFocusTrap, {
          key: 7,
          active: props.show,
          autoFocus: true
        }, {
          default: renderContentInnerNode
        }, 1032, ["active"])) : renderContentInnerNode());
      } else contentNode = renderBody([`${mergedClsPrefix}-popover-shared`, rtlEnabledRef?.value && `${mergedClsPrefix}-popover--rtl`, themeClassHandle?.themeClass.value, props.overlap && `${mergedClsPrefix}-popover-shared--overlap`, props.showArrow && `${mergedClsPrefix}-popover-shared--show-arrow`, props.arrowPointToCenter && `${mergedClsPrefix}-popover-shared--center-arrow`], bodyRef, styleRef.value, handleMouseEnter, handleMouseLeave);
      return withDirectives(contentNode, directivesRef.value);
    }
    return {
      displayed: displayedRef,
      namespace: namespaceRef,
      isMounted: NPopover.isMountedRef,
      zIndex: NPopover.zIndexRef,
      followerRef,
      adjustedTo: useAdjustedTo(props),
      followerEnabled: followerEnabledRef,
      renderContentNode
    };
  },
  render() {
    return openBlock(), createBlock(VFollower, {
      ref: "followerRef",
      zIndex: this.zIndex,
      show: this.show,
      enabled: this.followerEnabled,
      to: this.adjustedTo,
      x: this.x,
      y: this.y,
      flip: this.flip,
      placement: this.placement,
      containerClass: this.namespace,
      overlap: this.overlap,
      width: this.width === "trigger" ? "target" : void 0,
      teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey
    }, {
      _: 1,
      default: normalizeSlot(() => {
        return this.animated ? (openBlock(), createBlock(Transition, {
          key: 8,
          name: "popover-transition",
          appear: this.isMounted,
          onEnter: () => {
            this.followerEnabled = true;
          },
          onAfterLeave: () => {
            this.internalOnAfterLeave?.();
            this.followerEnabled = false;
            this.displayed = false;
          }
        }, {
          default: this.renderContentNode
        }, 1032, ["appear", "onEnter", "onAfterLeave"])) : this.renderContentNode();
      })
    }, 8, ["zIndex", "show", "enabled", "to", "x", "y", "flip", "placement", "containerClass", "overlap", "width", "teleportDisabled"]);
  }
});
//#endregion
export { PopoverBody_default as default, popoverBodyProps, renderArrow };