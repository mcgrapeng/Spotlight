import { GlobalTheme } from "../config-provider/src/interface.js";
import "../config-provider/index.js";
//#region src/themes/interface.d.ts
type BuiltInGlobalTheme = Omit<Required<GlobalTheme>, 'InternalSelectMenu' | 'InternalSelection'>;
//#endregion
export { BuiltInGlobalTheme };