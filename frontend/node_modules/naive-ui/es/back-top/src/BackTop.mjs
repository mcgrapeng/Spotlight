import { lockHtmlScrollRightCompensationRef } from "../../_utils/composable/use-lock-html-scroll.mjs";
import { formatLength } from "../../_utils/css/format-length.mjs";
import { isDocument } from "../../_utils/dom/is-document.mjs";
import { warn, warnOnce } from "../../_utils/naive/warn.mjs";
import { resolveSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import backTopLight from "../styles/light.mjs";
import BackTopIcon_default from "./BackTopIcon.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { getScrollParent, unwrapElement } from "seemly";
import { Transition, computed, createBlock, createElementBlock, defineComponent, h, mergeProps, nextTick, onBeforeUnmount, onMounted, openBlock, ref, toRef, watch, watchEffect } from "vue";
import { useIsMounted, useMergedState } from "vooks";
import { VLazyTeleport } from "vueuc";
//#region src/back-top/src/BackTop.tsx
const backTopProps = {
  ...useTheme.props,
  show: {
    type: Boolean,
    default: void 0
  },
  right: {
    type: [Number, String],
    default: 40
  },
  bottom: {
    type: [Number, String],
    default: 40
  },
  to: {
    type: [String, Object],
    default: "body"
  },
  visibilityHeight: {
    type: Number,
    default: 180
  },
  listenTo: [String, Object, Function],
  "onUpdate:show": {
    type: Function,
    default: () => {}
  },
  target: Function,
  onShow: Function,
  onHide: Function
};
var BackTop_default = defineComponent({
  name: "BackTop",
  inheritAttrs: false,
  props: backTopProps,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.target !== void 0) warnOnce("back-top", "`target` is deprecated, please use `listen-to` instead.");
      if (props.onShow !== void 0) warnOnce("back-top", "`on-show` is deprecated, please use `on-update:show` instead.");
      if (props.onHide !== void 0) warnOnce("back-top", "`on-hide` is deprecated, please use `on-update:show` instead.");
    });
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const scrollTopRef = ref(null);
    const uncontrolledShowRef = ref(false);
    watchEffect(() => {
      const {
        value: scrollTop
      } = scrollTopRef;
      if (scrollTop === null) {
        uncontrolledShowRef.value = false;
        return;
      }
      uncontrolledShowRef.value = scrollTop >= props.visibilityHeight;
    });
    const DomInfoReadyRef = ref(false);
    watch(uncontrolledShowRef, value => {
      if (DomInfoReadyRef.value) props["onUpdate:show"]?.(value);
    });
    const controlledShowRef = toRef(props, "show");
    const mergedShowRef = useMergedState(controlledShowRef, uncontrolledShowRef);
    const transitionDisabledRef = ref(true);
    const placeholderRef = ref(null);
    const styleRef = computed(() => {
      return {
        right: `calc(${formatLength(props.right)} + ${lockHtmlScrollRightCompensationRef.value})`,
        bottom: formatLength(props.bottom)
      };
    });
    let scrollElement;
    let scrollListenerRegistered;
    watch(mergedShowRef, value => {
      if (DomInfoReadyRef.value) {
        if (value) props.onShow?.();
        props.onHide?.();
      }
    });
    const themeRef = useTheme("BackTop", "-back-top", index_cssr_default, backTopLight, props, mergedClsPrefixRef);
    function init() {
      if (scrollListenerRegistered) return;
      scrollListenerRegistered = true;
      const scrollEl = props.target?.() || unwrapElement(props.listenTo) || getScrollParent(placeholderRef.value);
      if (!scrollEl) {
        if (process.env.NODE_ENV !== "production") warn("back-top", "Container of back-top element is not found. This could be a bug of naive-ui.");
        return;
      }
      scrollElement = scrollEl === document.documentElement ? document : scrollEl;
      const {
        to
      } = props;
      const target = typeof to === "string" ? document.querySelector(to) : to;
      if (process.env.NODE_ENV !== "production" && !target) warn("back-top", "Target is not found.");
      scrollElement.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    function handleClick() {
      (isDocument(scrollElement) ? document.documentElement : scrollElement).scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
    function handleScroll() {
      scrollTopRef.value = (isDocument(scrollElement) ? document.documentElement : scrollElement).scrollTop;
      if (!DomInfoReadyRef.value) nextTick(() => {
        DomInfoReadyRef.value = true;
      });
    }
    function handleAfterEnter() {
      transitionDisabledRef.value = false;
    }
    onMounted(() => {
      init();
      transitionDisabledRef.value = mergedShowRef.value;
    });
    onBeforeUnmount(() => {
      if (scrollElement) scrollElement.removeEventListener("scroll", handleScroll);
    });
    const cssVarsRef = computed(() => {
      const {
        self: {
          color,
          boxShadow,
          boxShadowHover,
          boxShadowPressed,
          iconColor,
          iconColorHover,
          iconColorPressed,
          width,
          height,
          iconSize,
          borderRadius,
          textColor
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-border-radius": borderRadius,
        "--n-height": height,
        "--n-width": width,
        "--n-box-shadow": boxShadow,
        "--n-box-shadow-hover": boxShadowHover,
        "--n-box-shadow-pressed": boxShadowPressed,
        "--n-color": color,
        "--n-icon-size": iconSize,
        "--n-icon-color": iconColor,
        "--n-icon-color-hover": iconColorHover,
        "--n-icon-color-pressed": iconColorPressed,
        "--n-text-color": textColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("back-top", void 0, cssVarsRef, props) : void 0;
    return {
      placeholderRef,
      style: styleRef,
      mergedShow: mergedShowRef,
      isMounted: useIsMounted(),
      scrollElement: ref(null),
      scrollTop: scrollTopRef,
      DomInfoReady: DomInfoReadyRef,
      transitionDisabled: transitionDisabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      handleAfterEnter,
      handleScroll,
      handleClick,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      ref: "placeholderRef",
      class: normalizeClass$1(`${mergedClsPrefix}-back-top-placeholder`),
      style: "display: none",
      "aria-hidden": true
    }, [(openBlock(), createBlock(VLazyTeleport, {
      to: this.to,
      show: this.mergedShow
    }, {
      default: () => (openBlock(), createBlock(Transition, {
        name: "fade-in-scale-up-transition",
        appear: this.isMounted,
        onAfterEnter: this.handleAfterEnter
      }, {
        default: () => {
          this.onRender?.();
          return this.mergedShow ? h("div", mergeProps(this.$attrs, {
            class: [`${mergedClsPrefix}-back-top`, this.themeClass, this.transitionDisabled && `${mergedClsPrefix}-back-top--transition-disabled`],
            style: [this.style, this.cssVars],
            onClick: this.handleClick
          }), resolveSlot(this.$slots.default, () => [(openBlock(), createBlock(Icon_default, {
            clsPrefix: mergedClsPrefix
          }, {
            default: BackTopIcon_default
          }, 1032, ["clsPrefix"]))])) : null;
        }
      }, 1032, ["appear", "onAfterEnter"]))
    }, 1032, ["to", "show"]))], 2);
  }
});
//#endregion
export { backTopProps, BackTop_default as default };