import { SelectBaseOption } from "../../select/src/interface.js";
//#region src/mention/src/interface.d.ts
type MentionOption = SelectBaseOption<string>;
interface MentionInst {
  focus: () => void;
  blur: () => void;
}
//#endregion
export { MentionInst, MentionOption };