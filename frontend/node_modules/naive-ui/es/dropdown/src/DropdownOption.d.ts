import { MenuGroupOption, MenuIgnoredOption, MenuNodeProps, MenuOption } from "../../menu/src/interface.js";
import { DropdownGroupOption, DropdownIgnoredOption, DropdownMenuProps, DropdownOption, RenderIconImpl, RenderLabelImpl, RenderOptionImpl } from "./interface.js";
import "../../index.js";
import { HTMLAttributes, PropType, Ref } from "vue";
import { FollowerPlacement } from "vueuc";
import { TreeNode } from "treemate";
//#region src/dropdown/src/DropdownOption.d.ts
interface NDropdownOptionInjection {
  enteringSubmenuRef: Ref<boolean>;
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  tmNode: {
    type: PropType<TreeNode<DropdownOption, DropdownGroupOption, DropdownIgnoredOption>>;
    required: true;
  };
  parentKey: {
    type: PropType<string | number | null>;
    default: null;
  };
  placement: {
    type: PropType<FollowerPlacement>;
    default: string;
  };
  props: PropType<HTMLAttributes>;
  scrollable: BooleanConstructor;
}>, {
  labelField: Ref<string, string>;
  renderLabel: Ref<RenderLabelImpl | undefined, RenderLabelImpl | undefined>;
  renderIcon: Ref<RenderIconImpl | undefined, RenderIconImpl | undefined>;
  siblingHasIcon: Ref<boolean, boolean>;
  siblingHasSubmenu: Ref<boolean, boolean>;
  menuProps: Ref<DropdownMenuProps | undefined, DropdownMenuProps | undefined>;
  popoverBody: Ref<HTMLElement | null, HTMLElement | null>;
  animated: Ref<boolean, boolean>;
  mergedShowSubmenu: import("vue").ComputedRef<boolean>;
  rawNode: import("vue").ComputedRef<MenuOption | MenuGroupOption | MenuIgnoredOption>;
  hasSubmenu: import("vue").ComputedRef<boolean>;
  pending: import("vue").ComputedRef<boolean>;
  childActive: import("vue").ComputedRef<boolean>;
  active: import("vue").ComputedRef<boolean>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  renderOption: Ref<RenderOptionImpl | undefined, RenderOptionImpl | undefined>;
  nodeProps: Ref<MenuNodeProps | undefined, MenuNodeProps | undefined>;
  handleClick: () => void;
  handleMouseMove: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: (e: MouseEvent) => void;
  handleSubmenuBeforeEnter: () => void;
  handleSubmenuAfterEnter: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  tmNode: {
    type: PropType<TreeNode<DropdownOption, DropdownGroupOption, DropdownIgnoredOption>>;
    required: true;
  };
  parentKey: {
    type: PropType<string | number | null>;
    default: null;
  };
  placement: {
    type: PropType<FollowerPlacement>;
    default: string;
  };
  props: PropType<HTMLAttributes>;
  scrollable: BooleanConstructor;
}>> & Readonly<{}>, {
  scrollable: boolean;
  placement: FollowerPlacement;
  parentKey: string | number | null;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { NDropdownOptionInjection, _default as default };