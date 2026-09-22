import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import inputLight from "../../input/styles/light.mjs";
import popselectLight from "../../popselect/styles/light.mjs";
import selectLight from "../../select/styles/light.mjs";
import _common_default from "./_common.mjs";
//#region src/pagination/styles/light.ts
function self(vars) {
  const {
    textColor2,
    primaryColor,
    primaryColorHover,
    primaryColorPressed,
    inputColorDisabled,
    textColorDisabled,
    borderColor,
    borderRadius,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    heightTiny,
    heightSmall,
    heightMedium
  } = vars;
  return {
    ..._common_default,
    buttonColor: "#0000",
    buttonColorHover: "#0000",
    buttonColorPressed: "#0000",
    buttonBorder: `1px solid ${borderColor}`,
    buttonBorderHover: `1px solid ${borderColor}`,
    buttonBorderPressed: `1px solid ${borderColor}`,
    buttonIconColor: textColor2,
    buttonIconColorHover: textColor2,
    buttonIconColorPressed: textColor2,
    itemTextColor: textColor2,
    itemTextColorHover: primaryColorHover,
    itemTextColorPressed: primaryColorPressed,
    itemTextColorActive: primaryColor,
    itemTextColorDisabled: textColorDisabled,
    itemColor: "#0000",
    itemColorHover: "#0000",
    itemColorPressed: "#0000",
    itemColorActive: "#0000",
    itemColorActiveHover: "#0000",
    itemColorDisabled: inputColorDisabled,
    itemBorder: "1px solid #0000",
    itemBorderHover: "1px solid #0000",
    itemBorderPressed: "1px solid #0000",
    itemBorderActive: `1px solid ${primaryColor}`,
    itemBorderDisabled: `1px solid ${borderColor}`,
    itemBorderRadius: borderRadius,
    itemSizeSmall: heightTiny,
    itemSizeMedium: heightSmall,
    itemSizeLarge: heightMedium,
    itemFontSizeSmall: fontSizeTiny,
    itemFontSizeMedium: fontSizeSmall,
    itemFontSizeLarge: fontSizeMedium,
    jumperFontSizeSmall: fontSizeTiny,
    jumperFontSizeMedium: fontSizeSmall,
    jumperFontSizeLarge: fontSizeMedium,
    jumperTextColor: textColor2,
    jumperTextColorDisabled: textColorDisabled
  };
}
const paginationLight = createTheme({
  name: "Pagination",
  common: derived,
  peers: {
    Select: selectLight,
    Input: inputLight,
    Popselect: popselectLight
  },
  self
});
//#endregion
export { paginationLight as default, self };