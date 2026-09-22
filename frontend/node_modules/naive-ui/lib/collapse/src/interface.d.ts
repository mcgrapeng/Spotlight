//#region src/collapse/src/interface.d.ts
type OnUpdateExpandedNames = <T extends string[] & number[] & Array<string | number> & (string | number | null) & (string | null) & (number | null)>(value: T) => void;
type OnUpdateExpandedNamesImpl = <T extends string[] | number[] | Array<string | number> | (string | number | null) | (string | null) | (number | null)>(value: T) => void;
type OnItemHeaderClick = <T extends string & number & (string | number)>(info: HeaderClickInfo<T>) => void;
type OnItemHeaderClickImpl = <T extends string | number | (string | number)>(info: HeaderClickInfo<T>) => void;
interface HeaderClickInfo<T> {
  name: T;
  expanded: boolean;
  event: MouseEvent;
}
interface CollapseArrowSlotProps {
  collapsed: boolean;
}
interface CollapseItemHeaderSlotProps {
  collapsed: boolean;
}
interface CollapseItemHeaderExtraSlotProps {
  collapsed: boolean;
}
interface CollapseItemArrowSlotProps {
  collapsed: boolean;
}
//#endregion
export { CollapseArrowSlotProps, CollapseItemArrowSlotProps, CollapseItemHeaderExtraSlotProps, CollapseItemHeaderSlotProps, HeaderClickInfo, OnItemHeaderClick, OnItemHeaderClickImpl, OnUpdateExpandedNames, OnUpdateExpandedNamesImpl };