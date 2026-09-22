import { CarouselContextValue } from "./CarouselContext.js";
//#region src/carousel/src/interface.d.ts
interface CarouselInst {
  getCurrentIndex: () => number;
  to: (index: number) => void;
  prev: () => void;
  next: () => void;
}
interface ArrowScopedSlotProps extends Pick<CarouselContextValue, 'to' | 'prev' | 'next' | 'isPrevDisabled' | 'isNextDisabled'> {
  total: number;
  currentIndex: number;
}
interface DotScopedSlotProps extends Pick<CarouselContextValue, 'to'> {
  total: number;
  currentIndex: number;
}
interface Size {
  width: number;
  height: number;
}
interface CarouselArrowSlotProps {
  total: number;
  currentIndex: number;
  to: (index: number) => void;
  prev: () => void;
  next: () => void;
}
interface CarouselDotSlotProps {
  total: number;
  currentIndex: number;
  to: (index: number) => void;
}
//#endregion
export { ArrowScopedSlotProps, CarouselArrowSlotProps, CarouselDotSlotProps, CarouselInst, DotScopedSlotProps, Size };