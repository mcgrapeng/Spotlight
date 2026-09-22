import { Size } from "../interface.js";
import { addDuplicateSlides, getDisplayIndex, getDisplayTotalView, getNextIndex, getPrevIndex, getRealIndex } from "./duplicatedLogic.js";
import { isTouchEvent } from "./event.js";
//#region src/carousel/src/utils/index.d.ts
declare function calculateSize(element: HTMLElement, innerOnly?: boolean): Size;
declare function clampValue(value: number, min: number, max: number): number;
declare function resolveSpeed(value?: string | number): number;
//#endregion
export { addDuplicateSlides, calculateSize, clampValue, getDisplayIndex, getDisplayTotalView, getNextIndex, getPrevIndex, getRealIndex, isTouchEvent, resolveSpeed };