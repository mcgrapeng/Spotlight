Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/_utils/env/is-native-lazy-load.ts
const isImageSupportNativeLazy = require("./is-browser.js").isBrowser && "loading" in document.createElement("img");
//#endregion
exports.isImageSupportNativeLazy = isImageSupportNativeLazy;
