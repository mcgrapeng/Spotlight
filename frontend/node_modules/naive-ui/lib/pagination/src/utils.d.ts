import { PaginationProps } from "./Pagination.js";
//#region src/pagination/src/utils.d.ts
declare function getDefaultPageSize(paginationProps: PaginationProps | false): number;
declare function createPageItemsInfo(currentPage: number, pageCount: number, pageSlot: number, showQuickJumpDropdown: boolean): {
  hasFastBackward: boolean;
  hasFastForward: boolean;
  fastBackwardTo: number;
  fastForwardTo: number;
  items: PageItem[];
};
type PageItem = {
  type: 'fast-backward' | 'fast-forward';
  label: undefined;
  active: false;
  options: Array<{
    label: string;
    value: number;
  }> | null;
} | {
  type: 'page';
  label: number;
  active: boolean;
  mayBeFastForward: boolean;
  mayBeFastBackward: boolean;
};
//#endregion
export { PageItem, createPageItemsInfo, getDefaultPageSize };