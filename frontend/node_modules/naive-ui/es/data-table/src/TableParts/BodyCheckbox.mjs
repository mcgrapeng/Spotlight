import Checkbox_default from "../../../checkbox/src/Checkbox.mjs";
import { dataTableInjectionKey } from "../interface.mjs";
import { createBlock, defineComponent, inject, openBlock } from "vue";
//#region src/data-table/src/TableParts/BodyCheckbox.tsx
var BodyCheckbox_default = defineComponent({
  name: "DataTableBodyCheckbox",
  props: {
    rowKey: {
      type: [String, Number],
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    },
    onUpdateChecked: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const {
      mergedCheckedRowKeySetRef,
      mergedInderminateRowKeySetRef
    } = inject(dataTableInjectionKey);
    return () => {
      const {
        rowKey
      } = props;
      return openBlock(), createBlock(Checkbox_default, {
        privateInsideTable: true,
        disabled: props.disabled,
        indeterminate: mergedInderminateRowKeySetRef.value.has(rowKey),
        checked: mergedCheckedRowKeySetRef.value.has(rowKey),
        onUpdateChecked: props.onUpdateChecked
      }, null, 8, ["disabled", "indeterminate", "checked", "onUpdateChecked"]);
    };
  }
});
//#endregion
export { BodyCheckbox_default as default };