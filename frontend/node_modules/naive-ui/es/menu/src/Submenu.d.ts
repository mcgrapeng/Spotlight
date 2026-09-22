import { ThemeCommonVars } from "../../_styles/common/light.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { TooltipTheme } from "../../tooltip/styles/light.js";
import "../../tooltip/styles/index.js";
import { DropdownTheme } from "../../dropdown/styles/light.js";
import "../../dropdown/styles/index.js";
import { MenuMixedOption, OnUpdateValueImpl, TmNode } from "./interface.js";
import { MenuThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { MenuSetupProps } from "./Menu.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { PropType, VNodeChild } from "vue";
//#region src/menu/src/Submenu.d.ts
declare const submenuProps: {
  readonly rawNodes: {
    readonly type: PropType<MenuMixedOption[]>;
    readonly default: () => never[];
  };
  readonly tmNodes: {
    readonly type: PropType<TmNode[]>;
    readonly default: () => never[];
  };
  readonly tmNode: {
    readonly type: PropType<TmNode>;
    readonly required: true;
  };
  readonly disabled: BooleanConstructor;
  readonly icon: PropType<() => VNodeChild>;
  readonly onClick: PropType<() => void>;
  readonly domId: StringConstructor;
  readonly virtualChildActive: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly isEllipsisPlaceholder: BooleanConstructor;
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
  readonly title: PropType<string | (() => VNodeChild)>;
  readonly extra: PropType<string | (() => VNodeChild)>;
};
declare const submenuPropKeys: ("title" | "icon" | "onClick" | "disabled" | "root" | "extra" | "tmNodes" | "tmNode" | "internalKey" | "isGroup" | "level" | "rawNodes" | "domId" | "virtualChildActive" | "isEllipsisPlaceholder")[];
declare const NSubmenu: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly rawNodes: {
    readonly type: PropType<MenuMixedOption[]>;
    readonly default: () => never[];
  };
  readonly tmNodes: {
    readonly type: PropType<TmNode[]>;
    readonly default: () => never[];
  };
  readonly tmNode: {
    readonly type: PropType<TmNode>;
    readonly required: true;
  };
  readonly disabled: BooleanConstructor;
  readonly icon: PropType<() => VNodeChild>;
  readonly onClick: PropType<() => void>;
  readonly domId: StringConstructor;
  readonly virtualChildActive: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly isEllipsisPlaceholder: BooleanConstructor;
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
  readonly title: PropType<string | (() => VNodeChild)>;
  readonly extra: PropType<string | (() => VNodeChild)>;
}>, {
  menuProps: MenuSetupProps;
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
  doSelect: OnUpdateValueImpl;
  inverted: import("vue").Ref<boolean, boolean>;
  isHorizontal: import("vue").Ref<boolean, boolean>;
  mergedClsPrefix: import("vue").Ref<string, string>;
  maxIconSize: import("vue").ComputedRef<number>;
  activeIconSize: import("vue").ComputedRef<number>;
  iconMarginRight: import("vue").ComputedRef<number>;
  dropdownPlacement: import("vue").ComputedRef<import("vueuc").FollowerPlacement>;
  dropdownShow: import("vue").Ref<boolean, boolean>;
  paddingLeft: import("vue").ComputedRef<number | undefined>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  mergedValue: import("vue").Ref<import("treemate").Key | null, import("treemate").Key | null>;
  childActive: import("vue").ComputedRef<boolean>;
  collapsed: import("vue").ComputedRef<boolean>;
  dropdownEnabled: import("vue").ComputedRef<boolean>;
  handlePopoverShowChange: (value: boolean) => void;
  handleClick: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly rawNodes: {
    readonly type: PropType<MenuMixedOption[]>;
    readonly default: () => never[];
  };
  readonly tmNodes: {
    readonly type: PropType<TmNode[]>;
    readonly default: () => never[];
  };
  readonly tmNode: {
    readonly type: PropType<TmNode>;
    readonly required: true;
  };
  readonly disabled: BooleanConstructor;
  readonly icon: PropType<() => VNodeChild>;
  readonly onClick: PropType<() => void>;
  readonly domId: StringConstructor;
  readonly virtualChildActive: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly isEllipsisPlaceholder: BooleanConstructor;
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
  readonly title: PropType<string | (() => VNodeChild)>;
  readonly extra: PropType<string | (() => VNodeChild)>;
}>> & Readonly<{}>, {
  readonly disabled: boolean;
  readonly root: boolean;
  readonly tmNodes: TmNode[];
  readonly isGroup: boolean;
  readonly rawNodes: MenuMixedOption[];
  readonly virtualChildActive: boolean;
  readonly isEllipsisPlaceholder: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { NSubmenu, submenuPropKeys, submenuProps };