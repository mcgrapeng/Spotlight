import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import tagLight from "../../tag/styles/light.mjs";
import inputLight from "../../input/styles/light.mjs";
import buttonLight from "../../button/styles/light.mjs";
import spaceLight from "../../space/styles/light.mjs";
//#region src/dynamic-tags/styles/light.ts
function self() {
  return {
    inputWidth: "64px"
  };
}
const dynamicTagsLight = createTheme({
  name: "DynamicTags",
  common: derived,
  peers: {
    Input: inputLight,
    Button: buttonLight,
    Tag: tagLight,
    Space: spaceLight
  },
  self
});
//#endregion
export { dynamicTagsLight as default, self };