import { defineComponent } from "vue";
//#region src/discrete/src/InjectionExtractor.tsx
const NInjectionExtractor = defineComponent({
  name: "InjectionExtractor",
  props: {
    onSetup: Function
  },
  setup(props, {
    slots
  }) {
    props.onSetup?.();
    return () => slots.default?.();
  }
});
//#endregion
export { NInjectionExtractor };