import { isBrowser } from "../../_utils/env/is-browser.mjs";
import { error } from "../../_utils/naive/warn.mjs";
//#region src/upload/src/utils.ts
function isImageFileType(type) {
  return type.includes("image/");
}
function getExtname(url = "") {
  const temp = url.split("/");
  const filenameWithoutSuffix = temp[temp.length - 1].split(/#|\?/)[0];
  return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [""])[0];
}
const imageExtensionRegex = /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i;
const isImageFile = file => {
  if (file.type) return isImageFileType(file.type);
  const fileNameExtension = getExtname(file.name || "");
  if (imageExtensionRegex.test(fileNameExtension)) return true;
  const url = file.thumbnailUrl || file.url || "";
  const urlExtension = getExtname(url);
  if (/^data:image\//.test(url) || imageExtensionRegex.test(urlExtension)) return true;
  return false;
};
async function createImageDataUrl(file) {
  return await new Promise(resolve => {
    if (!file.type || !isImageFileType(file.type)) {
      resolve("");
      return;
    }
    resolve(window.URL.createObjectURL(file));
  });
}
const environmentSupportFile = isBrowser && window.FileReader && window.File;
function isFileSystemDirectoryEntry(item) {
  return item.isDirectory;
}
function isFileSystemFileEntry(item) {
  return item.isFile;
}
async function getFilesFromEntries(entries, directory) {
  const fileAndEntries = [];
  async function _getFilesFromEntries(entries) {
    for (const entry of entries) {
      if (!entry) continue;
      if (directory && isFileSystemDirectoryEntry(entry)) {
        const directoryReader = entry.createReader();
        let allEntries = [];
        let readEntries;
        try {
          do {
            readEntries = await new Promise((resolve, reject) => {
              directoryReader.readEntries(resolve, reject);
            });
            allEntries = allEntries.concat(readEntries);
          } while (readEntries.length > 0);
        } catch (e) {
          error("upload", "error happens when handling directory upload", e);
        }
        await _getFilesFromEntries(allEntries);
      } else if (isFileSystemFileEntry(entry)) try {
        const file = await new Promise((resolve, reject) => {
          entry.file(resolve, reject);
        });
        fileAndEntries.push({
          file,
          entry,
          source: "dnd"
        });
      } catch (e) {
        error("upload", "error happens when handling file upload", e);
      }
    }
  }
  await _getFilesFromEntries(entries);
  return fileAndEntries;
}
function createSettledFileInfo(fileInfo) {
  const {
    id,
    name,
    percentage,
    status,
    url,
    file,
    thumbnailUrl,
    type,
    fullPath,
    batchId
  } = fileInfo;
  return {
    id,
    name,
    percentage: percentage ?? null,
    status,
    url: url ?? null,
    file: file ?? null,
    thumbnailUrl: thumbnailUrl ?? null,
    type: type ?? null,
    fullPath: fullPath ?? null,
    batchId: batchId ?? null
  };
}
/**
* This is a rather simple version. I may fix it later to make it more accurate.
* I've looked at https://github.com/broofa/mime, however it doesn't has a esm
* version, so I can't simply use it.
*/
function matchType(name, mimeType, accept) {
  name = name.toLowerCase();
  mimeType = mimeType.toLocaleLowerCase();
  accept = accept.toLocaleLowerCase();
  return accept.split(",").map(acceptAtom => acceptAtom.trim()).filter(Boolean).some(acceptAtom => {
    if (acceptAtom.startsWith(".")) {
      if (name.endsWith(acceptAtom)) return true;
    } else if (acceptAtom.includes("/")) {
      const [type, subtype] = mimeType.split("/");
      const [acceptType, acceptSubtype] = acceptAtom.split("/");
      if (acceptType === "*" || type && acceptType && acceptType === type) {
        if (acceptSubtype === "*" || subtype && acceptSubtype && acceptSubtype === subtype) return true;
      }
    } else return true;
    return false;
  });
}
//#endregion
export { createImageDataUrl, createSettledFileInfo, environmentSupportFile, getFilesFromEntries, isFileSystemDirectoryEntry, isFileSystemFileEntry, isImageFile, isImageFileType, matchType };