import { Ref } from "vue";
//#region src/image/src/utils.d.ts
type IntersectionObserverOptions = Omit<IntersectionObserverInit, 'root'> & {
  root?: Element | Document | null | string;
};
declare function resolveOptionsAndHash(options?: IntersectionObserverOptions | undefined): {
  hash: string;
  options: Omit<IntersectionObserverInit, 'root'> & {
    root: Element | Document;
  };
};
declare const observeIntersection: (el: HTMLElement | null, options: IntersectionObserverOptions | undefined, shouldStartLoadingRef: Ref<boolean>) => () => void;
//#endregion
export { IntersectionObserverOptions, observeIntersection, resolveOptionsAndHash };