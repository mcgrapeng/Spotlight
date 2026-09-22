import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { PropType } from "vue";
//#region src/grid/src/GridItem.d.ts
declare const defaultSpan = 1;
declare const gridItemProps: {
  readonly span: {
    readonly type: PropType<string | number>;
    readonly default: 1;
  };
  readonly offset: {
    readonly type: PropType<string | number>;
    readonly default: 0;
  };
  readonly suffix: BooleanConstructor;
  readonly privateOffset: NumberConstructor;
  readonly privateSpan: NumberConstructor;
  readonly privateColStart: NumberConstructor;
  readonly privateShow: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
};
declare const gridItemPropKeys: ("span" | "offset" | "suffix" | "privateOffset" | "privateSpan" | "privateColStart" | "privateShow")[];
type GridItemProps = ExtractPublicPropTypes<typeof gridItemProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly span: {
    readonly type: PropType<string | number>;
    readonly default: 1;
  };
  readonly offset: {
    readonly type: PropType<string | number>;
    readonly default: 0;
  };
  readonly suffix: BooleanConstructor;
  readonly privateOffset: NumberConstructor;
  readonly privateSpan: NumberConstructor;
  readonly privateColStart: NumberConstructor;
  readonly privateShow: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
}>, {
  overflow: import("vue").Ref<boolean, boolean>;
  itemStyle: import("vue").Ref<string | import("vue").CSSProperties | undefined, string | import("vue").CSSProperties | undefined>;
  layoutShiftDisabled: import("vue").Ref<boolean, boolean>;
  mergedXGap: import("vue").ComputedRef<string>;
  deriveStyle: () => {
    display: string;
    gridColumn: string;
    marginLeft: string;
  };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly span: {
    readonly type: PropType<string | number>;
    readonly default: 1;
  };
  readonly offset: {
    readonly type: PropType<string | number>;
    readonly default: 0;
  };
  readonly suffix: BooleanConstructor;
  readonly privateOffset: NumberConstructor;
  readonly privateSpan: NumberConstructor;
  readonly privateColStart: NumberConstructor;
  readonly privateShow: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
}>> & Readonly<{}>, {
  readonly span: string | number;
  readonly offset: string | number;
  readonly suffix: boolean;
  readonly privateShow: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { GridItemProps, _default as default, defaultSpan, gridItemPropKeys, gridItemProps };