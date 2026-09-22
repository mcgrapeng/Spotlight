import scrollbarRtl from "../../_internal/scrollbar/styles/rtl.mjs";
import rtl_cssr_default from "../src/styles/rtl.cssr.mjs";
//#region src/popover/styles/rtl.ts
const popoverRtl = {
  name: "Popover",
  style: rtl_cssr_default,
  peers: [scrollbarRtl]
};
//#endregion
export { popoverRtl };