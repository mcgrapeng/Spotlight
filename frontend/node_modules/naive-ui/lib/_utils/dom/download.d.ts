//#region src/_utils/dom/download.d.ts
declare function download(url: string | null, name: string | undefined): void;
declare function publicDownload(url: string, name: string | undefined): void;
//#endregion
export { download, publicDownload };