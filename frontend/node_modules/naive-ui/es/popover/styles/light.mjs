import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import scrollbarLight from "../../_internal/scrollbar/styles/light.mjs";
import _common_default from "./_common.mjs";
//#region src/popover/styles/light.ts
function self(vars) {
  const {
    boxShadow2,
    popoverColor,
    textColor2,
    borderRadius,
    fontSize,
    dividerColor
  } = vars;
  return {
    ..._common_default,
    fontSize,
    borderRadius,
    color: popoverColor,
    dividerColor,
    textColor: textColor2,
    boxShadow: boxShadow2
  };
}
const popoverLight = createTheme({
  name: "Popover",
  common: derived,
  peers: {
    Scrollbar: scrollbarLight
  },
  self
});
//#endregion
export { popoverLight as default, self };