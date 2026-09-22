import { internalSelectionMenuInjectionKey } from "./interface.mjs";
import { render } from "../../../_utils/vue/render.mjs";
import { normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, defineComponent, inject, mergeProps, openBlock } from "vue";
//#region src/_internal/select-menu/src/SelectGroupHeader.tsx
var SelectGroupHeader_default = defineComponent({
  name: "NBaseSelectGroupHeader",
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
      renderLabelRef,
      renderOptionRef,
      labelFieldRef,
      nodePropsRef
    } = inject(internalSelectionMenuInjectionKey);
    return {
      labelField: labelFieldRef,
      nodeProps: nodePropsRef,
      renderLabel: renderLabelRef,
      renderOption: renderOptionRef
    };
  },
  render() {
    const {
      clsPrefix,
      renderLabel,
      renderOption,
      nodeProps,
      tmNode: {
        rawNode
      }
    } = this;
    const attrs = nodeProps?.(rawNode);
    const children = renderLabel ? renderLabel(rawNode, false) : render(rawNode[this.labelField], rawNode, false);
    const node = (openBlock(), createElementBlock("div", mergeProps(attrs, {
      class: [`${clsPrefix}-base-select-group-header`, attrs?.class]
    }), [normalizeVNode(() => children)], 16));
    return rawNode.render ? rawNode.render({
      node,
      option: rawNode
    }) : renderOption ? renderOption({
      node,
      option: rawNode,
      selected: false
    }) : node;
  }
});
//#endregion
export { SelectGroupHeader_default as default };