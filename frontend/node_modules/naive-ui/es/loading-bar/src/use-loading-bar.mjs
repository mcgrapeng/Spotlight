import { throwError } from "../../_utils/naive/warn.mjs";
import { loadingBarApiInjectionKey } from "./context.mjs";
import { inject } from "vue";
//#region src/loading-bar/src/use-loading-bar.ts
function useLoadingBar() {
  const loadingBar = inject(loadingBarApiInjectionKey, null);
  if (loadingBar === null) throwError("use-loading-bar", "No outer <n-loading-bar-provider /> founded.");
  return loadingBar;
}
//#endregion
export { useLoadingBar };