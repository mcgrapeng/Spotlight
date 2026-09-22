import { isBrowser } from "../env/is-browser.mjs";
//#region src/_utils/composable/use-houdini.ts
let houdiniRegistered = false;
function useHoudini() {
  if (!isBrowser) return;
  if (!window.CSS) return;
  if (!houdiniRegistered) {
    houdiniRegistered = true;
    if ("registerProperty" in window?.CSS) try {
      CSS.registerProperty({
        name: "--n-color-start",
        syntax: "<color>",
        inherits: false,
        initialValue: "#0000"
      });
      CSS.registerProperty({
        name: "--n-color-end",
        syntax: "<color>",
        inherits: false,
        initialValue: "#0000"
      });
    } catch {}
  }
}
//#endregion
export { useHoudini };