import derived from "../../_styles/common/dark.mjs";
import inputDark from "../../input/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/input-otp/styles/dark.ts
const inputOtpDark = {
  name: "InputOtp",
  common: derived,
  peers: {
    Input: inputDark
  },
  self
};
//#endregion
export { inputOtpDark as default };