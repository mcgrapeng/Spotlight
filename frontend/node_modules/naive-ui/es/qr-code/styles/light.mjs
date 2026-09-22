import derived from "../../_styles/common/light.mjs";
//#region src/qr-code/styles/light.ts
function self(vars) {
  return {
    borderRadius: vars.borderRadius
  };
}
const themeLight = {
  name: "QrCode",
  common: derived,
  self
};
//#endregion
export { themeLight as default };