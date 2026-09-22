import { color2Class } from "../../_utils/css/color-to-class.mjs";
import { createKey } from "../../_utils/cssr/index.mjs";
import { resolveSlot, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { tagInjectionKey } from "../../tag/src/Tag.mjs";
import { isImageSupportNativeLazy } from "../../_utils/env/is-native-lazy-load.mjs";
import { observeIntersection } from "../../image/src/utils.mjs";
import avatarLight from "../styles/light.mjs";
import { avatarGroupInjectionKey } from "./context.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createBlock, createElementBlock, defineComponent, h, inject, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref, watch, watchEffect } from "vue";
import { VResizeObserver } from "vueuc";
//#region src/avatar/src/Avatar.tsx
const _hoisted_1 = ["src"];
const avatarProps = {
  ...useTheme.props,
  size: [String, Number],
  src: String,
  circle: {
    type: Boolean,
    default: void 0
  },
  objectFit: String,
  round: {
    type: Boolean,
    default: void 0
  },
  bordered: {
    type: Boolean,
    default: void 0
  },
  onError: Function,
  fallbackSrc: String,
  intersectionObserverOptions: Object,
  lazy: Boolean,
  onLoad: Function,
  renderPlaceholder: Function,
  renderFallback: Function,
  imgProps: Object,
  /** @deprecated */
  color: String
};
var Avatar_default = defineComponent({
  name: "Avatar",
  props: avatarProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const hasLoadErrorRef = ref(false);
    let memoedTextHtml = null;
    const textRef = ref(null);
    const selfRef = ref(null);
    const fitTextTransform = () => {
      const {
        value: textEl
      } = textRef;
      if (textEl) {
        if (memoedTextHtml === null || memoedTextHtml !== textEl.innerHTML) {
          memoedTextHtml = textEl.innerHTML;
          const {
            value: selfEl
          } = selfRef;
          if (selfEl) {
            const {
              offsetWidth: elWidth,
              offsetHeight: elHeight
            } = selfEl;
            const {
              offsetWidth: textWidth,
              offsetHeight: textHeight
            } = textEl;
            const radix = .9;
            const ratio = Math.min(elWidth / textWidth * radix, elHeight / textHeight * radix, 1);
            textEl.style.transform = `translateX(-50%) translateY(-50%) scale(${ratio})`;
          }
        }
      }
    };
    const NAvatarGroup = inject(avatarGroupInjectionKey, null);
    const mergedSizeRef = computed(() => {
      const {
        size
      } = props;
      if (size) return size;
      const {
        size: avatarGroupSize
      } = NAvatarGroup || {};
      if (avatarGroupSize) return avatarGroupSize;
      return "medium";
    });
    const themeRef = useTheme("Avatar", "-avatar", index_cssr_default, avatarLight, props, mergedClsPrefixRef);
    const TagInjection = inject(tagInjectionKey, null);
    const mergedRoundRef = computed(() => {
      if (NAvatarGroup) return true;
      const {
        round,
        circle
      } = props;
      if (round !== void 0 || circle !== void 0) return round || circle;
      if (TagInjection) return TagInjection.roundRef.value;
      return false;
    });
    const mergedBorderedRef = computed(() => {
      if (NAvatarGroup) return true;
      return props.bordered || false;
    });
    const cssVarsRef = computed(() => {
      const size = mergedSizeRef.value;
      const round = mergedRoundRef.value;
      const bordered = mergedBorderedRef.value;
      const {
        color: propColor
      } = props;
      const {
        self: {
          borderRadius,
          fontSize,
          color,
          border,
          colorModal,
          colorPopover
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      let height;
      if (typeof size === "number") height = `${size}px`;else height = themeRef.value.self[createKey("height", size)];
      return {
        "--n-font-size": fontSize,
        "--n-border": bordered ? border : "none",
        "--n-border-radius": round ? "50%" : borderRadius,
        "--n-color": propColor || color,
        "--n-color-modal": propColor || colorModal,
        "--n-color-popover": propColor || colorPopover,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-merged-size": `var(--n-avatar-size-override, ${height})`
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("avatar", computed(() => {
      const size = mergedSizeRef.value;
      const round = mergedRoundRef.value;
      const bordered = mergedBorderedRef.value;
      const {
        color
      } = props;
      let hash = "";
      if (size) {
        if (typeof size === "number") hash += `a${size}`;else hash += size[0];
      }
      if (round) hash += "b";
      if (bordered) hash += "c";
      if (color) hash += color2Class(color);
      return hash;
    }), cssVarsRef, props) : void 0;
    const shouldStartLoadingRef = ref(!props.lazy);
    onMounted(() => {
      if (props.lazy && props.intersectionObserverOptions) {
        let unobserve;
        const stopWatchHandle = watchEffect(() => {
          unobserve?.();
          unobserve = void 0;
          if (props.lazy) unobserve = observeIntersection(selfRef.value, props.intersectionObserverOptions, shouldStartLoadingRef);
        });
        onBeforeUnmount(() => {
          stopWatchHandle();
          unobserve?.();
        });
      }
    });
    watch(() => props.src || props.imgProps?.src, () => {
      hasLoadErrorRef.value = false;
    });
    const loadedRef = ref(!props.lazy);
    return {
      textRef,
      selfRef,
      mergedRoundRef,
      mergedClsPrefix: mergedClsPrefixRef,
      fitTextTransform,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      hasLoadError: hasLoadErrorRef,
      shouldStartLoading: shouldStartLoadingRef,
      loaded: loadedRef,
      mergedOnError: e => {
        if (!shouldStartLoadingRef.value) return;
        hasLoadErrorRef.value = true;
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
      }
    };
  },
  render() {
    const {
      $slots,
      src,
      mergedClsPrefix,
      lazy,
      onRender,
      loaded,
      hasLoadError,
      imgProps = {}
    } = this;
    onRender?.();
    let img;
    const placeholderNode = !loaded && !hasLoadError && (this.renderPlaceholder ? this.renderPlaceholder() : this.$slots.placeholder?.());
    if (this.hasLoadError) img = this.renderFallback ? this.renderFallback() : resolveSlot($slots.fallback, () => [(openBlock(), createElementBlock("img", {
      src: this.fallbackSrc,
      style: normalizeStyle({
        objectFit: this.objectFit
      })
    }, null, 12, _hoisted_1))]);else img = resolveWrappedSlot($slots.default, children => {
      if (children) return openBlock(), createBlock(VResizeObserver, {
        key: 1,
        onResize: this.fitTextTransform
      }, {
        default: () => (openBlock(), createElementBlock("span", {
          ref: "textRef",
          class: normalizeClass$1(`${mergedClsPrefix}-avatar__text`)
        }, [normalizeVNode(() => children)], 2))
      }, 1032, ["onResize"]);else if (src || imgProps.src) {
        const loadSrc = this.src || imgProps.src;
        return h("img", {
          ...imgProps,
          loading: isImageSupportNativeLazy && !this.intersectionObserverOptions && lazy ? "lazy" : "eager",
          src: lazy && this.intersectionObserverOptions ? this.shouldStartLoading ? loadSrc : void 0 : loadSrc,
          "data-image-src": loadSrc,
          onLoad: this.mergedOnLoad,
          onError: this.mergedOnError,
          style: [imgProps.style || "", {
            objectFit: this.objectFit
          }, placeholderNode ? {
            height: "0",
            width: "0",
            visibility: "hidden",
            position: "absolute"
          } : ""]
        });
      }
    });
    return openBlock(), createElementBlock("span", {
      ref: "selfRef",
      class: normalizeClass$1([`${mergedClsPrefix}-avatar`, this.themeClass]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => img), normalizeVNode(() => lazy && placeholderNode)], 6);
  }
});
//#endregion
export { avatarProps, Avatar_default as default };