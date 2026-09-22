import { NDateLocale } from "../../locales/date/enUS.js";
import { ButtonProps } from "../../button/src/Button.js";
import "../../index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/popconfirm/src/PopconfirmPanel.d.ts
declare const panelProps: {
  readonly positiveText: PropType<string | null>;
  readonly negativeText: PropType<string | null>;
  readonly showIcon: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onPositiveClick: {
    readonly type: PropType<(e: MouseEvent) => void>;
    readonly required: true;
  };
  readonly onNegativeClick: {
    readonly type: PropType<(e: MouseEvent) => void>;
    readonly required: true;
  };
};
declare const panelPropKeys: ("showIcon" | "onPositiveClick" | "onNegativeClick" | "negativeText" | "positiveText")[];
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly positiveText: PropType<string | null>;
  readonly negativeText: PropType<string | null>;
  readonly showIcon: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onPositiveClick: {
    readonly type: PropType<(e: MouseEvent) => void>;
    readonly required: true;
  };
  readonly onNegativeClick: {
    readonly type: PropType<(e: MouseEvent) => void>;
    readonly required: true;
  };
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  localizedPositiveText: import("vue").ComputedRef<string>;
  localizedNegativeText: import("vue").ComputedRef<string>;
  positiveButtonProps: Ref<ButtonProps | undefined, ButtonProps | undefined>;
  negativeButtonProps: Ref<ButtonProps | undefined, ButtonProps | undefined>;
  handlePositiveClick(e: MouseEvent): void;
  handleNegativeClick(e: MouseEvent): void;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  localeRef: Ref<{
    positiveText: string;
    negativeText: string;
  }, {
    positiveText: string;
    negativeText: string;
  }>;
  dateLocaleRef: Ref<NDateLocale>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly positiveText: PropType<string | null>;
  readonly negativeText: PropType<string | null>;
  readonly showIcon: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onPositiveClick: {
    readonly type: PropType<(e: MouseEvent) => void>;
    readonly required: true;
  };
  readonly onNegativeClick: {
    readonly type: PropType<(e: MouseEvent) => void>;
    readonly required: true;
  };
}>> & Readonly<{}>, {
  readonly showIcon: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default, panelPropKeys, panelProps };