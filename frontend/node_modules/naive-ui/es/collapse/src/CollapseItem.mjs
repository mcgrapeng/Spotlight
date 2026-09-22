import { throwError } from "../../_utils/naive/warn.mjs";
import { resolveSlotWithTypedProps, resolveWrappedSlotWithProps } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlots, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import ChevronLeft_default from "../../_internal/icons/ChevronLeft.mjs";
import ChevronRight_default from "../../_internal/icons/ChevronRight.mjs";
import { collapseInjectionKey } from "./Collapse.mjs";
import CollapseItemContent_default from "./CollapseItemContent.mjs";
import { createId, happensIn } from "seemly";
import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, inject, openBlock, toRef } from "vue";
import { useMemo } from "vooks";
//#region src/collapse/src/CollapseItem.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["onClick"];
const collapseItemProps = {
  title: String,
  name: [String, Number],
  disabled: Boolean,
  displayDirective: String
};
var CollapseItem_default = defineComponent({
  name: "CollapseItem",
  props: collapseItemProps,
  setup(props) {
    const {
      mergedRtlRef
    } = useConfig(props);
    const randomName = createId();
    const mergedNameRef = useMemo(() => {
      return props.name ?? randomName;
    });
    const NCollapse = inject(collapseInjectionKey);
    if (!NCollapse) throwError("collapse-item", "`n-collapse-item` must be placed inside `n-collapse`.");
    const {
      expandedNamesRef,
      props: collapseProps,
      mergedClsPrefixRef,
      slots: collapseSlots
    } = NCollapse;
    const collapsedRef = computed(() => {
      const {
        value: expandedNames
      } = expandedNamesRef;
      if (Array.isArray(expandedNames)) {
        const {
          value: name
        } = mergedNameRef;
        return !~expandedNames.findIndex(expandedName => expandedName === name);
      } else if (expandedNames) {
        const {
          value: name
        } = mergedNameRef;
        return name !== expandedNames;
      }
      return true;
    });
    return {
      rtlEnabled: useRtl("Collapse", mergedRtlRef, mergedClsPrefixRef),
      collapseSlots,
      randomName,
      mergedClsPrefix: mergedClsPrefixRef,
      collapsed: collapsedRef,
      triggerAreas: toRef(collapseProps, "triggerAreas"),
      mergedDisplayDirective: computed(() => {
        const {
          displayDirective
        } = props;
        if (displayDirective) return displayDirective;else return collapseProps.displayDirective;
      }),
      arrowPlacement: computed(() => {
        return collapseProps.arrowPlacement;
      }),
      handleClick(e) {
        let happensInArea = "main";
        if (happensIn(e, "arrow")) happensInArea = "arrow";
        if (happensIn(e, "extra")) happensInArea = "extra";
        if (!collapseProps.triggerAreas.includes(happensInArea)) return;
        if (NCollapse && !props.disabled) NCollapse.toggleItem(collapsedRef.value, mergedNameRef.value, e);
      }
    };
  },
  render() {
    const {
      collapseSlots,
      $slots,
      arrowPlacement,
      collapsed,
      mergedDisplayDirective,
      mergedClsPrefix,
      disabled,
      triggerAreas
    } = this;
    const headerNode = resolveSlotWithTypedProps($slots.header, {
      collapsed
    }, () => [this.title]);
    const headerExtraSlot = $slots["header-extra"] || collapseSlots["header-extra"];
    const arrowSlot = $slots.arrow || collapseSlots.arrow;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-collapse-item`, `${mergedClsPrefix}-collapse-item--${arrowPlacement}-arrow-placement`, disabled && `${mergedClsPrefix}-collapse-item--disabled`, !collapsed && `${mergedClsPrefix}-collapse-item--active`, triggerAreas.map(area => {
        return `${mergedClsPrefix}-collapse-item--trigger-area-${area}`;
      })])
    }, [createElementVNode("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-collapse-item__header`, !collapsed && `${mergedClsPrefix}-collapse-item__header--active`])
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-collapse-item__header-main`),
      onClick: this.handleClick
    }, [normalizeVNode(() => arrowPlacement === "right" && headerNode), (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-collapse-item-arrow`),
      key: this.rtlEnabled ? 0 : 1,
      "data-arrow": true
    }, [normalizeVNode(() => resolveSlotWithTypedProps(arrowSlot, {
      collapsed
    }, () => [(openBlock(), createBlock(Icon_default, {
      clsPrefix: mergedClsPrefix
    }, {
      default: () => this.rtlEnabled ? (openBlock(), createBlock(ChevronLeft_default, {
        key: 1
      })) : (openBlock(), createBlock(ChevronRight_default, {
        key: 2
      }))
    }, 1032, ["clsPrefix"]))]))], 2)), normalizeVNode(() => arrowPlacement === "left" && headerNode)], 10, _hoisted_2), normalizeVNode(() => resolveWrappedSlotWithProps(headerExtraSlot, {
      collapsed
    }, children => (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-collapse-item__header-extra`),
      onClick: this.handleClick,
      "data-extra": true
    }, [normalizeVNode(() => children)], 10, _hoisted_1))))], 2), (openBlock(), createBlock(CollapseItemContent_default, {
      clsPrefix: mergedClsPrefix,
      displayDirective: mergedDisplayDirective,
      show: !collapsed
    }, normalizeSlots($slots), 1032, ["clsPrefix", "displayDirective", "show"]))], 2);
  }
});
//#endregion
export { collapseItemProps, CollapseItem_default as default };