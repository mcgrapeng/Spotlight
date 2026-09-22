import { Ref } from "vue";
//#region src/_utils/composable/use-lock-html-scroll.d.ts
declare const lockHtmlScrollRightCompensationRef: Ref<string, string>;
declare function useLockHtmlScroll(lockRef: Ref<boolean>): void;
//#endregion
export { lockHtmlScrollRightCompensationRef, useLockHtmlScroll };