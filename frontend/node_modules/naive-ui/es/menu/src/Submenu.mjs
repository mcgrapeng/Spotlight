import { keysOf } from "../../_utils/vue/keysOf.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import FadeInExpandTransition_default from "../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.mjs";
import Dropdown_default from "../../dropdown/src/Dropdown.mjs";
import { menuItemGroupInjectionKey, submenuInjectionKey } from "./context.mjs";
import MenuOptionContent_default from "./MenuOptionContent.mjs";
import { useMenuChild } from "./use-menu-child.mjs";
import { useMenuChildProps } from "./use-menu-child-props.mjs";
import { itemRenderer } from "./utils.mjs";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, mergeProps, openBlock, provide, ref } from "vue";
import { useMemo } from "vooks";
//#region src/menu/src/Submenu.tsx
const _hoisted_1 = ["aria-expanded", "id"];
const _hoisted_2 = ["aria-expanded", "id"];
const submenuProps = {
  ...useMenuChildProps,
  rawNodes: {
    type: Array,
    default: () => []
  },
  tmNodes: {
    type: Array,
    default: () => []
  },
  tmNode: {
    type: Object,
    required: true
  },
  disabled: Boolean,
  icon: Function,
  onClick: Function,
  domId: String,
  virtualChildActive: {
    type: Boolean,
    default: void 0
  },
  isEllipsisPlaceholder: Boolean
};
const submenuPropKeys = keysOf(submenuProps);
const NSubmenu = defineComponent({
  name: "Submenu",
  props: submenuProps,
  setup(props) {
    const MenuChild = useMenuChild(props);
    const {
      NMenu,
      NSubmenu
    } = MenuChild;
    const {
      props: menuProps,
      mergedCollapsedRef,
      mergedThemeRef
    } = NMenu;
    const mergedDisabledRef = computed(() => {
      const {
        disabled
      } = props;
      if (NSubmenu?.mergedDisabledRef.value) return true;
      if (menuProps.disabled) return true;
      return disabled;
    });
    const dropdownShowRef = ref(false);
    provide(submenuInjectionKey, {
      paddingLeftRef: MenuChild.paddingLeft,
      mergedDisabledRef
    });
    provide(menuItemGroupInjectionKey, null);
    function doClick() {
      const {
        onClick
      } = props;
      if (onClick) onClick();
    }
    function handleClick() {
      if (!mergedDisabledRef.value) {
        if (!mergedCollapsedRef.value) NMenu.toggleExpand(props.internalKey);
        doClick();
      }
    }
    function handlePopoverShowChange(value) {
      dropdownShowRef.value = value;
    }
    return {
      menuProps,
      mergedTheme: mergedThemeRef,
      doSelect: NMenu.doSelect,
      inverted: NMenu.invertedRef,
      isHorizontal: NMenu.isHorizontalRef,
      mergedClsPrefix: NMenu.mergedClsPrefixRef,
      maxIconSize: MenuChild.maxIconSize,
      activeIconSize: MenuChild.activeIconSize,
      iconMarginRight: MenuChild.iconMarginRight,
      dropdownPlacement: MenuChild.dropdownPlacement,
      dropdownShow: dropdownShowRef,
      paddingLeft: MenuChild.paddingLeft,
      mergedDisabled: mergedDisabledRef,
      mergedValue: NMenu.mergedValueRef,
      childActive: useMemo(() => {
        return props.virtualChildActive ?? NMenu.activePathRef.value.includes(props.internalKey);
      }),
      collapsed: computed(() => {
        if (menuProps.mode === "horizontal") return false;
        if (mergedCollapsedRef.value) return true;
        return !NMenu.mergedExpandedKeysRef.value.includes(props.internalKey);
      }),
      dropdownEnabled: computed(() => {
        return !mergedDisabledRef.value && (menuProps.mode === "horizontal" || mergedCollapsedRef.value);
      }),
      handlePopoverShowChange,
      handleClick
    };
  },
  render() {
    const {
      mergedClsPrefix,
      menuProps: {
        renderIcon,
        renderLabel
      }
    } = this;
    const createSubmenuItem = () => {
      const {
        isHorizontal,
        paddingLeft,
        collapsed,
        mergedDisabled,
        maxIconSize,
        activeIconSize,
        title,
        childActive,
        icon,
        handleClick,
        menuProps: {
          nodeProps
        },
        dropdownShow,
        iconMarginRight,
        tmNode,
        mergedClsPrefix,
        isEllipsisPlaceholder,
        extra
      } = this;
      const attrs = nodeProps?.(tmNode.rawNode);
      return openBlock(), createElementBlock("div", mergeProps(attrs, {
        class: [`${mergedClsPrefix}-menu-item`, attrs?.class],
        role: "menuitem"
      }), [(openBlock(), createBlock(MenuOptionContent_default, {
        tmNode,
        paddingLeft,
        collapsed,
        disabled: mergedDisabled,
        iconMarginRight,
        maxIconSize,
        activeIconSize,
        title,
        extra,
        showArrow: !isHorizontal,
        childActive,
        clsPrefix: mergedClsPrefix,
        icon,
        hover: dropdownShow,
        onClick: handleClick,
        isEllipsisPlaceholder
      }, null, 8, ["tmNode", "paddingLeft", "collapsed", "disabled", "iconMarginRight", "maxIconSize", "activeIconSize", "title", "extra", "showArrow", "childActive", "clsPrefix", "icon", "hover", "onClick", "isEllipsisPlaceholder"]))], 16);
    };
    const createSubmenuChildren = () => {
      return openBlock(), createBlock(FadeInExpandTransition_default, null, {
        default: () => {
          const {
            tmNodes,
            collapsed
          } = this;
          return !collapsed ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass$1(`${mergedClsPrefix}-submenu-children`),
            role: "menu"
          }, [normalizeVNode(() => tmNodes.map(item => itemRenderer(item, this.menuProps)))], 2)) : null;
        }
      }, 1024);
    };
    return this.root ? (openBlock(), createBlock(Dropdown_default, mergeProps({
      key: 2,
      size: "large",
      trigger: "hover"
    }, this.menuProps?.dropdownProps, {
      themeOverrides: this.mergedTheme.peerOverrides.Dropdown,
      theme: this.mergedTheme.peers.Dropdown,
      builtinThemeOverrides: {
        fontSizeLarge: "14px",
        optionIconSizeLarge: "18px"
      },
      value: this.mergedValue,
      disabled: !this.dropdownEnabled,
      placement: this.dropdownPlacement,
      keyField: this.menuProps.keyField,
      labelField: this.menuProps.labelField,
      childrenField: this.menuProps.childrenField,
      onUpdateShow: this.handlePopoverShowChange,
      options: this.rawNodes,
      onSelect: this.doSelect,
      inverted: this.inverted,
      renderIcon,
      renderLabel
    }), {
      default: () => (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-submenu`),
        role: "menu",
        "aria-expanded": !this.collapsed,
        id: this.domId
      }, [normalizeVNode(() => createSubmenuItem()), this.isHorizontal ? normalizeVNode(() => null) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => createSubmenuChildren())], 64))], 10, _hoisted_1))
    }, 1040, ["themeOverrides", "theme", "value", "disabled", "placement", "keyField", "labelField", "childrenField", "onUpdateShow", "options", "onSelect", "inverted", "renderIcon", "renderLabel"])) : (openBlock(), createElementBlock("div", {
      key: 3,
      class: normalizeClass$1(`${mergedClsPrefix}-submenu`),
      role: "menu",
      "aria-expanded": !this.collapsed,
      id: this.domId
    }, [normalizeVNode(() => createSubmenuItem()), normalizeVNode(() => createSubmenuChildren())], 10, _hoisted_2));
  }
});
//#endregion
export { NSubmenu, submenuPropKeys, submenuProps };