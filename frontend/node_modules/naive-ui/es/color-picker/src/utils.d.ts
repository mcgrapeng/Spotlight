import { HSLA, RGB } from "seemly";
//#region src/color-picker/src/utils.d.ts
type ColorPickerMode = 'rgb' | 'hsl' | 'hsv' | 'hex';
type ActionType = 'confirm' | 'clear';
declare function deriveDefaultValue(modes: ColorPickerMode[], showAlpha: boolean): string;
declare function getModeFromValue(color: string | null): ColorPickerMode | null;
declare function getWCAGContrast(hsla: HSLA, contrastColor?: RGB, level?: 'AA' | 'AAA'): boolean;
declare function floor(color: number[]): number[];
declare function normalizeHue(hue: number): number;
declare function normalizeAlpha(alpha: number): number;
/**
 * Convert color value by mode
 */
declare function convertColor(value: string, mode: ColorPickerMode, originalMode: ColorPickerMode): string;
declare function convertColor(value: string, mode: ColorPickerMode, originalMode?: null): string | null;
//#endregion
export { ActionType, ColorPickerMode, convertColor, deriveDefaultValue, floor, getModeFromValue, getWCAGContrast, normalizeAlpha, normalizeHue };