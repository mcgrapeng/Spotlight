import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import scrollbarLight from "../../_internal/scrollbar/styles/light.mjs";
import emptyLight from "../../empty/styles/light.mjs";
import popoverLight from "../../popover/styles/light.mjs";
import buttonLight from "../../button/styles/light.mjs";
import checkboxLight from "../../checkbox/styles/light.mjs";
import paginationLight from "../../pagination/styles/light.mjs";
import dropdownLight from "../../dropdown/styles/light.mjs";
import ellipsisLight from "../../ellipsis/styles/light.mjs";
import radioLight from "../../radio/styles/light.mjs";
import _common_default from "./_common.mjs";
import { composite } from "seemly";
//#region src/data-table/styles/light.ts
function self(vars) {
  const {
    cardColor,
    modalColor,
    popoverColor,
    textColor2,
    textColor1,
    tableHeaderColor,
    tableColorHover,
    iconColor,
    primaryColor,
    fontWeightStrong,
    borderRadius,
    lineHeight,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    dividerColor,
    heightSmall,
    opacityDisabled,
    tableColorStriped
  } = vars;
  return {
    ..._common_default,
    actionDividerColor: dividerColor,
    lineHeight,
    borderRadius,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    borderColor: composite(cardColor, dividerColor),
    tdColorHover: composite(cardColor, tableColorHover),
    tdColorSorting: composite(cardColor, tableColorHover),
    tdColorStriped: composite(cardColor, tableColorStriped),
    thColor: composite(cardColor, tableHeaderColor),
    thColorHover: composite(composite(cardColor, tableHeaderColor), tableColorHover),
    thColorSorting: composite(composite(cardColor, tableHeaderColor), tableColorHover),
    tdColor: cardColor,
    tdTextColor: textColor2,
    thTextColor: textColor1,
    thFontWeight: fontWeightStrong,
    thButtonColorHover: tableColorHover,
    thIconColor: iconColor,
    thIconColorActive: primaryColor,
    borderColorModal: composite(modalColor, dividerColor),
    tdColorHoverModal: composite(modalColor, tableColorHover),
    tdColorSortingModal: composite(modalColor, tableColorHover),
    tdColorStripedModal: composite(modalColor, tableColorStriped),
    thColorModal: composite(modalColor, tableHeaderColor),
    thColorHoverModal: composite(composite(modalColor, tableHeaderColor), tableColorHover),
    thColorSortingModal: composite(composite(modalColor, tableHeaderColor), tableColorHover),
    tdColorModal: modalColor,
    borderColorPopover: composite(popoverColor, dividerColor),
    tdColorHoverPopover: composite(popoverColor, tableColorHover),
    tdColorSortingPopover: composite(popoverColor, tableColorHover),
    tdColorStripedPopover: composite(popoverColor, tableColorStriped),
    thColorPopover: composite(popoverColor, tableHeaderColor),
    thColorHoverPopover: composite(composite(popoverColor, tableHeaderColor), tableColorHover),
    thColorSortingPopover: composite(composite(popoverColor, tableHeaderColor), tableColorHover),
    tdColorPopover: popoverColor,
    boxShadowBefore: "inset -12px 0 8px -12px rgba(0, 0, 0, .18)",
    boxShadowAfter: "inset 12px 0 8px -12px rgba(0, 0, 0, .18)",
    loadingColor: primaryColor,
    loadingSize: heightSmall,
    opacityLoading: opacityDisabled
  };
}
const dataTableLight = createTheme({
  name: "DataTable",
  common: derived,
  peers: {
    Button: buttonLight,
    Checkbox: checkboxLight,
    Radio: radioLight,
    Pagination: paginationLight,
    Scrollbar: scrollbarLight,
    Empty: emptyLight,
    Popover: popoverLight,
    Ellipsis: ellipsisLight,
    Dropdown: dropdownLight
  },
  self
});
//#endregion
export { dataTableLight as default, self };