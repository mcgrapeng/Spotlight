const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/log/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("log", `
 position: relative;
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
`, [require__utils_cssr_index.c("pre", `
 white-space: pre-wrap;
 word-break: break-word;
 margin: 0;
 `), require__utils_cssr_index.cB("log-loader", `
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 box-sizing: border-box;
 position: absolute;
 right: 16px;
 top: 8px;
 height: 34px;
 border-radius: 17px;
 line-height: 34px;
 white-space: nowrap;
 overflow: hidden;
 border: var(--n-loader-border);
 color: var(--n-loader-text-color);
 background-color: var(--n-loader-color);
 font-size: var(--n-loader-font-size);
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition(), require__utils_cssr_index.cE("content", `
 display: inline-block;
 vertical-align: bottom;
 line-height: 34px;
 padding-left: 40px;
 padding-right: 20px;
 white-space: nowrap;
 `), require__utils_cssr_index.cB("base-loading", `
 color: var(--n-loading-color);
 position: absolute;
 left: 12px;
 top: calc(50% - 10px);
 font-size: 20px;
 width: 20px;
 height: 20px;
 display: inline-block;
 `)])]);
//#endregion
module.exports = index_cssr_default;