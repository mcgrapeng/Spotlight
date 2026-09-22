//#region src/_utils/naive/warn.d.ts
declare function warnOnce(location: string, message: string): void;
declare function warn(location: string, message: string): void;
declare function error(location: string, message: string, error: unknown): void;
declare function throwError(location: string, message: string): never;
//#endregion
export { error, throwError, warn, warnOnce };