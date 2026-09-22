import derived from "../../_styles/common/dark.mjs";
//#region src/watermark/styles/dark.ts
const watermarkDark = {
  name: "Watermark",
  common: derived,
  self(vars) {
    const {
      fontFamily
    } = vars;
    return {
      fontFamily
    };
  }
};
//#endregion
export { watermarkDark as default };