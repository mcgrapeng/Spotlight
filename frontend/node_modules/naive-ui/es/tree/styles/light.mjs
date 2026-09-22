import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import scrollbarLight from "../../_internal/scrollbar/styles/light.mjs";
import emptyLight from "../../empty/styles/light.mjs";
import checkboxLight from "../../checkbox/styles/light.mjs";
import { changeColor } from "seemly";
//#region src/tree/styles/light.ts
function self(vars) {
  const {
    borderRadiusSmall,
    dividerColor,
    hoverColor,
    pressedColor,
    primaryColor,
    textColor3,
    textColor2,
    textColorDisabled,
    fontSize
  } = vars;
  return {
    fontSize,
    lineHeight: "1.5",
    nodeHeight: "30px",
    nodeWrapperPadding: "3px 0",
    nodeBorderRadius: borderRadiusSmall,
    nodeColorHover: hoverColor,
    nodeColorPressed: pressedColor,
    nodeColorActive: changeColor(primaryColor, {
      alpha: .1
    }),
    arrowColor: textColor3,
    nodeTextColor: textColor2,
    nodeTextColorDisabled: textColorDisabled,
    loadingColor: primaryColor,
    dropMarkColor: primaryColor,
    lineColor: dividerColor
  };
}
const treeLight = createTheme({
  name: "Tree",
  common: derived,
  peers: {
    Checkbox: checkboxLight,
    Scrollbar: scrollbarLight,
    Empty: emptyLight
  },
  self
});
//#endregion
export { treeLight as default, self };