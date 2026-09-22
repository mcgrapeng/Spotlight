import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ScrollbarProps } from "../../scrollbar/src/Scrollbar.js";
import { CSSProperties, PropType } from "vue";
import { VirtualListInst, VirtualListItemData, VirtualListScrollToOptions } from "vueuc";
//#region src/virtual-list/src/VirtualList.d.ts
declare const virtualListProps: {
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly items: {
    readonly type: PropType<VirtualListItemData[]>;
    readonly default: () => never[];
  };
  readonly itemSize: {
    readonly type: NumberConstructor;
    readonly required: true;
  };
  readonly itemResizable: BooleanConstructor;
  readonly itemsStyle: PropType<string | CSSProperties>;
  readonly visibleItemsTag: {
    readonly type: PropType<string | object>;
    readonly default: "div";
  };
  readonly visibleItemsProps: ObjectConstructor;
  readonly ignoreItemResize: BooleanConstructor;
  readonly onScroll: PropType<(event: Event) => void>;
  readonly onWheel: PropType<(event: WheelEvent) => void>;
  readonly onResize: PropType<(entry: ResizeObserverEntry) => void>;
  readonly defaultScrollKey: PropType<number | string>;
  readonly defaultScrollIndex: NumberConstructor;
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly paddingTop: {
    readonly type: PropType<number | string>;
    readonly default: 0;
  };
  readonly paddingBottom: {
    readonly type: PropType<number | string>;
    readonly default: 0;
  };
};
type VirtualListProps = ExtractPublicPropTypes<typeof virtualListProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly items: {
    readonly type: PropType<VirtualListItemData[]>;
    readonly default: () => never[];
  };
  readonly itemSize: {
    readonly type: NumberConstructor;
    readonly required: true;
  };
  readonly itemResizable: BooleanConstructor;
  readonly itemsStyle: PropType<string | CSSProperties>;
  readonly visibleItemsTag: {
    readonly type: PropType<string | object>;
    readonly default: "div";
  };
  readonly visibleItemsProps: ObjectConstructor;
  readonly ignoreItemResize: BooleanConstructor;
  readonly onScroll: PropType<(event: Event) => void>;
  readonly onWheel: PropType<(event: WheelEvent) => void>;
  readonly onResize: PropType<(entry: ResizeObserverEntry) => void>;
  readonly defaultScrollKey: PropType<number | string>;
  readonly defaultScrollIndex: NumberConstructor;
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly paddingTop: {
    readonly type: PropType<number | string>;
    readonly default: 0;
  };
  readonly paddingBottom: {
    readonly type: PropType<number | string>;
    readonly default: 0;
  };
}>, {
  scrollTo: (options: VirtualListScrollToOptions | number, y?: number) => void;
  scrollbarInstRef: unknown;
  virtualListInstRef: unknown;
  getScrollContainer: () => HTMLElement | null | undefined;
  getScrollContent: () => HTMLElement | null | undefined;
  handleScroll: (e: Event) => void;
  handleResize: (e: ResizeObserverEntry) => void;
  handleWheel: (e: WheelEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly items: {
    readonly type: PropType<VirtualListItemData[]>;
    readonly default: () => never[];
  };
  readonly itemSize: {
    readonly type: NumberConstructor;
    readonly required: true;
  };
  readonly itemResizable: BooleanConstructor;
  readonly itemsStyle: PropType<string | CSSProperties>;
  readonly visibleItemsTag: {
    readonly type: PropType<string | object>;
    readonly default: "div";
  };
  readonly visibleItemsProps: ObjectConstructor;
  readonly ignoreItemResize: BooleanConstructor;
  readonly onScroll: PropType<(event: Event) => void>;
  readonly onWheel: PropType<(event: WheelEvent) => void>;
  readonly onResize: PropType<(entry: ResizeObserverEntry) => void>;
  readonly defaultScrollKey: PropType<number | string>;
  readonly defaultScrollIndex: NumberConstructor;
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly paddingTop: {
    readonly type: PropType<number | string>;
    readonly default: 0;
  };
  readonly paddingBottom: {
    readonly type: PropType<number | string>;
    readonly default: 0;
  };
}>> & Readonly<{}>, {
  readonly items: VirtualListItemData[];
  readonly paddingBottom: string | number;
  readonly paddingTop: string | number;
  readonly keyField: string;
  readonly itemResizable: boolean;
  readonly visibleItemsTag: string | object;
  readonly ignoreItemResize: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { type VirtualListInst, VirtualListProps, _default as default, virtualListProps };