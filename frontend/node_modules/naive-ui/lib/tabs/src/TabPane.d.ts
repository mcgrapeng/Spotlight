import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { HTMLAttributes, PropType, SlotsType, VNode, VNodeChild } from "vue";
//#region src/tabs/src/TabPane.d.ts
declare const tabPaneProps: {
  readonly tab: PropType<string | number | VNode | (() => VNodeChild)>;
  readonly name: {
    readonly type: PropType<string | number>;
    readonly required: true;
  };
  readonly disabled: BooleanConstructor;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show" | "show:lazy">;
    readonly default: "if";
  };
  readonly closable: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly tabProps: PropType<HTMLAttributes>;
  /** @deprecated */
  readonly label: PropType<string | number | VNode | (() => VNodeChild)>;
};
type TabPaneProps = ExtractPublicPropTypes<typeof tabPaneProps>;
interface TabPaneSlots {
  default?: () => VNode[];
  tab?: () => VNode[];
  prefix?: () => VNode[];
  suffix?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly tab: PropType<string | number | VNode | (() => VNodeChild)>;
  readonly name: {
    readonly type: PropType<string | number>;
    readonly required: true;
  };
  readonly disabled: BooleanConstructor;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show" | "show:lazy">;
    readonly default: "if";
  };
  readonly closable: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly tabProps: PropType<HTMLAttributes>;
  /** @deprecated */
  readonly label: PropType<string | number | VNode | (() => VNodeChild)>;
}>, {
  style: import("vue").Ref<string | import("vue").CSSProperties | undefined, string | import("vue").CSSProperties | undefined>;
  class: import("vue").Ref<string | undefined, string | undefined>;
  mergedClsPrefix: import("vue").Ref<string, string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly tab: PropType<string | number | VNode | (() => VNodeChild)>;
  readonly name: {
    readonly type: PropType<string | number>;
    readonly required: true;
  };
  readonly disabled: BooleanConstructor;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show" | "show:lazy">;
    readonly default: "if";
  };
  readonly closable: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly tabProps: PropType<HTMLAttributes>;
  /** @deprecated */
  readonly label: PropType<string | number | VNode | (() => VNodeChild)>;
}>> & Readonly<{}>, {
  readonly closable: boolean | undefined;
  readonly disabled: boolean;
  readonly displayDirective: "show" | "if" | "show:lazy";
}, SlotsType<TabPaneSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TabPaneProps, TabPaneSlots, _default as default, tabPaneProps };