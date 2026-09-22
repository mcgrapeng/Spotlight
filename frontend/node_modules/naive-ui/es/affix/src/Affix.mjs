import { warn } from "../../_utils/naive/warn.mjs";
import { keysOf } from "../../_utils/vue/keysOf.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useStyle from "../../_mixins/use-style.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { getRect, getScrollTop } from "./utils.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { beforeNextFrameOnce, unwrapElement } from "seemly";
import { computed, createElementBlock, defineComponent, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref } from "vue";
//#region src/affix/src/Affix.tsx
const affixProps = {
  listenTo: [String, Object, Function],
  top: Number,
  bottom: Number,
  triggerTop: Number,
  triggerBottom: Number,
  position: {
    type: String,
    default: "fixed"
  },
  offsetTop: {
    type: Number,
    validator: () => {
      if (process.env.NODE_ENV !== "production") warn("affix", "`offset-top` is deprecated, please use `trigger-top` instead.");
      return true;
    },
    default: void 0
  },
  offsetBottom: {
    type: Number,
    validator: () => {
      if (process.env.NODE_ENV !== "production") warn("affix", "`offset-bottom` is deprecated, please use `trigger-bottom` instead.");
      return true;
    },
    default: void 0
  },
  target: {
    type: Function,
    validator: () => {
      if (process.env.NODE_ENV !== "production") warn("affix", "`target` is deprecated, please use `listen-to` instead.");
      return true;
    },
    default: void 0
  }
};
const affixPropKeys = keysOf(affixProps);
var Affix_default = defineComponent({
  name: "Affix",
  props: affixProps,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    useStyle("-affix", index_cssr_default, mergedClsPrefixRef);
    let scrollTarget = null;
    const stickToTopRef = ref(false);
    const stickToBottomRef = ref(false);
    const bottomAffixedTriggerScrollTopRef = ref(null);
    const topAffixedTriggerScrollTopRef = ref(null);
    const affixedRef = computed(() => {
      return stickToBottomRef.value || stickToTopRef.value;
    });
    const mergedOffsetTopRef = computed(() => {
      return props.triggerTop ?? props.offsetTop ?? props.top;
    });
    const mergedTopRef = computed(() => {
      return props.top ?? props.triggerTop ?? props.offsetTop;
    });
    const mergedBottomRef = computed(() => {
      return props.bottom ?? props.triggerBottom ?? props.offsetBottom;
    });
    const mergedOffsetBottomRef = computed(() => {
      return props.triggerBottom ?? props.offsetBottom ?? props.bottom;
    });
    const selfRef = ref(null);
    const init = () => {
      const {
        target: getScrollTarget,
        listenTo
      } = props;
      if (getScrollTarget) scrollTarget = getScrollTarget();else if (listenTo) scrollTarget = unwrapElement(listenTo);else scrollTarget = document;
      if (scrollTarget) {
        scrollTarget.addEventListener("scroll", handleScroll);
        handleScroll();
      } else if (process.env.NODE_ENV !== "production") warn("affix", "Target to be listened to is not valid.");
    };
    function handleScroll() {
      beforeNextFrameOnce(_handleScroll);
    }
    function _handleScroll() {
      const {
        value: selfEl
      } = selfRef;
      if (!scrollTarget || !selfEl) return;
      const scrollTop = getScrollTop(scrollTarget);
      if (affixedRef.value) {
        if (topAffixedTriggerScrollTopRef.value !== null && scrollTop < topAffixedTriggerScrollTopRef.value) {
          stickToTopRef.value = false;
          topAffixedTriggerScrollTopRef.value = null;
        }
        if (bottomAffixedTriggerScrollTopRef.value !== null && scrollTop > bottomAffixedTriggerScrollTopRef.value) {
          stickToBottomRef.value = false;
          bottomAffixedTriggerScrollTopRef.value = null;
        }
        return;
      }
      const containerRect = getRect(scrollTarget);
      const affixRect = selfEl.getBoundingClientRect();
      const pxToTop = affixRect.top - containerRect.top;
      const pxToBottom = containerRect.bottom - affixRect.bottom;
      const mergedOffsetTop = mergedOffsetTopRef.value;
      const mergedOffsetBottom = mergedOffsetBottomRef.value;
      if (mergedOffsetTop !== void 0 && pxToTop <= mergedOffsetTop) {
        stickToTopRef.value = true;
        topAffixedTriggerScrollTopRef.value = scrollTop - (mergedOffsetTop - pxToTop);
      } else {
        stickToTopRef.value = false;
        topAffixedTriggerScrollTopRef.value = null;
      }
      if (mergedOffsetBottom !== void 0 && pxToBottom <= mergedOffsetBottom) {
        stickToBottomRef.value = true;
        bottomAffixedTriggerScrollTopRef.value = scrollTop + mergedOffsetBottom - pxToBottom;
      } else {
        stickToBottomRef.value = false;
        bottomAffixedTriggerScrollTopRef.value = null;
      }
    }
    onMounted(() => {
      init();
    });
    onBeforeUnmount(() => {
      if (!scrollTarget) return;
      scrollTarget.removeEventListener("scroll", handleScroll);
    });
    return {
      selfRef,
      affixed: affixedRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedstyle: computed(() => {
        const style = {};
        if (stickToTopRef.value && mergedOffsetTopRef.value !== void 0 && mergedTopRef.value !== void 0) style.top = `${mergedTopRef.value}px`;
        if (stickToBottomRef.value && mergedOffsetBottomRef.value !== void 0 && mergedBottomRef.value !== void 0) style.bottom = `${mergedBottomRef.value}px`;
        return style;
      })
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      ref: "selfRef",
      class: normalizeClass$1([`${mergedClsPrefix}-affix`, {
        [`${mergedClsPrefix}-affix--affixed`]: this.affixed,
        [`${mergedClsPrefix}-affix--absolute-positioned`]: this.position === "absolute"
      }]),
      style: normalizeStyle(this.mergedstyle)
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { affixPropKeys, affixProps, Affix_default as default };