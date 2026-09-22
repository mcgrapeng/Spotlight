import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import popoverLight from "../../popover/styles/light.mjs";
import buttonLight from "../../button/styles/light.mjs";
import _common_default from "./_common.mjs";
//#region src/popconfirm/styles/light.ts
function self(vars) {
  const {
    fontSize,
    warningColor
  } = vars;
  return {
    ..._common_default,
    fontSize,
    iconColor: warningColor
  };
}
const popconfirmLight = createTheme({
  name: "Popconfirm",
  common: derived,
  peers: {
    Button: buttonLight,
    Popover: popoverLight
  },
  self
});
//#endregion
export { popconfirmLight as default, self };