import { throwError } from "../../_utils/naive/warn.mjs";
import { notificationApiInjectionKey } from "./NotificationProvider.mjs";
import { inject } from "vue";
//#region src/notification/src/use-notification.ts
function useNotification() {
  const api = inject(notificationApiInjectionKey, null);
  if (api === null) throwError("use-notification", "No outer `n-notification-provider` found.");
  return api;
}
//#endregion
export { useNotification };