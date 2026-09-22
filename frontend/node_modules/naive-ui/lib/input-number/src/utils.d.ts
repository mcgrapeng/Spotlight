//#region src/input-number/src/utils.d.ts
declare function parse(value: string): number | null;
declare function isWipValue(value: string): boolean;
declare function validator(value: number | null): boolean;
declare function format(value: number | undefined | null, precision: number | undefined): string;
declare function parseNumber(number: number | null | undefined | string): number | null;
//#endregion
export { format, isWipValue, parse, parseNumber, validator };