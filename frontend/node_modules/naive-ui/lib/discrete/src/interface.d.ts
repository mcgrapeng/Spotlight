import { DialogApiInjection, DialogProviderProps } from "../../dialog/src/DialogProvider.js";
import "../../dialog/index.js";
import { LoadingBarApiInjection, LoadingBarProviderProps } from "../../loading-bar/src/LoadingBarProvider.js";
import "../../loading-bar/index.js";
import { MessageApiInjection, MessageProviderProps } from "../../message/src/MessageProvider.js";
import "../../message/index.js";
import { ModalApiInjection, ModalProviderProps } from "../../modal/src/ModalProvider.js";
import "../../modal/index.js";
import { NotificationApiInjection, NotificationProviderProps } from "../../notification/src/NotificationProvider.js";
import "../../notification/index.js";
import { ConfigProviderProps } from "../../config-provider/src/ConfigProvider.js";
import "../../config-provider/index.js";
import { App, Ref } from "vue";
//#region src/discrete/src/interface.d.ts
type MaybeRef<T> = Ref<T> | T;
interface DiscreteApiOptions {
  configProviderProps?: MaybeRef<ConfigProviderProps>;
  messageProviderProps?: MaybeRef<MessageProviderProps>;
  dialogProviderProps?: MaybeRef<DialogProviderProps>;
  notificationProviderProps?: MaybeRef<NotificationProviderProps>;
  loadingBarProviderProps?: MaybeRef<LoadingBarProviderProps>;
  modalProviderProps?: MaybeRef<ModalProviderProps>;
}
type DiscreteApiType = 'message' | 'notification' | 'loadingBar' | 'dialog' | 'modal';
type DiscreteApi<T extends DiscreteApiType = DiscreteApiType> = {
  unmount: () => void;
  app: App;
} & ('message' extends T ? {
  message: MessageApiInjection;
} : Record<string, unknown>) & ('notification' extends T ? {
  notification: NotificationApiInjection;
} : Record<string, unknown>) & ('dialog' extends T ? {
  dialog: DialogApiInjection;
} : Record<string, unknown>) & ('loadingBar' extends T ? {
  loadingBar: LoadingBarApiInjection;
} : Record<string, unknown>) & ('modal' extends T ? {
  modal: ModalApiInjection;
} : Record<string, unknown>);
//#endregion
export { DiscreteApi, DiscreteApiOptions, DiscreteApiType, MaybeRef };