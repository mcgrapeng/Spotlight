import { throwError } from "../../_utils/naive/warn.mjs";
import { messageApiInjectionKey } from "./context.mjs";
import { inject } from "vue";
//#region src/message/src/use-message.ts
function useMessage() {
  const api = inject(messageApiInjectionKey, null);
  if (api === null) throwError("use-message", "No outer <n-message-provider /> founded. See prerequisite in https://www.naiveui.com/en-US/os-theme/components/message for more details. If you want to use `useMessage` outside setup, please check https://www.naiveui.com/zh-CN/os-theme/components/message#Q-&-A.");
  return api;
}
//#endregion
export { useMessage };