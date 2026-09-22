import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { BadgeTheme, BadgeThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/badge/src/Badge.d.ts
declare const badgeProps: {
  readonly value: PropType<string | number>;
  readonly max: NumberConstructor;
  readonly dot: BooleanConstructor;
  readonly type: {
    readonly type: PropType<"success" | "error" | "warning" | "info" | "default">;
    readonly default: "default";
  };
  readonly show: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showZero: BooleanConstructor;
  readonly processing: BooleanConstructor;
  readonly color: StringConstructor;
  readonly offset: PropType<readonly [number | string, number | string]>;
  readonly theme: PropType<BadgeTheme>;
  readonly themeOverrides: PropType<BadgeThemeOverrides>;
  readonly builtinThemeOverrides: PropType<BadgeThemeOverrides>;
};
type BadgeProps = ExtractPublicPropTypes<typeof badgeProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly value: PropType<string | number>;
  readonly max: NumberConstructor;
  readonly dot: BooleanConstructor;
  readonly type: {
    readonly type: PropType<"success" | "error" | "warning" | "info" | "default">;
    readonly default: "default";
  };
  readonly show: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showZero: BooleanConstructor;
  readonly processing: BooleanConstructor;
  readonly color: StringConstructor;
  readonly offset: PropType<readonly [number | string, number | string]>;
  readonly theme: PropType<BadgeTheme>;
  readonly themeOverrides: PropType<BadgeThemeOverrides>;
  readonly builtinThemeOverrides: PropType<BadgeThemeOverrides>;
}>, {
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: Ref<string, string>;
  appeared: Ref<boolean, boolean>;
  showBadge: import("vue").ComputedRef<boolean>;
  handleAfterEnter: () => void;
  handleAfterLeave: () => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  offsetStyle: import("vue").ComputedRef<{
    transform: string;
  } | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly value: PropType<string | number>;
  readonly max: NumberConstructor;
  readonly dot: BooleanConstructor;
  readonly type: {
    readonly type: PropType<"success" | "error" | "warning" | "info" | "default">;
    readonly default: "default";
  };
  readonly show: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showZero: BooleanConstructor;
  readonly processing: BooleanConstructor;
  readonly color: StringConstructor;
  readonly offset: PropType<readonly [number | string, number | string]>;
  readonly theme: PropType<BadgeTheme>;
  readonly themeOverrides: PropType<BadgeThemeOverrides>;
  readonly builtinThemeOverrides: PropType<BadgeThemeOverrides>;
}>> & Readonly<{}>, {
  readonly type: "error" | "info" | "success" | "warning" | "default";
  readonly dot: boolean;
  readonly show: boolean;
  readonly showZero: boolean;
  readonly processing: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { BadgeProps, badgeProps, _default as default };