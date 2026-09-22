import { DataTableScrollTo } from "./interface.js";
//#region src/data-table/src/MainTable.d.ts
declare const _default: import("vue").DefineComponent<{}, {
  getHeaderElement: () => HTMLElement | null;
  getBodyElement: () => HTMLElement | null;
  scrollTo: DataTableScrollTo;
  maxHeight: import("vue").Ref<string | number | undefined, string | number | undefined>;
  mergedClsPrefix: import("vue").Ref<string, string>;
  selfElRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
  headerInstRef: unknown;
  bodyInstRef: unknown;
  bodyStyle: import("vue").ComputedRef<{
    maxHeight: string | undefined;
    minHeight: string | undefined;
  }>;
  flexHeight: import("vue").Ref<boolean, boolean>;
  handleBodyResize: (entry: ResizeObserverEntry) => void;
  scrollX: import("vue").Ref<string | number | undefined, string | number | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };