import { GlobalTheme } from "../config-provider/src/interface.js";
import "../config-provider/index.js";
//#region src/themes/utils.d.ts
type ComponentKey = Exclude<keyof GlobalTheme, 'name'>;
type ComponentThemes = Array<Exclude<GlobalTheme[ComponentKey], undefined>>;
declare function createTheme(name: string, componentThemes: ComponentThemes): GlobalTheme;
declare function createTheme(componentThemes: ComponentThemes): GlobalTheme;
//#endregion
export { createTheme };