//#region src/_utils/vue/keysOf.d.ts
declare function keysOf<T extends Record<string, unknown>>(obj: T): Array<keyof T>;
//#endregion
export { keysOf };