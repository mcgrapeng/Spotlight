import { isBrowser } from "./is-browser.mjs";
//#region src/_utils/env/is-native-lazy-load.ts
const isImageSupportNativeLazy = isBrowser && "loading" in document.createElement("img");
//#endregion
export { isImageSupportNativeLazy };