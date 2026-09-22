import { omit } from "../../_utils/vue/omit.mjs";
import { render } from "../../_utils/vue/render.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Add_default from "../../_internal/icons/Add.mjs";
import Close_default from "../../_internal/close/src/Close.mjs";
import { tabsInjectionKey } from "./interface.mjs";
import { tabPaneProps } from "./TabPane.mjs";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, inject, mergeProps, openBlock } from "vue";
//#region src/tabs/src/Tab.tsx
const _hoisted_1 = ["data-name", "data-disabled"];
const tabProps = {
  internalLeftPadded: Boolean,
  internalAddable: Boolean,
  internalCreatedByPane: Boolean,
  ...omit(tabPaneProps, ["displayDirective"])
};
var Tab_default = defineComponent({
  __TAB__: true,
  inheritAttrs: false,
  name: "Tab",
  props: tabProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      valueRef,
      typeRef,
      closableRef,
      tabStyleRef,
      addTabStyleRef,
      tabClassRef,
      addTabClassRef,
      tabChangeIdRef,
      onBeforeLeaveRef,
      triggerRef,
      handleAdd,
      activateTab,
      handleClose
    } = inject(tabsInjectionKey);
    return {
      trigger: triggerRef,
      mergedClosable: computed(() => {
        if (props.internalAddable) return false;
        const {
          closable
        } = props;
        if (closable === void 0) return closableRef.value;
        return closable;
      }),
      style: tabStyleRef,
      addStyle: addTabStyleRef,
      tabClass: tabClassRef,
      addTabClass: addTabClassRef,
      clsPrefix: mergedClsPrefixRef,
      value: valueRef,
      type: typeRef,
      handleClose(e) {
        e.stopPropagation();
        if (props.disabled) return;
        handleClose(props.name);
      },
      activateTab() {
        if (props.disabled) return;
        if (props.internalAddable) {
          handleAdd();
          return;
        }
        const {
          name: nameProp
        } = props;
        const id = ++tabChangeIdRef.id;
        if (nameProp !== valueRef.value) {
          const {
            value: onBeforeLeave
          } = onBeforeLeaveRef;
          if (!onBeforeLeave) activateTab(nameProp);else Promise.resolve(onBeforeLeave(props.name, valueRef.value)).then(allowLeave => {
            if (allowLeave && tabChangeIdRef.id === id) activateTab(nameProp);
          });
        }
      }
    };
  },
  render() {
    const {
      internalAddable,
      clsPrefix,
      name,
      disabled,
      label,
      tab,
      value,
      mergedClosable,
      trigger,
      $slots: {
        default: defaultSlot
      }
    } = this;
    const mergedTab = label ?? tab;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-tabs-tab-wrapper`)
    }, [this.internalLeftPadded ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${clsPrefix}-tabs-tab-pad`)
    }, null, 2)) : normalizeVNode(() => null), (openBlock(), createElementBlock("div", mergeProps({
      key: name,
      "data-name": name,
      "data-disabled": disabled ? true : void 0
    }, mergeProps({
      class: [`${clsPrefix}-tabs-tab`, value === name && `${clsPrefix}-tabs-tab--active`, disabled && `${clsPrefix}-tabs-tab--disabled`, mergedClosable && `${clsPrefix}-tabs-tab--closable`, internalAddable && `${clsPrefix}-tabs-tab--addable`, internalAddable ? this.addTabClass : this.tabClass],
      onClick: trigger === "click" ? this.activateTab : void 0,
      onMouseenter: trigger === "hover" ? this.activateTab : void 0,
      style: internalAddable ? this.addStyle : this.style
    }, this.internalCreatedByPane ? this.tabProps || {} : this.$attrs)), [createElementVNode("span", {
      class: normalizeClass$1(`${clsPrefix}-tabs-tab__label`)
    }, [internalAddable ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-tabs-tab__height-placeholder`)
    }, "\xA0", 2), (openBlock(), createBlock(Icon_default, {
      clsPrefix
    }, {
      default: () => (openBlock(), createBlock(Add_default))
    }, 1032, ["clsPrefix"]))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [defaultSlot ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => defaultSlot())], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [typeof mergedTab === "object" ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => mergedTab)], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => render(mergedTab ?? name))], 64))], 64))], 64))], 2), mergedClosable && this.type === "card" ? (openBlock(), createBlock(Close_default, {
      key: 0,
      clsPrefix,
      class: normalizeClass$1(`${clsPrefix}-tabs-tab__close`),
      onClick: this.handleClose,
      disabled
    }, null, 8, ["clsPrefix", "class", "onClick", "disabled"])) : normalizeVNode(() => null)], 16, _hoisted_1))], 2);
  }
});
//#endregion
export { Tab_default as default, tabProps };