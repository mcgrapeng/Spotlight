import { dataTableInjectionKey } from "../interface.mjs";
import Radio_default from "../../../radio/src/Radio.mjs";
import { createBlock, defineComponent, inject, openBlock } from "vue";
//#region src/data-table/src/TableParts/BodyRadio.tsx
var BodyRadio_default = defineComponent({
  name: "DataTableBodyRadio",
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
      componentId
    } = inject(dataTableInjectionKey);
    return () => {
      const {
        rowKey
      } = props;
      return openBlock(), createBlock(Radio_default, {
        name: componentId,
        disabled: props.disabled,
        checked: mergedCheckedRowKeySetRef.value.has(rowKey),
        onUpdateChecked: props.onUpdateChecked
      }, null, 8, ["name", "disabled", "checked", "onUpdateChecked"]);
    };
  }
});
//#endregion
export { BodyRadio_default as default };