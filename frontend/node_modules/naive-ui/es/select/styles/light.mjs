import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import internalSelectMenuLight from "../../_internal/select-menu/styles/light.mjs";
import internalSelectionLight from "../../_internal/selection/styles/light.mjs";
//#region src/select/styles/light.ts
function self(vars) {
  const {
    boxShadow2
  } = vars;
  return {
    menuBoxShadow: boxShadow2
  };
}
const selectLight = createTheme({
  name: "Select",
  common: derived,
  peers: {
    InternalSelection: internalSelectionLight,
    InternalSelectMenu: internalSelectMenuLight
  },
  self
});
//#endregion
export { selectLight as default, self };