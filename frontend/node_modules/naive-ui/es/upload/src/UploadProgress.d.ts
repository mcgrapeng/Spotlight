import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ProgressTheme } from "../../progress/styles/light.js";
import "../../progress/styles/index.js";
import { UploadThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { PropType } from "vue";
//#region src/upload/src/UploadProgress.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  show: BooleanConstructor;
  percentage: {
    type: NumberConstructor;
    required: true;
  };
  status: {
    type: PropType<"info" | "error" | "success">;
    required: true;
  };
}>, {
  mergedTheme: import("vue").Ref<{
    common: ThemeCommonVars;
    self: UploadThemeVars;
    peers: {
      Button: ButtonTheme;
      Progress: ProgressTheme;
    };
    peerOverrides: {
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Progress?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }, {
    common: ThemeCommonVars;
    self: UploadThemeVars;
    peers: {
      Button: ButtonTheme;
      Progress: ProgressTheme;
    };
    peerOverrides: {
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Progress?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  show: BooleanConstructor;
  percentage: {
    type: NumberConstructor;
    required: true;
  };
  status: {
    type: PropType<"info" | "error" | "success">;
    required: true;
  };
}>> & Readonly<{}>, {
  show: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };