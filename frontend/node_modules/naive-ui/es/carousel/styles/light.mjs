import derived from "../../_styles/common/light.mjs";
//#region src/carousel/styles/light.ts
function self() {
  return {
    dotSize: "8px",
    dotColor: "rgba(255, 255, 255, .3)",
    dotColorActive: "rgba(255, 255, 255, 1)",
    dotColorFocus: "rgba(255, 255, 255, .5)",
    dotLineWidth: "16px",
    dotLineWidthActive: "24px",
    arrowColor: "#eee"
  };
}
const carouselLight = {
  name: "Carousel",
  common: derived,
  self
};
//#endregion
export { carouselLight as default, self };