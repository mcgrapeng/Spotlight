//#region src/_utils/event/index.d.ts
declare function markEventEffectPerformed(event: Event): void;
declare function eventEffectNotPerformed(event: Event): boolean;
//#endregion
export { eventEffectNotPerformed, markEventEffectPerformed };