import { buttonRtl } from "../../button/styles/rtl.mjs";
import { spaceRtl } from "../../space/styles/rtl.mjs";
import rtl_cssr_default from "../src/styles/rtl.cssr.mjs";
//#region src/thing/styles/rtl.ts
const thingRtl = {
  name: "Thing",
  style: rtl_cssr_default,
  peers: [buttonRtl, spaceRtl]
};
//#endregion
export { thingRtl };