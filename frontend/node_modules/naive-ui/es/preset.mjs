import { components_exports } from "./components.mjs";
import create from "./create.mjs";
//#region src/preset.ts
const naive = create({
  components: Object.keys(components_exports).map(key => components_exports[key])
});
const install = naive.install;
//#endregion
export { naive as default, install };