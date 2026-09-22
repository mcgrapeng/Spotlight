import { VNode } from "vue";
//#region src/carousel/src/utils/duplicatedLogic.d.ts
declare function addDuplicateSlides(slides: VNode[]): VNode[];
declare function getDisplayIndex(current: number, length: number, duplicatedable: boolean): number;
declare function getRealIndex(current: number, duplicatedable?: boolean): number;
declare function getPrevIndex(current: number, length: number, duplicatedable?: boolean): number | null;
declare function getNextIndex(current: number, length: number, duplicatedable?: boolean): number | null;
declare function getDisplayTotalView(total: number, duplicatedable?: boolean): number;
//#endregion
export { addDuplicateSlides, getDisplayIndex, getDisplayTotalView, getNextIndex, getPrevIndex, getRealIndex };