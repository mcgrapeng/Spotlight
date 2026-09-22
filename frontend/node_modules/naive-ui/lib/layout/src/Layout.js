Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__utils_composable_use_reactivated = require("../../_utils/composable/use-reactivated.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_layout_styles_light = require("../styles/light.js");
const require_layout_src_interface = require("./interface.js");
const require_layout_src_styles_layout_cssr = require("./styles/layout.cssr.js");
let vue = require("vue");
//#region src/layout/src/Layout.tsx
const layoutProps = {
	embedded: Boolean,
	position: require_layout_src_interface.positionProp,
	nativeScrollbar: {
		type: Boolean,
		default: true
	},
	scrollbarProps: Object,
	onScroll: Function,
	contentClass: String,
	contentStyle: {
		type: [String, Object],
		default: ""
	},
	hasSider: Boolean,
	siderPlacement: {
		type: String,
		default: "left"
	}
};
const layoutInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-layout");
function createLayoutComponent(isContent) {
	return (0, vue.defineComponent)({
		name: isContent ? "LayoutContent" : "Layout",
		props: {
			...require__mixins_use_theme.default.props,
			...layoutProps
		},
		setup(props) {
			const scrollableElRef = (0, vue.ref)(null);
			const scrollbarInstRef = (0, vue.ref)(null);
			const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
			const themeRef = require__mixins_use_theme.default("Layout", "-layout", require_layout_src_styles_layout_cssr, require_layout_styles_light.default, props, mergedClsPrefixRef);
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
			(0, vue.provide)(layoutInjectionKey, props);
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
			const hasSiderStyle = {
				display: "flex",
				flexWrap: "nowrap",
				width: "100%",
				flexDirection: "row"
			};
			const exposedMethods = { scrollTo };
			const cssVarsRef = (0, vue.computed)(() => {
				const { common: { cubicBezierEaseInOut }, self } = themeRef.value;
				return {
					"--n-bezier": cubicBezierEaseInOut,
					"--n-color": props.embedded ? self.colorEmbedded : self.color,
					"--n-text-color": self.textColor
				};
			});
			const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("layout", (0, vue.computed)(() => {
				return props.embedded ? "e" : "";
			}), cssVarsRef, props) : void 0;
			return {
				mergedClsPrefix: mergedClsPrefixRef,
				scrollableElRef,
				scrollbarInstRef,
				hasSiderStyle,
				mergedTheme: themeRef,
				handleNativeElScroll,
				cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
				themeClass: themeClassHandle?.themeClass,
				onRender: themeClassHandle?.onRender,
				...exposedMethods
			};
		},
		render() {
			const { mergedClsPrefix, hasSider } = this;
			this.onRender?.();
			const hasSiderStyle = hasSider ? this.hasSiderStyle : void 0;
			const layoutClass = [
				this.themeClass,
				isContent && `${mergedClsPrefix}-layout-content`,
				`${mergedClsPrefix}-layout`,
				`${mergedClsPrefix}-layout--${this.position}-positioned`
			];
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(layoutClass),
				style: (0, vue.normalizeStyle)(this.cssVars)
			}, [this.nativeScrollbar ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				ref: "scrollableElRef",
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-layout-scroll-container`, this.contentClass]),
				style: (0, vue.normalizeStyle)([this.contentStyle, hasSiderStyle]),
				onScroll: this.handleNativeElScroll
			}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 46, ["onScroll"])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, (0, vue.mergeProps)({ key: 1 }, this.scrollbarProps, {
				onScroll: this.onScroll,
				ref: "scrollbarInstRef",
				theme: this.mergedTheme.peers.Scrollbar,
				themeOverrides: this.mergedTheme.peerOverrides.Scrollbar,
				contentClass: this.contentClass,
				contentStyle: [this.contentStyle, hasSiderStyle]
			}), require_vdom.normalizeSlots(this.$slots), 1040, [
				"onScroll",
				"theme",
				"themeOverrides",
				"contentClass",
				"contentStyle"
			]))], 6);
		}
	});
}
var Layout_default = createLayoutComponent(false);
//#endregion
exports.createLayoutComponent = createLayoutComponent;
exports.default = Layout_default;
exports.layoutInjectionKey = layoutInjectionKey;
exports.layoutProps = layoutProps;
