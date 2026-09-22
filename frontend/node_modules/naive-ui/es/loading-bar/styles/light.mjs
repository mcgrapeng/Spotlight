import derived from "../../_styles/common/light.mjs";
//#region src/loading-bar/styles/light.ts
function self(vars) {
  const {
    primaryColor,
    errorColor
  } = vars;
  return {
    colorError: errorColor,
    colorLoading: primaryColor,
    height: "2px"
  };
}
const loadingBarLight = {
  name: "LoadingBar",
  common: derived,
  self
};
//#endregion
export { loadingBarLight as default };