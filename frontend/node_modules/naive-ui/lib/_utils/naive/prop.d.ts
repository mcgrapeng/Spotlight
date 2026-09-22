//#region src/_utils/naive/prop.d.ts
declare const smallerSizeMap: {
  readonly tiny: "mini";
  readonly small: "tiny";
  readonly medium: "small";
  readonly large: "medium";
  readonly huge: "large";
};
declare const largerSizeMap: {
  readonly tiny: "small";
  readonly small: "medium";
  readonly medium: "large";
  readonly large: "huge";
};
type SmallerSizeMap = typeof smallerSizeMap;
type SmallerSize = keyof SmallerSizeMap;
type LargerSizeMap = typeof largerSizeMap;
type LargerSize = keyof LargerSizeMap;
declare function largerSize<T extends LargerSize>(size: T): LargerSizeMap[T];
declare function smallerSize<T extends SmallerSize>(size: T): SmallerSizeMap[T];
//#endregion
export { largerSize, smallerSize };