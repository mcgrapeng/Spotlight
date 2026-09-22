import { cB } from "../../../_utils/cssr/index.mjs";
//#region src/typography/src/styles/hr.cssr.ts
var hr_cssr_default = cB("hr", `
 margin: 12px 0;
 transition: border-color .3s var(--n-bezier);
 border-left: none;
 border-right: none;
 border-bottom: none;
 border-top: 1px solid var(--n-color);
`);
//#endregion
export { hr_cssr_default as default };