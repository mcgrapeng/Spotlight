import { normalizeSlots } from "../../../vue-jsx-vapor/vdom.mjs";
import { Transition, createBlock, defineComponent, openBlock } from "vue";
import { useIsMounted } from "vooks";
//#region src/_internal/icon-switch-transition/src/IconSwitchTransition.tsx
var IconSwitchTransition_default = defineComponent({
  name: "BaseIconSwitchTransition",
  setup(_, {
    slots
  }) {
    const isMountedRef = useIsMounted();
    return () => (openBlock(), createBlock(Transition, {
      name: "icon-switch-transition",
      appear: isMountedRef.value
    }, normalizeSlots(slots), 1032, ["appear"]));
  }
});
//#endregion
export { IconSwitchTransition_default as default };