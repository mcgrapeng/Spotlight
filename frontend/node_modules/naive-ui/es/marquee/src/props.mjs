import useTheme from "../../_mixins/use-theme.mjs";
//#region src/marquee/src/props.ts
const marqueeProps = {
  ...useTheme.props,
  autoFill: Boolean,
  speed: {
    type: Number,
    default: 48
  }
};
//#endregion
export { marqueeProps };