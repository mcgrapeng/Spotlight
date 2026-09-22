import { SelectOption } from "../../../select/src/interface.js";
import { VNodeChild } from "vue";
//#region src/_internal/selection/src/interface.d.ts
type RenderTag = (props: {
  option: SelectOption;
  handleClose: () => void;
}) => VNodeChild;
//#endregion
export { RenderTag };