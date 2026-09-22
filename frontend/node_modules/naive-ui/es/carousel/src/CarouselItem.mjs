import useConfig from "../../_mixins/use-config.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { useCarouselContext } from "./CarouselContext.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref } from "vue";
import { camelCase } from "lodash-es";
//#region src/carousel/src/CarouselItem.tsx
const _hoisted_1 = ["data-index", "aria-hidden", "onClickCapture"];
const CarouselItemName = "CarouselItem";
function isCarouselItem(child) {
  return child.type?.name === CarouselItemName;
}
var CarouselItem_default = defineComponent({
  name: CarouselItemName,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const NCarousel = useCarouselContext(camelCase(CarouselItemName), `n-${camelCase(CarouselItemName)}`);
    const selfElRef = ref();
    const indexRef = computed(() => {
      const {
        value: selfEl
      } = selfElRef;
      return selfEl ? NCarousel.getSlideIndex(selfEl) : -1;
    });
    const isPrevRef = computed(() => NCarousel.isPrev(indexRef.value));
    const isNextRef = computed(() => NCarousel.isNext(indexRef.value));
    const isActiveRef = computed(() => NCarousel.isActive(indexRef.value));
    const styleRef = computed(() => NCarousel.getSlideStyle(indexRef.value));
    onMounted(() => {
      NCarousel.addSlide(selfElRef.value);
    });
    onBeforeUnmount(() => {
      NCarousel.removeSlide(selfElRef.value);
    });
    function handleClick(event) {
      const {
        value: index
      } = indexRef;
      if (index !== void 0) NCarousel?.onCarouselItemClick(index, event);
    }
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      selfElRef,
      isPrev: isPrevRef,
      isNext: isNextRef,
      isActive: isActiveRef,
      index: indexRef,
      style: styleRef,
      handleClick
    };
  },
  render() {
    const {
      $slots: slots,
      mergedClsPrefix,
      isPrev,
      isNext,
      isActive,
      index,
      style
    } = this;
    const className = [`${mergedClsPrefix}-carousel__slide`, {
      [`${mergedClsPrefix}-carousel__slide--current`]: isActive,
      [`${mergedClsPrefix}-carousel__slide--prev`]: isPrev,
      [`${mergedClsPrefix}-carousel__slide--next`]: isNext
    }];
    return openBlock(), createElementBlock("div", {
      ref: "selfElRef",
      class: normalizeClass$1(className),
      role: "option",
      tabindex: "-1",
      "data-index": index,
      "aria-hidden": !isActive,
      style: normalizeStyle(style),
      onClickCapture: this.handleClick
    }, [normalizeVNode(() => slots.default?.({
      isPrev,
      isNext,
      isActive,
      index
    }))], 46, _hoisted_1);
  }
});
//#endregion
export { CarouselItem_default as default, isCarouselItem };