import derived from "../../_styles/common/dark.mjs";
import avatarDark from "../../avatar/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/avatar-group/styles/dark.ts
const avatarGroupDark = {
  name: "AvatarGroup",
  common: derived,
  peers: {
    Avatar: avatarDark
  },
  self
};
//#endregion
export { avatarGroupDark as default };