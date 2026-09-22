import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { PropType } from "vue";
//#region src/carousel/src/CarouselDots.d.ts
declare const carouselDotsProps: {
  total: {
    type: NumberConstructor;
    default: number;
  };
  currentIndex: {
    type: NumberConstructor;
    default: number;
  };
  dotType: {
    type: PropType<"dot" | "line" | "never">;
    default: string;
  };
  trigger: {
    type: PropType<"click" | "hover">;
    default: string;
  };
  keyboard: BooleanConstructor;
};
type CarouselDotsProps = ExtractPublicPropTypes<typeof carouselDotsProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  total: {
    type: NumberConstructor;
    default: number;
  };
  currentIndex: {
    type: NumberConstructor;
    default: number;
  };
  dotType: {
    type: PropType<"dot" | "line" | "never">;
    default: string;
  };
  trigger: {
    type: PropType<"click" | "hover">;
    default: string;
  };
  keyboard: BooleanConstructor;
}>, {
  mergedClsPrefix: import("vue").Ref<string, string>;
  dotEls: import("vue").Ref<HTMLElement[], HTMLElement[]>;
  handleKeydown: (e: KeyboardEvent, current: number) => void;
  handleMouseenter: (current: number) => void;
  handleClick: (current: number) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  total: {
    type: NumberConstructor;
    default: number;
  };
  currentIndex: {
    type: NumberConstructor;
    default: number;
  };
  dotType: {
    type: PropType<"dot" | "line" | "never">;
    default: string;
  };
  trigger: {
    type: PropType<"click" | "hover">;
    default: string;
  };
  keyboard: BooleanConstructor;
}>> & Readonly<{}>, {
  trigger: "hover" | "click";
  keyboard: boolean;
  currentIndex: number;
  dotType: "dot" | "line" | "never";
  total: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { CarouselDotsProps, _default as default };