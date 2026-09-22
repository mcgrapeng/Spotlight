//#region src/_utils/vue/keep.ts
function keep(object, keys = [], rest) {
  const keepedObject = {};
  keys.forEach(key => {
    keepedObject[key] = object[key];
  });
  return Object.assign(keepedObject, rest);
}
//#endregion
export { keep };