import { ComputedRef, Ref } from "vue";
import { HLJSApi } from "highlight.js";
//#region src/_mixins/use-hljs.d.ts
interface UseHljsProps {
  hljs?: unknown;
  [key: string]: unknown;
}
interface Hljs {
  highlight: HLJSApi['highlight'];
  getLanguage: HLJSApi['getLanguage'];
}
declare function useHljs(props: UseHljsProps, shouldHighlightRef?: Ref<boolean>): ComputedRef<Hljs | undefined>;
//#endregion
export { Hljs, useHljs as default };