import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
//#region src/watermark/styles/light.ts
const watermarkLight = createTheme({
  name: "Watermark",
  common: derived,
  self(vars) {
    const {
      fontFamily
    } = vars;
    return {
      fontFamily
    };
  }
});
//#endregion
export { watermarkLight as default };