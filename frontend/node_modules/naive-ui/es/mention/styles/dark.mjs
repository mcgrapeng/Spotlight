import derived from "../../_styles/common/dark.mjs";
import internalSelectMenuDark from "../../_internal/select-menu/styles/dark.mjs";
import inputDark from "../../input/styles/dark.mjs";
//#region src/mention/styles/dark.ts
const listDark = {
  name: "Mention",
  common: derived,
  peers: {
    InternalSelectMenu: internalSelectMenuDark,
    Input: inputDark
  },
  self(vars) {
    const {
      boxShadow2
    } = vars;
    return {
      menuBoxShadow: boxShadow2
    };
  }
};
//#endregion
export { listDark as default };