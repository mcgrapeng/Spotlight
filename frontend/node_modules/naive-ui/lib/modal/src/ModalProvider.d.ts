import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { Mutable } from "../../_utils/naive/mutable.js";
import "../../_utils/index.js";
import { modalProps } from "./Modal.js";
import { CSSProperties, DefineComponent, ExtractPropTypes, PropType, Ref, VNodeChild } from "vue";
//#region src/modal/src/ModalProvider.d.ts
type ModalOptions = Mutable<Omit<Partial<ExtractPropTypes<typeof modalProps>>, 'internalStyle'> & {
  class?: any;
  style?: string | CSSProperties;
  render?: () => VNodeChild;
}>;
type ModalReactive = {
  readonly key: string;
  readonly destroy: () => void;
} & ModalOptions;
interface ModalApiInjection {
  destroyAll: () => void;
  create: (options: ModalOptions) => ModalReactive;
}
interface ModalProviderInjection {
  clickedRef: Ref<boolean>;
  clickedPositionRef: Ref<{
    x: number;
    y: number;
  } | null>;
}
type ModalReactiveListInjection = Ref<ModalReactive[]>;
type ModalProviderInst = ModalApiInjection;
declare const modalProviderProps: {
  to: PropType<string | HTMLElement>;
};
type ModalProviderProps = ExtractPublicPropTypes<typeof modalProviderProps>;
declare const NModalProvider: DefineComponent<{
  to?: string | HTMLElement;
}>;
//#endregion
export { ModalApiInjection, ModalOptions, ModalProviderInjection, ModalProviderInst, ModalProviderProps, ModalReactive, ModalReactiveListInjection, NModalProvider, modalProviderProps };