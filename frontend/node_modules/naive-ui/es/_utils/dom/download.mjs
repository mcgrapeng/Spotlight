//#region src/_utils/dom/download.ts
function download(url, name) {
  if (!url) return;
  const a = document.createElement("a");
  a.href = url;
  if (name !== void 0) a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function publicDownload(url, name) {
  download(url, name);
}
//#endregion
export { download, publicDownload };