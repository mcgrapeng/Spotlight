import { CSSProperties, Ref } from "vue";
//#region src/tabs/src/interface.d.ts
type TabsType = 'line' | 'card' | 'bar' | 'segment';
type OnUpdateValue = (value: string & number) => void;
type OnUpdateValueImpl = (value: string | number) => void;
type OnClose = (name: string & number) => void;
type OnCloseImpl = (name: string | number) => void;
type OnBeforeLeave = (name: string & number, oldName: string & number & null) => boolean | Promise<boolean>;
type OnBeforeLeaveImpl = (name: string | number, oldName: string | number | null) => boolean | Promise<boolean>;
interface TabsInjection {
  mergedClsPrefixRef: Ref<string>;
  valueRef: Ref<string | number | null>;
  typeRef: Ref<TabsType>;
  closableRef: Ref<boolean>;
  tabStyleRef: Ref<string | CSSProperties | undefined>;
  tabClassRef: Ref<string | undefined>;
  addTabClassRef: Ref<string | undefined>;
  addTabStyleRef: Ref<string | CSSProperties | undefined>;
  paneClassRef: Ref<string | undefined>;
  paneStyleRef: Ref<string | CSSProperties | undefined>;
  tabChangeIdRef: {
    id: number;
  };
  onBeforeLeaveRef: Ref<OnBeforeLeave | undefined>;
  triggerRef: Ref<'click' | 'hover'>;
  activateTab: (panelName: string | number) => void;
  handleClose: (panelName: string | number) => void;
  handleAdd: () => void;
}
type Addable = boolean | {
  disabled?: boolean;
};
declare const tabsInjectionKey: import("vue").InjectionKey<TabsInjection>;
interface TabsInst {
  syncBarPosition: () => void;
  scrollToCurrentTab: () => void;
}
//#endregion
export { Addable, OnBeforeLeave, OnBeforeLeaveImpl, OnClose, OnCloseImpl, OnUpdateValue, OnUpdateValueImpl, TabsInjection, TabsInst, TabsType, tabsInjectionKey };