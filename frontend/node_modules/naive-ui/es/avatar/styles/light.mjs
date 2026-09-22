import derived from "../../_styles/common/light.mjs";
import { composite } from "seemly";
//#region src/avatar/styles/light.ts
function self(vars) {
  const {
    borderRadius,
    avatarColor,
    cardColor,
    fontSize,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    heightHuge,
    modalColor,
    popoverColor
  } = vars;
  return {
    borderRadius,
    fontSize,
    border: `2px solid ${cardColor}`,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    heightHuge,
    color: composite(cardColor, avatarColor),
    colorModal: composite(modalColor, avatarColor),
    colorPopover: composite(popoverColor, avatarColor)
  };
}
const avatarLight = {
  name: "Avatar",
  common: derived,
  self
};
//#endregion
export { avatarLight as default, self };