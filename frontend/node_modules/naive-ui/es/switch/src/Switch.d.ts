import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { SwitchSize, SwitchSpinProps } from "./public-types.js";
import { SwitchTheme, SwitchThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { OnUpdateValue } from "./interface.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/switch/src/Switch.d.ts
declare const switchProps: {
  readonly size: PropType<SwitchSize>;
  readonly value: {
    readonly type: PropType<string | number | boolean | undefined>;
    readonly default: undefined;
  };
  readonly loading: BooleanConstructor;
  readonly defaultValue: {
    readonly type: PropType<string | number | boolean>;
    readonly default: false;
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly round: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly checkedValue: {
    readonly type: PropType<string | number | boolean>;
    readonly default: true;
  };
  readonly uncheckedValue: {
    readonly type: PropType<string | number | boolean>;
    readonly default: false;
  };
  readonly railStyle: PropType<(params: {
    focused: boolean;
    checked: boolean;
  }) => string | CSSProperties>;
  readonly rubberBand: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly spinProps: PropType<SwitchSpinProps>;
  /** @deprecated */
  readonly onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly theme: PropType<SwitchTheme>;
  readonly themeOverrides: PropType<SwitchThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SwitchThemeOverrides>;
};
type SwitchProps = ExtractPublicPropTypes<typeof switchProps>;
interface SwitchSlots {
  checked?: () => VNode[];
  'checked-icon'?: () => VNode[];
  icon?: () => VNode[];
  unchecked?: () => VNode[];
  'unchecked-icon'?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly size: PropType<SwitchSize>;
  readonly value: {
    readonly type: PropType<string | number | boolean | undefined>;
    readonly default: undefined;
  };
  readonly loading: BooleanConstructor;
  readonly defaultValue: {
    readonly type: PropType<string | number | boolean>;
    readonly default: false;
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly round: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly checkedValue: {
    readonly type: PropType<string | number | boolean>;
    readonly default: true;
  };
  readonly uncheckedValue: {
    readonly type: PropType<string | number | boolean>;
    readonly default: false;
  };
  readonly railStyle: PropType<(params: {
    focused: boolean;
    checked: boolean;
  }) => string | CSSProperties>;
  readonly rubberBand: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly spinProps: PropType<SwitchSpinProps>;
  /** @deprecated */
  readonly onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly theme: PropType<SwitchTheme>;
  readonly themeOverrides: PropType<SwitchThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SwitchThemeOverrides>;
}>, {
  handleClick: () => void;
  handleBlur: () => void;
  handleFocus: () => void;
  handleKeyup: (e: KeyboardEvent) => void;
  handleKeydown: (e: KeyboardEvent) => void;
  mergedRailStyle: import("vue").ComputedRef<string | CSSProperties | undefined>;
  pressed: Ref<boolean, boolean>;
  mergedClsPrefix: Ref<string, string>;
  mergedValue: import("vue").ComputedRef<string | number | boolean>;
  checked: import("vue").ComputedRef<boolean>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly size: PropType<SwitchSize>;
  readonly value: {
    readonly type: PropType<string | number | boolean | undefined>;
    readonly default: undefined;
  };
  readonly loading: BooleanConstructor;
  readonly defaultValue: {
    readonly type: PropType<string | number | boolean>;
    readonly default: false;
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly round: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly checkedValue: {
    readonly type: PropType<string | number | boolean>;
    readonly default: true;
  };
  readonly uncheckedValue: {
    readonly type: PropType<string | number | boolean>;
    readonly default: false;
  };
  readonly railStyle: PropType<(params: {
    focused: boolean;
    checked: boolean;
  }) => string | CSSProperties>;
  readonly rubberBand: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly spinProps: PropType<SwitchSpinProps>;
  /** @deprecated */
  readonly onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly theme: PropType<SwitchTheme>;
  readonly themeOverrides: PropType<SwitchThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SwitchThemeOverrides>;
}>> & Readonly<{}>, {
  readonly loading: boolean;
  readonly defaultValue: string | number | boolean;
  readonly disabled: boolean | undefined;
  readonly value: string | number | boolean | undefined;
  readonly round: boolean;
  readonly checkedValue: string | number | boolean;
  readonly uncheckedValue: string | number | boolean;
  readonly rubberBand: boolean;
}, SlotsType<SwitchSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { SwitchProps, SwitchSlots, _default as default, switchProps };