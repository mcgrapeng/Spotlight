import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import internalSelectMenuLight from "../../_internal/select-menu/styles/light.mjs";
import popoverLight from "../../popover/styles/light.mjs";
//#region src/popselect/styles/light.ts
function self(vars) {
  const {
    boxShadow2
  } = vars;
  return {
    menuBoxShadow: boxShadow2
  };
}
const popselectLight = createTheme({
  name: "Popselect",
  common: derived,
  peers: {
    Popover: popoverLight,
    InternalSelectMenu: internalSelectMenuLight
  },
  self
});
//#endregion
export { popselectLight as default, self };