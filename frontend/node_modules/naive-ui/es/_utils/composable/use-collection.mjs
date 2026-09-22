import { getCurrentInstance, inject, onBeforeUnmount, onMounted, watch } from "vue";
//#region src/_utils/composable/use-collection.ts
function useInjectionInstanceCollection(injectionName, collectionKey, registerKeyRef) {
  const injection = inject(injectionName, null);
  if (injection === null) return;
  const vm = getCurrentInstance()?.proxy;
  watch(registerKeyRef, registerInstance);
  registerInstance(registerKeyRef.value);
  onBeforeUnmount(() => {
    registerInstance(void 0, registerKeyRef.value);
  });
  function registerInstance(key, oldKey) {
    if (!injection) return;
    const collection = injection[collectionKey];
    if (oldKey !== void 0) removeInstance(collection, oldKey);
    if (key !== void 0) addInstance(collection, key);
  }
  function removeInstance(collection, key) {
    if (!collection[key]) collection[key] = [];
    collection[key].splice(collection[key].findIndex(instance => instance === vm), 1);
  }
  function addInstance(collection, key) {
    if (!collection[key]) collection[key] = [];
    if (!~collection[key].findIndex(instance => instance === vm)) collection[key].push(vm);
  }
}
function useInjectionCollection(injectionName, collectionKey, valueRef) {
  const injection = inject(injectionName, null);
  if (injection === null) return;
  if (!(collectionKey in injection)) injection[collectionKey] = [];
  injection[collectionKey].push(valueRef.value);
  watch(valueRef, (value, prevValue) => {
    const collectionArray = injection[collectionKey];
    const index = collectionArray.findIndex(collectionValue => collectionValue === prevValue);
    if (~index) collectionArray.splice(index, 1);
    collectionArray.push(value);
  });
  onBeforeUnmount(() => {
    const collectionArray = injection[collectionKey];
    const index = collectionArray.findIndex(collectionValue => collectionValue === valueRef.value);
    if (~index) collectionArray.splice(index, 1);
  });
}
function useInjectionElementCollection(injectionName, collectionKey, getElement) {
  const injection = inject(injectionName, null);
  if (injection === null) return;
  if (!(collectionKey in injection)) injection[collectionKey] = [];
  onMounted(() => {
    const el = getElement();
    if (!el) return;
    injection[collectionKey].push(el);
  });
  onBeforeUnmount(() => {
    const collectionArray = injection[collectionKey];
    const element = getElement();
    const index = collectionArray.findIndex(collectionElement => collectionElement === element);
    if (~index) collectionArray.splice(index, 1);
  });
}
//#endregion
export { useInjectionCollection, useInjectionElementCollection, useInjectionInstanceCollection };