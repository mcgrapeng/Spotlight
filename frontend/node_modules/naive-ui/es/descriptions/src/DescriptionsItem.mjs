import { DESCRIPTION_ITEM_FLAG } from "./utils.mjs";
import { defineComponent } from "vue";
//#region src/descriptions/src/DescriptionsItem.ts
const descriptionsItemProps = {
  label: String,
  span: {
    type: Number,
    default: 1
  },
  labelClass: String,
  labelStyle: [Object, String],
  contentClass: String,
  contentStyle: [Object, String]
};
var DescriptionsItem_default = defineComponent({
  name: "DescriptionsItem",
  [DESCRIPTION_ITEM_FLAG]: true,
  props: descriptionsItemProps,
  slots: Object,
  render() {
    return null;
  }
});
//#endregion
export { DescriptionsItem_default as default, descriptionsItemProps };