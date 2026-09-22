import { TmNode } from "./interface.js";
import { PropType } from "vue";
//#region src/menu/src/MenuOptionGroup.d.ts
declare const menuItemGroupProps: {
  readonly tmNode: {
    readonly type: PropType<TmNode>;
    readonly required: true;
  };
  readonly tmNodes: {
    readonly type: PropType<TmNode[]>;
    readonly required: true;
  };
  readonly internalKey: {
    readonly type: PropType<import("treemate").Key>;
    readonly required: true;
  };
  readonly root: BooleanConstructor;
  readonly isGroup: BooleanConstructor;
  readonly level: {
    readonly type: NumberConstructor;
    readonly required: true;
  };
  readonly title: PropType<string | (() => import("vue").VNodeChild)>;
  readonly extra: PropType<string | (() => import("vue").VNodeChild)>;
};
declare const menuItemGroupPropKeys: ("title" | "root" | "extra" | "tmNodes" | "tmNode" | "internalKey" | "isGroup" | "level")[];
declare const NMenuOptionGroup: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly tmNode: {
    readonly type: PropType<TmNode>;
    readonly required: true;
  };
  readonly tmNodes: {
    readonly type: PropType<TmNode[]>;
    readonly required: true;
  };
  readonly internalKey: {
    readonly type: PropType<import("treemate").Key>;
    readonly required: true;
  };
  readonly root: BooleanConstructor;
  readonly isGroup: BooleanConstructor;
  readonly level: {
    readonly type: NumberConstructor;
    readonly required: true;
  };
  readonly title: PropType<string | (() => import("vue").VNodeChild)>;
  readonly extra: PropType<string | (() => import("vue").VNodeChild)>;
}>, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly tmNode: {
    readonly type: PropType<TmNode>;
    readonly required: true;
  };
  readonly tmNodes: {
    readonly type: PropType<TmNode[]>;
    readonly required: true;
  };
  readonly internalKey: {
    readonly type: PropType<import("treemate").Key>;
    readonly required: true;
  };
  readonly root: BooleanConstructor;
  readonly isGroup: BooleanConstructor;
  readonly level: {
    readonly type: NumberConstructor;
    readonly required: true;
  };
  readonly title: PropType<string | (() => import("vue").VNodeChild)>;
  readonly extra: PropType<string | (() => import("vue").VNodeChild)>;
}>> & Readonly<{}>, {
  readonly root: boolean;
  readonly isGroup: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { NMenuOptionGroup, menuItemGroupPropKeys, menuItemGroupProps };