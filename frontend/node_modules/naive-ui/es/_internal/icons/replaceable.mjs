import { configProviderInjectionKey } from "../../config-provider/src/context.mjs";
import { createBlock, defineComponent, inject, openBlock } from "vue";
import { upperFirst } from "lodash-es";
//#region src/_internal/icons/replaceable.tsx
function replaceable(name, icon) {
  const IconComponent = defineComponent({
    render() {
      return icon();
    }
  });
  return defineComponent({
    name: upperFirst(name),
    setup() {
      const mergedIconsRef = inject(configProviderInjectionKey, null)?.mergedIconsRef;
      return () => {
        const iconOverride = mergedIconsRef?.value?.[name];
        return iconOverride ? iconOverride() : (openBlock(), createBlock(IconComponent, {
          key: 1
        }));
      };
    }
  });
}
//#endregion
export { replaceable };