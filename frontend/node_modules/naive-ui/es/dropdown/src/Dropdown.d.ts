import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { PopoverTrigger } from "../../popover/src/interface.js";
import { TriggerEventHandlers } from "../../popover/src/Popover.js";
import { DropdownTheme, DropdownThemeOverrides, DropdownThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { MenuGroupOption, MenuIgnoredOption, MenuOption, MenuRenderOption } from "../../menu/src/interface.js";
import { DropdownMenuProps, DropdownMixedOption, NodeProps, OnUpdateValue, OnUpdateValueImpl, RenderIcon, RenderIconImpl, RenderLabel, RenderLabelImpl, RenderOption, RenderOptionImpl } from "./interface.js";
import { DropdownSize } from "./public-types.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
import { FollowerPlacement } from "vueuc";
import { Key, TreeNode } from "treemate";
//#region src/dropdown/src/Dropdown.d.ts
interface DropdownInjection {
  renderLabelRef: Ref<RenderLabelImpl | undefined>;
  renderIconRef: Ref<RenderIconImpl | undefined>;
  renderOptionRef: Ref<RenderOptionImpl | undefined>;
  menuPropsRef: Ref<DropdownMenuProps | undefined>;
  nodePropsRef: Ref<NodeProps | undefined>;
  hoverKeyRef: Ref<Key | null>;
  keyboardKeyRef: Ref<Key | null>;
  lastToggledSubmenuKeyRef: Ref<Key | null>;
  pendingKeyPathRef: Ref<Key[]>;
  activeKeyPathRef: Ref<Key[]>;
  animatedRef: Ref<boolean>;
  mergedShowRef: Ref<boolean>;
  labelFieldRef: Ref<string>;
  childrenFieldRef: Ref<string>;
  doSelect: OnUpdateValueImpl;
  doUpdateShow: (value: boolean) => void;
}
declare const dropdownProps: {
  readonly theme: PropType<DropdownTheme>;
  readonly themeOverrides: PropType<DropdownThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DropdownThemeOverrides>;
  readonly animated: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly size: PropType<DropdownSize>;
  readonly inverted: BooleanConstructor;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom";
  };
  readonly onSelect: PropType<MaybeArray<OnUpdateValue>>;
  readonly options: {
    readonly type: PropType<DropdownMixedOption[]>;
    readonly default: () => never[];
  };
  readonly menuProps: PropType<DropdownMenuProps>;
  readonly showArrow: BooleanConstructor;
  readonly renderLabel: PropType<RenderLabel>;
  readonly renderIcon: PropType<RenderIcon>;
  readonly renderOption: PropType<RenderOption>;
  readonly nodeProps: PropType<NodeProps>;
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly value: PropType<Key | null>;
  readonly show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  readonly defaultShow: BooleanConstructor;
  readonly trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  readonly delay: {
    type: NumberConstructor;
    default: number;
  };
  readonly duration: {
    type: NumberConstructor;
    default: number;
  };
  readonly raw: BooleanConstructor;
  readonly x: NumberConstructor;
  readonly y: NumberConstructor;
  readonly arrowPointToCenter: BooleanConstructor;
  readonly disabled: BooleanConstructor;
  readonly getDisabled: PropType<() => boolean>;
  readonly displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  readonly arrowClass: StringConstructor;
  readonly arrowStyle: PropType<string | CSSProperties>;
  readonly arrowWrapperClass: StringConstructor;
  readonly arrowWrapperStyle: PropType<string | CSSProperties>;
  readonly flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  readonly width: {
    type: PropType<number | "trigger">;
    default: undefined;
  };
  readonly overlap: BooleanConstructor;
  readonly keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  readonly zIndex: NumberConstructor;
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly scrollable: BooleanConstructor;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<CSSProperties | string>;
  readonly headerClass: StringConstructor;
  readonly headerStyle: PropType<CSSProperties | string>;
  readonly footerClass: StringConstructor;
  readonly footerStyle: PropType<CSSProperties | string>;
  readonly onClickoutside: PropType<(e: MouseEvent) => void>;
  readonly 'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  readonly internalDeactivateImmediately: BooleanConstructor;
  readonly internalSyncTargetWithParent: BooleanConstructor;
  readonly internalInheritedEventHandlers: {
    type: PropType<TriggerEventHandlers[]>;
    default: () => never[];
  };
  readonly internalTrapFocus: BooleanConstructor;
  readonly internalExtraClass: {
    type: PropType<string[]>;
    default: () => never[];
  };
  readonly onShow: PropType<MaybeArray<(value: boolean) => void> | undefined>;
  readonly onHide: PropType<MaybeArray<(value: boolean) => void> | undefined>;
  readonly arrow: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  readonly minWidth: NumberConstructor;
  readonly maxWidth: NumberConstructor;
};
type DropdownProps = ExtractPublicPropTypes<typeof dropdownProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly theme: PropType<DropdownTheme>;
  readonly themeOverrides: PropType<DropdownThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DropdownThemeOverrides>;
  readonly animated: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly size: PropType<DropdownSize>;
  readonly inverted: BooleanConstructor;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom";
  };
  readonly onSelect: PropType<MaybeArray<OnUpdateValue>>;
  readonly options: {
    readonly type: PropType<DropdownMixedOption[]>;
    readonly default: () => never[];
  };
  readonly menuProps: PropType<DropdownMenuProps>;
  readonly showArrow: BooleanConstructor;
  readonly renderLabel: PropType<RenderLabel>;
  readonly renderIcon: PropType<RenderIcon>;
  readonly renderOption: PropType<RenderOption>;
  readonly nodeProps: PropType<NodeProps>;
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly value: PropType<Key | null>;
  readonly show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  readonly defaultShow: BooleanConstructor;
  readonly trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  readonly delay: {
    type: NumberConstructor;
    default: number;
  };
  readonly duration: {
    type: NumberConstructor;
    default: number;
  };
  readonly raw: BooleanConstructor;
  readonly x: NumberConstructor;
  readonly y: NumberConstructor;
  readonly arrowPointToCenter: BooleanConstructor;
  readonly disabled: BooleanConstructor;
  readonly getDisabled: PropType<() => boolean>;
  readonly displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  readonly arrowClass: StringConstructor;
  readonly arrowStyle: PropType<string | CSSProperties>;
  readonly arrowWrapperClass: StringConstructor;
  readonly arrowWrapperStyle: PropType<string | CSSProperties>;
  readonly flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  readonly width: {
    type: PropType<number | "trigger">;
    default: undefined;
  };
  readonly overlap: BooleanConstructor;
  readonly keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  readonly zIndex: NumberConstructor;
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly scrollable: BooleanConstructor;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<CSSProperties | string>;
  readonly headerClass: StringConstructor;
  readonly headerStyle: PropType<CSSProperties | string>;
  readonly footerClass: StringConstructor;
  readonly footerStyle: PropType<CSSProperties | string>;
  readonly onClickoutside: PropType<(e: MouseEvent) => void>;
  readonly 'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  readonly internalDeactivateImmediately: BooleanConstructor;
  readonly internalSyncTargetWithParent: BooleanConstructor;
  readonly internalInheritedEventHandlers: {
    type: PropType<TriggerEventHandlers[]>;
    default: () => never[];
  };
  readonly internalTrapFocus: BooleanConstructor;
  readonly internalExtraClass: {
    type: PropType<string[]>;
    default: () => never[];
  };
  readonly onShow: PropType<MaybeArray<(value: boolean) => void> | undefined>;
  readonly onHide: PropType<MaybeArray<(value: boolean) => void> | undefined>;
  readonly arrow: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  readonly minWidth: NumberConstructor;
  readonly maxWidth: NumberConstructor;
}>, {
  mergedClsPrefix: Ref<string, string>;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: DropdownThemeVars;
    peers: {
      Popover: PopoverTheme;
    };
    peerOverrides: {
      Popover?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  mergedSize: import("vue").ComputedRef<DropdownSize>;
  tmNodes: import("vue").ComputedRef<TreeNode<MenuOption | MenuRenderOption, MenuGroupOption, MenuIgnoredOption>[]>;
  mergedShow: import("vue").ComputedRef<boolean>;
  handleAfterLeave: () => void;
  doUpdateShow: (value: boolean) => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly theme: PropType<DropdownTheme>;
  readonly themeOverrides: PropType<DropdownThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DropdownThemeOverrides>;
  readonly animated: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly size: PropType<DropdownSize>;
  readonly inverted: BooleanConstructor;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom";
  };
  readonly onSelect: PropType<MaybeArray<OnUpdateValue>>;
  readonly options: {
    readonly type: PropType<DropdownMixedOption[]>;
    readonly default: () => never[];
  };
  readonly menuProps: PropType<DropdownMenuProps>;
  readonly showArrow: BooleanConstructor;
  readonly renderLabel: PropType<RenderLabel>;
  readonly renderIcon: PropType<RenderIcon>;
  readonly renderOption: PropType<RenderOption>;
  readonly nodeProps: PropType<NodeProps>;
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly value: PropType<Key | null>;
  readonly show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  readonly defaultShow: BooleanConstructor;
  readonly trigger: {
    type: PropType<PopoverTrigger>;
    default: string;
  };
  readonly delay: {
    type: NumberConstructor;
    default: number;
  };
  readonly duration: {
    type: NumberConstructor;
    default: number;
  };
  readonly raw: BooleanConstructor;
  readonly x: NumberConstructor;
  readonly y: NumberConstructor;
  readonly arrowPointToCenter: BooleanConstructor;
  readonly disabled: BooleanConstructor;
  readonly getDisabled: PropType<() => boolean>;
  readonly displayDirective: {
    type: PropType<"if" | "show">;
    default: string;
  };
  readonly arrowClass: StringConstructor;
  readonly arrowStyle: PropType<string | CSSProperties>;
  readonly arrowWrapperClass: StringConstructor;
  readonly arrowWrapperStyle: PropType<string | CSSProperties>;
  readonly flip: {
    type: BooleanConstructor;
    default: boolean;
  };
  readonly width: {
    type: PropType<number | "trigger">;
    default: undefined;
  };
  readonly overlap: BooleanConstructor;
  readonly keepAliveOnHover: {
    type: BooleanConstructor;
    default: boolean;
  };
  readonly zIndex: NumberConstructor;
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly scrollable: BooleanConstructor;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<CSSProperties | string>;
  readonly headerClass: StringConstructor;
  readonly headerStyle: PropType<CSSProperties | string>;
  readonly footerClass: StringConstructor;
  readonly footerStyle: PropType<CSSProperties | string>;
  readonly onClickoutside: PropType<(e: MouseEvent) => void>;
  readonly 'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  readonly internalDeactivateImmediately: BooleanConstructor;
  readonly internalSyncTargetWithParent: BooleanConstructor;
  readonly internalInheritedEventHandlers: {
    type: PropType<TriggerEventHandlers[]>;
    default: () => never[];
  };
  readonly internalTrapFocus: BooleanConstructor;
  readonly internalExtraClass: {
    type: PropType<string[]>;
    default: () => never[];
  };
  readonly onShow: PropType<MaybeArray<(value: boolean) => void> | undefined>;
  readonly onHide: PropType<MaybeArray<(value: boolean) => void> | undefined>;
  readonly arrow: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  readonly minWidth: NumberConstructor;
  readonly maxWidth: NumberConstructor;
}>> & Readonly<{}>, {
  readonly to: string | boolean | HTMLElement;
  readonly raw: boolean;
  readonly width: number | "trigger";
  readonly duration: number;
  readonly scrollable: boolean;
  readonly trigger: PopoverTrigger;
  readonly disabled: boolean;
  readonly placement: FollowerPlacement;
  readonly options: DropdownMixedOption[];
  readonly show: boolean | undefined;
  readonly defaultShow: boolean;
  readonly showArrow: boolean;
  readonly delay: number;
  readonly arrowPointToCenter: boolean;
  readonly displayDirective: "if" | "show";
  readonly flip: boolean;
  readonly animated: boolean;
  readonly overlap: boolean;
  readonly keepAliveOnHover: boolean;
  readonly internalDeactivateImmediately: boolean;
  readonly internalSyncTargetWithParent: boolean;
  readonly internalInheritedEventHandlers: TriggerEventHandlers[];
  readonly internalTrapFocus: boolean;
  readonly internalExtraClass: string[];
  readonly arrow: boolean | undefined;
  readonly labelField: string;
  readonly childrenField: string;
  readonly keyboard: boolean;
  readonly inverted: boolean;
  readonly keyField: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { DropdownInjection, DropdownProps, _default as default, dropdownProps };