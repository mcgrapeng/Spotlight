import { FuncOrRecordOrUndef } from "./interface.js";
import { UploadProps } from "./Upload.js";
//#region src/upload/src/public-types.d.ts
interface UploadInst {
  openOpenFileDialog: () => void;
  submit: (options?: {
    fileId?: string;
    retry?: boolean;
  }) => void;
  clear: () => void;
}
interface UploadFileInfo {
  id: string;
  name: string;
  batchId?: string | null;
  percentage?: number | null;
  status: 'pending' | 'uploading' | 'finished' | 'removed' | 'error';
  url?: string | null;
  file?: File | null;
  thumbnailUrl?: string | null;
  type?: string | null;
  fullPath?: string | null;
}
interface UploadCustomRequestOptions {
  file: UploadSettledFileInfo;
  action?: string;
  withCredentials?: boolean;
  data?: FuncOrRecordOrUndef<string | Blob>;
  headers?: FuncOrRecordOrUndef;
  onProgress: (e: {
    percent: number;
  }) => void;
  onFinish: () => void;
  onError: () => void;
}
type UploadSettledFileInfo = Required<UploadFileInfo>;
type UploadOnChange = (data: {
  file: UploadSettledFileInfo;
  fileList: UploadSettledFileInfo[];
  event: ProgressEvent | Event | undefined;
}) => void;
type UploadOnFinish = ({ file, event }: {
  file: UploadSettledFileInfo;
  event?: ProgressEvent;
}) => UploadFileInfo | undefined | void;
type UploadOnRemove = (data: {
  file: UploadSettledFileInfo;
  fileList: UploadSettledFileInfo[];
  index: number;
}) => Promise<boolean> | boolean | any;
type UploadOnDownload = (file: UploadSettledFileInfo) => Promise<boolean> | boolean | any;
//#endregion
export { UploadCustomRequestOptions, UploadFileInfo, UploadInst, UploadOnChange, UploadOnDownload, UploadOnFinish, UploadOnRemove, type UploadProps, UploadSettledFileInfo };