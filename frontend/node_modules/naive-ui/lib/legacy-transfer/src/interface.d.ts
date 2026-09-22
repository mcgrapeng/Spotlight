import { TransferTheme } from "../styles/light.js";
import "../styles/index.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { Ref } from "vue";
//#region src/legacy-transfer/src/interface.d.ts
type OptionValue = string | number;
interface Option {
  label: string;
  value: OptionValue;
  disabled?: boolean;
}
interface CheckedStatus {
  checked: boolean;
  indeterminate: boolean;
  disabled?: boolean;
}
type Filter = (pattern: string, option: Option, from: 'source' | 'target') => boolean;
interface TransferInjection {
  mergedClsPrefixRef: Ref<string>;
  mergedSizeRef: Ref<'small' | 'medium' | 'large'>;
  disabledRef: Ref<boolean>;
  mergedThemeRef: Ref<MergedTheme<TransferTheme>>;
  srcCheckedValuesRef: Ref<OptionValue[]>;
  tgtCheckedValuesRef: Ref<OptionValue[]>;
  srcOptsRef: Ref<Option[]>;
  tgtOptsRef: Ref<Option[]>;
  srcCheckedStatusRef: Ref<CheckedStatus>;
  tgtCheckedStatusRef: Ref<CheckedStatus>;
  handleSrcCheckboxClick: (checked: boolean, value: OptionValue) => void;
  handleTgtCheckboxClick: (checked: boolean, value: OptionValue) => void;
}
declare const transferInjectionKey: import("vue").InjectionKey<TransferInjection>;
type OnUpdateValue = (value: OptionValue[]) => void;
//#endregion
export { CheckedStatus, Filter, OnUpdateValue, Option, OptionValue, TransferInjection, transferInjectionKey };