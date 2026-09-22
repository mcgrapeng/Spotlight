import { onActivated, onDeactivated } from "vue";
//#region src/_utils/composable/use-reactivated.ts
function useReactivated(callback) {
  const isDeactivatedRef = {
    isDeactivated: false
  };
  let activateStateInitialized = false;
  onActivated(() => {
    isDeactivatedRef.isDeactivated = false;
    if (!activateStateInitialized) {
      activateStateInitialized = true;
      return;
    }
    callback();
  });
  onDeactivated(() => {
    isDeactivatedRef.isDeactivated = true;
    if (!activateStateInitialized) activateStateInitialized = true;
  });
  return isDeactivatedRef;
}
//#endregion
export { useReactivated };