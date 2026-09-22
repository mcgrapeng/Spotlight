//#region src/_utils/vue/merge-handlers.d.ts
declare function mergeEventHandlers<T>(handlers: Array<undefined | ((e: T) => void)>): undefined | ((e: T) => void);
//#endregion
export { mergeEventHandlers };