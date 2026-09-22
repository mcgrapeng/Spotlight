import { FileAndEntry, ShouldUseThumbnailUrl } from "./interface.js";
import { UploadFileInfo, UploadSettledFileInfo } from "./public-types.js";
//#region src/upload/src/utils.d.ts
declare function isImageFileType(type: string): boolean;
declare const isImageFile: ShouldUseThumbnailUrl;
declare function createImageDataUrl(file: File): Promise<string>;
declare const environmentSupportFile: false | {
  new (fileBits: BlobPart[], fileName: string, options?: FilePropertyBag): File;
  prototype: File;
};
declare function isFileSystemDirectoryEntry(item: FileSystemEntry | FileSystemFileEntry | FileSystemDirectoryEntry): item is FileSystemDirectoryEntry;
declare function isFileSystemFileEntry(item: FileSystemEntry | FileSystemFileEntry | FileSystemDirectoryEntry): item is FileSystemFileEntry;
declare function getFilesFromEntries(entries: readonly FileSystemEntry[] | Array<FileSystemEntry | null>, directory: boolean): Promise<FileAndEntry[]>;
declare function createSettledFileInfo(fileInfo: UploadFileInfo): UploadSettledFileInfo;
/**
 * This is a rather simple version. I may fix it later to make it more accurate.
 * I've looked at https://github.com/broofa/mime, however it doesn't has a esm
 * version, so I can't simply use it.
 */
declare function matchType(name: string, mimeType: string, accept: string): boolean;
//#endregion
export { createImageDataUrl, createSettledFileInfo, environmentSupportFile, getFilesFromEntries, isFileSystemDirectoryEntry, isFileSystemFileEntry, isImageFile, isImageFileType, matchType };