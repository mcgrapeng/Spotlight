Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_carousel_src_CarouselContext = require("./CarouselContext.js");
let vue = require("vue");
let lodash_es = require("lodash");
//#region src/carousel/src/CarouselItem.tsx
const _hoisted_1 = [
	"data-index",
	"aria-hidden",
	"onClickCapture"
];
const CarouselItemName = "CarouselItem";
function isCarouselItem(child) {
	return child.type?.name === CarouselItemName;
}
var CarouselItem_default = (0, vue.defineComponent)({
	name: CarouselItemName,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const NCarousel = require_carousel_src_CarouselContext.useCarouselContext((0, lodash_es.camelCase)(CarouselItemName), `n-${(0, lodash_es.camelCase)(CarouselItemName)}`);
		const selfElRef = (0, vue.ref)();
		const indexRef = (0, vue.computed)(() => {
			const { value: selfEl } = selfElRef;
			return selfEl ? NCarousel.getSlideIndex(selfEl) : -1;
		});
		const isPrevRef = (0, vue.computed)(() => NCarousel.isPrev(indexRef.value));
		const isNextRef = (0, vue.computed)(() => NCarousel.isNext(indexRef.value));
		const isActiveRef = (0, vue.computed)(() => NCarousel.isActive(indexRef.value));
		const styleRef = (0, vue.computed)(() => NCarousel.getSlideStyle(indexRef.value));
		(0, vue.onMounted)(() => {
			NCarousel.addSlide(selfElRef.value);
		});
		(0, vue.onBeforeUnmount)(() => {
			NCarousel.removeSlide(selfElRef.value);
		});
		function handleClick(event) {
			const { value: index } = indexRef;
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
		const { $slots: slots, mergedClsPrefix, isPrev, isNext, isActive, index, style } = this;
		const className = [`${mergedClsPrefix}-carousel__slide`, {
			[`${mergedClsPrefix}-carousel__slide--current`]: isActive,
			[`${mergedClsPrefix}-carousel__slide--prev`]: isPrev,
			[`${mergedClsPrefix}-carousel__slide--next`]: isNext
		}];
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "selfElRef",
			class: require_vdom.normalizeClass(className),
			role: "option",
			tabindex: "-1",
			"data-index": index,
			"aria-hidden": !isActive,
			style: (0, vue.normalizeStyle)(style),
			onClickCapture: this.handleClick
		}, [require_vdom.normalizeVNode(() => slots.default?.({
			isPrev,
			isNext,
			isActive,
			index
		}))], 46, _hoisted_1);
	}
});
//#endregion
exports.default = CarouselItem_default;
exports.isCarouselItem = isCarouselItem;
