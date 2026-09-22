import { PropType, Ref } from "vue";
//#region src/layout/src/interface.d.ts
declare const layoutSiderInjectionKey: import("vue").InjectionKey<{
  collapsedRef: Ref<boolean>;
  collapseModeRef: Ref<"transform" | "width">;
}>;
declare const positionProp: {
  readonly type: PropType<"static" | "absolute">;
  readonly default: "static";
};
interface LayoutInst {
  scrollTo: ((options: ScrollToOptions) => void) & ((x: number, y: number) => void);
}
type LayoutSiderInst = LayoutInst;
//#endregion
export { LayoutInst, LayoutSiderInst, layoutSiderInjectionKey, positionProp };