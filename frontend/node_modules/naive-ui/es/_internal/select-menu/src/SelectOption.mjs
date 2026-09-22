import { internalSelectionMenuInjectionKey } from "./interface.mjs";
import { mergeEventHandlers } from "../../../_utils/vue/merge-handlers.mjs";
import { render } from "../../../_utils/vue/render.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../icon/src/Icon.mjs";
import Checkmark_default from "../../icons/Checkmark.mjs";
import { Transition, createBlock, createElementBlock, createElementVNode, defineComponent, h, inject, mergeProps, openBlock } from "vue";
import { useMemo } from "vooks";
//#region src/_internal/select-menu/src/SelectOption.tsx
const _hoisted_1 = ["onClick", "onMouseenter", "onMousemove"];
function renderCheckMark(show, clsPrefix) {
  return openBlock(), createBlock(Transition, {
    name: "fade-in-scale-up-transition"
  }, {
    default: () => show ? (openBlock(), createBlock(Icon_default, {
      key: 1,
      clsPrefix,
      class: normalizeClass$1(`${clsPrefix}-base-select-option__check`)
    }, {
      default: () => h(Checkmark_default)
    }, 1032, ["clsPrefix", "class"])) : null
  }, 1024);
}
var SelectOption_default = defineComponent({
  name: "NBaseSelectOption",
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
  setup(props) {
    const {
      valueRef,
      pendingTmNodeRef,
      multipleRef,
      valueSetRef,
      renderLabelRef,
      renderOptionRef,
      labelFieldRef,
      valueFieldRef,
      showCheckmarkRef,
      nodePropsRef,
      handleOptionClick,
      handleOptionMouseEnter
    } = inject(internalSelectionMenuInjectionKey);
    const isPendingRef = useMemo(() => {
      const {
        value: pendingTmNode
      } = pendingTmNodeRef;
      if (!pendingTmNode) return false;
      return props.tmNode.key === pendingTmNode.key;
    });
    function handleClick(e) {
      const {
        tmNode
      } = props;
      if (tmNode.disabled) return;
      handleOptionClick(e, tmNode);
    }
    function handleMouseEnter(e) {
      const {
        tmNode
      } = props;
      if (tmNode.disabled) return;
      handleOptionMouseEnter(e, tmNode);
    }
    function handleMouseMove(e) {
      const {
        tmNode
      } = props;
      const {
        value: isPending
      } = isPendingRef;
      if (tmNode.disabled || isPending) return;
      handleOptionMouseEnter(e, tmNode);
    }
    return {
      multiple: multipleRef,
      isGrouped: useMemo(() => {
        const {
          tmNode
        } = props;
        const {
          parent
        } = tmNode;
        return parent && parent.rawNode.type === "group";
      }),
      showCheckmark: showCheckmarkRef,
      nodeProps: nodePropsRef,
      isPending: isPendingRef,
      isSelected: useMemo(() => {
        const {
          value
        } = valueRef;
        const {
          value: multiple
        } = multipleRef;
        if (value === null) return false;
        const optionValue = props.tmNode.rawNode[valueFieldRef.value];
        if (multiple) {
          const {
            value: valueSet
          } = valueSetRef;
          return valueSet.has(optionValue);
        } else return value === optionValue;
      }),
      labelField: labelFieldRef,
      renderLabel: renderLabelRef,
      renderOption: renderOptionRef,
      handleMouseMove,
      handleMouseEnter,
      handleClick
    };
  },
  render() {
    const {
      clsPrefix,
      tmNode: {
        rawNode
      },
      isSelected,
      isPending,
      isGrouped,
      showCheckmark,
      nodeProps,
      renderOption,
      renderLabel,
      handleClick,
      handleMouseEnter,
      handleMouseMove
    } = this;
    const checkmark = renderCheckMark(isSelected, clsPrefix);
    const children = renderLabel ? [renderLabel(rawNode, isSelected), showCheckmark && checkmark] : [render(rawNode[this.labelField], rawNode, isSelected), showCheckmark && checkmark];
    const attrs = nodeProps?.(rawNode);
    const node = (openBlock(), createElementBlock("div", mergeProps(attrs, {
      class: [`${clsPrefix}-base-select-option`, rawNode.class, attrs?.class, {
        [`${clsPrefix}-base-select-option--disabled`]: rawNode.disabled,
        [`${clsPrefix}-base-select-option--selected`]: isSelected,
        [`${clsPrefix}-base-select-option--grouped`]: isGrouped,
        [`${clsPrefix}-base-select-option--pending`]: isPending,
        [`${clsPrefix}-base-select-option--show-checkmark`]: showCheckmark
      }],
      style: [attrs?.style || "", rawNode.style || ""],
      onClick: mergeEventHandlers([handleClick, attrs?.onClick]),
      onMouseenter: mergeEventHandlers([handleMouseEnter, attrs?.onMouseenter]),
      onMousemove: mergeEventHandlers([handleMouseMove, attrs?.onMousemove])
    }), [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-base-select-option__content`)
    }, [normalizeVNode(() => children)], 2)], 16, _hoisted_1));
    return rawNode.render ? rawNode.render({
      node,
      option: rawNode,
      selected: isSelected
    }) : renderOption ? renderOption({
      node,
      option: rawNode,
      selected: isSelected
    }) : node;
  }
});
//#endregion
export { SelectOption_default as default };