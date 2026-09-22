import { ExtractPropTypes, PropType, VNodeChild } from "vue";
import { Key } from "treemate";
//#region src/menu/src/use-menu-child-props.d.ts
declare const useMenuChildProps: {
  readonly internalKey: {
    readonly type: PropType<Key>;
    readonly required: true;
  };
  readonly root: BooleanConstructor;
  readonly isGroup: BooleanConstructor;
  readonly level: {
    readonly type: NumberConstructor;
    readonly required: true;
  };
  readonly title: PropType<string | (() => VNodeChild)>;
  readonly extra: PropType<string | (() => VNodeChild)>;
};
type UseMenuChildProps = ExtractPropTypes<typeof useMenuChildProps>;
//#endregion
export { UseMenuChildProps, useMenuChildProps };