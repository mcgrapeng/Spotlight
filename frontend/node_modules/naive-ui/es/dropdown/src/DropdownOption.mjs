import { popoverBodyInjectionKey } from "../../popover/src/interface.mjs";
import { useDeferredTrue } from "../../_utils/composable/use-deferred-true.mjs";
import { render } from "../../_utils/vue/render.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlot, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import ChevronRight_default from "../../_internal/icons/ChevronRight.mjs";
import { dropdownInjectionKey, dropdownMenuInjectionKey, dropdownOptionInjectionKey } from "./context.mjs";
import { NIcon } from "../../icon/src/Icon.mjs";
import { isSubmenuNode } from "./utils.mjs";
import DropdownMenu_default from "./DropdownMenu.mjs";
import { happensIn } from "seemly";
import { Fragment, Transition, computed, createBlock, createElementBlock, defineComponent, h, inject, mergeProps, openBlock, provide, ref } from "vue";
import { useMemo } from "vooks";
import { VBinder, VFollower, VTarget } from "vueuc";
//#region src/dropdown/src/DropdownOption.tsx
var DropdownOption_default = defineComponent({
  name: "DropdownOption",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    tmNode: {
      type: Object,
      required: true
    },
    parentKey: {
      type: [String, Number],
      default: null
    },
    placement: {
      type: String,
      default: "right-start"
    },
    props: Object,
    scrollable: Boolean
  },
  setup(props) {
    const NDropdown = inject(dropdownInjectionKey);
    const {
      hoverKeyRef,
      keyboardKeyRef,
      lastToggledSubmenuKeyRef,
      pendingKeyPathRef,
      activeKeyPathRef,
      animatedRef,
      mergedShowRef,
      renderLabelRef,
      renderIconRef,
      labelFieldRef,
      childrenFieldRef,
      renderOptionRef,
      nodePropsRef,
      menuPropsRef
    } = NDropdown;
    const NDropdownOption = inject(dropdownOptionInjectionKey, null);
    const NDropdownMenu = inject(dropdownMenuInjectionKey);
    const NPopoverBody = inject(popoverBodyInjectionKey);
    const rawNodeRef = computed(() => props.tmNode.rawNode);
    const hasSubmenuRef = computed(() => {
      const {
        value: childrenField
      } = childrenFieldRef;
      return isSubmenuNode(props.tmNode.rawNode, childrenField);
    });
    const mergedDisabledRef = computed(() => {
      const {
        disabled
      } = props.tmNode;
      return disabled;
    });
    const showSubmenuRef = computed(() => {
      if (!hasSubmenuRef.value) return false;
      const {
        key,
        disabled
      } = props.tmNode;
      if (disabled) return false;
      const {
        value: hoverKey
      } = hoverKeyRef;
      const {
        value: keyboardKey
      } = keyboardKeyRef;
      const {
        value: lastToggledSubmenuKey
      } = lastToggledSubmenuKeyRef;
      const {
        value: pendingKeyPath
      } = pendingKeyPathRef;
      if (hoverKey !== null) return pendingKeyPath.includes(key);
      if (keyboardKey !== null) return pendingKeyPath.includes(key) && pendingKeyPath[pendingKeyPath.length - 1] !== key;
      if (lastToggledSubmenuKey !== null) return pendingKeyPath.includes(key);
      return false;
    });
    const shouldDelayRef = computed(() => {
      return keyboardKeyRef.value === null && !animatedRef.value;
    });
    const deferredShowSubmenuRef = useDeferredTrue(showSubmenuRef, 300, shouldDelayRef);
    const parentEnteringSubmenuRef = computed(() => {
      return !!NDropdownOption?.enteringSubmenuRef.value;
    });
    const enteringSubmenuRef = ref(false);
    provide(dropdownOptionInjectionKey, {
      enteringSubmenuRef
    });
    function handleSubmenuBeforeEnter() {
      enteringSubmenuRef.value = true;
    }
    function handleSubmenuAfterEnter() {
      enteringSubmenuRef.value = false;
    }
    function handleMouseEnter() {
      const {
        parentKey,
        tmNode
      } = props;
      if (tmNode.disabled) return;
      if (!mergedShowRef.value) return;
      lastToggledSubmenuKeyRef.value = parentKey;
      keyboardKeyRef.value = null;
      hoverKeyRef.value = tmNode.key;
    }
    function handleMouseMove() {
      const {
        tmNode
      } = props;
      if (tmNode.disabled) return;
      if (!mergedShowRef.value) return;
      if (hoverKeyRef.value === tmNode.key) return;
      handleMouseEnter();
    }
    function handleMouseLeave(e) {
      if (props.tmNode.disabled) return;
      if (!mergedShowRef.value) return;
      const {
        relatedTarget
      } = e;
      if (relatedTarget && !happensIn({
        target: relatedTarget
      }, "dropdownOption") && !happensIn({
        target: relatedTarget
      }, "scrollbarRail")) hoverKeyRef.value = null;
    }
    function handleClick() {
      const {
        value: hasSubmenu
      } = hasSubmenuRef;
      const {
        tmNode
      } = props;
      if (!mergedShowRef.value) return;
      if (!hasSubmenu && !tmNode.disabled) {
        NDropdown.doSelect(tmNode.key, tmNode.rawNode);
        NDropdown.doUpdateShow(false);
      }
    }
    return {
      labelField: labelFieldRef,
      renderLabel: renderLabelRef,
      renderIcon: renderIconRef,
      siblingHasIcon: NDropdownMenu.showIconRef,
      siblingHasSubmenu: NDropdownMenu.hasSubmenuRef,
      menuProps: menuPropsRef,
      popoverBody: NPopoverBody,
      animated: animatedRef,
      mergedShowSubmenu: computed(() => {
        return deferredShowSubmenuRef.value && !parentEnteringSubmenuRef.value;
      }),
      rawNode: rawNodeRef,
      hasSubmenu: hasSubmenuRef,
      pending: useMemo(() => {
        const {
          value: pendingKeyPath
        } = pendingKeyPathRef;
        const {
          key
        } = props.tmNode;
        return pendingKeyPath.includes(key);
      }),
      childActive: useMemo(() => {
        const {
          value: activeKeyPath
        } = activeKeyPathRef;
        const {
          key
        } = props.tmNode;
        const index = activeKeyPath.findIndex(k => key === k);
        if (index === -1) return false;
        return index < activeKeyPath.length - 1;
      }),
      active: useMemo(() => {
        const {
          value: activeKeyPath
        } = activeKeyPathRef;
        const {
          key
        } = props.tmNode;
        const index = activeKeyPath.findIndex(k => key === k);
        if (index === -1) return false;
        return index === activeKeyPath.length - 1;
      }),
      mergedDisabled: mergedDisabledRef,
      renderOption: renderOptionRef,
      nodeProps: nodePropsRef,
      handleClick,
      handleMouseMove,
      handleMouseEnter,
      handleMouseLeave,
      handleSubmenuBeforeEnter,
      handleSubmenuAfterEnter
    };
  },
  render() {
    const {
      animated,
      rawNode,
      mergedShowSubmenu,
      clsPrefix,
      siblingHasIcon,
      siblingHasSubmenu,
      renderLabel,
      renderIcon,
      renderOption,
      nodeProps,
      props,
      scrollable
    } = this;
    let submenuVNode = null;
    if (mergedShowSubmenu) {
      const submenuNodeProps = this.menuProps?.(rawNode, rawNode.children);
      submenuVNode = (submenuVNode => {
        return openBlock(), createBlock(DropdownMenu_default, mergeProps({
          key: 1
        }, submenuNodeProps, {
          clsPrefix,
          scrollable: this.scrollable,
          tmNodes: this.tmNode.children,
          parentKey: this.tmNode.key
        }), null, 16, ["clsPrefix", "scrollable", "tmNodes", "parentKey"]);
      })(submenuVNode);
    }
    const builtinProps = {
      class: [`${clsPrefix}-dropdown-option-body`, this.pending && `${clsPrefix}-dropdown-option-body--pending`, this.active && `${clsPrefix}-dropdown-option-body--active`, this.childActive && `${clsPrefix}-dropdown-option-body--child-active`, this.mergedDisabled && `${clsPrefix}-dropdown-option-body--disabled`],
      onMousemove: this.handleMouseMove,
      onMouseenter: this.handleMouseEnter,
      onMouseleave: this.handleMouseLeave,
      onClick: this.handleClick
    };
    const optionNodeProps = nodeProps?.(rawNode);
    const node = (openBlock(), createElementBlock("div", mergeProps({
      class: [`${clsPrefix}-dropdown-option`, optionNodeProps?.class],
      "data-dropdown-option": true
    }, optionNodeProps), [normalizeVNode(() => h("div", mergeProps(builtinProps, props), [(openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${clsPrefix}-dropdown-option-body__prefix`, siblingHasIcon && `${clsPrefix}-dropdown-option-body__prefix--show-icon`])
    }, [normalizeVNode(() => [renderIcon ? renderIcon(rawNode) : render(rawNode.icon)])], 2)), (openBlock(), createElementBlock("div", {
      "data-dropdown-option": true,
      class: normalizeClass$1(`${clsPrefix}-dropdown-option-body__label`)
    }, [renderLabel ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderLabel(rawNode))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => render(rawNode[this.labelField] ?? rawNode.title))], 64))], 2)), (openBlock(), createElementBlock("div", {
      "data-dropdown-option": true,
      class: normalizeClass$1([`${clsPrefix}-dropdown-option-body__suffix`, siblingHasSubmenu && `${clsPrefix}-dropdown-option-body__suffix--has-submenu`])
    }, [this.hasSubmenu ? (openBlock(), createBlock(NIcon, {
      key: 0
    }, {
      _: 1,
      default: normalizeSlot(() => (openBlock(), createBlock(ChevronRight_default)))
    })) : normalizeVNode(() => null)], 2))])), this.hasSubmenu ? (openBlock(), createBlock(VBinder, {
      key: 0
    }, {
      default: () => [(openBlock(), createBlock(VTarget, null, {
        default: () => (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${clsPrefix}-dropdown-offset-container`)
        }, [(openBlock(), createBlock(VFollower, {
          show: this.mergedShowSubmenu,
          placement: this.placement,
          to: scrollable ? this.popoverBody || void 0 : void 0,
          teleportDisabled: !scrollable
        }, {
          default: () => {
            return openBlock(), createElementBlock("div", {
              class: normalizeClass$1(`${clsPrefix}-dropdown-menu-wrapper`)
            }, [animated ? (openBlock(), createBlock(Transition, {
              key: 0,
              onBeforeEnter: this.handleSubmenuBeforeEnter,
              onAfterEnter: this.handleSubmenuAfterEnter,
              name: "fade-in-scale-up-transition",
              appear: true
            }, {
              default: () => submenuVNode
            }, 1032, ["onBeforeEnter", "onAfterEnter"])) : (openBlock(), createElementBlock(Fragment, {
              key: 1
            }, [normalizeVNode(() => submenuVNode)], 64))], 2);
          }
        }, 1032, ["show", "placement", "to", "teleportDisabled"]))], 2))
      }, 1024))]
    }, 1024)) : normalizeVNode(() => null)], 16));
    if (renderOption) return renderOption({
      node,
      option: rawNode
    });
    return node;
  }
});
//#endregion
export { DropdownOption_default as default };