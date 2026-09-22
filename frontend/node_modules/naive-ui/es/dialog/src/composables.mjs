import { throwError } from "../../_utils/naive/warn.mjs";
import { dialogApiInjectionKey, dialogReactiveListInjectionKey } from "./context.mjs";
import { inject } from "vue";
//#region src/dialog/src/composables.ts
function useDialog() {
  const dialog = inject(dialogApiInjectionKey, null);
  if (dialog === null) throwError("use-dialog", "No outer <n-dialog-provider /> founded.");
  return dialog;
}
function useDialogReactiveList() {
  const dialogReactiveList = inject(dialogReactiveListInjectionKey, null);
  if (dialogReactiveList === null) throwError("use-dialog-reactive-list", "No outer <n-dialog-provider /> founded.");
  return dialogReactiveList;
}
//#endregion
export { useDialog, useDialogReactiveList };