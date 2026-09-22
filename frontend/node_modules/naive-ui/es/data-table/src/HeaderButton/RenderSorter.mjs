import { defineComponent } from "vue";
//#region src/data-table/src/HeaderButton/RenderSorter.ts
var RenderSorter_default = defineComponent({
  name: "DataTableRenderSorter",
  props: {
    render: {
      type: Function,
      required: true
    },
    order: {
      type: [String, Boolean],
      default: false
    }
  },
  render() {
    const {
      render,
      order
    } = this;
    return render({
      order
    });
  }
});
//#endregion
export { RenderSorter_default as default };