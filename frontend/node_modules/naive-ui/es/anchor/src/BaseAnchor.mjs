import { keysOf } from "../../_utils/vue/keysOf.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import { anchorInjectionKey } from "./Link.mjs";
import { getOffset } from "./utils.mjs";
import { unwrapElement } from "seemly";
import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, nextTick, onBeforeUnmount, onMounted, openBlock, provide, ref, toRef, watch } from "vue";
import { onFontsReady } from "vooks";
//#region src/anchor/src/BaseAnchor.tsx
const baseAnchorProps = {
  type: {
    type: String,
    default: "rail"
  },
  showRail: {
    type: Boolean,
    default: true
  },
  showBackground: {
    type: Boolean,
    default: true
  },
  bound: {
    type: Number,
    default: 12
  },
  internalScrollable: Boolean,
  ignoreGap: Boolean,
  offsetTarget: [String, Object, Function]
};
const baseAnchorPropKeys = keysOf(baseAnchorProps);
var BaseAnchor_default = defineComponent({
  name: "BaseAnchor",
  props: {
    ...baseAnchorProps,
    mergedClsPrefix: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const collectedLinkHrefs = [];
    const titleEls = [];
    const activeHrefRef = ref(null);
    const slotRef = ref(null);
    const barRef = ref(null);
    const selfRef = ref(null);
    let skipScrollHandling = false;
    const isBlockTypeRef = computed(() => {
      return props.type === "block";
    });
    const mergedShowRailRef = computed(() => {
      return !isBlockTypeRef.value && props.showRail;
    });
    function disableTransitionOneTick() {
      const {
        value: barEl
      } = barRef;
      const {
        value: slotEl
      } = slotRef;
      if (barEl) barEl.style.transition = "none";
      if (slotEl) slotEl.style.transition = "none";
      if (titleEls) titleEls.forEach(titleEl => {
        titleEl.style.transition = "none";
      });
      nextTick(() => {
        const {
          value: nextBarEl
        } = barRef;
        const {
          value: nextSlotEl
        } = slotRef;
        if (nextBarEl) {
          nextBarEl.offsetWidth;
          nextBarEl.style.transition = "";
        }
        if (nextSlotEl) {
          nextSlotEl.offsetWidth;
          nextSlotEl.style.transition = "";
        }
        if (titleEls) titleEls.forEach(titleEl => {
          titleEl.offsetWidth;
          titleEl.style.transition = "";
        });
      });
    }
    function updateBarPosition(linkTitleEl, transition = true) {
      const {
        value: barEl
      } = barRef;
      const {
        value: slotEl
      } = slotRef;
      const {
        value: selfEl
      } = selfRef;
      if (!selfEl || !barEl) return;
      if (!transition) {
        barEl.style.transition = "none";
        if (slotEl) slotEl.style.transition = "none";
      }
      const {
        offsetHeight,
        offsetWidth
      } = linkTitleEl;
      const {
        top: linkTitleClientTop,
        left: linkTitleClientLeft
      } = linkTitleEl.getBoundingClientRect();
      const {
        top: anchorClientTop,
        left: anchorClientLeft
      } = selfEl.getBoundingClientRect();
      const offsetTop = linkTitleClientTop - anchorClientTop;
      const offsetLeft = linkTitleClientLeft - anchorClientLeft;
      barEl.style.top = `${offsetTop}px`;
      barEl.style.height = `${offsetHeight}px`;
      if (slotEl) {
        slotEl.style.top = `${offsetTop}px`;
        slotEl.style.height = `${offsetHeight}px`;
        slotEl.style.maxWidth = `${offsetWidth + offsetLeft}px`;
      }
      barEl.offsetHeight;
      if (slotEl) slotEl.offsetHeight;
      if (!transition) {
        barEl.style.transition = "";
        if (slotEl) slotEl.style.transition = "";
      }
    }
    let currentThrottleTimerId;
    let hasTrailingThrottledTask = false;
    let isInThrottledPeriod = false;
    const handleScroll = () => {
      if (isInThrottledPeriod) hasTrailingThrottledTask = true;else {
        if (skipScrollHandling) return;
        _handleScroll(true);
        isInThrottledPeriod = true;
        clearTimeout(currentThrottleTimerId);
        currentThrottleTimerId = setTimeout(() => {
          isInThrottledPeriod = false;
          if (hasTrailingThrottledTask) {
            hasTrailingThrottledTask = false;
            handleScroll();
          }
        }, 128);
      }
    };
    function setActiveHref(href, transition = true) {
      const idMatchResult = /^#([^#]+)$/.exec(href);
      if (!idMatchResult) return;
      const linkEl = document.getElementById(idMatchResult[1]);
      if (!linkEl) return;
      skipScrollHandling = true;
      activeHrefRef.value = href;
      linkEl.scrollIntoView();
      if (!transition) disableTransitionOneTick();
      hasTrailingThrottledTask = false;
      setTimeout(() => {
        skipScrollHandling = false;
      }, 0);
    }
    function _handleScroll(transition = true) {
      const links = [];
      const offsetTarget = unwrapElement(props.offsetTarget ?? document);
      collectedLinkHrefs.forEach(href => {
        const idMatchResult = /#([^#]+)$/.exec(href);
        if (!idMatchResult) return;
        const linkEl = document.getElementById(idMatchResult[1]);
        if (linkEl && offsetTarget) {
          const {
            top,
            height
          } = getOffset(linkEl, offsetTarget);
          links.push({
            top,
            height,
            href
          });
        }
      });
      links.sort((a, b) => {
        if (a.top > b.top) return 1;else if (a.top === b.top && a.height < b.height) return -1;
        return -1;
      });
      const currentActiveHref = activeHrefRef.value;
      const {
        bound,
        ignoreGap
      } = props;
      const activeLink = links.reduce((prevLink, link) => {
        if (link.top + link.height < 0) {
          if (ignoreGap) return link;else return prevLink;
        }
        if (link.top <= bound) {
          if (prevLink === null) return link;else if (link.top === prevLink.top) {
            if (link.href === currentActiveHref) return link;else return prevLink;
          } else if (link.top > prevLink.top) return link;else return prevLink;
        }
        return prevLink;
      }, null);
      if (!transition) disableTransitionOneTick();
      if (activeLink) activeHrefRef.value = activeLink.href;else activeHrefRef.value = null;
    }
    provide(anchorInjectionKey, {
      activeHref: activeHrefRef,
      mergedClsPrefix: toRef(props, "mergedClsPrefix"),
      updateBarPosition,
      setActiveHref,
      collectedLinkHrefs,
      titleEls
    });
    onMounted(() => {
      document.addEventListener("scroll", handleScroll, true);
      setActiveHref(window.location.hash);
      _handleScroll(false);
    });
    onFontsReady(() => {
      setActiveHref(window.location.hash);
      _handleScroll(false);
    });
    onBeforeUnmount(() => {
      clearTimeout(currentThrottleTimerId);
      document.removeEventListener("scroll", handleScroll, true);
    });
    watch(activeHrefRef, value => {
      if (value === null) {
        const {
          value: slotEl
        } = slotRef;
        if (slotEl && !isBlockTypeRef.value) slotEl.style.maxWidth = "0";
      }
    });
    return {
      selfRef,
      barRef,
      slotRef,
      setActiveHref,
      activeHref: activeHrefRef,
      isBlockType: isBlockTypeRef,
      mergedShowRail: mergedShowRailRef
    };
  },
  render() {
    const {
      mergedClsPrefix,
      mergedShowRail,
      isBlockType,
      $slots
    } = this;
    const Anchor = (openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-anchor`, isBlockType && `${mergedClsPrefix}-anchor--block`, mergedShowRail && `${mergedClsPrefix}-anchor--show-rail`]),
      ref: "selfRef"
    }, [mergedShowRail && this.showBackground ? (openBlock(), createElementBlock("div", {
      key: 0,
      ref: "slotRef",
      class: normalizeClass$1(`${mergedClsPrefix}-anchor-link-background`)
    }, null, 2)) : normalizeVNode(() => null), mergedShowRail ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-anchor-rail`)
    }, [createElementVNode("div", {
      ref: "barRef",
      class: normalizeClass$1([`${mergedClsPrefix}-anchor-rail__bar`, this.activeHref !== null && `${mergedClsPrefix}-anchor-rail__bar--active`])
    }, null, 2)], 2)) : normalizeVNode(() => null), normalizeVNode(() => $slots.default?.())], 2));
    return this.internalScrollable ? (openBlock(), createBlock(Scrollbar, {
      key: 1
    }, {
      default: () => Anchor
    }, 1024)) : Anchor;
  }
});
//#endregion
export { baseAnchorPropKeys, baseAnchorProps, BaseAnchor_default as default };