import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { Span } from "./interface.js";
import { PropType } from "vue";
//#region src/legacy-grid/src/Col.d.ts
declare const colProps: {
  readonly span: {
    readonly type: PropType<Span>;
    readonly default: 1;
  };
  readonly push: {
    readonly type: PropType<Span>;
    readonly default: 0;
  };
  readonly pull: {
    readonly type: PropType<Span>;
    readonly default: 0;
  };
  readonly offset: {
    readonly type: PropType<Span>;
    readonly default: 0;
  };
};
declare const colPropKeys: ("push" | "span" | "offset" | "pull")[];
type ColProps = ExtractPublicPropTypes<typeof colProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly span: {
    readonly type: PropType<Span>;
    readonly default: 1;
  };
  readonly push: {
    readonly type: PropType<Span>;
    readonly default: 0;
  };
  readonly pull: {
    readonly type: PropType<Span>;
    readonly default: 0;
  };
  readonly offset: {
    readonly type: PropType<Span>;
    readonly default: 0;
  };
}>, {
  mergedClsPrefix: import("vue").Ref<string, string>;
  gutter: import("vue").Ref<string | number | [number, number], string | number | [number, number]>;
  stylePadding: import("vue").ComputedRef<string>;
  mergedPush: import("vue").ComputedRef<number>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly span: {
    readonly type: PropType<Span>;
    readonly default: 1;
  };
  readonly push: {
    readonly type: PropType<Span>;
    readonly default: 0;
  };
  readonly pull: {
    readonly type: PropType<Span>;
    readonly default: 0;
  };
  readonly offset: {
    readonly type: PropType<Span>;
    readonly default: 0;
  };
}>> & Readonly<{}>, {
  readonly push: Span;
  readonly span: Span;
  readonly offset: Span;
  readonly pull: Span;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ColProps, colPropKeys, colProps, _default as default };