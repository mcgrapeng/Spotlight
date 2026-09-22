import derived from "../../_styles/common/dark.mjs";
import scrollbarDark from "../../_internal/scrollbar/styles/dark.mjs";
import emptyDark from "../../empty/styles/dark.mjs";
import inputDark from "../../input/styles/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
import checkboxDark from "../../checkbox/styles/dark.mjs";
import _common_default from "./_common.mjs";
//#region src/legacy-transfer/styles/dark.ts
const transferDark = {
  name: "Transfer",
  common: derived,
  peers: {
    Checkbox: checkboxDark,
    Scrollbar: scrollbarDark,
    Input: inputDark,
    Empty: emptyDark,
    Button: buttonDark
  },
  self(vars) {
    const {
      iconColorDisabled,
      iconColor,
      fontWeight,
      fontSizeLarge,
      fontSizeMedium,
      fontSizeSmall,
      heightLarge,
      heightMedium,
      heightSmall,
      borderRadius,
      inputColor,
      tableHeaderColor,
      textColor1,
      textColorDisabled,
      textColor2,
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
      borderColor: "#0000",
      listColor: inputColor,
      headerColor: tableHeaderColor,
      titleTextColor: textColor1,
      titleTextColorDisabled: textColorDisabled,
      extraTextColor: textColor2,
      filterDividerColor: "#0000",
      itemTextColor: textColor2,
      itemTextColorDisabled: textColorDisabled,
      itemColorPending: hoverColor,
      titleFontWeight: fontWeight,
      iconColor,
      iconColorDisabled
    };
  }
};
//#endregion
export { transferDark as default };