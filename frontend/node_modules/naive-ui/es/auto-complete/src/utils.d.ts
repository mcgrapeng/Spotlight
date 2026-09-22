import { SelectMixedOption } from "../../select/src/interface.js";
import { AutoCompleteOptions } from "./interface.js";
//#region src/auto-complete/src/utils.d.ts
declare function mapAutoCompleteOptionsToSelectOptions(options: AutoCompleteOptions): SelectMixedOption[];
//#endregion
export { mapAutoCompleteOptionsToSelectOptions };