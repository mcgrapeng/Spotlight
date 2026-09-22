const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/marquee/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("marquee", `
 overflow: hidden;
 display: flex;
 `, [require__utils_cssr_index.cE("group", `
 flex: 0 0 auto;
 min-width: var(--n-min-width);
 z-index: 1;
 display: flex;
 flex-direction: row;
 align-items: center;
 animation: n-marquee var(--n-duration) linear var(--n-delay) var(--n-iteration-count);
 animation-play-state: var(--n-play);
 animation-delay: var(--n-delay);
 animation-direction: var(--n-direction);
 `), require__utils_cssr_index.cNotM("auto-fill", [require__utils_cssr_index.cE("group", `min-width: 100%;`), require__utils_cssr_index.cE("item", `min-width: 100%;`)])]), require__utils_cssr_index.c("@keyframes n-marquee", {
  from: {
    transform: "translateX(0)"
  },
  to: {
    transform: "translateX(-100%)"
  }
})]);
//#endregion
module.exports = index_cssr_default;