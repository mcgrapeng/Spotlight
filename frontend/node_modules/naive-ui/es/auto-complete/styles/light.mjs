import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import internalSelectMenuLight from "../../_internal/select-menu/styles/light.mjs";
import inputLight from "../../input/styles/light.mjs";
//#region src/auto-complete/styles/light.ts
function self(vars) {
  const {
    boxShadow2
  } = vars;
  return {
    menuBoxShadow: boxShadow2
  };
}
const autoCompleteLight = createTheme({
  name: "AutoComplete",
  common: derived,
  peers: {
    InternalSelectMenu: internalSelectMenuLight,
    Input: inputLight
  },
  self
});
//#endregion
export { autoCompleteLight as default, self };