import { ThemeCommonVars } from "../_styles/common/light.js";
import { CustomThemeCommonVars } from "../config-provider/src/interface.js";
import "../config-provider/index.js";
import { ComputedRef } from "vue";
//#region src/composables/use-theme-vars.d.ts
declare function useThemeVars(): ComputedRef<ThemeCommonVars & CustomThemeCommonVars>;
//#endregion
export { useThemeVars };