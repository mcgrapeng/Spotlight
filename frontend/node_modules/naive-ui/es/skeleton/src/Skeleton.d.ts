import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { SkeletonSize } from "./public-types.js";
import { SkeletonTheme, SkeletonThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/skeleton/src/Skeleton.d.ts
declare const skeletonProps: {
  readonly text: BooleanConstructor;
  readonly round: BooleanConstructor;
  readonly circle: BooleanConstructor;
  readonly height: PropType<string | number>;
  readonly width: PropType<string | number>;
  readonly size: PropType<SkeletonSize>;
  readonly repeat: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly animated: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly sharp: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly theme: PropType<SkeletonTheme>;
  readonly themeOverrides: PropType<SkeletonThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SkeletonThemeOverrides>;
};
type SkeletonProps = ExtractPublicPropTypes<typeof skeletonProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly text: BooleanConstructor;
  readonly round: BooleanConstructor;
  readonly circle: BooleanConstructor;
  readonly height: PropType<string | number>;
  readonly width: PropType<string | number>;
  readonly size: PropType<SkeletonSize>;
  readonly repeat: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly animated: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly sharp: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly theme: PropType<SkeletonTheme>;
  readonly themeOverrides: PropType<SkeletonThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SkeletonThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  style: Ref<CSSProperties>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly text: BooleanConstructor;
  readonly round: BooleanConstructor;
  readonly circle: BooleanConstructor;
  readonly height: PropType<string | number>;
  readonly width: PropType<string | number>;
  readonly size: PropType<SkeletonSize>;
  readonly repeat: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly animated: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly sharp: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly theme: PropType<SkeletonTheme>;
  readonly themeOverrides: PropType<SkeletonThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SkeletonThemeOverrides>;
}>> & Readonly<{}>, {
  readonly circle: boolean;
  readonly round: boolean;
  readonly text: boolean;
  readonly repeat: number;
  readonly animated: boolean;
  readonly sharp: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { SkeletonProps, _default as default, skeletonProps };