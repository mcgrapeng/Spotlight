import { Ref } from "vue";
//#region src/_utils/composable/use-resize.d.ts
declare function useOnResize(elRef: Ref<HTMLElement | null>, onResize: (() => void) | undefined): void;
//#endregion
export { useOnResize };