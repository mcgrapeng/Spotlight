import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
//#region src/layout/src/interface.ts
const layoutSiderInjectionKey = createInjectionKey("n-layout-sider");
const positionProp = {
  type: String,
  default: "static"
};
//#endregion
export { layoutSiderInjectionKey, positionProp };