import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import buttonLight from "../../button/styles/light.mjs";
import progressLight from "../../progress/styles/light.mjs";
import { changeColor } from "seemly";
//#region src/upload/styles/light.ts
function self(vars) {
  const {
    iconColor,
    primaryColor,
    errorColor,
    textColor2,
    successColor,
    opacityDisabled,
    actionColor,
    borderColor,
    hoverColor,
    lineHeight,
    borderRadius,
    fontSize
  } = vars;
  return {
    fontSize,
    lineHeight,
    borderRadius,
    draggerColor: actionColor,
    draggerBorder: `1px dashed ${borderColor}`,
    draggerBorderHover: `1px dashed ${primaryColor}`,
    itemColorHover: hoverColor,
    itemColorHoverError: changeColor(errorColor, {
      alpha: .06
    }),
    itemTextColor: textColor2,
    itemTextColorError: errorColor,
    itemTextColorSuccess: successColor,
    itemIconColor: iconColor,
    itemDisabledOpacity: opacityDisabled,
    itemBorderImageCardError: `1px solid ${errorColor}`,
    itemBorderImageCard: `1px solid ${borderColor}`
  };
}
const uploadLight = createTheme({
  name: "Upload",
  common: derived,
  peers: {
    Button: buttonLight,
    Progress: progressLight
  },
  self
});
//#endregion
export { uploadLight as default, self };