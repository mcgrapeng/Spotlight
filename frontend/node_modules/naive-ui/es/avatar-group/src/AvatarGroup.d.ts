import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { AvatarTheme } from "../../avatar/styles/light.js";
import "../../avatar/styles/index.js";
import { Size } from "../../avatar/src/interface.js";
import { AvatarGroupTheme, AvatarGroupThemeOverrides, AvatarGroupThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { AvatarGroupAvatarSlotProps, AvatarGroupOption, AvatarGroupRestSlotProps } from "./public-types.js";
import "../../index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/avatar-group/src/AvatarGroup.d.ts
interface AvatarGroupInjection {
  size?: Size | undefined;
}
declare const avatarGroupProps: {
  readonly max: NumberConstructor;
  readonly maxStyle: PropType<CSSProperties | string>;
  readonly options: {
    readonly type: PropType<AvatarGroupOption[]>;
    readonly default: () => never[];
  };
  readonly vertical: BooleanConstructor;
  readonly expandOnHover: BooleanConstructor;
  readonly size: PropType<Size | undefined>;
  readonly theme: PropType<AvatarGroupTheme>;
  readonly themeOverrides: PropType<AvatarGroupThemeOverrides>;
  readonly builtinThemeOverrides: PropType<AvatarGroupThemeOverrides>;
};
type AvatarGroupProps = ExtractPublicPropTypes<typeof avatarGroupProps>;
interface AvatarGroupSlots {
  avatar?: (props: AvatarGroupAvatarSlotProps) => VNode[];
  rest?: (props: AvatarGroupRestSlotProps) => VNode[];
  default?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly max: NumberConstructor;
  readonly maxStyle: PropType<CSSProperties | string>;
  readonly options: {
    readonly type: PropType<AvatarGroupOption[]>;
    readonly default: () => never[];
  };
  readonly vertical: BooleanConstructor;
  readonly expandOnHover: BooleanConstructor;
  readonly size: PropType<Size | undefined>;
  readonly theme: PropType<AvatarGroupTheme>;
  readonly themeOverrides: PropType<AvatarGroupThemeOverrides>;
  readonly builtinThemeOverrides: PropType<AvatarGroupThemeOverrides>;
}>, {
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: AvatarGroupThemeVars;
    peers: {
      Avatar: AvatarTheme;
    };
    peerOverrides: {
      Avatar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: Ref<string, string>;
  restOptions: import("vue").ComputedRef<AvatarGroupOption[] | undefined>;
  displayedOptions: import("vue").ComputedRef<AvatarGroupOption[]>;
  cssVars: Ref<CSSProperties>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly max: NumberConstructor;
  readonly maxStyle: PropType<CSSProperties | string>;
  readonly options: {
    readonly type: PropType<AvatarGroupOption[]>;
    readonly default: () => never[];
  };
  readonly vertical: BooleanConstructor;
  readonly expandOnHover: BooleanConstructor;
  readonly size: PropType<Size | undefined>;
  readonly theme: PropType<AvatarGroupTheme>;
  readonly themeOverrides: PropType<AvatarGroupThemeOverrides>;
  readonly builtinThemeOverrides: PropType<AvatarGroupThemeOverrides>;
}>> & Readonly<{}>, {
  readonly options: AvatarGroupOption[];
  readonly vertical: boolean;
  readonly expandOnHover: boolean;
}, SlotsType<AvatarGroupSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { AvatarGroupInjection, AvatarGroupProps, AvatarGroupSlots, avatarGroupProps, _default as default };