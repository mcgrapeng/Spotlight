import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ProgressTheme } from "../../progress/styles/light.js";
import "../../progress/styles/index.js";
import { UploadThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { ListType, RenderIcon, ShouldUseThumbnailUrl } from "./interface.js";
import { UploadSettledFileInfo } from "./public-types.js";
import "../../index.js";
import { PropType } from "vue";
//#region src/upload/src/UploadFile.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  file: {
    type: PropType<UploadSettledFileInfo>;
    required: true;
  };
  listType: {
    type: PropType<ListType>;
    required: true;
  };
  index: {
    type: NumberConstructor;
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
  progressStatus: import("vue").ComputedRef<"info" | "error" | "success">;
  buttonType: import("vue").ComputedRef<"error" | undefined>;
  showProgress: import("vue").ComputedRef<boolean>;
  disabled: import("vue").Ref<boolean, boolean>;
  showCancelButton: import("vue").ComputedRef<boolean>;
  showRemoveButton: import("vue").ComputedRef<boolean>;
  showDownloadButton: import("vue").ComputedRef<boolean>;
  showRetryButton: import("vue").ComputedRef<boolean>;
  showPreviewButton: import("vue").ComputedRef<boolean | "" | null>;
  alwaysShowActions: import("vue").Ref<boolean, boolean>;
  mergedThumbnailUrl: import("vue").ComputedRef<string | null>;
  shouldUseThumbnailUrl: import("vue").Ref<ShouldUseThumbnailUrl, ShouldUseThumbnailUrl>;
  renderIcon: import("vue").Ref<RenderIcon | undefined, RenderIcon | undefined>;
  imageRef: unknown;
  handleRemoveOrCancelClick: (e: MouseEvent) => void;
  handleDownloadClick: (e: MouseEvent) => void;
  handleRetryClick: () => Promise<void>;
  handlePreviewClick: (e: MouseEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  file: {
    type: PropType<UploadSettledFileInfo>;
    required: true;
  };
  listType: {
    type: PropType<ListType>;
    required: true;
  };
  index: {
    type: NumberConstructor;
    required: true;
  };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export = _default;