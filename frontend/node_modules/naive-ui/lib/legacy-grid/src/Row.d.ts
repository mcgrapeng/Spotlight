import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { PropType, Ref } from "vue";
//#region src/legacy-grid/src/Row.d.ts
interface RowInjection {
  gutterRef: Ref<string | number | [number, number]>;
  verticalGutterRef: Ref<number>;
  horizontalGutterRef: Ref<number>;
  mergedClsPrefixRef: Ref<string>;
}
declare const rowInjectionKey: import("vue").InjectionKey<RowInjection>;
declare const rowProps: {
  readonly gutter: {
    readonly type: PropType<string | number | [number, number]>;
    readonly default: 0;
  };
  readonly alignItems: StringConstructor;
  readonly justifyContent: StringConstructor;
};
declare const rowPropKeys: ("alignItems" | "justifyContent" | "gutter")[];
type RowProps = ExtractPublicPropTypes<typeof rowProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly gutter: {
    readonly type: PropType<string | number | [number, number]>;
    readonly default: 0;
  };
  readonly alignItems: StringConstructor;
  readonly justifyContent: StringConstructor;
}>, {
  mergedClsPrefix: Ref<string, string>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  styleMargin: import("vue").ComputedRef<string>;
  styleWidth: import("vue").ComputedRef<string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly gutter: {
    readonly type: PropType<string | number | [number, number]>;
    readonly default: 0;
  };
  readonly alignItems: StringConstructor;
  readonly justifyContent: StringConstructor;
}>> & Readonly<{}>, {
  readonly gutter: string | number | [number, number];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { RowInjection, RowProps, _default as default, rowInjectionKey, rowPropKeys, rowProps };