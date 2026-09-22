import derived from "../../_styles/common/dark.mjs";
import scrollbarDark from "../../_internal/scrollbar/styles/dark.mjs";
import { composite } from "seemly";
//#region src/layout/styles/dark.ts
const layoutDark = {
  name: "Layout",
  common: derived,
  peers: {
    Scrollbar: scrollbarDark
  },
  self(vars) {
    const {
      textColor2,
      bodyColor,
      popoverColor,
      cardColor,
      dividerColor,
      scrollbarColor,
      scrollbarColorHover
    } = vars;
    return {
      textColor: textColor2,
      textColorInverted: textColor2,
      color: bodyColor,
      colorEmbedded: bodyColor,
      headerColor: cardColor,
      headerColorInverted: cardColor,
      footerColor: cardColor,
      footerColorInverted: cardColor,
      headerBorderColor: dividerColor,
      headerBorderColorInverted: dividerColor,
      footerBorderColor: dividerColor,
      footerBorderColorInverted: dividerColor,
      siderBorderColor: dividerColor,
      siderBorderColorInverted: dividerColor,
      siderColor: cardColor,
      siderColorInverted: cardColor,
      siderToggleButtonBorder: "1px solid transparent",
      siderToggleButtonColor: popoverColor,
      siderToggleButtonIconColor: textColor2,
      siderToggleButtonIconColorInverted: textColor2,
      siderToggleBarColor: composite(bodyColor, scrollbarColor),
      siderToggleBarColorHover: composite(bodyColor, scrollbarColorHover),
      __invertScrollbar: "false"
    };
  }
};
//#endregion
export { layoutDark as default };