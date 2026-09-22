import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ScrollbarProps } from "../../scrollbar/src/Scrollbar.js";
import { PropType } from "vue";
//#region src/infinite-scroll/src/InfiniteScroll.d.ts
declare const infiniteScrollProps: {
  readonly distance: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly onLoad: PropType<() => Promise<void> | void>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
};
type InfiniteScrollProps = ExtractPublicPropTypes<typeof infiniteScrollProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly distance: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly onLoad: PropType<() => Promise<void> | void>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
}>, {
  scrollbarInstRef: unknown;
  handleScroll: () => void;
  handleWheel: (e: WheelEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly distance: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly onLoad: PropType<() => Promise<void> | void>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
}>> & Readonly<{}>, {
  readonly distance: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { InfiniteScrollProps, _default as default, infiniteScrollProps };