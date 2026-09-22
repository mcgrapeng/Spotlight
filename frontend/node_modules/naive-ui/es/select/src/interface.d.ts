import { CSSProperties, VNode, VNodeChild } from "vue";
import { TreeMate } from "treemate";
//#region src/select/src/interface.d.ts
type SelectMixedOption = SelectBaseOption | SelectGroupOption | SelectIgnoredOption;
interface SelectBaseOption<V = string | number, L = string | ((option: SelectBaseOption<V>, selected: boolean) => VNodeChild)> {
  value?: V;
  label?: L;
  class?: string;
  style?: string | CSSProperties;
  disabled?: boolean;
  render?: (info: {
    node: VNode;
    option: SelectBaseOption<V>;
    selected: boolean;
  }) => VNodeChild;
  [k: string]: unknown;
}
interface SelectGroupOptionBase {
  label?: string | ((option: SelectGroupOption) => VNodeChild);
  type: 'group';
  children?: SelectBaseOption[];
  render?: (info: {
    node: VNode;
    option: SelectGroupOption;
  }) => VNodeChild;
  [k: string]: unknown;
}
interface SelectIgnoredOption {
  type: 'ignored';
  value: string | number;
  [k: string]: unknown;
}
type ValueAtom = string | number;
type Value = ValueAtom | string[] | number[] | ValueAtom[];
type OnUpdateValue = (value: string & number & ValueAtom & string[] & number[] & ValueAtom[] & (ValueAtom | null) & (string[] | null) & (number[] | null) & (ValueAtom[] | null), option: SelectBaseOption & null & SelectBaseOption[]) => void;
type OnUpdateValueImpl = (value: ValueAtom | string[] | number[] | ValueAtom[] | (ValueAtom | null) | (string[] | null) | (number[] | null) | (ValueAtom[] | null), option: SelectBaseOption | null | SelectBaseOption[]) => void;
type SelectTreeMate = TreeMate<SelectBaseOption, SelectGroupOption, SelectIgnoredOption>;
type SelectOption = SelectBaseOption<string | number>;
type SelectGroupOption = (SelectGroupOptionBase & {
  /** @deprecated should use key and label instead */
  name?: string;
}) | (SelectGroupOptionBase & {
  key: string | number;
});
interface SelectInst {
  focus: () => void;
  blur: () => void;
  focusInput: () => void;
  blurInput: () => void;
}
type SelectFallbackOption = (value: string & number) => SelectOption;
type SelectFallbackOptionImpl = (value: string | number) => SelectOption;
type SelectFilter = (pattern: string, option: SelectOption) => boolean;
//#endregion
export { OnUpdateValue, OnUpdateValueImpl, SelectBaseOption, SelectFallbackOption, SelectFallbackOptionImpl, SelectFilter, SelectGroupOption, SelectGroupOptionBase, SelectIgnoredOption, SelectInst, SelectMixedOption, SelectOption, SelectTreeMate, Value, ValueAtom };