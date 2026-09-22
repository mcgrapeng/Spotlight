import { defineComponent } from "vue";
//#region src/data-table/src/HeaderButton/RenderFilter.ts
var RenderFilter_default = defineComponent({
  name: "DataTableRenderFilter",
  props: {
    render: {
      type: Function,
      required: true
    },
    active: Boolean,
    show: Boolean
  },
  render() {
    const {
      render,
      active,
      show
    } = this;
    return render({
      active,
      show
    });
  }
});
//#endregion
export { RenderFilter_default as default };