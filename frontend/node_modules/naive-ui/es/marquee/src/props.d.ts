import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { MarqueeTheme, MarqueeThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
//#region src/marquee/src/props.d.ts
declare const marqueeProps: {
  autoFill: BooleanConstructor;
  speed: {
    type: NumberConstructor;
    default: number;
  };
  theme: import("vue").PropType<MarqueeTheme>;
  themeOverrides: import("vue").PropType<MarqueeThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<MarqueeThemeOverrides>;
};
type MarqueeProps = ExtractPublicPropTypes<typeof marqueeProps>;
//#endregion
export { MarqueeProps, marqueeProps };