import { keysOf } from "../../_utils/vue/keysOf.mjs";
import { render } from "../../_utils/vue/render.mjs";
import { createVNodeCache, normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { menuInjectionKey, menuItemGroupInjectionKey } from "./context.mjs";
import { useMenuChild } from "./use-menu-child.mjs";
import { useMenuChildProps } from "./use-menu-child-props.mjs";
import { itemRenderer } from "./utils.mjs";
import { Fragment, computed, createElementBlock, createElementVNode, defineComponent, inject, mergeProps, openBlock, provide } from "vue";
//#region src/menu/src/MenuOptionGroup.tsx
const menuItemGroupProps = {
  ...useMenuChildProps,
  tmNode: {
    type: Object,
    required: true
  },
  tmNodes: {
    type: Array,
    required: true
  }
};
const menuItemGroupPropKeys = keysOf(menuItemGroupProps);
const NMenuOptionGroup = defineComponent({
  name: "MenuOptionGroup",
  props: menuItemGroupProps,
  setup(props) {
    const MenuChild = useMenuChild(props);
    const {
      NSubmenu
    } = MenuChild;
    const mergedDisabledRef = computed(() => {
      if (NSubmenu?.mergedDisabledRef.value) return true;
      return props.tmNode.disabled;
    });
    provide(menuItemGroupInjectionKey, {
      paddingLeftRef: MenuChild.paddingLeft,
      mergedDisabledRef
    });
    const {
      mergedClsPrefixRef,
      props: menuProps
    } = inject(menuInjectionKey);
    return function () {
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      const paddingLeft = MenuChild.paddingLeft.value;
      const {
        nodeProps
      } = menuProps;
      const attrs = nodeProps?.(props.tmNode.rawNode);
      return (() => {
        const _cache = createVNodeCache("45eca6a63be5028b");
        return openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-menu-item-group`),
          role: "group"
        }, [createElementVNode("div", mergeProps(attrs, {
          class: [`${mergedClsPrefix}-menu-item-group-title`, attrs?.class],
          style: [attrs?.style || "", paddingLeft !== void 0 ? `padding-left: ${paddingLeft}px;` : ""]
        }), [normalizeVNode(() => render(props.title)), props.extra ? (openBlock(), createElementBlock(Fragment, {
          key: 0
        }, [_cache[0] || (_cache[0] = normalizeVNode(" ", -1)), normalizeVNode(() => render(props.extra))], 64)) : normalizeVNode(() => null)], 16), createElementVNode("div", null, [normalizeVNode(() => props.tmNodes.map(tmNode => itemRenderer(tmNode, menuProps)))])], 2);
      })();
    };
  }
});
//#endregion
export { NMenuOptionGroup, menuItemGroupPropKeys, menuItemGroupProps };