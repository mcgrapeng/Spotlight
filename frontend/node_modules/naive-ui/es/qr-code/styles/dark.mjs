import derived from "../../_styles/common/dark.mjs";
//#region src/qr-code/styles/dark.ts
const qrcodeDark = {
  name: "QrCode",
  common: derived,
  self: vars => {
    return {
      borderRadius: vars.borderRadius
    };
  }
};
//#endregion
export { qrcodeDark as default };