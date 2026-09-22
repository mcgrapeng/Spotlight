Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_hljs = require("../../_mixins/use-hljs.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_code_src_Code = require("../../code/src/Code.js");
const require_log_styles_light = require("../styles/light.js");
const require_log_src_context = require("./context.js");
const require_log_src_LogLine = require("./LogLine.js");
const require_log_src_LogLoader = require("./LogLoader.js");
const require_log_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/log/src/Log.tsx
const throttle = require("lodash").throttle;
const logProps = {
	...require__mixins_use_theme.default.props,
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
var Log_default = (0, vue.defineComponent)({
	name: "Log",
	props: logProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const silentRef = (0, vue.ref)(false);
		const highlightRef = (0, vue.computed)(() => {
			return props.language !== void 0;
		});
		const styleHeightRef = (0, vue.computed)(() => {
			return `calc(${Math.round(props.rows * props.lineHeight * props.fontSize)}px)`;
		});
		const mergedLinesRef = (0, vue.computed)(() => {
			const { log } = props;
			if (log) return log.split("\n");
			return props.lines;
		});
		const scrollbarRef = (0, vue.ref)(null);
		const themeRef = require__mixins_use_theme.default("Log", "-log", require_log_src_styles_index_cssr, require_log_styles_light, props, mergedClsPrefixRef);
		function handleScroll(e) {
			const container = e.target;
			const content = container.firstElementChild;
			if (silentRef.value) {
				(0, vue.nextTick)(() => {
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
				const { onReachTop, onRequireMore } = props;
				if (onRequireMore) onRequireMore("top");
				if (onReachTop) onReachTop();
			}
			if (scrollBottom <= props.offsetBottom) {
				const { onReachBottom, onRequireMore } = props;
				if (onRequireMore) onRequireMore("bottom");
				if (onReachBottom) onReachBottom();
			}
		}
		const handleWheel = throttle(_handleWheel, 300);
		function _handleWheel(e) {
			if (silentRef.value) {
				(0, vue.nextTick)(() => {
					silentRef.value = false;
				});
				return;
			}
			if (scrollbarRef.value) {
				const { containerRef, contentRef } = scrollbarRef.value;
				if (containerRef && contentRef) {
					const containerHeight = containerRef.offsetHeight;
					const containerScrollTop = containerRef.scrollTop;
					const contentHeight = contentRef.offsetHeight;
					const scrollTop = containerScrollTop;
					const scrollBottom = contentHeight - containerScrollTop - containerHeight;
					const deltaY = e.deltaY;
					if (scrollTop === 0 && deltaY < 0) {
						const { onRequireMore } = props;
						if (onRequireMore) onRequireMore("top");
					}
					if (scrollBottom <= 0 && deltaY > 0) {
						const { onRequireMore } = props;
						if (onRequireMore) onRequireMore("bottom");
					}
				}
			}
		}
		function scrollTo(options) {
			const { value: scrollbarInst } = scrollbarRef;
			if (!scrollbarInst) return;
			const { silent, top, position } = options;
			if (silent) silentRef.value = true;
			if (top !== void 0) scrollbarInst.scrollTo({
				left: 0,
				top
			});
			else if (position === "bottom" || position === "top") scrollbarInst.scrollTo({ position });
		}
		function scrollToTop(silent = false) {
			require__utils_naive_warn.warn("log", "`scrollToTop` is deprecated, please use `scrollTo({ position: 'top'})` instead.");
			scrollTo({
				position: "top",
				silent
			});
		}
		function scrollToBottom(silent = false) {
			require__utils_naive_warn.warn("log", "`scrollToTop` is deprecated, please use `scrollTo({ position: 'bottom'})` instead.");
			scrollTo({
				position: "bottom",
				silent
			});
		}
		(0, vue.provide)(require_log_src_context.logInjectionKey, {
			languageRef: (0, vue.toRef)(props, "language"),
			mergedHljsRef: require__mixins_use_hljs(props, highlightRef),
			trimRef: (0, vue.toRef)(props, "trim"),
			highlightRef
		});
		const exportedMethods = { scrollTo };
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { loaderFontSize, loaderTextColor, loaderColor, loaderBorder, loadingColor }, common: { cubicBezierEaseInOut } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-loader-font-size": loaderFontSize,
				"--n-loader-border": loaderBorder,
				"--n-loader-color": loaderColor,
				"--n-loader-text-color": loaderTextColor,
				"--n-loading-color": loadingColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("log", void 0, cssVarsRef, props) : void 0;
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
		const { mergedClsPrefix, mergedTheme, onRender } = this;
		onRender?.();
		return (0, vue.h)("div", {
			class: [`${mergedClsPrefix}-log`, this.themeClass],
			style: [{
				lineHeight: this.lineHeight,
				height: this.styleHeight
			}, this.cssVars],
			onWheelPassive: this.handleWheel
		}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
			ref: "scrollbarRef",
			theme: mergedTheme.peers.Scrollbar,
			themeOverrides: mergedTheme.peerOverrides.Scrollbar,
			onScroll: this.handleScroll
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require_code_src_Code.default, {
			internalNoHighlight: true,
			internalFontSize: this.fontSize,
			theme: mergedTheme.peers.Code,
			themeOverrides: mergedTheme.peerOverrides.Code
		}, { default: () => this.mergedLines.map((line, index) => {
			return (0, vue.openBlock)(), (0, vue.createBlock)(require_log_src_LogLine, {
				key: index,
				line
			}, null, 8, ["line"]);
		}) }, 1032, [
			"internalFontSize",
			"theme",
			"themeOverrides"
		])) }, 1032, [
			"theme",
			"themeOverrides",
			"onScroll"
		])), ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, { name: "fade-in-scale-up-transition" }, { default: () => this.loading ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_log_src_LogLoader, {
			key: 1,
			clsPrefix: mergedClsPrefix,
			spinProps: this.spinProps
		}, null, 8, ["clsPrefix", "spinProps"])) : null }, 1024))]);
	}
});
//#endregion
exports.default = Log_default;
exports.logProps = logProps;
