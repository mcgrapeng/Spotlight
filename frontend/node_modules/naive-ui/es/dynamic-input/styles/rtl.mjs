import { inputRtl } from "../../input/styles/rtl.mjs";
import { buttonRtl } from "../../button/styles/rtl.mjs";
import { checkboxRtl } from "../../checkbox/styles/rtl.mjs";
import { buttonGroupRtl } from "../../button-group/styles/rtl.mjs";
import { inputNumberRtl } from "../../input-number/styles/rtl.mjs";
import rtl_cssr_default from "../src/styles/rtl.cssr.mjs";
//#region src/dynamic-input/styles/rtl.ts
const dynamicInputRtl = {
  name: "DynamicInput",
  style: rtl_cssr_default,
  peers: [inputRtl, buttonRtl, buttonGroupRtl, checkboxRtl, inputNumberRtl]
};
//#endregion
export { dynamicInputRtl };