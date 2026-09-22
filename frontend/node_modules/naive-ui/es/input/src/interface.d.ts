import { Ref } from "vue";
//#region src/input/src/interface.d.ts
type OnUpdateValue = (value: string & [string, string], meta: {
  source: 0 | 1 | 'clear';
}) => void;
type OnUpdateValueImpl = (value: string | [string, string], meta: {
  source: 0 | 1 | 'clear';
}) => void;
interface InputWrappedRef {
  wrapperElRef: Ref<HTMLElement | null>;
  textareaElRef: Ref<HTMLTextAreaElement | null>;
  inputElRef: Ref<HTMLInputElement | null>;
  isCompositing: Ref<boolean>;
  blur: () => void;
  clear: () => void;
  focus: () => void;
  select: () => void;
  activate: () => void;
  deactivate: () => void;
  scrollTo: (options: ScrollToOptions) => void;
}
declare const inputInjectionKey: import("vue").InjectionKey<{
  countGraphemesRef: Ref<((input: string) => number) | undefined>;
  mergedValueRef: Ref<string | [string, string] | null>;
  maxlengthRef: Ref<number | undefined>;
  mergedClsPrefixRef: Ref<string>;
}>;
//#endregion
export { InputWrappedRef, OnUpdateValue, OnUpdateValueImpl, inputInjectionKey };