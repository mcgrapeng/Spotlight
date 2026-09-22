import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { CarouselTheme, CarouselThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { ArrowScopedSlotProps, CarouselArrowSlotProps, CarouselDotSlotProps, DotScopedSlotProps, Size } from "./interface.js";
import { CSSProperties, PropType, Ref, SlotsType, TransitionProps, VNode } from "vue";
//#region src/carousel/src/Carousel.d.ts
declare const transitionProperties: readonly ["transitionDuration", "transitionTimingFunction"];
type TransitionStyle = Partial<Pick<CSSProperties, (typeof transitionProperties)[number]>>;
declare const carouselProps: {
  defaultIndex: {
    type: NumberConstructor;
    default: number;
  };
  currentIndex: NumberConstructor;
  showArrow: BooleanConstructor;
  dotType: {
    type: PropType<"dot" | "line">;
    default: string;
  };
  dotPlacement: {
    type: PropType<"top" | "bottom" | "left" | "right">;
    default: string;
  };
  slidesPerView: {
    type: PropType<number | "auto">;
    default: number;
  };
  spaceBetween: {
    type: NumberConstructor;
    default: number;
  };
  centeredSlides: BooleanConstructor;
  direction: {
    type: PropType<"horizontal" | "vertical">;
    default: string;
  };
  autoplay: BooleanConstructor;
  interval: {
    type: NumberConstructor;
    default: number;
  };
  loop: {
    type: BooleanConstructor;
    default: boolean;
  };
  effect: {
    type: PropType<"slide" | "fade" | "card" | "custom">;
    default: string;
  };
  showDots: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: PropType<"click" | "hover">;
    default: string;
  };
  transitionStyle: {
    type: PropType<TransitionStyle>;
    default: () => TransitionStyle;
  };
  transitionProps: PropType<TransitionProps>;
  draggable: BooleanConstructor;
  prevSlideStyle: PropType<CSSProperties | string>;
  nextSlideStyle: PropType<CSSProperties | string>;
  touchable: {
    type: BooleanConstructor;
    default: boolean;
  };
  mousewheel: BooleanConstructor;
  keyboard: BooleanConstructor;
  'onUpdate:currentIndex': PropType<(currentIndex: number, lastIndex: number) => void>;
  onUpdateCurrentIndex: PropType<(currentIndex: number, lastIndex: number) => void>;
  theme: PropType<CarouselTheme>;
  themeOverrides: PropType<CarouselThemeOverrides>;
  builtinThemeOverrides: PropType<CarouselThemeOverrides>;
};
type CarouselProps = ExtractPublicPropTypes<typeof carouselProps>;
interface CarouselSlots {
  default?: () => VNode[];
  arrow?: (props: CarouselArrowSlotProps) => VNode[];
  dots?: (props: CarouselDotSlotProps) => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  defaultIndex: {
    type: NumberConstructor;
    default: number;
  };
  currentIndex: NumberConstructor;
  showArrow: BooleanConstructor;
  dotType: {
    type: PropType<"dot" | "line">;
    default: string;
  };
  dotPlacement: {
    type: PropType<"top" | "bottom" | "left" | "right">;
    default: string;
  };
  slidesPerView: {
    type: PropType<number | "auto">;
    default: number;
  };
  spaceBetween: {
    type: NumberConstructor;
    default: number;
  };
  centeredSlides: BooleanConstructor;
  direction: {
    type: PropType<"horizontal" | "vertical">;
    default: string;
  };
  autoplay: BooleanConstructor;
  interval: {
    type: NumberConstructor;
    default: number;
  };
  loop: {
    type: BooleanConstructor;
    default: boolean;
  };
  effect: {
    type: PropType<"slide" | "fade" | "card" | "custom">;
    default: string;
  };
  showDots: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: PropType<"click" | "hover">;
    default: string;
  };
  transitionStyle: {
    type: PropType<TransitionStyle>;
    default: () => TransitionStyle;
  };
  transitionProps: PropType<TransitionProps>;
  draggable: BooleanConstructor;
  prevSlideStyle: PropType<CSSProperties | string>;
  nextSlideStyle: PropType<CSSProperties | string>;
  touchable: {
    type: BooleanConstructor;
    default: boolean;
  };
  mousewheel: BooleanConstructor;
  keyboard: BooleanConstructor;
  'onUpdate:currentIndex': PropType<(currentIndex: number, lastIndex: number) => void>;
  onUpdateCurrentIndex: PropType<(currentIndex: number, lastIndex: number) => void>;
  theme: PropType<CarouselTheme>;
  themeOverrides: PropType<CarouselThemeOverrides>;
  builtinThemeOverrides: PropType<CarouselThemeOverrides>;
}>, {
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  getCurrentIndex: () => number;
  to: (index: number) => void;
  prev: () => void;
  next: () => void;
  mergedClsPrefix: Ref<string, string>;
  selfElRef: Ref<HTMLDivElement | null, HTMLDivElement | null>;
  slidesElRef: Ref<HTMLDivElement | null, HTMLDivElement | null>;
  slideVNodes: {
    value: VNode[];
  };
  duplicatedable: import("vue").ComputedRef<boolean>;
  userWantsControl: import("vue").ComputedRef<boolean>;
  autoSlideSize: import("vue").ComputedRef<boolean>;
  realIndex: import("vue").ComputedRef<number>;
  slideStyles: import("vue").ComputedRef<(Partial<Size> | undefined)[] | CSSProperties[]>;
  translateStyle: Ref<CSSProperties, CSSProperties>;
  slidesControlListeners: import("vue").ComputedRef<{
    onTouchstartPassive: ((event: MouseEvent | TouchEvent) => void) | undefined;
    onMousedown: ((event: MouseEvent | TouchEvent) => void) | undefined;
    onWheel: ((event: WheelEvent) => void) | undefined;
  }>;
  handleTransitionEnd: () => void;
  handleResize: () => void;
  handleSlideResize: () => void;
  handleMouseenter: () => void;
  handleMouseleave: () => void;
  isActive: (index: number) => boolean;
  arrowSlotProps: import("vue").ComputedRef<ArrowScopedSlotProps>;
  dotSlotProps: import("vue").ComputedRef<DotScopedSlotProps>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  defaultIndex: {
    type: NumberConstructor;
    default: number;
  };
  currentIndex: NumberConstructor;
  showArrow: BooleanConstructor;
  dotType: {
    type: PropType<"dot" | "line">;
    default: string;
  };
  dotPlacement: {
    type: PropType<"top" | "bottom" | "left" | "right">;
    default: string;
  };
  slidesPerView: {
    type: PropType<number | "auto">;
    default: number;
  };
  spaceBetween: {
    type: NumberConstructor;
    default: number;
  };
  centeredSlides: BooleanConstructor;
  direction: {
    type: PropType<"horizontal" | "vertical">;
    default: string;
  };
  autoplay: BooleanConstructor;
  interval: {
    type: NumberConstructor;
    default: number;
  };
  loop: {
    type: BooleanConstructor;
    default: boolean;
  };
  effect: {
    type: PropType<"slide" | "fade" | "card" | "custom">;
    default: string;
  };
  showDots: {
    type: BooleanConstructor;
    default: boolean;
  };
  trigger: {
    type: PropType<"click" | "hover">;
    default: string;
  };
  transitionStyle: {
    type: PropType<TransitionStyle>;
    default: () => TransitionStyle;
  };
  transitionProps: PropType<TransitionProps>;
  draggable: BooleanConstructor;
  prevSlideStyle: PropType<CSSProperties | string>;
  nextSlideStyle: PropType<CSSProperties | string>;
  touchable: {
    type: BooleanConstructor;
    default: boolean;
  };
  mousewheel: BooleanConstructor;
  keyboard: BooleanConstructor;
  'onUpdate:currentIndex': PropType<(currentIndex: number, lastIndex: number) => void>;
  onUpdateCurrentIndex: PropType<(currentIndex: number, lastIndex: number) => void>;
  theme: PropType<CarouselTheme>;
  themeOverrides: PropType<CarouselThemeOverrides>;
  builtinThemeOverrides: PropType<CarouselThemeOverrides>;
}>> & Readonly<{}>, {
  trigger: "hover" | "click";
  showArrow: boolean;
  keyboard: boolean;
  defaultIndex: number;
  dotType: "dot" | "line";
  dotPlacement: "left" | "right" | "top" | "bottom";
  slidesPerView: number | "auto";
  spaceBetween: number;
  centeredSlides: boolean;
  direction: "vertical" | "horizontal";
  autoplay: boolean;
  interval: number;
  loop: boolean;
  effect: "card" | "slide" | "fade" | "custom";
  showDots: boolean;
  transitionStyle: Partial<Pick<CSSProperties, "transitionDuration" | "transitionTimingFunction">>;
  draggable: boolean;
  touchable: boolean;
  mousewheel: boolean;
}, SlotsType<CarouselSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { CarouselProps, CarouselSlots, carouselProps, _default as default };