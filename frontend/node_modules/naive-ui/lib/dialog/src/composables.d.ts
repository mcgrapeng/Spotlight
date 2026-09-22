import { DialogApiInjection, DialogReactive } from "./DialogProvider.js";
import { Ref } from "vue";
//#region src/dialog/src/composables.d.ts
declare function useDialog(): DialogApiInjection;
declare function useDialogReactiveList(): Ref<readonly DialogReactive[]>;
//#endregion
export { useDialog, useDialogReactiveList };