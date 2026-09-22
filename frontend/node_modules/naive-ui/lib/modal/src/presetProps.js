Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require_card_src_Card = require("../../card/src/Card.js");
const require_dialog_src_dialogProps = require("../../dialog/src/dialogProps.js");
//#region src/modal/src/presetProps.ts
const presetProps = {
	...require_card_src_Card.cardBaseProps,
	...require_dialog_src_dialogProps.dialogProps
};
const presetPropsKeys = require__utils_vue_keysOf.keysOf(presetProps);
const forwardedPresetPropsKeys = presetPropsKeys.filter((key) => key !== "onClose" && key !== "onPositiveClick" && key !== "onNegativeClick");
//#endregion
exports.forwardedPresetPropsKeys = forwardedPresetPropsKeys;
exports.presetProps = presetProps;
exports.presetPropsKeys = presetPropsKeys;
