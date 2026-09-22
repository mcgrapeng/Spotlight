import { ImageGroupProps } from "../../image/src/ImageGroup.js";
import "../../image/index.js";
import { UploadTheme } from "../styles/light.js";
import "../styles/index.js";
import { UploadCustomRequestOptions, UploadFileInfo, UploadOnDownload, UploadOnFinish, UploadOnRemove, UploadSettledFileInfo } from "./public-types.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { CSSProperties, Ref, VNodeChild } from "vue";
//#region src/upload/src/interface.d.ts
type ShouldUseThumbnailUrl = (file: UploadSettledFileInfo) => boolean;
type FuncOrRecordOrUndef<T = string> = Record<string, T> | (({ file }: {
  file: UploadSettledFileInfo;
}) => Record<string, T>) | undefined;
interface UploadInternalInst {
  doChange: DoChange;
  xhrMap: Map<string, XMLHttpRequest>;
  isErrorState: ((xhr: XMLHttpRequest) => boolean) | undefined;
  onError: OnError | undefined;
  onFinish: UploadOnFinish | undefined;
}
type DoChange = (fileAfterChange: UploadSettledFileInfo, event?: ProgressEvent | Event, options?: {
  append?: boolean;
  remove?: boolean;
}) => void;
type OnUpdateFileList = (fileList: UploadSettledFileInfo[]) => void;
type RenderIcon = (file: UploadSettledFileInfo) => VNodeChild;
interface UploadInjection {
  mergedClsPrefixRef: Ref<string>;
  mergedThemeRef: Ref<MergedTheme<UploadTheme>>;
  showCancelButtonRef: Ref<boolean>;
  showRemoveButtonRef: Ref<boolean>;
  showDownloadButtonRef: Ref<boolean>;
  showRetryButtonRef: Ref<boolean>;
  showTriggerRef: Ref<boolean>;
  mergedFileListRef: Ref<UploadSettledFileInfo[]>;
  onRemoveRef: Ref<UploadOnRemove | undefined>;
  onDownloadRef: Ref<UploadOnDownload | undefined>;
  customDownloadRef: Ref<UploadOnDownload | undefined>;
  xhrMap: Map<string, XMLHttpRequest>;
  showPreviewButtonRef: Ref<boolean>;
  alwaysShowActionsRef: Ref<boolean>;
  onPreviewRef: Ref<OnPreview | undefined>;
  listTypeRef: Ref<ListType>;
  dragOverRef: Ref<boolean>;
  draggerInsideRef: {
    value: boolean;
  };
  fileListClassRef: Ref<string | undefined>;
  fileListStyleRef: Ref<string | CSSProperties | undefined>;
  mergedDisabledRef: Ref<boolean>;
  maxReachedRef: Ref<boolean>;
  abstractRef: Ref<boolean>;
  imageGroupPropsRef: Ref<ImageGroupProps | undefined>;
  cssVarsRef: undefined | Ref<CSSProperties>;
  themeClassRef: undefined | Ref<string>;
  mergedDirectoryDndRef: Ref<boolean>;
  acceptRef: Ref<string | undefined>;
  triggerClassRef: Ref<string | undefined>;
  triggerStyleRef: Ref<CSSProperties | string | undefined>;
  doChange: DoChange;
  onRender: undefined | (() => void);
  submit: (options?: {
    fileId?: string;
    retry?: boolean;
  }) => void;
  onRetryRef: Ref<undefined | OnRetry>;
  shouldUseThumbnailUrlRef: Ref<ShouldUseThumbnailUrl>;
  getFileThumbnailUrlResolver: (file: UploadSettledFileInfo) => Promise<string> | string;
  renderIconRef: Ref<RenderIcon | undefined>;
  handleFileAddition: (files: FileAndEntry[] | null, e?: Event) => void;
  openOpenFileDialog: () => void;
}
declare const uploadInjectionKey: import("vue").InjectionKey<UploadInjection>;
interface XhrHandlers {
  handleXHRLoad: (e: ProgressEvent) => void;
  handleXHRAbort: (e: ProgressEvent) => void;
  handleXHRProgress: (e: ProgressEvent) => void;
  handleXHRError: (e: ProgressEvent) => void;
}
type OnBeforeUpload = (data: {
  file: UploadSettledFileInfo;
  fileList: UploadSettledFileInfo[];
}) => Promise<boolean | void> | boolean | void;
type ListType = 'text' | 'image' | 'image-card';
type OnPreview = (file: UploadSettledFileInfo, detail: {
  event: MouseEvent;
}) => void;
type CreateThumbnailUrl = (file: File | null, fileInfo: UploadSettledFileInfo) => Promise<string> | string | undefined;
type CustomRequest = (options: UploadCustomRequestOptions) => void;
type OnError = ({ file, event }: {
  file: UploadSettledFileInfo;
  event?: ProgressEvent;
}) => UploadFileInfo | undefined | void;
type OnRetry = ({ file }: {
  file: UploadSettledFileInfo;
}) => Promise<boolean | void> | boolean | void;
interface FileAndEntry {
  file: File;
  entry: FileSystemFileEntry | null;
  source: 'dnd' | 'input';
}
interface UploadTriggerDefaultSlotOptions {
  handleClick: () => void;
  handleDragOver: (e: DragEvent) => void;
  handleDragEnter: (e: DragEvent) => void;
  handleDragLeave: (e: DragEvent) => void;
  handleDrop: (e: DragEvent) => void;
}
//#endregion
export { CreateThumbnailUrl, CustomRequest, DoChange, FileAndEntry, FuncOrRecordOrUndef, ListType, OnBeforeUpload, OnError, OnPreview, OnRetry, OnUpdateFileList, RenderIcon, ShouldUseThumbnailUrl, UploadInjection, UploadInternalInst, UploadTriggerDefaultSlotOptions, XhrHandlers, uploadInjectionKey };