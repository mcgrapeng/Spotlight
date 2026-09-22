//#region src/highlight/src/utils.d.ts
declare function splitAndMarkByRegex(str: string, regex: RegExp): Array<{
  text: string;
  isMatch: boolean;
}>;
//#endregion
export { splitAndMarkByRegex };