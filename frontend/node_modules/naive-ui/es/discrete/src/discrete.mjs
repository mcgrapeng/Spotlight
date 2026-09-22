import { NDialogProvider } from "../../dialog/src/DialogProvider.mjs";
import LoadingBarProvider_default from "../../loading-bar/src/LoadingBarProvider.mjs";
import MessageProvider_default from "../../message/src/MessageProvider.mjs";
import { NModalProvider } from "../../modal/src/ModalProvider.mjs";
import NotificationProvider_default from "../../notification/src/NotificationProvider.mjs";
import { createDiscreteApp } from "./discreteApp.mjs";
//#region src/discrete/src/discrete.ts
function createDiscreteApi(includes, {
  configProviderProps,
  messageProviderProps,
  dialogProviderProps,
  notificationProviderProps,
  loadingBarProviderProps,
  modalProviderProps
} = {}) {
  const providersAndProps = [];
  includes.forEach(type => {
    switch (type) {
      case "message":
        providersAndProps.push({
          type,
          Provider: MessageProvider_default,
          props: messageProviderProps
        });
        break;
      case "notification":
        providersAndProps.push({
          type,
          Provider: NotificationProvider_default,
          props: notificationProviderProps
        });
        break;
      case "dialog":
        providersAndProps.push({
          type,
          Provider: NDialogProvider,
          props: dialogProviderProps
        });
        break;
      case "loadingBar":
        providersAndProps.push({
          type,
          Provider: LoadingBarProvider_default,
          props: loadingBarProviderProps
        });
        break;
      case "modal":
        providersAndProps.push({
          type,
          Provider: NModalProvider,
          props: modalProviderProps
        });
    }
  });
  return createDiscreteApp({
    providersAndProps,
    configProviderProps
  });
}
//#endregion
export { createDiscreteApi };