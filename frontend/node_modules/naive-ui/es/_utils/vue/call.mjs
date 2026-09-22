//#region src/_utils/vue/call.ts
function call(funcs, ...args) {
  if (Array.isArray(funcs)) funcs.forEach(func => call(func, ...args));else return funcs(...args);
}
//#endregion
export { call };