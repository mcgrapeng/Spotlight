import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import inputLight from "../../input/styles/light.mjs";
//#region src/input-otp/styles/light.ts
function self() {
  return {
    inputWidthSmall: "24px",
    inputWidthMedium: "30px",
    inputWidthLarge: "36px",
    gapSmall: "8px",
    gapMedium: "8px",
    gapLarge: "8px"
  };
}
const inputOtpLight = createTheme({
  name: "InputOtp",
  common: derived,
  peers: {
    Input: inputLight
  },
  self
});
//#endregion
export { inputOtpLight as default, self };