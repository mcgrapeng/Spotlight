import derived from "../../_styles/common/dark.mjs";
//#region src/loading-bar/styles/dark.ts
const loadingBarDark = {
  name: "LoadingBar",
  common: derived,
  self(vars) {
    const {
      primaryColor
    } = vars;
    return {
      colorError: "red",
      colorLoading: primaryColor,
      height: "2px"
    };
  }
};
//#endregion
export { loadingBarDark as default };