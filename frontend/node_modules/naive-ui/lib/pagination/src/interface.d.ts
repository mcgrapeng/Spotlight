import { SelectBaseOption } from "../../select/src/interface.js";
import { VNodeChild } from "vue";
//#region src/pagination/src/interface.d.ts
type PaginationInfo = Parameters<RenderPrefix>[0];
type RenderPrefix = (info: {
  startIndex: number;
  endIndex: number;
  page: number;
  pageSize: number;
  pageCount: number;
  itemCount: number | undefined;
}) => VNodeChild;
type PaginationSizeOption = SelectBaseOption<number, string>;
type RenderSuffix = RenderPrefix;
type RenderNext = RenderPrefix;
type RenderPrev = RenderPrefix;
type RenderGoto = () => VNodeChild;
type PaginationRenderLabel = (info: {
  type: 'fast-backward' | 'fast-forward';
  node: VNodeChild;
  active: boolean;
} | {
  type: 'page';
  node: number;
  active: boolean;
}) => VNodeChild;
type PaginationLabelInfo = Parameters<PaginationRenderLabel>[0];
//#endregion
export { PaginationInfo, PaginationLabelInfo, PaginationRenderLabel, PaginationSizeOption, RenderGoto, RenderNext, RenderPrefix, RenderPrev, RenderSuffix };