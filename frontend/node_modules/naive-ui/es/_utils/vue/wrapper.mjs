import { defineComponent } from "vue";
//#region src/_utils/vue/wrapper.tsx
const Wrapper = defineComponent({
  render() {
    return this.$slots.default?.();
  }
});
//#endregion
export { Wrapper };