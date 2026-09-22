import { resolveSlotWithTypedProps } from "../../_utils/vue/resolve-slot.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { inputInjectionKey } from "./interface.mjs";
import { len } from "./utils.mjs";
import { computed, createElementBlock, defineComponent, inject, openBlock } from "vue";
//#region src/input/src/WordCount.tsx
var WordCount_default = defineComponent({
  name: "InputWordCount",
  setup(_, {
    slots
  }) {
    const {
      mergedValueRef,
      maxlengthRef,
      mergedClsPrefixRef,
      countGraphemesRef
    } = inject(inputInjectionKey);
    const wordCountRef = computed(() => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (mergedValue === null || Array.isArray(mergedValue)) return 0;
      return (countGraphemesRef.value || len)(mergedValue);
    });
    return () => {
      const {
        value: maxlength
      } = maxlengthRef;
      const {
        value: mergedValue
      } = mergedValueRef;
      return openBlock(), createElementBlock("span", {
        class: normalizeClass$1(`${mergedClsPrefixRef.value}-input-word-count`)
      }, [normalizeVNode(() => resolveSlotWithTypedProps(slots.default, {
        value: mergedValue === null || Array.isArray(mergedValue) ? "" : mergedValue
      }, () => [maxlength === void 0 ? wordCountRef.value : `${wordCountRef.value} / ${maxlength}`]))], 2);
    };
  }
});
//#endregion
export { WordCount_default as default };