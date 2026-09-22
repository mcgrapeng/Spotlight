import { keep } from "../../_utils/vue/keep.mjs";
import { keysOf } from "../../_utils/vue/keysOf.mjs";
import FormItem_default, { formItemPropKeys, formItemProps } from "./FormItem.mjs";
import Col_default, { colPropKeys, colProps } from "../../legacy-grid/src/Col.mjs";
import { defineComponent, h, ref } from "vue";
//#region src/form/src/FormItemCol.ts
const formItemColProps = {
  ...colProps,
  ...formItemProps
};
const formItemColPropKeys = keysOf(formItemColProps);
var FormItemCol_default = defineComponent({
  name: "FormItemCol",
  props: formItemColProps,
  setup() {
    const formItemInstRef = ref(null);
    const validate = (...args) => {
      const {
        value
      } = formItemInstRef;
      if (value) return value.validate(...args);
    };
    const restoreValidation = () => {
      const {
        value
      } = formItemInstRef;
      if (value) value.restoreValidation();
    };
    return {
      formItemInstRef,
      validate,
      restoreValidation
    };
  },
  render() {
    return h(Col_default, keep(this.$props, colPropKeys), {
      default: () => {
        const itemProps = keep(this.$props, formItemPropKeys);
        return h(FormItem_default, {
          ref: "formItemInstRef",
          ...itemProps
        }, this.$slots);
      }
    });
  }
});
//#endregion
export { FormItemCol_default as default, formItemColPropKeys, formItemColProps };