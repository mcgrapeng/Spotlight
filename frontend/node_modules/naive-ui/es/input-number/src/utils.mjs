//#region src/input-number/src/utils.ts
function parse(value) {
  if (value === void 0 || value === null || typeof value === "string" && value.trim() === "") return null;
  return Number(value);
}
function isWipValue(value) {
  return value.includes(".") && (/^(-)?\d+.*(\.|0)$/.test(value) || /^-?\d*$/.test(value)) || value === "-" || value === "-0";
}
function validator(value) {
  if (value === void 0 || value === null) return true;
  if (Number.isNaN(value)) return false;
  return true;
}
function format(value, precision) {
  if (typeof value !== "number") return "";
  return precision === void 0 ? String(value) : value.toFixed(precision);
}
function parseNumber(number) {
  if (number === null) return null;
  if (typeof number === "number") return number;else {
    const parsedNumber = Number(number);
    if (Number.isNaN(parsedNumber)) return null;else return parsedNumber;
  }
}
//#endregion
export { format, isWipValue, parse, parseNumber, validator };