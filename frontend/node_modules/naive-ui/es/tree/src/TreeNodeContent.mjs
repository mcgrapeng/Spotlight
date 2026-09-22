import { render } from "../../_utils/vue/render.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { treeInjectionKey } from "./interface.mjs";
import { Fragment, createElementBlock, createElementVNode, defineComponent, inject, mergeProps, openBlock, ref } from "vue";
//#region src/tree/src/TreeNodeContent.tsx
const _hoisted_1 = ["onClick", "draggable", "onDragstart"];
var TreeNodeContent_default = defineComponent({
  name: "TreeNodeContent",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    disabled: Boolean,
    checked: Boolean,
    selected: Boolean,
    onClick: Function,
    onDragstart: Function,
    tmNode: {
      type: Object,
      required: true
    },
    nodeProps: Object
  },
  setup(props) {
    const {
      renderLabelRef,
      renderPrefixRef,
      renderSuffixRef,
      labelFieldRef
    } = inject(treeInjectionKey);
    const selfRef = ref(null);
    function doClick(e) {
      const {
        onClick
      } = props;
      if (onClick) onClick(e);
    }
    function handleClick(e) {
      doClick(e);
    }
    return {
      selfRef,
      renderLabel: renderLabelRef,
      renderPrefix: renderPrefixRef,
      renderSuffix: renderSuffixRef,
      labelField: labelFieldRef,
      handleClick
    };
  },
  render() {
    const {
      clsPrefix,
      labelField,
      nodeProps,
      checked = false,
      selected = false,
      renderLabel,
      renderPrefix,
      renderSuffix,
      handleClick,
      onDragstart,
      tmNode: {
        rawNode,
        rawNode: {
          prefix,
          suffix,
          [labelField]: label
        }
      }
    } = this;
    return openBlock(), createElementBlock("span", mergeProps(nodeProps, {
      ref: "selfRef",
      class: [`${clsPrefix}-tree-node-content`, nodeProps?.class],
      onClick: handleClick,
      draggable: onDragstart === void 0 ? void 0 : true,
      onDragstart
    }), [renderPrefix || prefix ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${clsPrefix}-tree-node-content__prefix`)
    }, [renderPrefix ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderPrefix({
      option: rawNode,
      selected,
      checked
    }))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => render(prefix))], 64))], 2)) : normalizeVNode(() => null), createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-tree-node-content__text`)
    }, [renderLabel ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderLabel({
      option: rawNode,
      selected,
      checked
    }))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => render(label))], 64))], 2), renderSuffix || suffix ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${clsPrefix}-tree-node-content__suffix`)
    }, [renderSuffix ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderSuffix({
      option: rawNode,
      selected,
      checked
    }))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => render(suffix))], 64))], 2)) : normalizeVNode(() => null)], 16, _hoisted_1);
  }
});
//#endregion
export { TreeNodeContent_default as default };