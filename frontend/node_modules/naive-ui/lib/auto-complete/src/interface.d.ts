import { SelectBaseOption, SelectGroupOption } from "../../select/src/interface.js";
//#region src/auto-complete/src/interface.d.ts
type AutoCompleteOption = SelectBaseOption<string, string>;
interface AutoCompleteGroupOption extends Omit<SelectGroupOption, 'children'> {
  children: AutoCompleteOptions;
}
type AutoCompleteOptions = Array<AutoCompleteOption | AutoCompleteGroupOption | string>;
type OnUpdateValue = (value: string & (string | null)) => void;
type OnUpdateImpl = (value: string | null) => void;
type OnSelect = (value: string & number) => void;
type OnSelectImpl = (value: string | number) => void;
interface AutoCompleteInst {
  focus: () => void;
  blur: () => void;
}
interface AutoCompleteDefaultSlotProps {
  handleInput: (value: string) => void;
  handleFocus: (e: FocusEvent) => void;
  handleBlur: (e: FocusEvent) => void;
  value: string | null;
}
//#endregion
export { AutoCompleteDefaultSlotProps, AutoCompleteGroupOption, AutoCompleteInst, AutoCompleteOption, AutoCompleteOptions, OnSelect, OnSelectImpl, OnUpdateImpl, OnUpdateValue };