//#region src/rate/src/interface.d.ts
type RateOnUpdateValue = (value: number & null) => void;
type RateOnUpdateValueImpl = (value: number | null) => void;
//#endregion
export { RateOnUpdateValue, RateOnUpdateValueImpl };