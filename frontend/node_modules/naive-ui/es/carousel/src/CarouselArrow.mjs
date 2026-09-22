import useConfig from "../../_mixins/use-config.mjs";
import { createVNodeCache, normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { useCarouselContext } from "./CarouselContext.mjs";
import { createElementBlock, createElementVNode, defineComponent, openBlock } from "vue";
//#region src/carousel/src/CarouselArrow.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["onClick"];
function renderBackwardIcon() {
  return (() => {
    const _cache = createVNodeCache("f6e8125451d09846");
    return _cache[0] || (_cache[0] = createElementVNode("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16"
    }, [createElementVNode("g", {
      fill: "none"
    }, [createElementVNode("path", {
      d: "M10.26 3.2a.75.75 0 0 1 .04 1.06L6.773 8l3.527 3.74a.75.75 0 1 1-1.1 1.02l-4-4.25a.75.75 0 0 1 0-1.02l4-4.25a.75.75 0 0 1 1.06-.04z",
      fill: "currentColor"
    })])], -1));
  })();
}
function renderForwardIcon() {
  return (() => {
    const _cache = createVNodeCache("32cda25b09864a17");
    return _cache[0] || (_cache[0] = createElementVNode("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16"
    }, [createElementVNode("g", {
      fill: "none"
    }, [createElementVNode("path", {
      d: "M5.74 3.2a.75.75 0 0 0-.04 1.06L9.227 8L5.7 11.74a.75.75 0 1 0 1.1 1.02l4-4.25a.75.75 0 0 0 0-1.02l-4-4.25a.75.75 0 0 0-1.06-.04z",
      fill: "currentColor"
    })])], -1));
  })();
}
var CarouselArrow_default = defineComponent({
  name: "CarouselArrow",
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const {
      isVertical,
      isPrevDisabled,
      isNextDisabled,
      prev,
      next
    } = useCarouselContext();
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      isVertical,
      isPrevDisabled,
      isNextDisabled,
      prev,
      next
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-carousel__arrow-group`)
    }, [createElementVNode("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-carousel__arrow`, this.isPrevDisabled() && `${mergedClsPrefix}-carousel__arrow--disabled`]),
      role: "button",
      onClick: this.prev
    }, [normalizeVNode(() => renderBackwardIcon())], 10, _hoisted_1), createElementVNode("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-carousel__arrow`, this.isNextDisabled() && `${mergedClsPrefix}-carousel__arrow--disabled`]),
      role: "button",
      onClick: this.next
    }, [normalizeVNode(() => renderForwardIcon())], 10, _hoisted_2)], 2);
  }
});
//#endregion
export { CarouselArrow_default as default };