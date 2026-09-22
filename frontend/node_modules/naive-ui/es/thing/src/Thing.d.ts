import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ThingTheme, ThingThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, SlotsType, VNode } from "vue";
//#region src/thing/src/Thing.d.ts
declare const thingProps: {
  title: StringConstructor;
  titleExtra: StringConstructor;
  description: StringConstructor;
  descriptionClass: StringConstructor;
  descriptionStyle: PropType<string | CSSProperties>;
  content: StringConstructor;
  contentClass: StringConstructor;
  contentStyle: PropType<string | CSSProperties>;
  contentIndented: BooleanConstructor;
  theme: PropType<ThingTheme>;
  themeOverrides: PropType<ThingThemeOverrides>;
  builtinThemeOverrides: PropType<ThingThemeOverrides>;
};
type ThingProps = ExtractPublicPropTypes<typeof thingProps>;
interface ThingSlots {
  action?: () => VNode[];
  avatar?: () => VNode[];
  default?: () => VNode[];
  description?: () => VNode[];
  footer?: () => VNode[];
  'header-extra'?: () => VNode[];
  header?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  title: StringConstructor;
  titleExtra: StringConstructor;
  description: StringConstructor;
  descriptionClass: StringConstructor;
  descriptionStyle: PropType<string | CSSProperties>;
  content: StringConstructor;
  contentClass: StringConstructor;
  contentStyle: PropType<string | CSSProperties>;
  contentIndented: BooleanConstructor;
  theme: PropType<ThingTheme>;
  themeOverrides: PropType<ThingThemeOverrides>;
  builtinThemeOverrides: PropType<ThingThemeOverrides>;
}>, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  title: StringConstructor;
  titleExtra: StringConstructor;
  description: StringConstructor;
  descriptionClass: StringConstructor;
  descriptionStyle: PropType<string | CSSProperties>;
  content: StringConstructor;
  contentClass: StringConstructor;
  contentStyle: PropType<string | CSSProperties>;
  contentIndented: BooleanConstructor;
  theme: PropType<ThingTheme>;
  themeOverrides: PropType<ThingThemeOverrides>;
  builtinThemeOverrides: PropType<ThingThemeOverrides>;
}>> & Readonly<{}>, {
  contentIndented: boolean;
}, SlotsType<ThingSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ThingProps, ThingSlots, _default as default, thingProps };