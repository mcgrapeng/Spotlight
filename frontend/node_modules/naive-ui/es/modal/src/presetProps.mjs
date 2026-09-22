import { keysOf } from "../../_utils/vue/keysOf.mjs";
import { cardBaseProps } from "../../card/src/Card.mjs";
import { dialogProps } from "../../dialog/src/dialogProps.mjs";
//#region src/modal/src/presetProps.ts
const presetProps = {
  ...cardBaseProps,
  ...dialogProps
};
const presetPropsKeys = keysOf(presetProps);
const forwardedPresetPropsKeys = presetPropsKeys.filter(key => key !== "onClose" && key !== "onPositiveClick" && key !== "onNegativeClick");
//#endregion
export { forwardedPresetPropsKeys, presetProps, presetPropsKeys };