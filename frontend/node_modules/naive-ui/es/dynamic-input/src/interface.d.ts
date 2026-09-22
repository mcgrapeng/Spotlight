import { DynamicInputTheme } from "../styles/light.js";
import "../styles/index.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { Ref } from "vue";
//#region src/dynamic-input/src/interface.d.ts
interface DynamicInputInjection {
  mergedThemeRef: Ref<MergedTheme<DynamicInputTheme>>;
  keyPlaceholderRef: Ref<string | undefined>;
  valuePlaceholderRef: Ref<string | undefined>;
  placeholderRef: Ref<string | undefined>;
}
declare const dynamicInputInjectionKey: import("vue").InjectionKey<DynamicInputInjection>;
type OnUpdateValue = <T>(value: T[]) => void;
interface DynamicInputDefaultSlotProps {
  value: any;
  index: number;
}
interface DynamicInputActionSlotProps {
  value: any;
  index: number;
  create: (index: number) => void;
  remove: (index: number) => void;
  move: (type: 'up' | 'down', index: number) => void;
}
//#endregion
export { DynamicInputActionSlotProps, DynamicInputDefaultSlotProps, DynamicInputInjection, OnUpdateValue, dynamicInputInjectionKey };