import { isBrowser } from "../env/is-browser.mjs";
import { onMounted, onUnmounted, ref } from "vue";
//#region src/_utils/composable/use-browser-location.ts
function useBrowserLocation(customWindow = isBrowser ? window : null) {
  const getWindowLocation = () => {
    const {
      hash,
      host,
      hostname,
      href,
      origin,
      pathname,
      port,
      protocol,
      search
    } = customWindow?.location || {};
    return {
      hash,
      host,
      hostname,
      href,
      origin,
      pathname,
      port,
      protocol,
      search
    };
  };
  const locationState = ref(getWindowLocation());
  const updateLocation = () => {
    locationState.value = getWindowLocation();
  };
  onMounted(() => {
    if (customWindow) {
      customWindow.addEventListener("popstate", updateLocation);
      customWindow.addEventListener("hashchange", updateLocation);
    }
  });
  onUnmounted(() => {
    if (customWindow) {
      customWindow.removeEventListener("popstate", updateLocation);
      customWindow.removeEventListener("hashchange", updateLocation);
    }
  });
  return locationState;
}
//#endregion
export { useBrowserLocation };