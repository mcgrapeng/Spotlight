import { TransferTheme } from "../styles/light.js";
import "../styles/index.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { Ref, VNodeChild } from "vue";
//#region src/transfer/src/interface.d.ts
type OptionValue = string | number;
interface Option {
  label: string;
  value: OptionValue;
  disabled?: boolean;
}
type Filter = (pattern: string, option: Option, from: 'source' | 'target') => boolean;
interface RenderLabelProps {
  option: Option;
}
type TransferRenderTargetLabel = (props: RenderLabelProps) => VNodeChild;
type TransferRenderSourceLabel = (props: RenderLabelProps) => VNodeChild;
interface RenderListProps {
  onCheck: (checkedValueList: OptionValue[]) => void;
  checkedOptions: Option[];
  pattern: string;
}
type TransferRenderSourceList = (props: RenderListProps) => VNodeChild;
interface TransferInjection {
  targetValueSetRef: Ref<Set<OptionValue>>;
  mergedClsPrefixRef: Ref<string>;
  disabledRef: Ref<boolean>;
  mergedThemeRef: Ref<MergedTheme<TransferTheme>>;
  targetOptionsRef: Ref<Option[]>;
  canNotSelectAnythingRef: Ref<boolean>;
  canBeClearedRef: Ref<boolean>;
  allCheckedRef: Ref<boolean>;
  srcOptionsLengthRef: Ref<number>;
  handleItemCheck: (checked: boolean, value: OptionValue) => void;
  renderSourceLabelRef: Ref<TransferRenderSourceLabel | undefined>;
  renderTargetLabelRef: Ref<TransferRenderTargetLabel | undefined>;
  showSelectedRef: Ref<boolean>;
}
declare const transferInjectionKey: import("vue").InjectionKey<TransferInjection>;
type OnUpdateValue = (value: OptionValue[]) => void;
//#endregion
export { Filter, OnUpdateValue, Option, OptionValue, RenderLabelProps, RenderListProps, TransferInjection, TransferRenderSourceLabel, TransferRenderSourceList, TransferRenderTargetLabel, transferInjectionKey };