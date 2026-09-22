import { App } from "vue";
//#region src/create.d.ts
type ComponentType = any;
interface NUiInstance {
  version: string;
  componentPrefix: string;
  install: (app: App) => void;
}
interface NUiCreateOptions {
  components?: ComponentType[];
  componentPrefix?: string;
}
declare function create({ componentPrefix, components }?: NUiCreateOptions): NUiInstance;
//#endregion
export { NUiInstance, create as default };