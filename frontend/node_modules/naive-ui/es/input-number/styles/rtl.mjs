import { inputRtl } from "../../input/styles/rtl.mjs";
import { buttonRtl } from "../../button/styles/rtl.mjs";
import rtl_cssr_default from "../src/styles/rtl.cssr.mjs";
//#region src/input-number/styles/rtl.ts
const inputNumberRtl = {
  name: "InputNumber",
  style: rtl_cssr_default,
  peers: [inputRtl, buttonRtl]
};
//#endregion
export { inputNumberRtl };