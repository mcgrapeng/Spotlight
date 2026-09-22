import { DialogApiInjection } from "../../dialog/src/DialogProvider.js";
import "../../dialog/index.js";
import { LoadingBarApiInjection } from "../../loading-bar/src/LoadingBarProvider.js";
import "../../loading-bar/index.js";
import { MessageApiInjection } from "../../message/src/MessageProvider.js";
import "../../message/index.js";
import { ModalApiInjection } from "../../modal/src/ModalProvider.js";
import "../../modal/index.js";
import { NotificationApiInjection } from "../../notification/src/NotificationProvider.js";
import "../../notification/index.js";
import { DiscreteApiType, MaybeRef } from "./interface.js";
import { ConfigProviderProps } from "../../config-provider/src/ConfigProvider.js";
import "../../config-provider/index.js";
import { App, Component } from "vue";
//#region src/discrete/src/discreteApp.d.ts
type Provider<P = any> = new (...args: any[]) => {
  $props: P;
};
type ProviderProps<C> = C extends Provider<infer P> ? P : unknown;
interface DiscreteAppOptions {
  providersAndProps: Array<{
    type: DiscreteApiType;
    Provider: Component;
    props: any;
  }>;
  configProviderProps?: MaybeRef<ConfigProviderProps>;
}
interface DiscreteApp {
  unmount: () => void;
  app: App;
  message?: MessageApiInjection;
  notification?: NotificationApiInjection;
  dialog?: DialogApiInjection;
  loadingBar?: LoadingBarApiInjection;
  modal?: ModalApiInjection;
}
declare function createDiscreteApp({ providersAndProps, configProviderProps }: DiscreteAppOptions): DiscreteApp;
//#endregion
export { DiscreteApp, DiscreteAppOptions, Provider, ProviderProps, createDiscreteApp };