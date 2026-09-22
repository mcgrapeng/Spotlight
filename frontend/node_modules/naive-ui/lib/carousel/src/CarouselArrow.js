const require__mixins_use_config = require("../../_mixins/use-config.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_carousel_src_CarouselContext = require("./CarouselContext.js");
let vue = require("vue");
//#region src/carousel/src/CarouselArrow.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["onClick"];
function renderBackwardIcon() {
	return (() => {
		const _cache = require_vdom.createVNodeCache("f6e8125451d09846");
		return _cache[0] || (_cache[0] = (0, vue.createElementVNode)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 16 16"
		}, [(0, vue.createElementVNode)("g", { fill: "none" }, [(0, vue.createElementVNode)("path", {
			d: "M10.26 3.2a.75.75 0 0 1 .04 1.06L6.773 8l3.527 3.74a.75.75 0 1 1-1.1 1.02l-4-4.25a.75.75 0 0 1 0-1.02l4-4.25a.75.75 0 0 1 1.06-.04z",
			fill: "currentColor"
		})])], -1));
	})();
}
function renderForwardIcon() {
	return (() => {
		const _cache = require_vdom.createVNodeCache("32cda25b09864a17");
		return _cache[0] || (_cache[0] = (0, vue.createElementVNode)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 16 16"
		}, [(0, vue.createElementVNode)("g", { fill: "none" }, [(0, vue.createElementVNode)("path", {
			d: "M5.74 3.2a.75.75 0 0 0-.04 1.06L9.227 8L5.7 11.74a.75.75 0 1 0 1.1 1.02l4-4.25a.75.75 0 0 0 0-1.02l-4-4.25a.75.75 0 0 0-1.06-.04z",
			fill: "currentColor"
		})])], -1));
	})();
}
var CarouselArrow_default = (0, vue.defineComponent)({
	name: "CarouselArrow",
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const { isVertical, isPrevDisabled, isNextDisabled, prev, next } = require_carousel_src_CarouselContext.useCarouselContext();
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
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-carousel__arrow-group`) }, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-carousel__arrow`, this.isPrevDisabled() && `${mergedClsPrefix}-carousel__arrow--disabled`]),
			role: "button",
			onClick: this.prev
		}, [require_vdom.normalizeVNode(() => renderBackwardIcon())], 10, _hoisted_1), (0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-carousel__arrow`, this.isNextDisabled() && `${mergedClsPrefix}-carousel__arrow--disabled`]),
			role: "button",
			onClick: this.next
		}, [require_vdom.normalizeVNode(() => renderForwardIcon())], 10, _hoisted_2)], 2);
	}
});
//#endregion
module.exports = CarouselArrow_default;
