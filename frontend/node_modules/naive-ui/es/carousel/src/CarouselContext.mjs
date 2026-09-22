import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import { throwError } from "../../_utils/naive/warn.mjs";
import { inject, provide } from "vue";
//#region src/carousel/src/CarouselContext.ts
const carouselMethodsInjectionKey = createInjectionKey("n-carousel-methods");
function provideCarouselContext(contextValue) {
  provide(carouselMethodsInjectionKey, contextValue);
}
function useCarouselContext(location = "unknown", component = "component") {
  const CarouselContext = inject(carouselMethodsInjectionKey);
  if (!CarouselContext) throwError(location, `\`${component}\` must be placed inside \`n-carousel\`.`);
  return CarouselContext;
}
//#endregion
export { provideCarouselContext, useCarouselContext };