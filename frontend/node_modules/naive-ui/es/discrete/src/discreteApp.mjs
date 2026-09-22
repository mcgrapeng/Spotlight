import { isBrowser } from "../../_utils/env/is-browser.mjs";
import { warn } from "../../_utils/naive/warn.mjs";
import ConfigProvider_default from "../../config-provider/src/ConfigProvider.mjs";
import { useDialog } from "../../dialog/src/composables.mjs";
import { useModal } from "../../modal/src/composables.mjs";
import { useLoadingBar } from "../../loading-bar/src/use-loading-bar.mjs";
import { useMessage } from "../../message/src/use-message.mjs";
import { useNotification } from "../../notification/src/use-notification.mjs";
import { NInjectionExtractor } from "./InjectionExtractor.mjs";
import { createApp, h, unref } from "vue";
//#region src/discrete/src/discreteApp.ts
const injectionFactoryMap = {
  message: useMessage,
  notification: useNotification,
  loadingBar: useLoadingBar,
  dialog: useDialog,
  modal: useModal
};
function createDiscreteApp({
  providersAndProps,
  configProviderProps
}) {
  let app = createApp(App);
  const extractedApi = {
    app
  };
  function App() {
    return h(ConfigProvider_default, unref(configProviderProps), {
      default: () => providersAndProps.map(({
        type,
        Provider,
        props
      }) => {
        return h(Provider, unref(props), {
          default: () => h(NInjectionExtractor, {
            onSetup: () => extractedApi[type] = injectionFactoryMap[type]()
          })
        });
      })
    });
  }
  let hostEl;
  if (isBrowser) {
    hostEl = document.createElement("div");
    document.body.appendChild(hostEl);
    app.mount(hostEl);
  }
  const unmount = () => {
    if (app === null || hostEl === null) {
      warn("discrete", "unmount call no need because discrete app has been unmounted");
      return;
    }
    app.unmount();
    hostEl.parentNode?.removeChild(hostEl);
    hostEl = null;
    app = null;
  };
  return {
    unmount,
    ...extractedApi
  };
}
//#endregion
export { createDiscreteApp };