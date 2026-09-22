import { ColorPickerTheme } from "../styles/light.js";
import "../styles/index.js";
import { RenderLabel } from "./interface.js";
import { ColorPickerSlots } from "./ColorPicker.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ComputedRef, Ref } from "vue";
//#region src/color-picker/src/context.d.ts
declare const colorPickerInjectionKey: import("vue").InjectionKey<{
  themeRef: ComputedRef<MergedTheme<ColorPickerTheme>>;
  colorPickerSlots: ColorPickerSlots;
  renderLabelRef: Ref<RenderLabel | undefined>;
}>;
//#endregion
export { colorPickerInjectionKey };