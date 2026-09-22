import { HeatmapThemeVars } from "../styles/light.js";
import { MergedTheme, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import "../styles/index.js";
import { ComputedRef, Ref } from "vue";
//#region src/heatmap/src/animationStyle.d.ts
declare function useLoadingStyleClass(props: {
  loading?: boolean;
}, themeRef: ComputedRef<MergedTheme<Theme<'Heatmap', HeatmapThemeVars, any>>>): Ref<string>;
//#endregion
export { useLoadingStyleClass };