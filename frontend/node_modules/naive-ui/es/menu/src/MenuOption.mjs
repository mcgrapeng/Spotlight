import { keysOf } from "../../_utils/vue/keysOf.mjs";
import { render } from "../../_utils/vue/render.mjs";
import Tooltip_default from "../../tooltip/src/Tooltip.mjs";
import MenuOptionContent_default from "./MenuOptionContent.mjs";
import { useMenuChild } from "./use-menu-child.mjs";
import { useMenuChildProps } from "./use-menu-child-props.mjs";
import { computed, createBlock, createElementBlock, defineComponent, mergeProps, openBlock } from "vue";
import { useMemo } from "vooks";
//#region src/menu/src/MenuOption.tsx
const menuItemProps = {
  ...useMenuChildProps,
  tmNode: {
    type: Object,
    required: true
  },
  disabled: Boolean,
  icon: Function,
  onClick: Function
};
const menuItemPropKeys = keysOf(menuItemProps);
const NMenuOption = defineComponent({
  name: "MenuOption",
  props: menuItemProps,
  setup(props) {
    const MenuChild = useMenuChild(props);
    const {
      NSubmenu,
      NMenu,
      NMenuOptionGroup
    } = MenuChild;
    const {
      props: menuProps,
      mergedClsPrefixRef,
      mergedCollapsedRef
    } = NMenu;
    const parentDisabledRef = NSubmenu ? NSubmenu.mergedDisabledRef : NMenuOptionGroup ? NMenuOptionGroup.mergedDisabledRef : {
      value: false
    };
    const mergedDisabledRef = computed(() => {
      return parentDisabledRef.value || props.disabled;
    });
    function doClick(e) {
      const {
        onClick
      } = props;
      if (onClick) onClick(e);
    }
    function handleClick(e) {
      if (!mergedDisabledRef.value) {
        NMenu.doSelect(props.internalKey, props.tmNode.rawNode);
        doClick(e);
      }
    }
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      dropdownPlacement: MenuChild.dropdownPlacement,
      paddingLeft: MenuChild.paddingLeft,
      iconMarginRight: MenuChild.iconMarginRight,
      maxIconSize: MenuChild.maxIconSize,
      activeIconSize: MenuChild.activeIconSize,
      mergedTheme: NMenu.mergedThemeRef,
      menuProps,
      dropdownEnabled: useMemo(() => {
        return props.root && mergedCollapsedRef.value && menuProps.mode !== "horizontal" && !mergedDisabledRef.value;
      }),
      selected: useMemo(() => {
        if (NMenu.mergedValueRef.value === props.internalKey) return true;
        return false;
      }),
      mergedDisabled: mergedDisabledRef,
      handleClick
    };
  },
  render() {
    const {
      mergedClsPrefix,
      mergedTheme,
      tmNode,
      menuProps: {
        renderLabel,
        nodeProps
      }
    } = this;
    const attrs = nodeProps?.(tmNode.rawNode);
    return openBlock(), createElementBlock("div", mergeProps(attrs, {
      role: "menuitem",
      class: [`${mergedClsPrefix}-menu-item`, attrs?.class]
    }), [(openBlock(), createBlock(Tooltip_default, {
      theme: mergedTheme.peers.Tooltip,
      themeOverrides: mergedTheme.peerOverrides.Tooltip,
      trigger: "hover",
      placement: this.dropdownPlacement,
      disabled: !this.dropdownEnabled || this.title === void 0,
      internalExtraClass: ["menu-tooltip"]
    }, {
      default: () => renderLabel ? renderLabel(tmNode.rawNode) : render(this.title),
      trigger: () => (openBlock(), createBlock(MenuOptionContent_default, {
        tmNode,
        clsPrefix: mergedClsPrefix,
        paddingLeft: this.paddingLeft,
        iconMarginRight: this.iconMarginRight,
        maxIconSize: this.maxIconSize,
        activeIconSize: this.activeIconSize,
        selected: this.selected,
        title: this.title,
        extra: this.extra,
        disabled: this.mergedDisabled,
        icon: this.icon,
        onClick: this.handleClick
      }, null, 8, ["tmNode", "clsPrefix", "paddingLeft", "iconMarginRight", "maxIconSize", "activeIconSize", "selected", "title", "extra", "disabled", "icon", "onClick"]))
    }, 1032, ["theme", "themeOverrides", "placement", "disabled"]))], 16);
  }
});
//#endregion
export { NMenuOption, menuItemPropKeys, menuItemProps };