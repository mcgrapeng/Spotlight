import derived from "../../_styles/common/dark.mjs";
//#region src/code/styles/dark.ts
const codeDark = {
  name: "Code",
  common: derived,
  self(vars) {
    const {
      textColor2,
      fontSize,
      fontWeightStrong,
      textColor3
    } = vars;
    return {
      textColor: textColor2,
      fontSize,
      fontWeightStrong,
      "mono-3": "#5c6370",
      "hue-1": "#56b6c2",
      "hue-2": "#61aeee",
      "hue-3": "#c678dd",
      "hue-4": "#98c379",
      "hue-5": "#e06c75",
      "hue-5-2": "#be5046",
      "hue-6": "#d19a66",
      "hue-6-2": "#e6c07b",
      lineNumberTextColor: textColor3
    };
  }
};
//#endregion
export { codeDark as default };