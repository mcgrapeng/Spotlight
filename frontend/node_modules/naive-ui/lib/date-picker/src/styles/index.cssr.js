const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/date-picker/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("date-picker", `
 position: relative;
 z-index: auto;
 `, [require__utils_cssr_index.cB("date-picker-icon", `
 color: var(--n-icon-color-override);
 transition: color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("icon", `
 color: var(--n-icon-color-override);
 transition: color .3s var(--n-bezier);
 `), require__utils_cssr_index.cM("disabled", [require__utils_cssr_index.cB("date-picker-icon", `
 color: var(--n-icon-color-disabled-override);
 `), require__utils_cssr_index.cB("icon", `
 color: var(--n-icon-color-disabled-override);
 `)])]), require__utils_cssr_index.cB("date-panel", `
 width: fit-content;
 outline: none;
 margin: 4px 0;
 display: grid;
 grid-template-columns: 0fr;
 border-radius: var(--n-panel-border-radius);
 background-color: var(--n-panel-color);
 color: var(--n-panel-text-color);
 user-select: none;
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition(), require__utils_cssr_index.cM("shadow", `
 box-shadow: var(--n-panel-box-shadow);
 `), require__utils_cssr_index.cB("date-panel-calendar", {
  padding: "var(--n-calendar-left-padding)",
  display: "grid",
  gridTemplateColumns: "1fr",
  gridArea: "left-calendar"
}, [require__utils_cssr_index.cM("end", {
  padding: "var(--n-calendar-right-padding)",
  gridArea: "right-calendar"
})]), require__utils_cssr_index.cB("date-panel-month-calendar", {
  display: "flex",
  gridArea: "left-calendar"
}, [require__utils_cssr_index.cE("picker-col", `
 min-width: var(--n-scroll-item-width);
 height: calc(var(--n-scroll-item-height) * 6);
 user-select: none;
 -webkit-user-select: none;
 `, [require__utils_cssr_index.c("&:first-child", `
 min-width: calc(var(--n-scroll-item-width) + 4px);
 `, [require__utils_cssr_index.cE("picker-col-item", [require__utils_cssr_index.c("&::before", "left: 4px;")])]), require__utils_cssr_index.cE("padding", `
 height: calc(var(--n-scroll-item-height) * 5)
 `)]), require__utils_cssr_index.cE("picker-col-item", `
 z-index: 0;
 cursor: pointer;
 height: var(--n-scroll-item-height);
 box-sizing: border-box;
 padding-top: 4px;
 display: flex;
 align-items: center;
 justify-content: center;
 position: relative;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background: #0000;
 color: var(--n-item-text-color);
 `, [require__utils_cssr_index.c("&::before", `
 z-index: -1;
 content: "";
 position: absolute;
 left: 0;
 right: 4px;
 top: 4px;
 bottom: 0;
 border-radius: var(--n-scroll-item-border-radius);
 transition: 
 background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.c("&:hover::before", `
 background-color: var(--n-item-color-hover);
 `), require__utils_cssr_index.cM("selected", `
 color: var(--n-item-color-active);
 `, [require__utils_cssr_index.c("&::before", "background-color: var(--n-item-color-hover);")])]), require__utils_cssr_index.cM("disabled", `
 color: var(--n-item-text-color-disabled);
 cursor: not-allowed;
 `, [require__utils_cssr_index.cM("selected", [require__utils_cssr_index.c("&::before", `
 background-color: var(--n-item-color-disabled);
 `)])])])]), require__utils_cssr_index.cM("date", {
  gridTemplateAreas: `
 "left-calendar"
 "footer"
 "action"
 `
}), require__utils_cssr_index.cM("week", {
  gridTemplateAreas: `
 "left-calendar"
 "footer"
 "action"
 `
}), require__utils_cssr_index.cM("daterange", {
  gridTemplateAreas: `
 "left-calendar divider right-calendar"
 "footer footer footer"
 "action action action"
 `
}), require__utils_cssr_index.cM("datetime", {
  gridTemplateAreas: `
 "header"
 "left-calendar"
 "footer"
 "action"
 `
}), require__utils_cssr_index.cM("datetimerange", {
  gridTemplateAreas: `
 "header header header"
 "left-calendar divider right-calendar"
 "footer footer footer"
 "action action action"
 `
}), require__utils_cssr_index.cM("month", {
  gridTemplateAreas: `
 "left-calendar"
 "footer"
 "action"
 `
}), require__utils_cssr_index.cB("date-panel-footer", {
  gridArea: "footer"
}), require__utils_cssr_index.cB("date-panel-actions", {
  gridArea: "action"
}), require__utils_cssr_index.cB("date-panel-header", {
  gridArea: "header"
}), require__utils_cssr_index.cB("date-panel-header", `
 box-sizing: border-box;
 width: 100%;
 align-items: center;
 padding: var(--n-panel-header-padding);
 display: flex;
 justify-content: space-between;
 border-bottom: 1px solid var(--n-panel-header-divider-color);
 `, [require__utils_cssr_index.c(">", [require__utils_cssr_index.c("*:not(:last-child)", {
  marginRight: "10px"
}), require__utils_cssr_index.c("*", {
  flex: 1,
  width: 0
}), require__utils_cssr_index.cB("time-picker", {
  zIndex: 1
})])]), require__utils_cssr_index.cB("date-panel-month", `
 box-sizing: border-box;
 display: grid;
 grid-template-columns: var(--n-calendar-title-grid-template-columns);
 align-items: center;
 justify-items: center;
 padding: var(--n-calendar-title-padding);
 height: var(--n-calendar-title-height);
 `, [require__utils_cssr_index.cE("prev, next, fast-prev, fast-next", `
 line-height: 0;
 cursor: pointer;
 width: var(--n-arrow-size);
 height: var(--n-arrow-size);
 color: var(--n-arrow-color);
 `), require__utils_cssr_index.cE("month-year", `
 user-select: none;
 -webkit-user-select: none;
 flex-grow: 1;
 position: relative;
 `, [require__utils_cssr_index.cE("text", `
 font-size: var(--n-calendar-title-font-size);
 line-height: var(--n-calendar-title-font-size);
 font-weight: var(--n-calendar-title-font-weight);
 padding: 6px 8px;
 text-align: center;
 color: var(--n-calendar-title-text-color);
 cursor: pointer;
 transition: background-color .3s var(--n-bezier);
 border-radius: var(--n-panel-border-radius);
 `, [require__utils_cssr_index.cM("active", `
 background-color: var(--n-calendar-title-color-hover);
 `), require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-calendar-title-color-hover);
 `)])])]), require__utils_cssr_index.cB("date-panel-weekdays", `
 display: grid;
 margin: auto;
 grid-template-columns: repeat(7, var(--n-item-cell-width));
 grid-template-rows: repeat(1, var(--n-item-cell-height));
 align-items: center;
 justify-items: center;
 margin-bottom: 4px;
 border-bottom: 1px solid var(--n-calendar-days-divider-color);
 `, [require__utils_cssr_index.cE("day", `
 white-space: nowrap;
 user-select: none;
 -webkit-user-select: none;
 line-height: 15px;
 width: var(--n-item-size);
 text-align: center;
 font-size: var(--n-calendar-days-font-size);
 color: var(--n-item-text-color);
 display: flex;
 align-items: center;
 justify-content: center;
 `)]), require__utils_cssr_index.cB("date-panel-dates", `
 margin: auto;
 display: grid;
 grid-template-columns: repeat(7, var(--n-item-cell-width));
 grid-template-rows: repeat(6, var(--n-item-cell-height));
 align-items: center;
 justify-items: center;
 flex-wrap: wrap;
 `, [require__utils_cssr_index.cB("date-panel-date", `
 user-select: none;
 -webkit-user-select: none;
 position: relative;
 width: var(--n-item-size);
 height: var(--n-item-size);
 line-height: var(--n-item-size);
 text-align: center;
 font-size: var(--n-item-font-size);
 border-radius: var(--n-item-border-radius);
 z-index: 0;
 cursor: pointer;
 transition:
 background-color .2s var(--n-bezier),
 color .2s var(--n-bezier);
 `, [require__utils_cssr_index.cE("trigger", `
 position: absolute;
 left: calc(var(--n-item-size) / 2 - var(--n-item-cell-width) / 2);
 top: calc(var(--n-item-size) / 2 - var(--n-item-cell-height) / 2);
 width: var(--n-item-cell-width);
 height: var(--n-item-cell-height);
 `), require__utils_cssr_index.cM("current", [require__utils_cssr_index.cE("sup", `
 position: absolute;
 top: 2px;
 right: 2px;
 content: "";
 height: 4px;
 width: 4px;
 border-radius: 2px;
 background-color: var(--n-item-color-active);
 transition:
 background-color .2s var(--n-bezier);
 `)]), require__utils_cssr_index.c("&::after", `
 content: "";
 z-index: -1;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 transition: background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cM("covered, start, end", [require__utils_cssr_index.cNotM("excluded", [require__utils_cssr_index.c("&::before", `
 content: "";
 z-index: -2;
 position: absolute;
 left: calc((var(--n-item-size) - var(--n-item-cell-width)) / 2);
 right: calc((var(--n-item-size) - var(--n-item-cell-width)) / 2);
 top: 0;
 bottom: 0;
 background-color: var(--n-item-color-included);
 `), require__utils_cssr_index.c("&:nth-child(7n + 1)::before", {
  borderTopLeftRadius: "var(--n-item-border-radius)",
  borderBottomLeftRadius: "var(--n-item-border-radius)"
}), require__utils_cssr_index.c("&:nth-child(7n + 7)::before", {
  borderTopRightRadius: "var(--n-item-border-radius)",
  borderBottomRightRadius: "var(--n-item-border-radius)"
})])]), require__utils_cssr_index.cM("selected", {
  color: "var(--n-item-text-color-active)"
}, [require__utils_cssr_index.c("&::after", {
  backgroundColor: "var(--n-item-color-active)"
}), require__utils_cssr_index.cM("start", [require__utils_cssr_index.c("&::before", {
  left: "50%"
})]), require__utils_cssr_index.cM("end", [require__utils_cssr_index.c("&::before", {
  right: "50%"
})]), require__utils_cssr_index.cE("sup", {
  backgroundColor: "var(--n-panel-color)"
})]), require__utils_cssr_index.cM("excluded", {
  color: "var(--n-item-text-color-disabled)"
}, [require__utils_cssr_index.cM("selected", [require__utils_cssr_index.c("&::after", {
  backgroundColor: "var(--n-item-color-disabled)"
})])]), require__utils_cssr_index.cM("disabled", {
  cursor: "not-allowed",
  color: "var(--n-item-text-color-disabled)"
}, [require__utils_cssr_index.cM("covered", [require__utils_cssr_index.c("&::before", {
  backgroundColor: "var(--n-item-color-disabled)"
})]), require__utils_cssr_index.cM("selected", [require__utils_cssr_index.c("&::before", {
  backgroundColor: "var(--n-item-color-disabled)"
}), require__utils_cssr_index.c("&::after", {
  backgroundColor: "var(--n-item-color-disabled)"
})])]), require__utils_cssr_index.cM("week-hovered", [require__utils_cssr_index.c("&::before", `
 background-color: var(--n-item-color-included);
 `), require__utils_cssr_index.c("&:nth-child(7n + 1)::before", `
 border-top-left-radius: var(--n-item-border-radius);
 border-bottom-left-radius: var(--n-item-border-radius);
 `), require__utils_cssr_index.c("&:nth-child(7n + 7)::before", `
 border-top-right-radius: var(--n-item-border-radius);
 border-bottom-right-radius: var(--n-item-border-radius);
 `)]), require__utils_cssr_index.cM("week-selected", `
 color: var(--n-item-text-color-active)
 `, [require__utils_cssr_index.c("&::before", `
 background-color: var(--n-item-color-active);
 `), require__utils_cssr_index.c("&:nth-child(7n + 1)::before", `
 border-top-left-radius: var(--n-item-border-radius);
 border-bottom-left-radius: var(--n-item-border-radius);
 `), require__utils_cssr_index.c("&:nth-child(7n + 7)::before", `
 border-top-right-radius: var(--n-item-border-radius);
 border-bottom-right-radius: var(--n-item-border-radius);
 `)])])]), require__utils_cssr_index.cNotM("week", [require__utils_cssr_index.cB("date-panel-dates", [require__utils_cssr_index.cB("date-panel-date", [require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.cNotM("selected", [require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-item-color-hover);
 `)])])])])]), require__utils_cssr_index.cM("week", [require__utils_cssr_index.cB("date-panel-dates", [require__utils_cssr_index.cB("date-panel-date", [require__utils_cssr_index.c("&::before", `
 content: "";
 z-index: -2;
 position: absolute;
 left: calc((var(--n-item-size) - var(--n-item-cell-width)) / 2);
 right: calc((var(--n-item-size) - var(--n-item-cell-width)) / 2);
 top: 0;
 bottom: 0;
 transition: background-color .3s var(--n-bezier);
 `)])])]), require__utils_cssr_index.cE("vertical-divider", `
 grid-area: divider;
 height: 100%;
 width: 1px;
 background-color: var(--n-calendar-divider-color);
 `), require__utils_cssr_index.cB("date-panel-footer", `
 border-top: 1px solid var(--n-panel-action-divider-color);
 padding: var(--n-panel-extra-footer-padding);
 `), require__utils_cssr_index.cB("date-panel-actions", `
 flex: 1;
 padding: var(--n-panel-action-padding);
 display: flex;
 align-items: center;
 justify-content: space-between;
 border-top: 1px solid var(--n-panel-action-divider-color);
 `, [require__utils_cssr_index.cE("prefix, suffix", `
 display: flex;
 margin-bottom: -8px;
 `), require__utils_cssr_index.cE("suffix", `
 align-self: flex-end;
 `), require__utils_cssr_index.cE("prefix", `
 flex-wrap: wrap;
 `), require__utils_cssr_index.cB("button", `
 margin-bottom: 8px;
 `, [require__utils_cssr_index.c("&:not(:last-child)", `
 margin-right: 8px;
 `)])])]), require__utils_cssr_index.c("[data-n-date].transition-disabled", {
  transition: "none !important"
}, [require__utils_cssr_index.c("&::before, &::after", {
  transition: "none !important"
})])]);
//#endregion
module.exports = index_cssr_default;