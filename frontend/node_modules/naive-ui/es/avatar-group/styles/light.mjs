import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import avatarLight from "../../avatar/styles/light.mjs";
//#region src/avatar-group/styles/light.ts
function self() {
  return {
    gap: "-12px"
  };
}
const avatarGroupLight = createTheme({
  name: "AvatarGroup",
  common: derived,
  peers: {
    Avatar: avatarLight
  },
  self
});
//#endregion
export { avatarGroupLight as default, self };