import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import scrollbarLight from "../../_internal/scrollbar/styles/light.mjs";
import emptyLight from "../../empty/styles/light.mjs";
import inputLight from "../../input/styles/light.mjs";
import buttonLight from "../../button/styles/light.mjs";
import checkboxLight from "../../checkbox/styles/light.mjs";
import _common_default from "./_common.mjs";
import { composite } from "seemly";
//#region src/legacy-transfer/styles/light.ts
function self(vars) {
  const {
    fontWeight,
    iconColorDisabled,
    iconColor,
    fontSizeLarge,
    fontSizeMedium,
    fontSizeSmall,
    heightLarge,
    heightMedium,
    heightSmall,
    borderRadius,
    cardColor,
    tableHeaderColor,
    textColor1,
    textColorDisabled,
    textColor2,
    borderColor,
    hoverColor
  } = vars;
  return {
    ..._common_default,
    itemHeightSmall: heightSmall,
    itemHeightMedium: heightMedium,
    itemHeightLarge: heightLarge,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    borderRadius,
    borderColor,
    listColor: cardColor,
    headerColor: composite(cardColor, tableHeaderColor),
    titleTextColor: textColor1,
    titleTextColorDisabled: textColorDisabled,
    extraTextColor: textColor2,
    filterDividerColor: borderColor,
    itemTextColor: textColor2,
    itemTextColorDisabled: textColorDisabled,
    itemColorPending: hoverColor,
    titleFontWeight: fontWeight,
    iconColor,
    iconColorDisabled
  };
}
const transferLight = createTheme({
  name: "Transfer",
  common: derived,
  peers: {
    Checkbox: checkboxLight,
    Scrollbar: scrollbarLight,
    Input: inputLight,
    Empty: emptyLight,
    Button: buttonLight
  },
  self
});
//#endregion
export { transferLight as default };