import { defineComponent, h } from "vue";
//#region src/dropdown/src/DropdownRenderOption.tsx
var DropdownRenderOption_default = defineComponent({
  name: "DropdownRenderOption",
  props: {
    tmNode: {
      type: Object,
      required: true
    }
  },
  render() {
    const {
      rawNode: {
        render,
        props
      }
    } = this.tmNode;
    return h("div", props, [render?.()]);
  }
});
//#endregion
export { DropdownRenderOption_default as default };