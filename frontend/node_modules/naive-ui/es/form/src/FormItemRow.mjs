import { keep } from "../../_utils/vue/keep.mjs";
import Row_default, { rowPropKeys, rowProps } from "../../legacy-grid/src/Row.mjs";
import FormItemCol_default, { formItemColPropKeys, formItemColProps } from "./FormItemCol.mjs";
import { defineComponent, h, ref } from "vue";
//#region src/form/src/FormItemRow.ts
const formItemRowProps = {
  ...rowProps,
  ...formItemColProps
};
var FormItemRow_default = defineComponent({
  name: "FormItemRow",
  props: formItemRowProps,
  setup() {
    const formItemColInstRef = ref(null);
    const validate = (...args) => {
      const {
        value
      } = formItemColInstRef;
      if (value) return value.validate(...args);
    };
    const restoreValidation = () => {
      const {
        value
      } = formItemColInstRef;
      if (value) value.restoreValidation();
    };
    return {
      formItemColInstRef,
      validate,
      restoreValidation
    };
  },
  render() {
    return h(Row_default, keep(this.$props, rowPropKeys), {
      default: () => {
        const colProps = keep(this.$props, formItemColPropKeys);
        return h(FormItemCol_default, {
          ref: "formItemColInstRef",
          ...colProps,
          span: 24
        }, this.$slots);
      }
    });
  }
});
//#endregion
export { FormItemRow_default as default, formItemRowProps };