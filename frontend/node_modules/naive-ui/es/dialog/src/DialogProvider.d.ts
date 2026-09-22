import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { Mutable } from "../../_utils/naive/mutable.js";
import "../../_utils/index.js";
import { exposedDialogEnvProps } from "./DialogEnvironment.js";
import { CSSProperties, ExtractPropTypes, PropType, Ref } from "vue";
//#region src/dialog/src/DialogProvider.d.ts
type ExposedDialogEnvPropTypes = ExtractPropTypes<typeof exposedDialogEnvProps>;
interface DialogOptions extends Mutable<Omit<Partial<ExposedDialogEnvPropTypes>, 'internalStyle'> & {
  class?: any;
  style?: string | CSSProperties;
}> {}
interface DialogReactive extends DialogOptions {
  readonly key: string;
  readonly destroy: () => void;
}
interface TypeSafeDialogReactive extends DialogReactive {
  class?: any;
  style?: any;
}
interface DialogApiInjection {
  destroyAll: () => void;
  create: (options: DialogOptions) => DialogReactive;
  success: (options: DialogOptions) => DialogReactive;
  warning: (options: DialogOptions) => DialogReactive;
  error: (options: DialogOptions) => DialogReactive;
  info: (options: DialogOptions) => DialogReactive;
}
interface DialogProviderInjection {
  clickedRef: Ref<boolean>;
  clickedPositionRef: Ref<{
    x: number;
    y: number;
  } | null>;
}
type DialogReactiveListInjection = Ref<DialogReactive[]>;
interface DialogInst {
  hide: () => void;
}
type DialogProviderInst = DialogApiInjection;
declare const dialogProviderProps: {
  injectionKey: StringConstructor;
  to: PropType<string | HTMLElement>;
};
type DialogProviderProps = ExtractPublicPropTypes<typeof dialogProviderProps>;
interface DialogProviderSetup extends DialogApiInjection {
  dialogList: Ref<TypeSafeDialogReactive[]>;
  dialogInstRefs: Record<string, DialogInst | undefined>;
  handleAfterLeave: (key: string) => void;
}
declare const NDialogProvider: import("vue").DefineComponent<ExtractPropTypes<{
  injectionKey: StringConstructor;
  to: PropType<string | HTMLElement>;
}>, DialogProviderSetup, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  injectionKey: StringConstructor;
  to: PropType<string | HTMLElement>;
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { DialogApiInjection, DialogOptions, DialogProviderInjection, DialogProviderInst, DialogProviderProps, DialogReactive, DialogReactiveListInjection, NDialogProvider, dialogProviderProps };