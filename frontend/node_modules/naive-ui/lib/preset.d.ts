import { NUiInstance } from "./create.js";
//#region src/preset.d.ts
declare const naive: NUiInstance;
declare const install: (app: import("vue").App) => void;
//#endregion
export { naive as default, install };