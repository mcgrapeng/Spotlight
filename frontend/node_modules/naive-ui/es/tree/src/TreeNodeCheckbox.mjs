import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import Checkbox_default from "../../checkbox/src/Checkbox.mjs";
import { treeInjectionKey } from "./interface.mjs";
import { createBlock, createElementBlock, defineComponent, inject, normalizeStyle, openBlock } from "vue";
//#region src/tree/src/TreeNodeCheckbox.tsx
var TreeNodeCheckbox_default = defineComponent({
  name: "NTreeNodeCheckbox",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    indent: {
      type: Number,
      required: true
    },
    right: Boolean,
    focusable: Boolean,
    disabled: Boolean,
    checked: Boolean,
    indeterminate: Boolean,
    onCheck: Function
  },
  setup(props) {
    const NTree = inject(treeInjectionKey);
    function doCheck(value) {
      const {
        onCheck
      } = props;
      if (onCheck) onCheck(value);
    }
    function handleUpdateValue(value) {
      doCheck(value);
    }
    return {
      handleUpdateValue,
      mergedTheme: NTree.mergedThemeRef
    };
  },
  render() {
    const {
      clsPrefix,
      mergedTheme,
      checked,
      indeterminate,
      disabled,
      focusable,
      indent,
      handleUpdateValue
    } = this;
    return openBlock(), createElementBlock("span", {
      class: normalizeClass$1([`${clsPrefix}-tree-node-checkbox`, this.right && `${clsPrefix}-tree-node-checkbox--right`]),
      style: normalizeStyle({
        width: `${indent}px`
      }),
      "data-checkbox": true
    }, [(openBlock(), createBlock(Checkbox_default, {
      focusable,
      disabled,
      theme: mergedTheme.peers.Checkbox,
      themeOverrides: mergedTheme.peerOverrides.Checkbox,
      checked,
      indeterminate,
      onUpdateChecked: handleUpdateValue
    }, null, 8, ["focusable", "disabled", "theme", "themeOverrides", "checked", "indeterminate", "onUpdateChecked"]))], 6);
  }
});
//#endregion
export { TreeNodeCheckbox_default as default };