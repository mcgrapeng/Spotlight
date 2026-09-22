import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { WatermarkTheme, WatermarkThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { PropType } from "vue";
//#region src/watermark/src/Watermark.d.ts
declare const watermarkProps: {
  readonly debug: BooleanConstructor;
  readonly cross: BooleanConstructor;
  readonly fullscreen: BooleanConstructor;
  readonly width: {
    readonly type: NumberConstructor;
    readonly default: 32;
  };
  readonly height: {
    readonly type: NumberConstructor;
    readonly default: 32;
  };
  readonly zIndex: {
    readonly type: NumberConstructor;
    readonly default: 10;
  };
  readonly xGap: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly yGap: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly yOffset: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly xOffset: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly rotate: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly textAlign: {
    readonly type: PropType<"left" | "center" | "right">;
    readonly default: "left";
  };
  readonly image: StringConstructor;
  readonly imageOpacity: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly imageHeight: NumberConstructor;
  readonly imageWidth: NumberConstructor;
  readonly content: StringConstructor;
  readonly selectable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly fontSize: {
    readonly type: NumberConstructor;
    readonly default: 14;
  };
  readonly fontFamily: StringConstructor;
  readonly fontStyle: {
    readonly type: PropType<"normal" | "italic" | "oblique" | `oblique ${number}deg`>;
    readonly default: "normal";
  };
  readonly fontVariant: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly fontWeight: {
    readonly type: NumberConstructor;
    readonly default: 400;
  };
  readonly fontColor: {
    readonly type: StringConstructor;
    readonly default: "rgba(128, 128, 128, .3)";
  };
  readonly fontStretch: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly lineHeight: {
    readonly type: NumberConstructor;
    readonly default: 14;
  };
  readonly globalRotate: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly theme: PropType<WatermarkTheme>;
  readonly themeOverrides: PropType<WatermarkThemeOverrides>;
  readonly builtinThemeOverrides: PropType<WatermarkThemeOverrides>;
};
type WatermarkProps = ExtractPublicPropTypes<typeof watermarkProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly debug: BooleanConstructor;
  readonly cross: BooleanConstructor;
  readonly fullscreen: BooleanConstructor;
  readonly width: {
    readonly type: NumberConstructor;
    readonly default: 32;
  };
  readonly height: {
    readonly type: NumberConstructor;
    readonly default: 32;
  };
  readonly zIndex: {
    readonly type: NumberConstructor;
    readonly default: 10;
  };
  readonly xGap: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly yGap: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly yOffset: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly xOffset: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly rotate: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly textAlign: {
    readonly type: PropType<"left" | "center" | "right">;
    readonly default: "left";
  };
  readonly image: StringConstructor;
  readonly imageOpacity: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly imageHeight: NumberConstructor;
  readonly imageWidth: NumberConstructor;
  readonly content: StringConstructor;
  readonly selectable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly fontSize: {
    readonly type: NumberConstructor;
    readonly default: 14;
  };
  readonly fontFamily: StringConstructor;
  readonly fontStyle: {
    readonly type: PropType<"normal" | "italic" | "oblique" | `oblique ${number}deg`>;
    readonly default: "normal";
  };
  readonly fontVariant: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly fontWeight: {
    readonly type: NumberConstructor;
    readonly default: 400;
  };
  readonly fontColor: {
    readonly type: StringConstructor;
    readonly default: "rgba(128, 128, 128, .3)";
  };
  readonly fontStretch: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly lineHeight: {
    readonly type: NumberConstructor;
    readonly default: 14;
  };
  readonly globalRotate: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly theme: PropType<WatermarkTheme>;
  readonly themeOverrides: PropType<WatermarkThemeOverrides>;
  readonly builtinThemeOverrides: PropType<WatermarkThemeOverrides>;
}>, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly debug: BooleanConstructor;
  readonly cross: BooleanConstructor;
  readonly fullscreen: BooleanConstructor;
  readonly width: {
    readonly type: NumberConstructor;
    readonly default: 32;
  };
  readonly height: {
    readonly type: NumberConstructor;
    readonly default: 32;
  };
  readonly zIndex: {
    readonly type: NumberConstructor;
    readonly default: 10;
  };
  readonly xGap: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly yGap: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly yOffset: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly xOffset: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly rotate: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly textAlign: {
    readonly type: PropType<"left" | "center" | "right">;
    readonly default: "left";
  };
  readonly image: StringConstructor;
  readonly imageOpacity: {
    readonly type: NumberConstructor;
    readonly default: 1;
  };
  readonly imageHeight: NumberConstructor;
  readonly imageWidth: NumberConstructor;
  readonly content: StringConstructor;
  readonly selectable: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly fontSize: {
    readonly type: NumberConstructor;
    readonly default: 14;
  };
  readonly fontFamily: StringConstructor;
  readonly fontStyle: {
    readonly type: PropType<"normal" | "italic" | "oblique" | `oblique ${number}deg`>;
    readonly default: "normal";
  };
  readonly fontVariant: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly fontWeight: {
    readonly type: NumberConstructor;
    readonly default: 400;
  };
  readonly fontColor: {
    readonly type: StringConstructor;
    readonly default: "rgba(128, 128, 128, .3)";
  };
  readonly fontStretch: {
    readonly type: StringConstructor;
    readonly default: "";
  };
  readonly lineHeight: {
    readonly type: NumberConstructor;
    readonly default: 14;
  };
  readonly globalRotate: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly theme: PropType<WatermarkTheme>;
  readonly themeOverrides: PropType<WatermarkThemeOverrides>;
  readonly builtinThemeOverrides: PropType<WatermarkThemeOverrides>;
}>> & Readonly<{}>, {
  readonly fontSize: number;
  readonly lineHeight: number;
  readonly height: number;
  readonly width: number;
  readonly zIndex: number;
  readonly fontWeight: number;
  readonly fontStyle: "normal" | "italic" | "oblique" | `oblique ${number}deg`;
  readonly fontVariant: string;
  readonly textAlign: "left" | "right" | "center";
  readonly rotate: number;
  readonly fontStretch: string;
  readonly xGap: number;
  readonly yGap: number;
  readonly selectable: boolean;
  readonly debug: boolean;
  readonly cross: boolean;
  readonly fullscreen: boolean;
  readonly yOffset: number;
  readonly xOffset: number;
  readonly imageOpacity: number;
  readonly fontColor: string;
  readonly globalRotate: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { WatermarkProps, _default as default, watermarkProps };