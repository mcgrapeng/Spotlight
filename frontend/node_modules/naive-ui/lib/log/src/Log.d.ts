import { Hljs } from "../../_mixins/use-hljs.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { CodeTheme } from "../../code/styles/light.js";
import "../../code/styles/index.js";
import { LogTheme, LogThemeOverrides, LogThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { LogSpinProps } from "./public-types.js";
import "../../index.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/log/src/Log.d.ts
interface LogInjection {
  trimRef: Ref<boolean>;
  languageRef: Ref<string | undefined>;
  highlightRef: Ref<boolean>;
  mergedHljsRef: Ref<Hljs | undefined>;
}
interface LogInst {
  scrollTo: ((options: {
    silent?: boolean;
    position: 'top' | 'bottom';
  }) => void) & ((options: {
    silent?: boolean;
    top: number;
  }) => void);
}
declare const logProps: {
  readonly loading: BooleanConstructor;
  readonly trim: BooleanConstructor;
  readonly log: StringConstructor;
  readonly fontSize: {
    readonly type: NumberConstructor;
    readonly default: 14;
  };
  readonly lines: {
    readonly type: PropType<string[]>;
    readonly default: () => never[];
  };
  readonly lineHeight: {
    readonly type: NumberConstructor;
    readonly default: 1.25;
  };
  readonly language: StringConstructor;
  readonly rows: {
    readonly type: NumberConstructor;
    readonly default: 15;
  };
  readonly offsetTop: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly offsetBottom: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly hljs: ObjectConstructor;
  readonly spinProps: PropType<LogSpinProps>;
  readonly onReachTop: PropType<() => void>;
  readonly onReachBottom: PropType<() => void>;
  readonly onRequireMore: PropType<(from: "top" | "bottom") => void>;
  readonly theme: PropType<LogTheme>;
  readonly themeOverrides: PropType<LogThemeOverrides>;
  readonly builtinThemeOverrides: PropType<LogThemeOverrides>;
};
type LogProps = ExtractPublicPropTypes<typeof logProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly loading: BooleanConstructor;
  readonly trim: BooleanConstructor;
  readonly log: StringConstructor;
  readonly fontSize: {
    readonly type: NumberConstructor;
    readonly default: 14;
  };
  readonly lines: {
    readonly type: PropType<string[]>;
    readonly default: () => never[];
  };
  readonly lineHeight: {
    readonly type: NumberConstructor;
    readonly default: 1.25;
  };
  readonly language: StringConstructor;
  readonly rows: {
    readonly type: NumberConstructor;
    readonly default: 15;
  };
  readonly offsetTop: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly offsetBottom: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly hljs: ObjectConstructor;
  readonly spinProps: PropType<LogSpinProps>;
  readonly onReachTop: PropType<() => void>;
  readonly onReachBottom: PropType<() => void>;
  readonly onRequireMore: PropType<(from: "top" | "bottom") => void>;
  readonly theme: PropType<LogTheme>;
  readonly themeOverrides: PropType<LogThemeOverrides>;
  readonly builtinThemeOverrides: PropType<LogThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  scrollbarRef: unknown;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: LogThemeVars;
    peers: {
      Scrollbar: ScrollbarTheme;
      Code: CodeTheme;
    };
    peerOverrides: {
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Code?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  styleHeight: import("vue").ComputedRef<string>;
  mergedLines: import("vue").ComputedRef<string[]>;
  scrollToTop: (silent?: boolean) => void;
  scrollToBottom: (silent?: boolean) => void;
  handleWheel: (e: WheelEvent) => void;
  handleScroll: (e: Event) => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  scrollTo: ((options: {
    silent?: boolean;
    position: "top" | "bottom";
  }) => void) & ((options: {
    silent?: boolean;
    top: number;
  }) => void);
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly loading: BooleanConstructor;
  readonly trim: BooleanConstructor;
  readonly log: StringConstructor;
  readonly fontSize: {
    readonly type: NumberConstructor;
    readonly default: 14;
  };
  readonly lines: {
    readonly type: PropType<string[]>;
    readonly default: () => never[];
  };
  readonly lineHeight: {
    readonly type: NumberConstructor;
    readonly default: 1.25;
  };
  readonly language: StringConstructor;
  readonly rows: {
    readonly type: NumberConstructor;
    readonly default: 15;
  };
  readonly offsetTop: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly offsetBottom: {
    readonly type: NumberConstructor;
    readonly default: 0;
  };
  readonly hljs: ObjectConstructor;
  readonly spinProps: PropType<LogSpinProps>;
  readonly onReachTop: PropType<() => void>;
  readonly onReachBottom: PropType<() => void>;
  readonly onRequireMore: PropType<(from: "top" | "bottom") => void>;
  readonly theme: PropType<LogTheme>;
  readonly themeOverrides: PropType<LogThemeOverrides>;
  readonly builtinThemeOverrides: PropType<LogThemeOverrides>;
}>> & Readonly<{}>, {
  readonly loading: boolean;
  readonly fontSize: number;
  readonly lineHeight: number;
  readonly offsetTop: number;
  readonly offsetBottom: number;
  readonly trim: boolean;
  readonly rows: number;
  readonly lines: string[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { LogInjection, LogInst, LogProps, _default as default, logProps };