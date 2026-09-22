import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { SpaceTheme, SpaceThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { SpaceSize } from "./public-types.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType } from "vue";
//#region src/space/src/Space.d.ts
type Align = 'stretch' | 'baseline' | 'start' | 'end' | 'center' | 'flex-end' | 'flex-start';
type Justify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
declare const spaceProps: {
  readonly align: PropType<Align>;
  readonly justify: {
    readonly type: PropType<Justify>;
    readonly default: "start";
  };
  readonly inline: BooleanConstructor;
  readonly vertical: BooleanConstructor;
  readonly reverse: BooleanConstructor;
  readonly size: PropType<SpaceSize>;
  readonly wrapItem: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly itemClass: StringConstructor;
  readonly itemStyle: PropType<string | CSSProperties>;
  readonly wrap: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly internalUseGap: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly theme: PropType<SpaceTheme>;
  readonly themeOverrides: PropType<SpaceThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SpaceThemeOverrides>;
};
type SpaceProps = ExtractPublicPropTypes<typeof spaceProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly align: PropType<Align>;
  readonly justify: {
    readonly type: PropType<Justify>;
    readonly default: "start";
  };
  readonly inline: BooleanConstructor;
  readonly vertical: BooleanConstructor;
  readonly reverse: BooleanConstructor;
  readonly size: PropType<SpaceSize>;
  readonly wrapItem: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly itemClass: StringConstructor;
  readonly itemStyle: PropType<string | CSSProperties>;
  readonly wrap: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly internalUseGap: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly theme: PropType<SpaceTheme>;
  readonly themeOverrides: PropType<SpaceThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SpaceThemeOverrides>;
}>, {
  useGap: boolean;
  rtlEnabled: import("vue").Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: import("vue").Ref<string, string>;
  margin: import("vue").ComputedRef<{
    horizontal: number;
    vertical: number;
  }>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly align: PropType<Align>;
  readonly justify: {
    readonly type: PropType<Justify>;
    readonly default: "start";
  };
  readonly inline: BooleanConstructor;
  readonly vertical: BooleanConstructor;
  readonly reverse: BooleanConstructor;
  readonly size: PropType<SpaceSize>;
  readonly wrapItem: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly itemClass: StringConstructor;
  readonly itemStyle: PropType<string | CSSProperties>;
  readonly wrap: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly internalUseGap: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly theme: PropType<SpaceTheme>;
  readonly themeOverrides: PropType<SpaceThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SpaceThemeOverrides>;
}>> & Readonly<{}>, {
  readonly reverse: boolean;
  readonly vertical: boolean;
  readonly inline: boolean;
  readonly wrap: boolean;
  readonly justify: Justify;
  readonly wrapItem: boolean;
  readonly internalUseGap: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { Justify, SpaceProps, _default as default, spaceProps };