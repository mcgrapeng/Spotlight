import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { QrCodeTheme, QrCodeThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/qr-code/src/QrCode.d.ts
declare const qrCodeProps: {
  readonly value: StringConstructor;
  readonly color: {
    readonly type: StringConstructor;
    readonly default: "#000";
  };
  readonly backgroundColor: {
    readonly type: StringConstructor;
    readonly default: "#FFF";
  };
  readonly iconSrc: StringConstructor;
  readonly iconSize: {
    readonly type: NumberConstructor;
    readonly default: 40;
  };
  readonly iconBackgroundColor: {
    readonly type: StringConstructor;
    readonly default: "#FFF";
  };
  readonly iconBorderRadius: {
    readonly type: NumberConstructor;
    readonly default: 4;
  };
  readonly size: {
    readonly type: NumberConstructor;
    readonly default: 100;
  };
  readonly padding: {
    readonly type: PropType<string | number>;
    readonly default: 12;
  };
  readonly errorCorrectionLevel: {
    readonly type: StringConstructor;
    readonly default: "M";
  };
  readonly type: {
    readonly type: StringConstructor;
    readonly default: "canvas";
  };
  readonly theme: PropType<QrCodeTheme>;
  readonly themeOverrides: PropType<QrCodeThemeOverrides>;
  readonly builtinThemeOverrides: PropType<QrCodeThemeOverrides>;
};
type QrCodeProps = ExtractPublicPropTypes<typeof qrCodeProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly value: StringConstructor;
  readonly color: {
    readonly type: StringConstructor;
    readonly default: "#000";
  };
  readonly backgroundColor: {
    readonly type: StringConstructor;
    readonly default: "#FFF";
  };
  readonly iconSrc: StringConstructor;
  readonly iconSize: {
    readonly type: NumberConstructor;
    readonly default: 40;
  };
  readonly iconBackgroundColor: {
    readonly type: StringConstructor;
    readonly default: "#FFF";
  };
  readonly iconBorderRadius: {
    readonly type: NumberConstructor;
    readonly default: 4;
  };
  readonly size: {
    readonly type: NumberConstructor;
    readonly default: 100;
  };
  readonly padding: {
    readonly type: PropType<string | number>;
    readonly default: 12;
  };
  readonly errorCorrectionLevel: {
    readonly type: StringConstructor;
    readonly default: "M";
  };
  readonly type: {
    readonly type: StringConstructor;
    readonly default: "canvas";
  };
  readonly theme: PropType<QrCodeTheme>;
  readonly themeOverrides: PropType<QrCodeThemeOverrides>;
  readonly builtinThemeOverrides: PropType<QrCodeThemeOverrides>;
}>, {
  canvasRef: Ref<HTMLCanvasElement | undefined, HTMLCanvasElement | undefined>;
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  svgInfo: import("vue").ComputedRef<{
    innerHtml: string;
    numCells: number;
  }>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly value: StringConstructor;
  readonly color: {
    readonly type: StringConstructor;
    readonly default: "#000";
  };
  readonly backgroundColor: {
    readonly type: StringConstructor;
    readonly default: "#FFF";
  };
  readonly iconSrc: StringConstructor;
  readonly iconSize: {
    readonly type: NumberConstructor;
    readonly default: 40;
  };
  readonly iconBackgroundColor: {
    readonly type: StringConstructor;
    readonly default: "#FFF";
  };
  readonly iconBorderRadius: {
    readonly type: NumberConstructor;
    readonly default: 4;
  };
  readonly size: {
    readonly type: NumberConstructor;
    readonly default: 100;
  };
  readonly padding: {
    readonly type: PropType<string | number>;
    readonly default: 12;
  };
  readonly errorCorrectionLevel: {
    readonly type: StringConstructor;
    readonly default: "M";
  };
  readonly type: {
    readonly type: StringConstructor;
    readonly default: "canvas";
  };
  readonly theme: PropType<QrCodeTheme>;
  readonly themeOverrides: PropType<QrCodeThemeOverrides>;
  readonly builtinThemeOverrides: PropType<QrCodeThemeOverrides>;
}>> & Readonly<{}>, {
  readonly type: string;
  readonly color: string;
  readonly iconSize: number;
  readonly padding: string | number;
  readonly size: number;
  readonly backgroundColor: string;
  readonly iconBackgroundColor: string;
  readonly iconBorderRadius: number;
  readonly errorCorrectionLevel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { QrCodeProps, _default as default, qrCodeProps };