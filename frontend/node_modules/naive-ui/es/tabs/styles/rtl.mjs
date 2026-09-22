import { buttonRtl } from "../../button/styles/rtl.mjs";
import rtl_cssr_default from "../src/styles/rtl.cssr.mjs";
//#region src/tabs/styles/rtl.ts
const tabsRtl = {
  name: "Tabs",
  style: rtl_cssr_default,
  peers: [buttonRtl]
};
//#endregion
export { tabsRtl };