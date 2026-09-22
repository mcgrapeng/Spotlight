import { c } from "../../_utils/cssr/index.mjs";
import _common_default from "../common/_common.mjs";
//#region src/_styles/global/index.cssr.ts
const {
  fontSize,
  fontFamily,
  lineHeight
} = _common_default;
var index_cssr_default = c("body", `
 margin: 0;
 font-size: ${fontSize};
 font-family: ${fontFamily};
 line-height: ${lineHeight};
 -webkit-text-size-adjust: 100%;
 -webkit-tap-highlight-color: transparent;
`, [c("input", `
 font-family: inherit;
 font-size: inherit;
 `)]);
//#endregion
export { index_cssr_default as default };