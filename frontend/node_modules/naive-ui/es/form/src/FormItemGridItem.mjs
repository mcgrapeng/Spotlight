import { keep } from "../../_utils/vue/keep.mjs";
import { keysOf } from "../../_utils/vue/keysOf.mjs";
import FormItem_default, { formItemPropKeys, formItemProps } from "./FormItem.mjs";
import GridItem_default, { gridItemPropKeys, gridItemProps } from "../../grid/src/GridItem.mjs";
import { defineComponent, h, ref } from "vue";
//#region src/form/src/FormItemGridItem.ts
const formItemGiProps = {
  ...gridItemProps,
  ...formItemProps
};
const formItemGiPropKeys = keysOf(formItemGiProps);
var FormItemGridItem_default = defineComponent({
  __GRID_ITEM__: true,
  name: "FormItemGridItem",
  alias: ["FormItemGi"],
  props: formItemGiProps,
  slots: Object,
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
    return h(GridItem_default, keep(this.$.vnode.props || {}, gridItemPropKeys), {
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
export { FormItemGridItem_default as default, formItemGiPropKeys, formItemGiProps };