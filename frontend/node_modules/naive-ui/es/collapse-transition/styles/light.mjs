import derived from "../../_styles/common/light.mjs";
//#region src/collapse-transition/styles/light.ts
function self(vars) {
  const {
    cubicBezierEaseInOut
  } = vars;
  return {
    bezier: cubicBezierEaseInOut
  };
}
const collapseTransitionLight = {
  name: "CollapseTransition",
  common: derived,
  self
};
//#endregion
export { collapseTransitionLight as default, self };