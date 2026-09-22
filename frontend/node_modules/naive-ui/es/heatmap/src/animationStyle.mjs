import { c } from "../../_utils/cssr/index.mjs";
import { configProviderInjectionKey } from "../../config-provider/src/context.mjs";
import { inject, onMounted, ref, watchEffect } from "vue";
import { hash } from "css-render";
import { useSsrAdapter } from "@css-render/vue3-ssr";
//#region src/heatmap/src/animationStyle.ts
function useLoadingStyleClass(props, themeRef) {
  const loadingClassRef = ref("");
  const adapter = useSsrAdapter();
  const styleMountTarget = inject(configProviderInjectionKey, null)?.styleMountTarget;
  onMounted(() => {
    watchEffect(() => {
      if (!props.loading) return;
      const {
        self: {
          loadingColorStart,
          loadingColorEnd
        }
      } = themeRef.value;
      const loadingColorHash = hash(loadingColorStart) + hash(loadingColorEnd);
      const className = `heatmap-loading-${loadingColorHash}`;
      const animationName = `heatmap-loading-animation-${loadingColorHash}`;
      loadingClassRef.value = className;
      c([c(`.${className}`, `
          animation: 2s ${animationName} infinite cubic-bezier(0.36, 0, 0.64, 1);
        `), c(`@keyframes ${animationName}`, `
          0% {
            background: ${loadingColorStart};
          }
          40% {
            background: ${loadingColorEnd};
          }
          80% {
            background: ${loadingColorStart};
          }
          100% {
            background: ${loadingColorStart};
          }
        `)]).mount({
        id: loadingColorHash,
        ssr: adapter,
        parent: styleMountTarget
      });
    });
  });
  return loadingClassRef;
}
//#endregion
export { useLoadingStyleClass };