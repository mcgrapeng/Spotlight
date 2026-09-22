import { warn } from "../../_utils/naive/warn.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useHljs from "../../_mixins/use-hljs.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import Code_default from "../../code/src/Code.mjs";
import logLight from "../styles/light.mjs";
import { logInjectionKey } from "./context.mjs";
import LogLine_default from "./LogLine.mjs";
import LogLoader_default from "./LogLoader.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Transition, computed, createBlock, defineComponent, h, nextTick, openBlock, provide, ref, toRef } from "vue";
import { throttle } from "lodash-es";
//#region src/log/src/Log.tsx
const throttle$1 = throttle;
const logProps = {
  ...useTheme.props,
  loading: Boolean,
  trim: Boolean,
  log: String,
  fontSize: {
    type: Number,
    default: 14
  },
  lines: {
    type: Array,
    default: () => []
  },
  lineHeight: {
    type: Number,
    default: 1.25
  },
  language: String,
  rows: {
    type: Number,
    default: 15
  },
  offsetTop: {
    type: Number,
    default: 0
  },
  offsetBottom: {
    type: Number,
    default: 0
  },
  hljs: Object,
  spinProps: Object,
  onReachTop: Function,
  onReachBottom: Function,
  onRequireMore: Function
};
var Log_default = defineComponent({
  name: "Log",
  props: logProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const silentRef = ref(false);
    const highlightRef = computed(() => {
      return props.language !== void 0;
    });
    const styleHeightRef = computed(() => {
      return `calc(${Math.round(props.rows * props.lineHeight * props.fontSize)}px)`;
    });
    const mergedLinesRef = computed(() => {
      const {
        log
      } = props;
      if (log) return log.split("\n");
      return props.lines;
    });
    const scrollbarRef = ref(null);
    const themeRef = useTheme("Log", "-log", index_cssr_default, logLight, props, mergedClsPrefixRef);
    function handleScroll(e) {
      const container = e.target;
      const content = container.firstElementChild;
      if (silentRef.value) {
        nextTick(() => {
          silentRef.value = false;
        });
        return;
      }
      const containerHeight = container.offsetHeight;
      const containerScrollTop = container.scrollTop;
      const contentHeight = content.offsetHeight;
      const scrollTop = containerScrollTop;
      const scrollBottom = contentHeight - containerScrollTop - containerHeight;
      if (scrollTop <= props.offsetTop) {
        const {
          onReachTop,
          onRequireMore
        } = props;
        if (onRequireMore) onRequireMore("top");
        if (onReachTop) onReachTop();
      }
      if (scrollBottom <= props.offsetBottom) {
        const {
          onReachBottom,
          onRequireMore
        } = props;
        if (onRequireMore) onRequireMore("bottom");
        if (onReachBottom) onReachBottom();
      }
    }
    const handleWheel = throttle$1(_handleWheel, 300);
    function _handleWheel(e) {
      if (silentRef.value) {
        nextTick(() => {
          silentRef.value = false;
        });
        return;
      }
      if (scrollbarRef.value) {
        const {
          containerRef,
          contentRef
        } = scrollbarRef.value;
        if (containerRef && contentRef) {
          const containerHeight = containerRef.offsetHeight;
          const containerScrollTop = containerRef.scrollTop;
          const contentHeight = contentRef.offsetHeight;
          const scrollTop = containerScrollTop;
          const scrollBottom = contentHeight - containerScrollTop - containerHeight;
          const deltaY = e.deltaY;
          if (scrollTop === 0 && deltaY < 0) {
            const {
              onRequireMore
            } = props;
            if (onRequireMore) onRequireMore("top");
          }
          if (scrollBottom <= 0 && deltaY > 0) {
            const {
              onRequireMore
            } = props;
            if (onRequireMore) onRequireMore("bottom");
          }
        }
      }
    }
    function scrollTo(options) {
      const {
        value: scrollbarInst
      } = scrollbarRef;
      if (!scrollbarInst) return;
      const {
        silent,
        top,
        position
      } = options;
      if (silent) silentRef.value = true;
      if (top !== void 0) scrollbarInst.scrollTo({
        left: 0,
        top
      });else if (position === "bottom" || position === "top") scrollbarInst.scrollTo({
        position
      });
    }
    function scrollToTop(silent = false) {
      warn("log", "`scrollToTop` is deprecated, please use `scrollTo({ position: 'top'})` instead.");
      scrollTo({
        position: "top",
        silent
      });
    }
    function scrollToBottom(silent = false) {
      warn("log", "`scrollToTop` is deprecated, please use `scrollTo({ position: 'bottom'})` instead.");
      scrollTo({
        position: "bottom",
        silent
      });
    }
    provide(logInjectionKey, {
      languageRef: toRef(props, "language"),
      mergedHljsRef: useHljs(props, highlightRef),
      trimRef: toRef(props, "trim"),
      highlightRef
    });
    const exportedMethods = {
      scrollTo
    };
    const cssVarsRef = computed(() => {
      const {
        self: {
          loaderFontSize,
          loaderTextColor,
          loaderColor,
          loaderBorder,
          loadingColor
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-loader-font-size": loaderFontSize,
        "--n-loader-border": loaderBorder,
        "--n-loader-color": loaderColor,
        "--n-loader-text-color": loaderTextColor,
        "--n-loading-color": loadingColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("log", void 0, cssVarsRef, props) : void 0;
    return {
      ...exportedMethods,
      mergedClsPrefix: mergedClsPrefixRef,
      scrollbarRef,
      mergedTheme: themeRef,
      styleHeight: styleHeightRef,
      mergedLines: mergedLinesRef,
      scrollToTop,
      scrollToBottom,
      handleWheel,
      handleScroll,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix,
      mergedTheme,
      onRender
    } = this;
    onRender?.();
    return h("div", {
      class: [`${mergedClsPrefix}-log`, this.themeClass],
      style: [{
        lineHeight: this.lineHeight,
        height: this.styleHeight
      }, this.cssVars],
      onWheelPassive: this.handleWheel
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "scrollbarRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar,
      onScroll: this.handleScroll
    }, {
      default: () => (openBlock(), createBlock(Code_default, {
        internalNoHighlight: true,
        internalFontSize: this.fontSize,
        theme: mergedTheme.peers.Code,
        themeOverrides: mergedTheme.peerOverrides.Code
      }, {
        default: () => this.mergedLines.map((line, index) => {
          return openBlock(), createBlock(LogLine_default, {
            key: index,
            line
          }, null, 8, ["line"]);
        })
      }, 1032, ["internalFontSize", "theme", "themeOverrides"]))
    }, 1032, ["theme", "themeOverrides", "onScroll"])), (openBlock(), createBlock(Transition, {
      name: "fade-in-scale-up-transition"
    }, {
      default: () => this.loading ? (openBlock(), createBlock(LogLoader_default, {
        key: 1,
        clsPrefix: mergedClsPrefix,
        spinProps: this.spinProps
      }, null, 8, ["clsPrefix", "spinProps"])) : null
    }, 1024))]);
  }
});
//#endregion
export { Log_default as default, logProps };