import derived from "../../_styles/common/dark.mjs";
import tagDark from "../../tag/styles/dark.mjs";
import inputDark from "../../input/styles/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
import spaceDark from "../../space/styles/dark.mjs";
//#region src/dynamic-tags/styles/dark.ts
const dynamicTagsDark = {
  name: "DynamicTags",
  common: derived,
  peers: {
    Input: inputDark,
    Button: buttonDark,
    Tag: tagDark,
    Space: spaceDark
  },
  self() {
    return {
      inputWidth: "64px"
    };
  }
};
//#endregion
export { dynamicTagsDark as default };