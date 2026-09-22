import scrollbarRtl from "../../_internal/scrollbar/styles/rtl.mjs";
import { paginationRtl } from "../../pagination/styles/rtl.mjs";
import rtl_cssr_default from "../src/styles/rtl.cssr.mjs";
//#region src/data-table/styles/rtl.ts
const DataTableRtl = {
  name: "DataTable",
  style: rtl_cssr_default,
  peers: [scrollbarRtl, paginationRtl]
};
//#endregion
export { DataTableRtl };