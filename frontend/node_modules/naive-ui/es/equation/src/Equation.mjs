import { configProviderInjectionKey } from "../../config-provider/src/context.mjs";
import { computed, defineComponent, h, inject } from "vue";
//#region src/equation/src/Equation.tsx
const equationProps = {
  value: String,
  katex: Object,
  katexOptions: Object
};
const Equation = defineComponent({
  name: "Equation",
  props: equationProps,
  setup(props) {
    const configProviderContext = inject(configProviderInjectionKey, null);
    const extractedHtmlInfo = computed(() => {
      const outerHtml = (props.katex || configProviderContext?.mergedKatexRef.value)?.renderToString(props.value || "", {
        throwOnError: false,
        ...props.katexOptions
      }) || "no katex provided";
      const matchResult = outerHtml.match(/^<([a-z]+)[^>]+class="([^"]+)"[^>]*>/);
      const wrapperTag = matchResult?.[1] || "span";
      const wrapperClass = matchResult?.[2];
      return {
        wrapperTag,
        innerHtml: outerHtml.replace(/^<[a-z]+[^>]*>/, "").replace(/<\/[a-z]+>$/, ""),
        wrapperClass
      };
    });
    return () => {
      const {
        innerHtml,
        wrapperClass,
        wrapperTag
      } = extractedHtmlInfo.value;
      return h(wrapperTag, {
        class: wrapperClass,
        innerHTML: innerHtml
      });
    };
  }
});
//#endregion
export { Equation, equationProps };