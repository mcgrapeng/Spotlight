import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { TabsType } from "./interface.js";
//#region src/tabs/src/Tab.d.ts
declare const tabProps: {
  readonly name: {
    readonly type: import("vue").PropType<string | number>;
    readonly required: true;
  };
  readonly closable: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly label: import("vue").PropType<string | number | import("vue").VNode | (() => import("vue").VNodeChild)>;
  readonly disabled: BooleanConstructor;
  readonly tab: import("vue").PropType<string | number | import("vue").VNode | (() => import("vue").VNodeChild)>;
  readonly tabProps: import("vue").PropType<import("vue").HTMLAttributes>;
  readonly internalLeftPadded: BooleanConstructor;
  readonly internalAddable: BooleanConstructor;
  readonly internalCreatedByPane: BooleanConstructor;
};
type TabProps = ExtractPublicPropTypes<typeof tabProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly name: {
    readonly type: import("vue").PropType<string | number>;
    readonly required: true;
  };
  readonly closable: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly label: import("vue").PropType<string | number | import("vue").VNode | (() => import("vue").VNodeChild)>;
  readonly disabled: BooleanConstructor;
  readonly tab: import("vue").PropType<string | number | import("vue").VNode | (() => import("vue").VNodeChild)>;
  readonly tabProps: import("vue").PropType<import("vue").HTMLAttributes>;
  readonly internalLeftPadded: BooleanConstructor;
  readonly internalAddable: BooleanConstructor;
  readonly internalCreatedByPane: BooleanConstructor;
}>, {
  trigger: import("vue").Ref<"hover" | "click", "hover" | "click">;
  mergedClosable: import("vue").ComputedRef<boolean>;
  style: import("vue").Ref<string | import("vue").CSSProperties | undefined, string | import("vue").CSSProperties | undefined>;
  addStyle: import("vue").Ref<string | import("vue").CSSProperties | undefined, string | import("vue").CSSProperties | undefined>;
  tabClass: import("vue").Ref<string | undefined, string | undefined>;
  addTabClass: import("vue").Ref<string | undefined, string | undefined>;
  clsPrefix: import("vue").Ref<string, string>;
  value: import("vue").Ref<string | number | null, string | number | null>;
  type: import("vue").Ref<TabsType, TabsType>;
  handleClose(e: MouseEvent): void;
  activateTab(): void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly name: {
    readonly type: import("vue").PropType<string | number>;
    readonly required: true;
  };
  readonly closable: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly label: import("vue").PropType<string | number | import("vue").VNode | (() => import("vue").VNodeChild)>;
  readonly disabled: BooleanConstructor;
  readonly tab: import("vue").PropType<string | number | import("vue").VNode | (() => import("vue").VNodeChild)>;
  readonly tabProps: import("vue").PropType<import("vue").HTMLAttributes>;
  readonly internalLeftPadded: BooleanConstructor;
  readonly internalAddable: BooleanConstructor;
  readonly internalCreatedByPane: BooleanConstructor;
}>> & Readonly<{}>, {
  readonly closable: boolean | undefined;
  readonly disabled: boolean;
  readonly internalLeftPadded: boolean;
  readonly internalAddable: boolean;
  readonly internalCreatedByPane: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TabProps, _default as default, tabProps };