import { inputRtl } from "../../input/styles/rtl.mjs";
import { selectRtl } from "../../select/styles/rtl.mjs";
import rtl_cssr_default from "../src/styles/rtl.cssr.mjs";
//#region src/pagination/styles/rtl.ts
const paginationRtl = {
  name: "Pagination",
  style: rtl_cssr_default,
  peers: [inputRtl, selectRtl]
};
//#endregion
export { paginationRtl };