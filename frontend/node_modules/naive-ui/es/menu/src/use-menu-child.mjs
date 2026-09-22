import { menuInjectionKey, menuItemGroupInjectionKey, submenuInjectionKey } from "./context.mjs";
import { computed, inject } from "vue";
//#region src/menu/src/use-menu-child.ts
const ICON_MARGIN_RIGHT = 8;
function useMenuChild(props) {
  const NMenu = inject(menuInjectionKey);
  const {
    props: menuProps,
    mergedCollapsedRef
  } = NMenu;
  const NSubmenu = inject(submenuInjectionKey, null);
  const NMenuOptionGroup = inject(menuItemGroupInjectionKey, null);
  const horizontalRef = computed(() => {
    return menuProps.mode === "horizontal";
  });
  const dropdownPlacementRef = computed(() => {
    if (horizontalRef.value) return menuProps.dropdownPlacement;
    if ("tmNodes" in props) return "right-start";
    return "right";
  });
  const maxIconSizeRef = computed(() => {
    return Math.max(menuProps.collapsedIconSize ?? menuProps.iconSize, menuProps.iconSize);
  });
  return {
    dropdownPlacement: dropdownPlacementRef,
    activeIconSize: computed(() => {
      if (!horizontalRef.value && props.root && mergedCollapsedRef.value) return menuProps.collapsedIconSize ?? menuProps.iconSize;else return menuProps.iconSize;
    }),
    maxIconSize: maxIconSizeRef,
    paddingLeft: computed(() => {
      if (horizontalRef.value) return void 0;
      const {
        collapsedWidth,
        indent,
        rootIndent
      } = menuProps;
      const {
        root,
        isGroup
      } = props;
      const mergedRootIndent = rootIndent === void 0 ? indent : rootIndent;
      if (root) {
        if (mergedCollapsedRef.value) return collapsedWidth / 2 - maxIconSizeRef.value / 2;
        return mergedRootIndent;
      }
      if (NMenuOptionGroup && typeof NMenuOptionGroup.paddingLeftRef.value === "number") {
        if (mergedCollapsedRef.value) return collapsedWidth / 2 - maxIconSizeRef.value / 2;
        return indent / 2 + NMenuOptionGroup.paddingLeftRef.value;
      }
      if (NSubmenu && typeof NSubmenu.paddingLeftRef.value === "number") return (isGroup ? indent / 2 : indent) + NSubmenu.paddingLeftRef.value;
      return 0;
    }),
    iconMarginRight: computed(() => {
      const {
        collapsedWidth,
        indent,
        rootIndent
      } = menuProps;
      const {
        value: maxIconSize
      } = maxIconSizeRef;
      const {
        root
      } = props;
      if (horizontalRef.value) return ICON_MARGIN_RIGHT;
      if (!root) return ICON_MARGIN_RIGHT;
      if (!mergedCollapsedRef.value) return ICON_MARGIN_RIGHT;
      return (rootIndent === void 0 ? indent : rootIndent) + maxIconSize + ICON_MARGIN_RIGHT - (collapsedWidth + maxIconSize) / 2;
    }),
    NMenu,
    NSubmenu,
    NMenuOptionGroup
  };
}
//#endregion
export { useMenuChild };