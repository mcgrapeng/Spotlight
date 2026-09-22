Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_reactivated = require("../../_utils/composable/use-reactivated.js");
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_layout_styles_light = require("../styles/light.js");
const require_layout_src_interface = require("./interface.js");
const require_layout_src_Layout = require("./Layout.js");
const require_layout_src_styles_layout_sider_cssr = require("./styles/layout-sider.cssr.js");
const require_layout_src_ToggleBar = require("./ToggleBar.js");
const require_layout_src_ToggleButton = require("./ToggleButton.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/layout/src/LayoutSider.tsx
const _hoisted_1 = ["onTransitionend"];
const layoutSiderProps = {
	position: require_layout_src_interface.positionProp,
	bordered: Boolean,
	collapsedWidth: {
		type: Number,
		default: 48
	},
	width: {
		type: [Number, String],
		default: 272
	},
	contentClass: String,
	contentStyle: {
		type: [String, Object],
		default: ""
	},
	collapseMode: {
		type: String,
		default: "transform"
	},
	collapsed: {
		type: Boolean,
		default: void 0
	},
	defaultCollapsed: Boolean,
	showCollapsedContent: {
		type: Boolean,
		default: true
	},
	showTrigger: {
		type: [Boolean, String],
		default: false
	},
	nativeScrollbar: {
		type: Boolean,
		default: true
	},
	inverted: Boolean,
	scrollbarProps: Object,
	triggerClass: String,
	triggerStyle: [String, Object],
	collapsedTriggerClass: String,
	collapsedTriggerStyle: [String, Object],
	"onUpdate:collapsed": [Function, Array],
	onUpdateCollapsed: [Function, Array],
	onAfterEnter: Function,
	onAfterLeave: Function,
	onExpand: [Function, Array],
	onCollapse: [Function, Array],
	onScroll: Function
};
var LayoutSider_default = (0, vue.defineComponent)({
	name: "LayoutSider",
	props: {
		...require__mixins_use_theme.default.props,
		...layoutSiderProps
	},
	setup(props) {
		const layoutProps = (0, vue.inject)(require_layout_src_Layout.layoutInjectionKey);
		if (process.env.NODE_ENV !== "production") {
			if (!layoutProps) require__utils_naive_warn.warn("layout-sider", "Layout sider is not allowed to be put outside layout.");
			else if (!layoutProps.hasSider) require__utils_naive_warn.warn("layout-sider", "You are putting `n-layout-sider` in a `n-layout` but haven't set `has-sider` on the `n-layout`.");
		}
		const scrollableElRef = (0, vue.ref)(null);
		const scrollbarInstRef = (0, vue.ref)(null);
		const uncontrolledCollapsedRef = (0, vue.ref)(props.defaultCollapsed);
		const mergedCollapsedRef = (0, vooks.useMergedState)((0, vue.toRef)(props, "collapsed"), uncontrolledCollapsedRef);
		const styleMaxWidthRef = (0, vue.computed)(() => {
			return require__utils_css_format_length.formatLength(mergedCollapsedRef.value ? props.collapsedWidth : props.width);
		});
		const scrollContainerStyleRef = (0, vue.computed)(() => {
			if (props.collapseMode !== "transform") return {};
			return { minWidth: require__utils_css_format_length.formatLength(props.width) };
		});
		const siderPlacementRef = (0, vue.computed)(() => {
			return layoutProps ? layoutProps.siderPlacement : "left";
		});
		function scrollTo(options, y) {
			if (props.nativeScrollbar) {
				const { value: scrollableEl } = scrollableElRef;
				if (scrollableEl) {
					if (y === void 0) scrollableEl.scrollTo(options);
					else scrollableEl.scrollTo(options, y);
				}
			} else {
				const { value: scrollbarInst } = scrollbarInstRef;
				if (scrollbarInst) scrollbarInst.scrollTo(options, y);
			}
		}
		function handleTriggerClick() {
			const { "onUpdate:collapsed": _onUpdateCollapsed, onUpdateCollapsed, onExpand, onCollapse } = props;
			const { value: collapsed } = mergedCollapsedRef;
			if (onUpdateCollapsed) require__utils_vue_call.call(onUpdateCollapsed, !collapsed);
			if (_onUpdateCollapsed) require__utils_vue_call.call(_onUpdateCollapsed, !collapsed);
			uncontrolledCollapsedRef.value = !collapsed;
			if (collapsed) {
				if (onExpand) require__utils_vue_call.call(onExpand);
			} else if (onCollapse) require__utils_vue_call.call(onCollapse);
		}
		let scrollX = 0;
		let scrollY = 0;
		const handleNativeElScroll = (e) => {
			const target = e.target;
			scrollX = target.scrollLeft;
			scrollY = target.scrollTop;
			props.onScroll?.(e);
		};
		require__utils_composable_use_reactivated.useReactivated(() => {
			if (props.nativeScrollbar) {
				const el = scrollableElRef.value;
				if (el) {
					el.scrollTop = scrollY;
					el.scrollLeft = scrollX;
				}
			}
		});
		(0, vue.provide)(require_layout_src_interface.layoutSiderInjectionKey, {
			collapsedRef: mergedCollapsedRef,
			collapseModeRef: (0, vue.toRef)(props, "collapseMode")
		});
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Layout", "-layout-sider", require_layout_src_styles_layout_sider_cssr, require_layout_styles_light.default, props, mergedClsPrefixRef);
		function handleTransitionend(e) {
			if (e.propertyName === "max-width") {
				if (mergedCollapsedRef.value) props.onAfterLeave?.();
				else props.onAfterEnter?.();
			}
		}
		const exposedMethods = { scrollTo };
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self } = themeRef.value;
			const { siderToggleButtonColor, siderToggleButtonBorder, siderToggleBarColor, siderToggleBarColorHover } = self;
			const vars = {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-toggle-button-color": siderToggleButtonColor,
				"--n-toggle-button-border": siderToggleButtonBorder,
				"--n-toggle-bar-color": siderToggleBarColor,
				"--n-toggle-bar-color-hover": siderToggleBarColorHover
			};
			if (props.inverted) {
				vars["--n-color"] = self.siderColorInverted;
				vars["--n-text-color"] = self.textColorInverted;
				vars["--n-border-color"] = self.siderBorderColorInverted;
				vars["--n-toggle-button-icon-color"] = self.siderToggleButtonIconColorInverted;
				vars.__invertScrollbar = self.__invertScrollbar;
			} else {
				vars["--n-color"] = self.siderColor;
				vars["--n-text-color"] = self.textColor;
				vars["--n-border-color"] = self.siderBorderColor;
				vars["--n-toggle-button-icon-color"] = self.siderToggleButtonIconColor;
			}
			return vars;
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("layout-sider", (0, vue.computed)(() => props.inverted ? "a" : "b"), cssVarsRef, props) : void 0;
		return {
			scrollableElRef,
			scrollbarInstRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedTheme: themeRef,
			styleMaxWidth: styleMaxWidthRef,
			mergedCollapsed: mergedCollapsedRef,
			scrollContainerStyle: scrollContainerStyleRef,
			siderPlacement: siderPlacementRef,
			handleNativeElScroll,
			handleTransitionend,
			handleTriggerClick,
			inlineThemeDisabled,
			cssVars: cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			...exposedMethods
		};
	},
	render() {
		const { mergedClsPrefix, mergedCollapsed, showTrigger } = this;
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("aside", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-layout-sider`,
				this.themeClass,
				`${mergedClsPrefix}-layout-sider--${this.position}-positioned`,
				`${mergedClsPrefix}-layout-sider--${this.siderPlacement}-placement`,
				this.bordered && `${mergedClsPrefix}-layout-sider--bordered`,
				mergedCollapsed && `${mergedClsPrefix}-layout-sider--collapsed`,
				(!mergedCollapsed || this.showCollapsedContent) && `${mergedClsPrefix}-layout-sider--show-content`
			]),
			onTransitionend: this.handleTransitionend,
			style: (0, vue.normalizeStyle)([this.inlineThemeDisabled ? void 0 : this.cssVars, {
				maxWidth: this.styleMaxWidth,
				width: require__utils_css_format_length.formatLength(this.width)
			}])
		}, [
			!this.nativeScrollbar ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, (0, vue.mergeProps)({ key: 0 }, this.scrollbarProps, {
				onScroll: this.onScroll,
				ref: "scrollbarInstRef",
				style: this.scrollContainerStyle,
				contentStyle: this.contentStyle,
				contentClass: this.contentClass,
				theme: this.mergedTheme.peers.Scrollbar,
				themeOverrides: this.mergedTheme.peerOverrides.Scrollbar,
				builtinThemeOverrides: this.inverted && this.cssVars.__invertScrollbar === "true" ? {
					colorHover: "rgba(255, 255, 255, .4)",
					color: "rgba(255, 255, 255, .3)"
				} : void 0
			}), require_vdom.normalizeSlots(this.$slots), 1040, [
				"onScroll",
				"style",
				"contentStyle",
				"contentClass",
				"theme",
				"themeOverrides",
				"builtinThemeOverrides"
			])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 1,
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-layout-sider-scroll-container`, this.contentClass]),
				onScroll: this.handleNativeElScroll,
				style: (0, vue.normalizeStyle)([
					this.scrollContainerStyle,
					{ overflow: "auto" },
					this.contentStyle
				]),
				ref: "scrollableElRef"
			}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 46, ["onScroll"])),
			showTrigger ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [showTrigger === "bar" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_layout_src_ToggleBar, {
				key: 0,
				clsPrefix: mergedClsPrefix,
				class: require_vdom.normalizeClass(mergedCollapsed ? this.collapsedTriggerClass : this.triggerClass),
				style: (0, vue.normalizeStyle)(mergedCollapsed ? this.collapsedTriggerStyle : this.triggerStyle),
				onClick: this.handleTriggerClick
			}, null, 8, [
				"clsPrefix",
				"class",
				"style",
				"onClick"
			])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_layout_src_ToggleButton, {
				key: 1,
				clsPrefix: mergedClsPrefix,
				class: require_vdom.normalizeClass(mergedCollapsed ? this.collapsedTriggerClass : this.triggerClass),
				style: (0, vue.normalizeStyle)(mergedCollapsed ? this.collapsedTriggerStyle : this.triggerStyle),
				onClick: this.handleTriggerClick
			}, null, 8, [
				"clsPrefix",
				"class",
				"style",
				"onClick"
			]))], 64)) : require_vdom.normalizeVNode(() => null),
			this.bordered ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 4,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-layout-sider__border`)
			}, null, 2)) : require_vdom.normalizeVNode(() => null)
		], 46, _hoisted_1);
	}
});
//#endregion
exports.default = LayoutSider_default;
exports.layoutSiderProps = layoutSiderProps;
