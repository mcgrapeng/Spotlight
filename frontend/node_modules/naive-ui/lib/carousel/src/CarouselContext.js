Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
let vue = require("vue");
//#region src/carousel/src/CarouselContext.ts
const carouselMethodsInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-carousel-methods");
function provideCarouselContext(contextValue) {
	(0, vue.provide)(carouselMethodsInjectionKey, contextValue);
}
function useCarouselContext(location = "unknown", component = "component") {
	const CarouselContext = (0, vue.inject)(carouselMethodsInjectionKey);
	if (!CarouselContext) require__utils_naive_warn.throwError(location, `\`${component}\` must be placed inside \`n-carousel\`.`);
	return CarouselContext;
}
//#endregion
exports.provideCarouselContext = provideCarouselContext;
exports.useCarouselContext = useCarouselContext;
