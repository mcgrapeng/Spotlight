import { ComputedRef } from "vue";
//#region src/carousel/src/CarouselContext.d.ts
interface CarouselContextValue {
  currentIndexRef: ComputedRef<number>;
  to: (index: number) => void;
  prev: () => void;
  next: () => void;
  isVertical: () => boolean;
  isHorizontal: () => boolean;
  isPrev: (slideOrIndex: HTMLElement | number) => boolean;
  isNext: (slideOrIndex: HTMLElement | number) => boolean;
  isActive: (slideOrIndex: HTMLElement | number) => boolean;
  isPrevDisabled: () => boolean;
  isNextDisabled: () => boolean;
  getSlideIndex: (slideOrIndex?: HTMLElement | number) => number;
  getSlideStyle: (slideOrIndex: HTMLElement | number) => string | Record<string, string | number> | undefined;
  addSlide: (slide?: HTMLElement) => void;
  removeSlide: (slide?: HTMLElement) => void;
  onCarouselItemClick: (index: number, event: MouseEvent) => void;
}
declare function provideCarouselContext(contextValue: CarouselContextValue): void;
declare function useCarouselContext(location?: string, component?: string): CarouselContextValue;
//#endregion
export { CarouselContextValue, provideCarouselContext, useCarouselContext };