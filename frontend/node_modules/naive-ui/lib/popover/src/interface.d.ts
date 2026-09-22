import { CSSProperties, Ref, VNode } from "vue";
//#region src/popover/src/interface.d.ts
type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual';
interface PopoverInst {
  syncPosition: () => void;
  setShow: (value: boolean) => void;
}
type InternalPopoverInst = PopoverInst & {
  getMergedShow: () => boolean;
};
type PopoverBodyInjection = Ref<HTMLElement | null> | null;
declare const popoverBodyInjectionKey: import("vue").InjectionKey<PopoverBodyInjection>;
type InternalRenderBody = (className: any, ref: Ref<HTMLElement | null>, style: CSSProperties[], onMouseenter: (e: MouseEvent) => void, onMouseleave: (e: MouseEvent) => void) => VNode;
//#endregion
export { InternalPopoverInst, InternalRenderBody, PopoverBodyInjection, PopoverInst, PopoverTrigger, popoverBodyInjectionKey };