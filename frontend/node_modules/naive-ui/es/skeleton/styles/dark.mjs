import derived from "../../_styles/common/dark.mjs";
//#region src/skeleton/styles/dark.ts
const skeletonDark = {
  name: "Skeleton",
  common: derived,
  self(vars) {
    const {
      heightSmall,
      heightMedium,
      heightLarge,
      borderRadius
    } = vars;
    return {
      color: "rgba(255, 255, 255, 0.12)",
      colorEnd: "rgba(255, 255, 255, 0.18)",
      borderRadius,
      heightSmall,
      heightMedium,
      heightLarge
    };
  }
};
//#endregion
export { skeletonDark };