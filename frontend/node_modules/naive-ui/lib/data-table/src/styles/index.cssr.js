const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_icon_switch_cssr = require("../../../_styles/transitions/icon-switch.cssr.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/data-table/src/styles/index.cssr.ts
const fixedColumnStyle = createFixedColumnStyle();
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("data-table", `
 width: 100%;
 font-size: var(--n-font-size);
 display: flex;
 flex-direction: column;
 position: relative;
 --n-merged-th-color: var(--n-th-color);
 --n-merged-td-color: var(--n-td-color);
 --n-merged-border-color: var(--n-border-color);
 --n-merged-th-color-hover: var(--n-th-color-hover);
 --n-merged-th-color-sorting: var(--n-th-color-sorting);
 --n-merged-td-color-hover: var(--n-td-color-hover);
 --n-merged-td-color-sorting: var(--n-td-color-sorting);
 --n-merged-td-color-striped: var(--n-td-color-striped);
 `, [require__utils_cssr_index.cB("data-table-wrapper", `
 flex-grow: 1;
 display: flex;
 flex-direction: column;
 `), require__utils_cssr_index.cM("empty", [require__utils_cssr_index.cB("data-table-base-table", `
 height: 100%;
 display: flex;
 flex-direction: column;
 `), require__utils_cssr_index.cB("data-table-base-table-body", [`height: 100%;`, require__utils_cssr_index.cB("scrollbar-content", `
 height: 100%;
 display: flex;
 flex-direction: column;
 `)])]), require__utils_cssr_index.cM("flex-height", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("data-table-wrapper", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("data-table-base-table", `
 display: flex;
 flex-direction: column;
 flex-grow: 1;
 `, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("data-table-base-table-body", "flex-basis: 0;", [require__utils_cssr_index.c("&:last-child", "flex-grow: 1;")])])])])])])]), require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("data-table-loading-wrapper", `
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 transition: color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 justify-content: center;
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition({
  originalTransform: "translateX(-50%) translateY(-50%)"
})])]), require__utils_cssr_index.cB("data-table-expand-placeholder", `
 margin-right: 8px;
 display: inline-block;
 width: 16px;
 height: 1px;
 `), require__utils_cssr_index.cB("data-table-indent", `
 display: inline-block;
 height: 1px;
 `), require__utils_cssr_index.cB("data-table-expand-trigger", `
 display: inline-flex;
 margin-right: 8px;
 cursor: pointer;
 font-size: 16px;
 vertical-align: -0.2em;
 position: relative;
 width: 16px;
 height: 16px;
 color: var(--n-td-text-color);
 transition: color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("expanded", [require__utils_cssr_index.cB("icon", "transform: rotate(90deg);", [require__styles_transitions_icon_switch_cssr.iconSwitchTransition({
  originalTransform: "rotate(90deg)"
})]), require__utils_cssr_index.cB("base-icon", "transform: rotate(90deg);", [require__styles_transitions_icon_switch_cssr.iconSwitchTransition({
  originalTransform: "rotate(90deg)"
})])]), require__utils_cssr_index.cB("base-loading", `
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `, [require__styles_transitions_icon_switch_cssr.iconSwitchTransition()]), require__utils_cssr_index.cB("icon", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `, [require__styles_transitions_icon_switch_cssr.iconSwitchTransition()]), require__utils_cssr_index.cB("base-icon", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `, [require__styles_transitions_icon_switch_cssr.iconSwitchTransition()])]), require__utils_cssr_index.cB("data-table-thead", `
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-merged-th-color);
 `), require__utils_cssr_index.cB("data-table-tr", `
 position: relative;
 box-sizing: border-box;
 background-clip: padding-box;
 transition: background-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cB("data-table-expand", `
 position: sticky;
 left: 0;
 overflow: hidden;
 margin: calc(var(--n-th-padding) * -1);
 padding: var(--n-th-padding);
 box-sizing: border-box;
 `), require__utils_cssr_index.cM("striped", "background-color: var(--n-merged-td-color-striped);", [require__utils_cssr_index.cB("data-table-td", "background-color: var(--n-merged-td-color-striped);")]), require__utils_cssr_index.cNotM("summary", [require__utils_cssr_index.c("&:hover", "background-color: var(--n-merged-td-color-hover);", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("data-table-td", "background-color: var(--n-merged-td-color-hover);")])])])]), require__utils_cssr_index.cB("data-table-th", `
 padding: var(--n-th-padding);
 position: relative;
 text-align: start;
 box-sizing: border-box;
 background-color: var(--n-merged-th-color);
 border-color: var(--n-merged-border-color);
 border-bottom: 1px solid var(--n-merged-border-color);
 color: var(--n-th-text-color);
 transition:
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 font-weight: var(--n-th-font-weight);
 `, [require__utils_cssr_index.cM("filterable", `
 padding-right: 36px;
 `, [require__utils_cssr_index.cM("sortable", `
 padding-right: calc(var(--n-th-padding) + 36px);
 `)]), fixedColumnStyle, require__utils_cssr_index.cM("selection", `
 padding: 0;
 text-align: center;
 line-height: 0;
 z-index: 3;
 `), require__utils_cssr_index.cE("title-wrapper", `
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 max-width: 100%;
 `, [require__utils_cssr_index.cE("title", `
 flex: 1;
 min-width: 0;
 `)]), require__utils_cssr_index.cE("ellipsis", `
 display: inline-block;
 vertical-align: bottom;
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap;
 max-width: 100%;
 `), require__utils_cssr_index.cM("hover", `
 background-color: var(--n-merged-th-color-hover);
 `), require__utils_cssr_index.cM("sorting", `
 background-color: var(--n-merged-th-color-sorting);
 `), require__utils_cssr_index.cM("sortable", `
 cursor: pointer;
 `, [require__utils_cssr_index.cE("ellipsis", `
 max-width: calc(100% - 18px);
 `), require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-merged-th-color-hover);
 `)]), require__utils_cssr_index.cB("data-table-sorter", `
 height: var(--n-sorter-size);
 width: var(--n-sorter-size);
 margin-left: 4px;
 position: relative;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 vertical-align: -0.2em;
 color: var(--n-th-icon-color);
 transition: color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cB("base-icon", "transition: transform .3s var(--n-bezier)"), require__utils_cssr_index.cM("desc", [require__utils_cssr_index.cB("base-icon", `
 transform: rotate(0deg);
 `)]), require__utils_cssr_index.cM("asc", [require__utils_cssr_index.cB("base-icon", `
 transform: rotate(-180deg);
 `)]), require__utils_cssr_index.cM("asc, desc", `
 color: var(--n-th-icon-color-active);
 `)]), require__utils_cssr_index.cB("data-table-resize-button", `
 width: var(--n-resizable-container-size);
 position: absolute;
 top: 0;
 right: calc(var(--n-resizable-container-size) / 2);
 bottom: 0;
 cursor: col-resize;
 user-select: none;
 `, [require__utils_cssr_index.c("&::after", `
 width: var(--n-resizable-size);
 height: 50%;
 position: absolute;
 top: 50%;
 left: calc(var(--n-resizable-container-size) / 2);
 bottom: 0;
 background-color: var(--n-merged-border-color);
 transform: translateY(-50%);
 transition: background-color .3s var(--n-bezier);
 z-index: 1;
 content: '';
 `), require__utils_cssr_index.cM("active", [require__utils_cssr_index.c("&::after", ` 
 background-color: var(--n-th-icon-color-active);
 `)]), require__utils_cssr_index.c("&:hover::after", `
 background-color: var(--n-th-icon-color-active);
 `)]), require__utils_cssr_index.cB("data-table-filter", `
 position: absolute;
 z-index: auto;
 right: 0;
 width: 36px;
 top: 0;
 bottom: 0;
 cursor: pointer;
 display: flex;
 justify-content: center;
 align-items: center;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 font-size: var(--n-filter-size);
 color: var(--n-th-icon-color);
 `, [require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-th-button-color-hover);
 `), require__utils_cssr_index.cM("show", `
 background-color: var(--n-th-button-color-hover);
 `), require__utils_cssr_index.cM("active", `
 background-color: var(--n-th-button-color-hover);
 color: var(--n-th-icon-color-active);
 `)])]), require__utils_cssr_index.cB("data-table-td", `
 padding: var(--n-td-padding);
 text-align: start;
 box-sizing: border-box;
 border: none;
 background-color: var(--n-merged-td-color);
 color: var(--n-td-text-color);
 border-bottom: 1px solid var(--n-merged-border-color);
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("expand", [require__utils_cssr_index.cB("data-table-expand-trigger", `
 margin-right: 0;
 `)]), require__utils_cssr_index.cM("last-row", `
 border-bottom: 0 solid var(--n-merged-border-color);
 `, [require__utils_cssr_index.c("&::after", `
 bottom: 0 !important;
 `), require__utils_cssr_index.c("&::before", `
 bottom: 0 !important;
 `)]), require__utils_cssr_index.cM("summary", `
 background-color: var(--n-merged-th-color);
 `), require__utils_cssr_index.cM("hover", `
 background-color: var(--n-merged-td-color-hover);
 `), require__utils_cssr_index.cM("sorting", `
 background-color: var(--n-merged-td-color-sorting);
 `), require__utils_cssr_index.cE("ellipsis", `
 display: inline-block;
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap;
 max-width: 100%;
 vertical-align: bottom;
 max-width: calc(100% - var(--indent-offset, -1.5) * 16px - 24px);
 `), require__utils_cssr_index.cM("selection, expand", `
 text-align: center;
 padding: 0;
 line-height: 0;
 `), fixedColumnStyle]), require__utils_cssr_index.cB("data-table-empty", `
 box-sizing: border-box;
 padding: var(--n-empty-padding);
 flex-grow: 1;
 flex-shrink: 0;
 opacity: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: opacity .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("hide", `
 opacity: 0;
 `)]), require__utils_cssr_index.cE("pagination", `
 margin: var(--n-pagination-margin);
 display: flex;
 justify-content: flex-end;
 `), require__utils_cssr_index.cB("data-table-wrapper", `
 position: relative;
 opacity: 1;
 transition: opacity .3s var(--n-bezier), border-color .3s var(--n-bezier);
 border-top-left-radius: var(--n-border-radius);
 border-top-right-radius: var(--n-border-radius);
 line-height: var(--n-line-height);
 `), require__utils_cssr_index.cM("loading", [require__utils_cssr_index.cB("data-table-wrapper", `
 opacity: var(--n-opacity-loading);
 pointer-events: none;
 `)]), require__utils_cssr_index.cM("single-column", [require__utils_cssr_index.cB("data-table-td", `
 border-bottom: 0 solid var(--n-merged-border-color);
 `, [require__utils_cssr_index.c("&::after, &::before", `
 bottom: 0 !important;
 `)])]), require__utils_cssr_index.cNotM("single-line", [require__utils_cssr_index.cB("data-table-th", `
 border-right: 1px solid var(--n-merged-border-color);
 `, [require__utils_cssr_index.cM("last", `
 border-right: 0 solid var(--n-merged-border-color);
 `)]), require__utils_cssr_index.cB("data-table-td", `
 border-right: 1px solid var(--n-merged-border-color);
 `, [require__utils_cssr_index.cM("last-col", `
 border-right: 0 solid var(--n-merged-border-color);
 `)])]), require__utils_cssr_index.cM("bordered", [require__utils_cssr_index.cB("data-table-wrapper", `
 border: 1px solid var(--n-merged-border-color);
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 overflow: hidden;
 `)]), require__utils_cssr_index.cB("data-table-base-table", [require__utils_cssr_index.cM("transition-disabled", [require__utils_cssr_index.cB("data-table-th", [require__utils_cssr_index.c("&::after, &::before", "transition: none;")]), require__utils_cssr_index.cB("data-table-td", [require__utils_cssr_index.c("&::after, &::before", "transition: none;")])])]), require__utils_cssr_index.cM("bottom-bordered", [require__utils_cssr_index.cB("data-table-td", [require__utils_cssr_index.cM("last-row", `
 border-bottom: 1px solid var(--n-merged-border-color);
 `)])]), require__utils_cssr_index.cB("data-table-table", `
 font-variant-numeric: tabular-nums;
 width: 100%;
 word-break: break-word;
 transition: background-color .3s var(--n-bezier);
 border-collapse: separate;
 border-spacing: 0;
 background-color: var(--n-merged-td-color);
 `), require__utils_cssr_index.cB("data-table-base-table-header", `
 border-top-left-radius: calc(var(--n-border-radius) - 1px);
 border-top-right-radius: calc(var(--n-border-radius) - 1px);
 z-index: 3;
 overflow: scroll;
 flex-shrink: 0;
 transition: border-color .3s var(--n-bezier);
 scrollbar-width: none;
 `, [require__utils_cssr_index.c("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb", `
 display: none;
 width: 0;
 height: 0;
 `)]), require__utils_cssr_index.cB("data-table-check-extra", `
 transition: color .3s var(--n-bezier);
 color: var(--n-th-icon-color);
 position: absolute;
 font-size: 14px;
 right: -4px;
 top: 50%;
 transform: translateY(-50%);
 z-index: 1;
 `)]), require__utils_cssr_index.cB("data-table-filter-menu", [require__utils_cssr_index.cB("scrollbar", `
 max-height: 240px;
 `), require__utils_cssr_index.cE("group", `
 display: flex;
 flex-direction: column;
 padding: 12px 12px 0 12px;
 `, [require__utils_cssr_index.cB("checkbox", `
 margin-bottom: 12px;
 margin-right: 0;
 `), require__utils_cssr_index.cB("radio", `
 margin-bottom: 12px;
 margin-right: 0;
 `)]), require__utils_cssr_index.cE("action", `
 padding: var(--n-action-padding);
 display: flex;
 flex-wrap: nowrap;
 justify-content: space-evenly;
 border-top: 1px solid var(--n-action-divider-color);
 `, [require__utils_cssr_index.cB("button", [require__utils_cssr_index.c("&:not(:last-child)", `
 margin: var(--n-action-button-margin);
 `), require__utils_cssr_index.c("&:last-child", `
 margin-right: 0;
 `)])]), require__utils_cssr_index.cB("divider", `
 margin: 0 !important;
 `)]), require__utils_cssr_index.insideModal(require__utils_cssr_index.cB("data-table", `
 --n-merged-th-color: var(--n-th-color-modal);
 --n-merged-td-color: var(--n-td-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 --n-merged-th-color-hover: var(--n-th-color-hover-modal);
 --n-merged-td-color-hover: var(--n-td-color-hover-modal);
 --n-merged-th-color-sorting: var(--n-th-color-hover-modal);
 --n-merged-td-color-sorting: var(--n-td-color-hover-modal);
 --n-merged-td-color-striped: var(--n-td-color-striped-modal);
 `)), require__utils_cssr_index.insidePopover(require__utils_cssr_index.cB("data-table", `
 --n-merged-th-color: var(--n-th-color-popover);
 --n-merged-td-color: var(--n-td-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 --n-merged-th-color-hover: var(--n-th-color-hover-popover);
 --n-merged-td-color-hover: var(--n-td-color-hover-popover);
 --n-merged-th-color-sorting: var(--n-th-color-hover-popover);
 --n-merged-td-color-sorting: var(--n-td-color-hover-popover);
 --n-merged-td-color-striped: var(--n-td-color-striped-popover);
 `))]);
function createFixedColumnStyle() {
  return [require__utils_cssr_index.cM("fixed-left", `
 left: 0;
 position: sticky;
 z-index: 2;
 `, [require__utils_cssr_index.c("&::after", `
 pointer-events: none;
 content: "";
 width: 36px;
 display: inline-block;
 position: absolute;
 top: 0;
 bottom: -1px;
 transition: box-shadow .2s var(--n-bezier);
 right: -36px;
 `)]), require__utils_cssr_index.cM("fixed-right", `
 right: 0;
 position: sticky;
 z-index: 1;
 `, [require__utils_cssr_index.c("&::before", `
 pointer-events: none;
 content: "";
 width: 36px;
 display: inline-block;
 position: absolute;
 top: 0;
 bottom: -1px;
 transition: box-shadow .2s var(--n-bezier);
 left: -36px;
 `)])];
}
//#endregion
module.exports = index_cssr_default;