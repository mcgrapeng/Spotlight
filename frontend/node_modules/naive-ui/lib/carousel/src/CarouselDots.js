const require__mixins_use_config = require("../../_mixins/use-config.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_carousel_src_CarouselContext = require("./CarouselContext.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/carousel/src/CarouselDots.tsx
const _hoisted_1 = [
	"aria-selected",
	"onClick",
	"onMouseenter",
	"onKeydown"
];
const carouselDotsProps = {
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
};
var CarouselDots_default = (0, vue.defineComponent)({
	name: "CarouselDots",
	props: carouselDotsProps,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const dotElsRef = (0, vue.ref)([]);
		const NCarousel = require_carousel_src_CarouselContext.useCarouselContext();
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
			const { code: keycode } = e;
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
		(0, vue.onBeforeUpdate)(() => dotElsRef.value.length = 0);
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			dotEls: dotElsRef,
			handleKeydown,
			handleMouseenter,
			handleClick
		};
	},
	render() {
		const { mergedClsPrefix, dotEls } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-carousel__dots`, `${mergedClsPrefix}-carousel__dots--${this.dotType}`]),
			role: "tablist"
		}, [require_vdom.normalizeVNode(() => (0, seemly.indexMap)(this.total, (i) => {
			const selected = i === this.currentIndex;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				"aria-selected": selected,
				ref: (el) => dotEls.push(el),
				role: "button",
				tabindex: "0",
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-carousel__dot`, selected && `${mergedClsPrefix}-carousel__dot--active`]),
				key: i,
				onClick: () => {
					this.handleClick(i);
				},
				onMouseenter: () => {
					this.handleMouseenter(i);
				},
				onKeydown: (e) => {
					this.handleKeydown(e, i);
				}
			}, null, 42, _hoisted_1);
		}))], 2);
	}
});
//#endregion
module.exports = CarouselDots_default;
