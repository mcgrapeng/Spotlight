import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import { menuInjectionKey } from "./context.mjs";
import { createElementBlock, defineComponent, inject, openBlock } from "vue";
//#region src/menu/src/MenuDivider.tsx
var MenuDivider_default = defineComponent({
  name: "MenuDivider",
  setup() {
    const {
      mergedClsPrefixRef,
      isHorizontalRef
    } = inject(menuInjectionKey);
    return () => isHorizontalRef.value ? null : (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass$1(`${mergedClsPrefixRef.value}-menu-divider`)
    }, null, 2));
  }
});
//#endregion
export { MenuDivider_default as default };