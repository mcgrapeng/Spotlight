import scrollbarRtl from "../../_internal/scrollbar/styles/rtl.mjs";
import rtl_cssr_default from "../src/styles/rtl.cssr.mjs";
//#region src/drawer/styles/rtl.ts
const drawerRtl = {
  name: "Drawer",
  style: rtl_cssr_default,
  peers: [scrollbarRtl]
};
//#endregion
export { drawerRtl as default, drawerRtl };