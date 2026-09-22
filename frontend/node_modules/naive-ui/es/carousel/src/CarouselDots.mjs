import useConfig from "../../_mixins/use-config.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { useCarouselContext } from "./CarouselContext.mjs";
import { indexMap } from "seemly";
import { createElementBlock, defineComponent, onBeforeUpdate, openBlock, ref } from "vue";
//#region src/carousel/src/CarouselDots.tsx
const _hoisted_1 = ["aria-selected", "onClick", "onMouseenter", "onKeydown"];
var CarouselDots_default = defineComponent({
  name: "CarouselDots",
  props: {
    total: {
      type: Number,
      default: 0
    },
    currentIndex: {
      type: Number,
      default: 0
    },
    dotType: {
      type: String,
      default: "dot"
    },
    trigger: {
      type: String,
      default: "click"
    },
    keyboard: Boolean
  },
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const dotElsRef = ref([]);
    const NCarousel = useCarouselContext();
    function handleKeydown(e, current) {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          NCarousel.to(current);
          return;
      }
      if (props.keyboard) handleKeyboard(e);
    }
    function handleMouseenter(current) {
      if (props.trigger === "hover") NCarousel.to(current);
    }
    function handleClick(current) {
      if (props.trigger === "click") NCarousel.to(current);
    }
    function handleKeyboard(e) {
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
      const nodeName = document.activeElement?.nodeName.toLowerCase();
      if (nodeName === "input" || nodeName === "textarea") return;
      const {
        code: keycode
      } = e;
      const isVerticalNext = keycode === "PageUp" || keycode === "ArrowUp";
      const isVerticalPrev = keycode === "PageDown" || keycode === "ArrowDown";
      const isHorizontalNext = keycode === "PageUp" || keycode === "ArrowRight";
      const isHorizontalPrev = keycode === "PageDown" || keycode === "ArrowLeft";
      const vertical = NCarousel.isVertical();
      const wantToNext = vertical ? isVerticalNext : isHorizontalNext;
      const wantToPrev = vertical ? isVerticalPrev : isHorizontalPrev;
      if (!wantToNext && !wantToPrev) return;
      e.preventDefault();
      if (wantToNext && !NCarousel.isNextDisabled()) {
        NCarousel.next();
        focusDot(NCarousel.currentIndexRef.value);
      } else if (wantToPrev && !NCarousel.isPrevDisabled()) {
        NCarousel.prev();
        focusDot(NCarousel.currentIndexRef.value);
      }
    }
    function focusDot(index) {
      dotElsRef.value[index]?.focus();
    }
    onBeforeUpdate(() => dotElsRef.value.length = 0);
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      dotEls: dotElsRef,
      handleKeydown,
      handleMouseenter,
      handleClick
    };
  },
  render() {
    const {
      mergedClsPrefix,
      dotEls
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-carousel__dots`, `${mergedClsPrefix}-carousel__dots--${this.dotType}`]),
      role: "tablist"
    }, [normalizeVNode(() => indexMap(this.total, i => {
      const selected = i === this.currentIndex;
      return openBlock(), createElementBlock("div", {
        "aria-selected": selected,
        ref: el => dotEls.push(el),
        role: "button",
        tabindex: "0",
        class: normalizeClass$1([`${mergedClsPrefix}-carousel__dot`, selected && `${mergedClsPrefix}-carousel__dot--active`]),
        key: i,
        onClick: () => {
          this.handleClick(i);
        },
        onMouseenter: () => {
          this.handleMouseenter(i);
        },
        onKeydown: e => {
          this.handleKeydown(e, i);
        }
      }, null, 42, _hoisted_1);
    }))], 2);
  }
});
//#endregion
export { CarouselDots_default as default };