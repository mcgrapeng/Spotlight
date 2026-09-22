//#region src/_utils/vue/keep.d.ts
declare function keep<T, K, R>(object: T, keys?: K[], rest?: R): Pick<T, K & keyof T> & R;
//#endregion
export { keep };