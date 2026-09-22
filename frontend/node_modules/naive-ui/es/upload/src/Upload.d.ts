import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ImageGroupProps } from "../../image/src/ImageGroup.js";
import "../../image/index.js";
import { ProgressTheme } from "../../progress/styles/light.js";
import "../../progress/styles/index.js";
import { UploadTheme, UploadThemeOverrides, UploadThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { CreateThumbnailUrl, CustomRequest, FuncOrRecordOrUndef, ListType, OnBeforeUpload, OnError, OnPreview, OnRetry, OnUpdateFileList, RenderIcon, ShouldUseThumbnailUrl } from "./interface.js";
import { UploadFileInfo, UploadOnChange, UploadOnDownload, UploadOnFinish, UploadOnRemove, UploadSettledFileInfo } from "./public-types.js";
import "../../index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, InputHTMLAttributes, PropType, Ref } from "vue";
//#region src/upload/src/Upload.d.ts
declare const uploadProps: {
  readonly name: {
    readonly type: StringConstructor;
    readonly default: "file";
  };
  readonly accept: StringConstructor;
  readonly action: StringConstructor;
  readonly customRequest: PropType<CustomRequest>;
  readonly directory: BooleanConstructor;
  readonly directoryDnd: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly method: {
    readonly type: StringConstructor;
    readonly default: "POST";
  };
  readonly multiple: BooleanConstructor;
  readonly showFileList: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly data: PropType<FuncOrRecordOrUndef<string | Blob>>;
  readonly headers: PropType<FuncOrRecordOrUndef>;
  readonly withCredentials: BooleanConstructor;
  readonly responseType: {
    readonly type: PropType<XMLHttpRequestResponseType>;
    readonly default: "";
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly onChange: PropType<UploadOnChange>;
  readonly onRemove: PropType<UploadOnRemove>;
  readonly onFinish: PropType<UploadOnFinish>;
  readonly onError: PropType<OnError>;
  readonly onRetry: PropType<OnRetry>;
  readonly onBeforeUpload: PropType<OnBeforeUpload>;
  readonly isErrorState: PropType<(xhr: XMLHttpRequest) => boolean>;
  /** currently not used */
  readonly onDownload: PropType<UploadOnDownload>;
  readonly customDownload: PropType<UploadOnDownload>;
  readonly defaultUpload: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly fileList: PropType<UploadFileInfo[]>;
  readonly 'onUpdate:fileList': PropType<MaybeArray<OnUpdateFileList>>;
  readonly onUpdateFileList: PropType<MaybeArray<OnUpdateFileList>>;
  readonly fileListClass: StringConstructor;
  readonly fileListStyle: PropType<string | CSSProperties>;
  readonly defaultFileList: {
    readonly type: PropType<UploadFileInfo[]>;
    readonly default: () => never[];
  };
  readonly showCancelButton: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showRemoveButton: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showDownloadButton: BooleanConstructor;
  readonly showRetryButton: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showPreviewButton: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly alwaysShowActions: BooleanConstructor;
  readonly listType: {
    readonly type: PropType<ListType>;
    readonly default: "text";
  };
  readonly onPreview: PropType<OnPreview>;
  readonly shouldUseThumbnailUrl: {
    readonly type: PropType<ShouldUseThumbnailUrl>;
    readonly default: (file: UploadSettledFileInfo) => boolean;
  };
  readonly createThumbnailUrl: PropType<CreateThumbnailUrl>;
  readonly abstract: BooleanConstructor;
  readonly max: NumberConstructor;
  readonly showTrigger: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly imageGroupProps: PropType<ImageGroupProps>;
  readonly inputProps: PropType<InputHTMLAttributes>;
  readonly triggerClass: StringConstructor;
  readonly triggerStyle: PropType<CSSProperties | string>;
  readonly renderIcon: PropType<RenderIcon>;
  readonly theme: PropType<UploadTheme>;
  readonly themeOverrides: PropType<UploadThemeOverrides>;
  readonly builtinThemeOverrides: PropType<UploadThemeOverrides>;
};
type UploadProps = ExtractPublicPropTypes<typeof uploadProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly name: {
    readonly type: StringConstructor;
    readonly default: "file";
  };
  readonly accept: StringConstructor;
  readonly action: StringConstructor;
  readonly customRequest: PropType<CustomRequest>;
  readonly directory: BooleanConstructor;
  readonly directoryDnd: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly method: {
    readonly type: StringConstructor;
    readonly default: "POST";
  };
  readonly multiple: BooleanConstructor;
  readonly showFileList: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly data: PropType<FuncOrRecordOrUndef<string | Blob>>;
  readonly headers: PropType<FuncOrRecordOrUndef>;
  readonly withCredentials: BooleanConstructor;
  readonly responseType: {
    readonly type: PropType<XMLHttpRequestResponseType>;
    readonly default: "";
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly onChange: PropType<UploadOnChange>;
  readonly onRemove: PropType<UploadOnRemove>;
  readonly onFinish: PropType<UploadOnFinish>;
  readonly onError: PropType<OnError>;
  readonly onRetry: PropType<OnRetry>;
  readonly onBeforeUpload: PropType<OnBeforeUpload>;
  readonly isErrorState: PropType<(xhr: XMLHttpRequest) => boolean>;
  /** currently not used */
  readonly onDownload: PropType<UploadOnDownload>;
  readonly customDownload: PropType<UploadOnDownload>;
  readonly defaultUpload: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly fileList: PropType<UploadFileInfo[]>;
  readonly 'onUpdate:fileList': PropType<MaybeArray<OnUpdateFileList>>;
  readonly onUpdateFileList: PropType<MaybeArray<OnUpdateFileList>>;
  readonly fileListClass: StringConstructor;
  readonly fileListStyle: PropType<string | CSSProperties>;
  readonly defaultFileList: {
    readonly type: PropType<UploadFileInfo[]>;
    readonly default: () => never[];
  };
  readonly showCancelButton: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showRemoveButton: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showDownloadButton: BooleanConstructor;
  readonly showRetryButton: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showPreviewButton: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly alwaysShowActions: BooleanConstructor;
  readonly listType: {
    readonly type: PropType<ListType>;
    readonly default: "text";
  };
  readonly onPreview: PropType<OnPreview>;
  readonly shouldUseThumbnailUrl: {
    readonly type: PropType<ShouldUseThumbnailUrl>;
    readonly default: (file: UploadSettledFileInfo) => boolean;
  };
  readonly createThumbnailUrl: PropType<CreateThumbnailUrl>;
  readonly abstract: BooleanConstructor;
  readonly max: NumberConstructor;
  readonly showTrigger: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly imageGroupProps: PropType<ImageGroupProps>;
  readonly inputProps: PropType<InputHTMLAttributes>;
  readonly triggerClass: StringConstructor;
  readonly triggerStyle: PropType<CSSProperties | string>;
  readonly renderIcon: PropType<RenderIcon>;
  readonly theme: PropType<UploadTheme>;
  readonly themeOverrides: PropType<UploadThemeOverrides>;
  readonly builtinThemeOverrides: PropType<UploadThemeOverrides>;
}>, {
  openOpenFileDialog: () => void;
  submit: (options?: {
    fileId?: string;
    retry?: boolean;
  }) => void;
  clear: () => void;
  mergedClsPrefix: Ref<string, string>;
  draggerInsideRef: {
    value: boolean;
  };
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  inputElRef: Ref<HTMLInputElement | null, HTMLInputElement | null>;
  mergedTheme: import("vue").ComputedRef<{
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
  dragOver: Ref<boolean, boolean>;
  mergedMultiple: import("vue").ComputedRef<boolean>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  handleFileInputChange: (e: Event) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly name: {
    readonly type: StringConstructor;
    readonly default: "file";
  };
  readonly accept: StringConstructor;
  readonly action: StringConstructor;
  readonly customRequest: PropType<CustomRequest>;
  readonly directory: BooleanConstructor;
  readonly directoryDnd: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly method: {
    readonly type: StringConstructor;
    readonly default: "POST";
  };
  readonly multiple: BooleanConstructor;
  readonly showFileList: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly data: PropType<FuncOrRecordOrUndef<string | Blob>>;
  readonly headers: PropType<FuncOrRecordOrUndef>;
  readonly withCredentials: BooleanConstructor;
  readonly responseType: {
    readonly type: PropType<XMLHttpRequestResponseType>;
    readonly default: "";
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly onChange: PropType<UploadOnChange>;
  readonly onRemove: PropType<UploadOnRemove>;
  readonly onFinish: PropType<UploadOnFinish>;
  readonly onError: PropType<OnError>;
  readonly onRetry: PropType<OnRetry>;
  readonly onBeforeUpload: PropType<OnBeforeUpload>;
  readonly isErrorState: PropType<(xhr: XMLHttpRequest) => boolean>;
  /** currently not used */
  readonly onDownload: PropType<UploadOnDownload>;
  readonly customDownload: PropType<UploadOnDownload>;
  readonly defaultUpload: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly fileList: PropType<UploadFileInfo[]>;
  readonly 'onUpdate:fileList': PropType<MaybeArray<OnUpdateFileList>>;
  readonly onUpdateFileList: PropType<MaybeArray<OnUpdateFileList>>;
  readonly fileListClass: StringConstructor;
  readonly fileListStyle: PropType<string | CSSProperties>;
  readonly defaultFileList: {
    readonly type: PropType<UploadFileInfo[]>;
    readonly default: () => never[];
  };
  readonly showCancelButton: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showRemoveButton: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showDownloadButton: BooleanConstructor;
  readonly showRetryButton: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showPreviewButton: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly alwaysShowActions: BooleanConstructor;
  readonly listType: {
    readonly type: PropType<ListType>;
    readonly default: "text";
  };
  readonly onPreview: PropType<OnPreview>;
  readonly shouldUseThumbnailUrl: {
    readonly type: PropType<ShouldUseThumbnailUrl>;
    readonly default: (file: UploadSettledFileInfo) => boolean;
  };
  readonly createThumbnailUrl: PropType<CreateThumbnailUrl>;
  readonly abstract: BooleanConstructor;
  readonly max: NumberConstructor;
  readonly showTrigger: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly imageGroupProps: PropType<ImageGroupProps>;
  readonly inputProps: PropType<InputHTMLAttributes>;
  readonly triggerClass: StringConstructor;
  readonly triggerStyle: PropType<CSSProperties | string>;
  readonly renderIcon: PropType<RenderIcon>;
  readonly theme: PropType<UploadTheme>;
  readonly themeOverrides: PropType<UploadThemeOverrides>;
  readonly builtinThemeOverrides: PropType<UploadThemeOverrides>;
}>> & Readonly<{}>, {
  readonly name: string;
  readonly disabled: boolean | undefined;
  readonly multiple: boolean;
  readonly abstract: boolean;
  readonly showTrigger: boolean;
  readonly directory: boolean;
  readonly directoryDnd: boolean;
  readonly method: string;
  readonly showFileList: boolean;
  readonly withCredentials: boolean;
  readonly responseType: XMLHttpRequestResponseType;
  readonly defaultUpload: boolean;
  readonly defaultFileList: UploadFileInfo[];
  readonly showCancelButton: boolean;
  readonly showRemoveButton: boolean;
  readonly showDownloadButton: boolean;
  readonly showRetryButton: boolean;
  readonly showPreviewButton: boolean;
  readonly alwaysShowActions: boolean;
  readonly listType: ListType;
  readonly shouldUseThumbnailUrl: ShouldUseThumbnailUrl;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { UploadProps, _default as default, uploadProps };