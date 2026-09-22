import derived from "../../../_styles/common/light.mjs";
import { commonVars } from "./common.mjs";
//#region src/_internal/scrollbar/styles/light.ts
function self(vars) {
  const {
    scrollbarColor,
    scrollbarColorHover,
    scrollbarHeight,
    scrollbarWidth,
    scrollbarBorderRadius
  } = vars;
  return {
    ...commonVars,
    height: scrollbarHeight,
    width: scrollbarWidth,
    borderRadius: scrollbarBorderRadius,
    color: scrollbarColor,
    colorHover: scrollbarColorHover
  };
}
const scrollbarLight = {
  name: "Scrollbar",
  common: derived,
  self
};
//#endregion
export { scrollbarLight as default, self };