import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { DescriptionsTheme, DescriptionsThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { DescriptionsSize } from "./public-types.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/descriptions/src/Descriptions.d.ts
declare const descriptionsProps: {
  readonly title: StringConstructor;
  readonly column: {
    readonly type: NumberConstructor;
    readonly default: 3;
  };
  readonly columns: NumberConstructor;
  readonly labelPlacement: {
    readonly type: PropType<"left" | "top">;
    readonly default: "top";
  };
  readonly labelAlign: {
    readonly type: PropType<"left" | "right" | "center">;
    readonly default: "left";
  };
  readonly separator: {
    readonly type: StringConstructor;
    readonly default: ":";
  };
  readonly size: PropType<DescriptionsSize>;
  readonly bordered: BooleanConstructor;
  readonly labelClass: StringConstructor;
  readonly labelStyle: PropType<string | CSSProperties>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly theme: PropType<DescriptionsTheme>;
  readonly themeOverrides: PropType<DescriptionsThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DescriptionsThemeOverrides>;
};
type DescriptionsProps = ExtractPublicPropTypes<typeof descriptionsProps>;
/** @deprecated You should use `DescriptionsProps` */
type DescriptionProps = DescriptionsProps;
interface DescriptionsSlots {
  default?: () => VNode[];
  header?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly title: StringConstructor;
  readonly column: {
    readonly type: NumberConstructor;
    readonly default: 3;
  };
  readonly columns: NumberConstructor;
  readonly labelPlacement: {
    readonly type: PropType<"left" | "top">;
    readonly default: "top";
  };
  readonly labelAlign: {
    readonly type: PropType<"left" | "right" | "center">;
    readonly default: "left";
  };
  readonly separator: {
    readonly type: StringConstructor;
    readonly default: ":";
  };
  readonly size: PropType<DescriptionsSize>;
  readonly bordered: BooleanConstructor;
  readonly labelClass: StringConstructor;
  readonly labelStyle: PropType<string | CSSProperties>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly theme: PropType<DescriptionsTheme>;
  readonly themeOverrides: PropType<DescriptionsThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DescriptionsThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  compitableColumn: import("vue").ComputedRef<number>;
  inlineThemeDisabled: boolean | undefined;
  mergedSize: import("vue").ComputedRef<DescriptionsSize>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly title: StringConstructor;
  readonly column: {
    readonly type: NumberConstructor;
    readonly default: 3;
  };
  readonly columns: NumberConstructor;
  readonly labelPlacement: {
    readonly type: PropType<"left" | "top">;
    readonly default: "top";
  };
  readonly labelAlign: {
    readonly type: PropType<"left" | "right" | "center">;
    readonly default: "left";
  };
  readonly separator: {
    readonly type: StringConstructor;
    readonly default: ":";
  };
  readonly size: PropType<DescriptionsSize>;
  readonly bordered: BooleanConstructor;
  readonly labelClass: StringConstructor;
  readonly labelStyle: PropType<string | CSSProperties>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly theme: PropType<DescriptionsTheme>;
  readonly themeOverrides: PropType<DescriptionsThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DescriptionsThemeOverrides>;
}>> & Readonly<{}>, {
  readonly bordered: boolean;
  readonly separator: string;
  readonly column: number;
  readonly labelPlacement: "top" | "left";
  readonly labelAlign: "left" | "right" | "center";
}, SlotsType<DescriptionsSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { DescriptionProps, DescriptionsProps, DescriptionsSlots, _default as default, descriptionsProps };