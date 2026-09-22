import derived from "../../_styles/common/light.mjs";
//#region src/skeleton/styles/light.ts
function self(vars) {
  const {
    heightSmall,
    heightMedium,
    heightLarge,
    borderRadius
  } = vars;
  return {
    color: "#eee",
    colorEnd: "#ddd",
    borderRadius,
    heightSmall,
    heightMedium,
    heightLarge
  };
}
const skeletonLight = {
  name: "Skeleton",
  common: derived,
  self
};
//#endregion
export { skeletonLight };