import { ThemeCommonVars } from "../../_styles/common/light.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { TooltipTheme } from "../../tooltip/styles/light.js";
import "../../tooltip/styles/index.js";
import { DropdownTheme } from "../../dropdown/styles/light.js";
import "../../dropdown/styles/index.js";
import { TmNode } from "./interface.js";
import { MenuThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { MenuSetupProps } from "./Menu.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { PropType } from "vue";
//#region src/menu/src/MenuOption.d.ts
declare const menuItemProps: {
  readonly tmNode: {
    readonly type: PropType<TmNode>;
    readonly required: true;
  };
  readonly disabled: BooleanConstructor;
  readonly icon: FunctionConstructor;
  readonly onClick: FunctionConstructor;
  readonly internalKey: {
    readonly type: PropType<import("treemate").Key>;
    readonly required: true;
  };
  readonly root: BooleanConstructor;
  readonly isGroup: BooleanConstructor;
  readonly level: {
    readonly type: NumberConstructor;
    readonly required: true;
  };
  readonly title: PropType<string | (() => import("vue").VNodeChild)>;
  readonly extra: PropType<string | (() => import("vue").VNodeChild)>;
};
declare const menuItemPropKeys: ("title" | "icon" | "onClick" | "disabled" | "root" | "extra" | "tmNode" | "internalKey" | "isGroup" | "level")[];
declare const NMenuOption: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly tmNode: {
    readonly type: PropType<TmNode>;
    readonly required: true;
  };
  readonly disabled: BooleanConstructor;
  readonly icon: FunctionConstructor;
  readonly onClick: FunctionConstructor;
  readonly internalKey: {
    readonly type: PropType<import("treemate").Key>;
    readonly required: true;
  };
  readonly root: BooleanConstructor;
  readonly isGroup: BooleanConstructor;
  readonly level: {
    readonly type: NumberConstructor;
    readonly required: true;
  };
  readonly title: PropType<string | (() => import("vue").VNodeChild)>;
  readonly extra: PropType<string | (() => import("vue").VNodeChild)>;
}>, {
  mergedClsPrefix: import("vue").Ref<string, string>;
  dropdownPlacement: import("vue").ComputedRef<import("vueuc").FollowerPlacement>;
  paddingLeft: import("vue").ComputedRef<number | undefined>;
  iconMarginRight: import("vue").ComputedRef<number>;
  maxIconSize: import("vue").ComputedRef<number>;
  activeIconSize: import("vue").ComputedRef<number>;
  mergedTheme: import("vue").Ref<{
    common: ThemeCommonVars;
    self: MenuThemeVars;
    peers: {
      Tooltip: TooltipTheme;
      Dropdown: DropdownTheme;
    };
    peerOverrides: {
      Tooltip?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
      Dropdown?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }, {
    common: ThemeCommonVars;
    self: MenuThemeVars;
    peers: {
      Tooltip: TooltipTheme;
      Dropdown: DropdownTheme;
    };
    peerOverrides: {
      Tooltip?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
      Dropdown?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  menuProps: MenuSetupProps;
  dropdownEnabled: import("vue").ComputedRef<boolean>;
  selected: import("vue").ComputedRef<boolean>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  handleClick: (e: MouseEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly tmNode: {
    readonly type: PropType<TmNode>;
    readonly required: true;
  };
  readonly disabled: BooleanConstructor;
  readonly icon: FunctionConstructor;
  readonly onClick: FunctionConstructor;
  readonly internalKey: {
    readonly type: PropType<import("treemate").Key>;
    readonly required: true;
  };
  readonly root: BooleanConstructor;
  readonly isGroup: BooleanConstructor;
  readonly level: {
    readonly type: NumberConstructor;
    readonly required: true;
  };
  readonly title: PropType<string | (() => import("vue").VNodeChild)>;
  readonly extra: PropType<string | (() => import("vue").VNodeChild)>;
}>> & Readonly<{}>, {
  readonly disabled: boolean;
  readonly root: boolean;
  readonly isGroup: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { NMenuOption, menuItemPropKeys, menuItemProps };