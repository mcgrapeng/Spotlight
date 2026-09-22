import { DiscreteApi, DiscreteApiOptions, DiscreteApiType } from "./interface.js";
//#region src/discrete/src/discrete.d.ts
declare function createDiscreteApi<T extends DiscreteApiType>(includes: T[], { configProviderProps, messageProviderProps, dialogProviderProps, notificationProviderProps, loadingBarProviderProps, modalProviderProps }?: DiscreteApiOptions): DiscreteApi<T>;
//#endregion
export { createDiscreteApi };