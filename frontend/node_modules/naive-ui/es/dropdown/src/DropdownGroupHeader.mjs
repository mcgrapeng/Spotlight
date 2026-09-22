import { render } from "../../_utils/vue/render.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { dropdownInjectionKey, dropdownMenuInjectionKey } from "./context.mjs";
import { Fragment, createElementBlock, createElementVNode, defineComponent, inject, mergeProps, openBlock } from "vue";
//#region src/dropdown/src/DropdownGroupHeader.tsx
var DropdownGroupHeader_default = defineComponent({
  name: "DropdownGroupHeader",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    tmNode: {
      type: Object,
      required: true
    }
  },
  setup() {
    const {
      showIconRef,
      hasSubmenuRef
    } = inject(dropdownMenuInjectionKey);
    const {
      renderLabelRef,
      labelFieldRef,
      nodePropsRef,
      renderOptionRef
    } = inject(dropdownInjectionKey);
    return {
      labelField: labelFieldRef,
      showIcon: showIconRef,
      hasSubmenu: hasSubmenuRef,
      renderLabel: renderLabelRef,
      nodeProps: nodePropsRef,
      renderOption: renderOptionRef
    };
  },
  render() {
    const {
      clsPrefix,
      hasSubmenu,
      showIcon,
      nodeProps,
      renderLabel,
      renderOption
    } = this;
    const {
      rawNode
    } = this.tmNode;
    const node = (openBlock(), createElementBlock("div", mergeProps({
      class: `${clsPrefix}-dropdown-option`
    }, nodeProps?.(rawNode)), [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-dropdown-option-body ${clsPrefix}-dropdown-option-body--group`)
    }, [createElementVNode("div", {
      "data-dropdown-option": true,
      class: normalizeClass$1([`${clsPrefix}-dropdown-option-body__prefix`, showIcon && `${clsPrefix}-dropdown-option-body__prefix--show-icon`])
    }, [normalizeVNode(() => render(rawNode.icon))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-dropdown-option-body__label`),
      "data-dropdown-option": true
    }, [renderLabel ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderLabel(rawNode))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => render(rawNode.title ?? rawNode[this.labelField]))], 64))], 2), createElementVNode("div", {
      class: normalizeClass$1([`${clsPrefix}-dropdown-option-body__suffix`, hasSubmenu && `${clsPrefix}-dropdown-option-body__suffix--has-submenu`]),
      "data-dropdown-option": true
    }, null, 2)], 2)], 16));
    if (renderOption) return renderOption({
      node,
      option: rawNode
    });
    return node;
  }
});
//#endregion
export { DropdownGroupHeader_default as default };