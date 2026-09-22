import useConfig from "../../_mixins/use-config.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import marqueeLight from "../styles/light.mjs";
import { marqueeProps } from "./props.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { repeat } from "seemly";
import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, nextTick, normalizeStyle, openBlock, ref } from "vue";
import { VResizeObserver } from "vueuc";
//#region src/marquee/src/Marquee.tsx
const _hoisted_1 = ["onAnimationiteration"];
const _hoisted_2 = ["onAnimationiteration"];
var Marquee_default = defineComponent({
  name: "Marquee",
  props: marqueeProps,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    useTheme("Marquee", "-marquee", index_cssr_default, marqueeLight, props, mergedClsPrefixRef);
    const containerElRef = ref(null);
    const contentWidthRef = ref(-1);
    const containerWidthRef = ref(-1);
    const playStateRef = ref("running");
    const repeatCountInOneGroupRef = computed(() => {
      if (!props.autoFill) return 1;
      const {
        value: contentWidth
      } = contentWidthRef;
      const {
        value: containerWidth
      } = containerWidthRef;
      if (contentWidth === -1 || containerWidth === -1) return 1;
      return Math.ceil(containerWidthRef.value / contentWidth);
    });
    const durationRef = computed(() => {
      const {
        value: contentWidth
      } = contentWidthRef;
      if (contentWidth === -1) return 0;
      return contentWidth * repeatCountInOneGroupRef.value / props.speed;
    });
    const animationCssVarsRef = computed(() => {
      return {
        "--n-play": playStateRef.value,
        "--n-direction": "normal",
        "--n-duration": `${durationRef.value}s`,
        "--n-delay": "0s",
        "--n-iteration-count": "infinite",
        "--n-min-width": "auto"
      };
    });
    function resetScrollState() {
      playStateRef.value = "paused";
      nextTick().then(() => {
        containerElRef.value?.offsetTop;
        playStateRef.value = "running";
      });
    }
    function handleContainerResize(entry) {
      containerWidthRef.value = entry.contentRect.width;
    }
    function handleContentResize(entry) {
      contentWidthRef.value = entry.contentRect.width;
    }
    function handleAnimationIteration() {
      resetScrollState();
    }
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      animationCssVars: animationCssVarsRef,
      containerElRef,
      repeatCountInOneGroup: repeatCountInOneGroupRef,
      handleContainerResize,
      handleContentResize,
      handleAnimationIteration
    };
  },
  render() {
    const {
      $slots,
      mergedClsPrefix,
      animationCssVars,
      repeatCountInOneGroup,
      handleAnimationIteration
    } = this;
    const originalNode = (openBlock(), createBlock(VResizeObserver, {
      onResize: this.handleContentResize
    }, {
      default: () => (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-marquee__item ${mergedClsPrefix}-marquee__original-item`)
      }, [normalizeVNode(() => $slots.default?.())], 2))
    }, 1032, ["onResize"]));
    const mirrorNode = (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-marquee__item`)
    }, [normalizeVNode(() => $slots.default?.())], 2));
    if (this.autoFill) return openBlock(), createBlock(VResizeObserver, {
      key: 1,
      onResize: this.handleContainerResize
    }, {
      default: () => (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-marquee ${mergedClsPrefix}-marquee--auto-fill`),
        ref: "containerElRef",
        style: normalizeStyle(animationCssVars)
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-marquee__group`),
        onAnimationiteration: handleAnimationIteration
      }, [normalizeVNode(() => originalNode), normalizeVNode(() => repeat(repeatCountInOneGroup - 1, mirrorNode))], 42, _hoisted_1), createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-marquee__group`)
      }, [normalizeVNode(() => repeat(repeatCountInOneGroup, mirrorNode))], 2)], 6))
    }, 1032, ["onResize"]);else return openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1([`${mergedClsPrefix}-marquee`]),
      ref: "containerElRef",
      style: normalizeStyle(animationCssVars)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-marquee__group`),
      onAnimationiteration: handleAnimationIteration
    }, [normalizeVNode(() => originalNode)], 42, _hoisted_2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-marquee__group`)
    }, [normalizeVNode(() => mirrorNode)], 2)], 6);
  }
});
//#endregion
export { Marquee_default as default };