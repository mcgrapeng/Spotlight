import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
//#region src/time-picker/src/utils.d.ts
declare const time: {
  amHours: string[];
  pmHours: string[];
  hours: string[];
  minutes: string[];
  seconds: string[];
  period: string[];
};
declare function getFixValue(value: number): string;
declare function getTimeUnits(defaultValue: string[], stepOrList: MaybeArray<number> | undefined, isHourWithAmPm?: 'am' | 'pm'): string[];
declare function isTimeInStep(value: number, type: 'hours' | 'minutes' | 'seconds', stepOrList: MaybeArray<number> | undefined): boolean;
declare function findSimilarTime(value: number, type: 'hours' | 'minutes' | 'seconds', stepOrList: MaybeArray<number> | undefined): number;
declare function getAmPm(value: number): 'am' | 'pm';
//#endregion
export { findSimilarTime, getAmPm, getFixValue, getTimeUnits, isTimeInStep, time };