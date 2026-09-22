import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import _common_default from "./_common.mjs";
//#region src/page-header/styles/light.ts
function self(vars) {
  const {
    textColor1,
    textColor2,
    textColor3,
    fontSize,
    fontWeightStrong,
    primaryColorHover,
    primaryColorPressed
  } = vars;
  return {
    ..._common_default,
    titleFontWeight: fontWeightStrong,
    fontSize,
    titleTextColor: textColor1,
    backColor: textColor2,
    backColorHover: primaryColorHover,
    backColorPressed: primaryColorPressed,
    subtitleTextColor: textColor3
  };
}
const pageHeaderLight = createTheme({
  name: "PageHeader",
  common: derived,
  self
});
//#endregion
export { pageHeaderLight, self };