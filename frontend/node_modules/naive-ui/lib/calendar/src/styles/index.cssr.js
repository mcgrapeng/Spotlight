const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/calendar/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("calendar", `
 line-height: var(--n-line-height);
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 height: 720px;
 display: flex;
 flex-direction: column;
 `, [require__utils_cssr_index.cB("calendar-prev-btn", `
 cursor: pointer;
 `), require__utils_cssr_index.cB("calendar-next-btn", `
 cursor: pointer;
 `), require__utils_cssr_index.cB("calendar-header", `
 display: flex;
 align-items: center;
 line-height: 1;
 font-size: var(--n-title-font-size);
 padding: 0 0 18px 0;
 justify-content: space-between;
 `, [require__utils_cssr_index.cE("title", `
 color: var(--n-title-text-color);
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 `), require__utils_cssr_index.cE("extra", `
 display: flex;
 align-items: center;
 `)]), require__utils_cssr_index.cB("calendar-dates", `
 display: grid;
 grid-template-columns: repeat(7, minmax(0, 1fr));
 grid-auto-rows: 1fr;
 border-radius: var(--n-border-radius);
 flex: 1;
 border-top: 1px solid;
 border-left: 1px solid;
 border-color: var(--n-border-color);
 transition: border-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("calendar-cell", `
 box-sizing: border-box;
 padding: 10px;
 border-right: 1px solid;
 border-bottom: 1px solid;
 border-color: var(--n-border-color);
 cursor: pointer;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.c("&:nth-child(7)", `
 border-top-right-radius: var(--n-border-radius);
 `), require__utils_cssr_index.c("&:nth-last-child(7)", `
 border-bottom-left-radius: var(--n-border-radius);
 `), require__utils_cssr_index.c("&:last-child", `
 border-bottom-right-radius: var(--n-border-radius);
 `), require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-cell-color-hover);
 `), require__utils_cssr_index.cE("bar", `
 position: absolute;
 left: 0;
 right: 0;
 bottom: -1px;
 height: 3px;
 background-color: #0000;
 transition: background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cM("selected", [require__utils_cssr_index.cE("bar", `
 background-color: var(--n-bar-color);
 `)]), require__utils_cssr_index.cB("calendar-date", `
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 color: var(--n-text-color);
 `, [require__utils_cssr_index.cE("date", `
 color: var(--n-text-color);
 `)]), require__utils_cssr_index.cM("disabled, other-month", `
 color: var(--n-day-text-color);
 `, [require__utils_cssr_index.cB("calendar-date", [require__utils_cssr_index.cE("date", `
 color: var(--n-day-text-color);
 `)])]), require__utils_cssr_index.cM("disabled", `
 cursor: not-allowed;
 `), require__utils_cssr_index.cM("current", [require__utils_cssr_index.cB("calendar-date", [require__utils_cssr_index.cE("date", `
 color: var(--n-date-text-color-current);
 background-color: var(--n-date-color-current);
 `)])]), require__utils_cssr_index.cB("calendar-date", `
 position: relative;
 line-height: 1;
 display: flex;
 align-items: center;
 height: 1em;
 justify-content: space-between;
 padding-bottom: .75em;
 `, [require__utils_cssr_index.cE("date", `
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 margin-left: -0.4em;
 width: 1.8em;
 height: 1.8em;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cE("day", `
 color: var(--n-day-text-color);
 transition: color .3s var(--n-bezier);
 `)])])]), require__utils_cssr_index.insideModal(require__utils_cssr_index.cB("calendar", [require__utils_cssr_index.cB("calendar-dates", `
 border-color: var(--n-border-color-modal);
 `), require__utils_cssr_index.cB("calendar-cell", `
 border-color: var(--n-border-color-modal);
 `, [require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-cell-color-hover-modal);
 `)])])), require__utils_cssr_index.insidePopover(require__utils_cssr_index.cB("calendar", [require__utils_cssr_index.cB("calendar-dates", `
 border-color: var(--n-border-color-popover);
 `), require__utils_cssr_index.cB("calendar-cell", `
 border-color: var(--n-border-color-popover);
 `, [require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-cell-color-hover-popover);
 `)])]))]);
//#endregion
module.exports = index_cssr_default;