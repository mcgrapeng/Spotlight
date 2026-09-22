import { c, cB, cE, cNotM } from "../../../_utils/cssr/index.mjs";
//#region src/marquee/src/styles/index.cssr.ts
var index_cssr_default = c([cB("marquee", `
 overflow: hidden;
 display: flex;
 `, [cE("group", `
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
 `), cNotM("auto-fill", [cE("group", `min-width: 100%;`), cE("item", `min-width: 100%;`)])]), c("@keyframes n-marquee", {
  from: {
    transform: "translateX(0)"
  },
  to: {
    transform: "translateX(-100%)"
  }
})]);
//#endregion
export { index_cssr_default as default };