import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { CollapseTheme, CollapseThemeOverrides, CollapseThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { CollapseArrowSlotProps, CollapseItemHeaderExtraSlotProps, CollapseItemHeaderSlotProps, OnItemHeaderClick, OnUpdateExpandedNames } from "./interface.js";
import "../../index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, ExtractPropTypes, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/collapse/src/Collapse.d.ts
declare const collapseProps: {
  readonly defaultExpandedNames: {
    readonly type: PropType<string | number | Array<string | number> | null>;
    readonly default: null;
  };
  readonly expandedNames: PropType<string | number | Array<string | number> | null>;
  readonly arrowPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  readonly accordion: BooleanConstructor;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show">;
    readonly default: "if";
  };
  readonly triggerAreas: {
    readonly type: PropType<Array<"main" | "extra" | "arrow">>;
    readonly default: () => string[];
  };
  readonly onItemHeaderClick: PropType<MaybeArray<OnItemHeaderClick>>;
  readonly 'onUpdate:expandedNames': PropType<MaybeArray<OnUpdateExpandedNames>>;
  readonly onUpdateExpandedNames: PropType<MaybeArray<OnUpdateExpandedNames>>;
  readonly onExpandedNamesChange: {
    readonly type: PropType<MaybeArray<OnUpdateExpandedNames> | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly theme: PropType<CollapseTheme>;
  readonly themeOverrides: PropType<CollapseThemeOverrides>;
  readonly builtinThemeOverrides: PropType<CollapseThemeOverrides>;
};
type CollapseProps = ExtractPublicPropTypes<typeof collapseProps>;
interface CollapseSlots {
  default?: () => VNode[];
  arrow?: (props: CollapseArrowSlotProps) => VNode[];
  header?: (props: CollapseItemHeaderSlotProps) => VNode[];
  'header-extra'?: (props: CollapseItemHeaderExtraSlotProps) => VNode[];
}
interface NCollapseInjection {
  props: ExtractPropTypes<typeof collapseProps>;
  expandedNamesRef: Ref<string | number | Array<string | number> | null>;
  mergedClsPrefixRef: Ref<string>;
  slots: CollapseSlots;
  toggleItem: (collapse: boolean, name: string | number, event: MouseEvent) => void;
}
declare const collapseInjectionKey: import("vue").InjectionKey<NCollapseInjection>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  readonly defaultExpandedNames: {
    readonly type: PropType<string | number | Array<string | number> | null>;
    readonly default: null;
  };
  readonly expandedNames: PropType<string | number | Array<string | number> | null>;
  readonly arrowPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  readonly accordion: BooleanConstructor;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show">;
    readonly default: "if";
  };
  readonly triggerAreas: {
    readonly type: PropType<Array<"main" | "extra" | "arrow">>;
    readonly default: () => string[];
  };
  readonly onItemHeaderClick: PropType<MaybeArray<OnItemHeaderClick>>;
  readonly 'onUpdate:expandedNames': PropType<MaybeArray<OnUpdateExpandedNames>>;
  readonly onUpdateExpandedNames: PropType<MaybeArray<OnUpdateExpandedNames>>;
  readonly onExpandedNamesChange: {
    readonly type: PropType<MaybeArray<OnUpdateExpandedNames> | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly theme: PropType<CollapseTheme>;
  readonly themeOverrides: PropType<CollapseThemeOverrides>;
  readonly builtinThemeOverrides: PropType<CollapseThemeOverrides>;
}>, {
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: CollapseThemeVars;
    peers: any;
    peerOverrides: {
      [x: string]: any;
    };
  }>;
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  readonly defaultExpandedNames: {
    readonly type: PropType<string | number | Array<string | number> | null>;
    readonly default: null;
  };
  readonly expandedNames: PropType<string | number | Array<string | number> | null>;
  readonly arrowPlacement: {
    readonly type: PropType<"left" | "right">;
    readonly default: "left";
  };
  readonly accordion: BooleanConstructor;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show">;
    readonly default: "if";
  };
  readonly triggerAreas: {
    readonly type: PropType<Array<"main" | "extra" | "arrow">>;
    readonly default: () => string[];
  };
  readonly onItemHeaderClick: PropType<MaybeArray<OnItemHeaderClick>>;
  readonly 'onUpdate:expandedNames': PropType<MaybeArray<OnUpdateExpandedNames>>;
  readonly onUpdateExpandedNames: PropType<MaybeArray<OnUpdateExpandedNames>>;
  readonly onExpandedNamesChange: {
    readonly type: PropType<MaybeArray<OnUpdateExpandedNames> | undefined>;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly theme: PropType<CollapseTheme>;
  readonly themeOverrides: PropType<CollapseThemeOverrides>;
  readonly builtinThemeOverrides: PropType<CollapseThemeOverrides>;
}>> & Readonly<{}>, {
  readonly displayDirective: "show" | "if";
  readonly defaultExpandedNames: string | number | (string | number)[] | null;
  readonly arrowPlacement: "left" | "right";
  readonly accordion: boolean;
  readonly triggerAreas: ("main" | "extra" | "arrow")[];
  readonly onExpandedNamesChange: MaybeArray<OnUpdateExpandedNames> | undefined;
}, SlotsType<CollapseSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { CollapseProps, CollapseSlots, NCollapseInjection, collapseInjectionKey, collapseProps, _default as default };