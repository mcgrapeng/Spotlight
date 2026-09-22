import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { CSSProperties, PropType, SlotsType, VNode } from "vue";
//#region src/descriptions/src/DescriptionsItem.d.ts
declare const descriptionsItemProps: {
  readonly label: StringConstructor;
  readonly span: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly labelClass: StringConstructor;
  readonly labelStyle: PropType<string | CSSProperties>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | CSSProperties>;
};
type DescriptionItemProps = ExtractPublicPropTypes<typeof descriptionsItemProps>;
interface DescriptionItemSlots {
  default?: () => VNode[];
  label?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly label: StringConstructor;
  readonly span: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly labelClass: StringConstructor;
  readonly labelStyle: PropType<string | CSSProperties>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | CSSProperties>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly label: StringConstructor;
  readonly span: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly labelClass: StringConstructor;
  readonly labelStyle: PropType<string | CSSProperties>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | CSSProperties>;
}>> & Readonly<{}>, {
  readonly span: number;
}, SlotsType<DescriptionItemSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { DescriptionItemProps, DescriptionItemSlots, _default as default, descriptionsItemProps };