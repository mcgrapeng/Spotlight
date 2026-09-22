import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import { GlobalComponentConfig, GlobalIconConfig, GlobalThemeWithoutCommon } from "./internal-interface.js";
//#region src/config-provider/src/interface.d.ts
interface CustomThemeCommonVars {}
interface GlobalTheme extends GlobalThemeWithoutCommon {
  name: string;
  common?: ThemeCommonVars;
}
type GlobalThemeOverrides = {
  common?: Partial<ThemeCommonVars & CustomThemeCommonVars>;
} & { [key in keyof GlobalThemeWithoutCommon]?: ExtractThemeOverrides<GlobalThemeWithoutCommon[key]>; };
//#endregion
export { CustomThemeCommonVars, type GlobalComponentConfig, type GlobalIconConfig, GlobalTheme, GlobalThemeOverrides, type ThemeCommonVars };