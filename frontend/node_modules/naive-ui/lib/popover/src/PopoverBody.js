Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_drawer_src_interface = require("../../drawer/src/interface.js");
const require_modal_src_interface = require("../../modal/src/interface.js");
const require_popover_src_interface = require("./interface.js");
const require__utils_composable_use_adjusted_to = require("../../_utils/composable/use-adjusted-to.js");
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__utils_env_is_jsdom = require("../../_utils/env/is-jsdom.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_popover_styles_light = require("../styles/light.js");
const require_popover_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vueuc = require("vueuc");
let vdirs = require("vdirs");
//#region src/popover/src/PopoverBody.tsx
const popoverBodyProps = {
	...require__mixins_use_theme.default.props,
	to: require__utils_composable_use_adjusted_to.useAdjustedTo.propTo,
	show: Boolean,
	trigger: String,
	showArrow: Boolean,
	delay: Number,
	duration: Number,
	raw: Boolean,
	arrowPointToCenter: Boolean,
	arrowClass: String,
	arrowStyle: [String, Object],
	arrowWrapperClass: String,
	arrowWrapperStyle: [String, Object],
	displayDirective: String,
	x: Number,
	y: Number,
	flip: Boolean,
	overlap: Boolean,
	placement: String,
	width: [Number, String],
	keepAliveOnHover: Boolean,
	scrollable: Boolean,
	contentClass: String,
	contentStyle: [Object, String],
	headerClass: String,
	headerStyle: [Object, String],
	footerClass: String,
	footerStyle: [Object, String],
	internalDeactivateImmediately: Boolean,
	animated: Boolean,
	onClickoutside: Function,
	internalTrapFocus: Boolean,
	internalOnAfterLeave: Function,
	minWidth: Number,
	maxWidth: Number
};
function renderArrow({ arrowClass, arrowStyle, arrowWrapperClass, arrowWrapperStyle, clsPrefix }) {
	return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
		key: "__popover-arrow__",
		style: (0, vue.normalizeStyle)(arrowWrapperStyle),
		class: require_vdom.normalizeClass([`${clsPrefix}-popover-arrow-wrapper`, arrowWrapperClass])
	}, [(0, vue.createElementVNode)("div", {
		class: require_vdom.normalizeClass([`${clsPrefix}-popover-arrow`, arrowClass]),
		style: (0, vue.normalizeStyle)(arrowStyle)
	}, null, 6)], 6);
}
var PopoverBody_default = (0, vue.defineComponent)({
	name: "PopoverBody",
	inheritAttrs: false,
	props: popoverBodyProps,
	setup(props, { slots, attrs }) {
		const { namespaceRef, mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Popover", "-popover", require_popover_src_styles_index_cssr, require_popover_styles_light.default, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Popover", mergedRtlRef, mergedClsPrefixRef);
		const followerRef = (0, vue.ref)(null);
		const NPopover = (0, vue.inject)("NPopover");
		const bodyRef = (0, vue.ref)(null);
		const followerEnabledRef = (0, vue.ref)(props.show);
		const displayedRef = (0, vue.ref)(false);
		(0, vue.watchEffect)(() => {
			const { show } = props;
			if (show && !require__utils_env_is_jsdom.isJsdom() && !props.internalDeactivateImmediately) displayedRef.value = true;
		});
		const directivesRef = (0, vue.computed)(() => {
			const { trigger, onClickoutside } = props;
			const directives = [];
			const { positionManuallyRef: { value: positionManually } } = NPopover;
			if (!positionManually) {
				if (trigger === "click" && !onClickoutside) directives.push([
					vdirs.clickoutside,
					handleClickOutside,
					void 0,
					{ capture: true }
				]);
				if (trigger === "hover") directives.push([vdirs.mousemoveoutside, handleMouseMoveOutside]);
			}
			if (onClickoutside) directives.push([
				vdirs.clickoutside,
				handleClickOutside,
				void 0,
				{ capture: true }
			]);
			if (props.displayDirective === "show" || props.animated && displayedRef.value) directives.push([vue.vShow, props.show]);
			return directives;
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut, cubicBezierEaseIn, cubicBezierEaseOut }, self: { space, spaceArrow, padding, fontSize, textColor, dividerColor, color, boxShadow, borderRadius, arrowHeight, arrowOffset, arrowOffsetVertical } } = themeRef.value;
			return {
				"--n-box-shadow": boxShadow,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-bezier-ease-in": cubicBezierEaseIn,
				"--n-bezier-ease-out": cubicBezierEaseOut,
				"--n-font-size": fontSize,
				"--n-text-color": textColor,
				"--n-color": color,
				"--n-divider-color": dividerColor,
				"--n-border-radius": borderRadius,
				"--n-arrow-height": arrowHeight,
				"--n-arrow-offset": arrowOffset,
				"--n-arrow-offset-vertical": arrowOffsetVertical,
				"--n-padding": padding,
				"--n-space": space,
				"--n-space-arrow": spaceArrow
			};
		});
		const styleRef = (0, vue.computed)(() => {
			const width = props.width === "trigger" ? void 0 : require__utils_css_format_length.formatLength(props.width);
			const style = [];
			if (width) style.push({ width });
			const { maxWidth, minWidth } = props;
			if (maxWidth) style.push({ maxWidth: require__utils_css_format_length.formatLength(maxWidth) });
			if (minWidth) style.push({ maxWidth: require__utils_css_format_length.formatLength(minWidth) });
			if (!inlineThemeDisabled) style.push(cssVarsRef.value);
			return style;
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("popover", void 0, cssVarsRef, props) : void 0;
		NPopover.setBodyInstance({ syncPosition });
		(0, vue.onBeforeUnmount)(() => {
			NPopover.setBodyInstance(null);
		});
		(0, vue.watch)((0, vue.toRef)(props, "show"), (value) => {
			if (props.animated) return;
			if (value) followerEnabledRef.value = true;
			else followerEnabledRef.value = false;
		});
		function syncPosition() {
			followerRef.value?.syncPosition();
		}
		function handleMouseEnter(e) {
			if (props.trigger === "hover" && props.keepAliveOnHover && props.show) NPopover.handleMouseEnter(e);
		}
		function handleMouseLeave(e) {
			if (props.trigger === "hover" && props.keepAliveOnHover) NPopover.handleMouseLeave(e);
		}
		function handleMouseMoveOutside(e) {
			if (props.trigger === "hover" && !getTriggerElement().contains((0, seemly.getPreciseEventTarget)(e))) NPopover.handleMouseMoveOutside(e);
		}
		function handleClickOutside(e) {
			if (props.trigger === "click" && !getTriggerElement().contains((0, seemly.getPreciseEventTarget)(e)) || props.onClickoutside) NPopover.handleClickOutside(e);
		}
		function getTriggerElement() {
			return NPopover.getTriggerElement();
		}
		(0, vue.provide)(require_popover_src_interface.popoverBodyInjectionKey, bodyRef);
		(0, vue.provide)(require_drawer_src_interface.drawerBodyInjectionKey, null);
		(0, vue.provide)(require_modal_src_interface.modalBodyInjectionKey, null);
		function renderContentNode() {
			themeClassHandle?.onRender();
			if (!(props.displayDirective === "show" || props.show || props.animated && displayedRef.value)) return null;
			let contentNode;
			const renderBody = NPopover.internalRenderBodyRef.value;
			const { value: mergedClsPrefix } = mergedClsPrefixRef;
			if (!renderBody) {
				const { value: extraClass } = NPopover.extraClassRef;
				const { internalTrapFocus } = props;
				const hasHeaderOrFooter = !require__utils_vue_resolve_slot.isSlotEmpty(slots.header) || !require__utils_vue_resolve_slot.isSlotEmpty(slots.footer);
				const renderContentInnerNode = () => {
					const body = hasHeaderOrFooter ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [
						require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(slots.header, (children) => {
							return children ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
								key: 2,
								class: require_vdom.normalizeClass([`${mergedClsPrefix}-popover__header`, props.headerClass]),
								style: (0, vue.normalizeStyle)(props.headerStyle)
							}, [require_vdom.normalizeVNode(() => children)], 6)) : null;
						})),
						require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(slots.default, (children) => {
							return children ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
								key: 3,
								class: require_vdom.normalizeClass([`${mergedClsPrefix}-popover__content`, props.contentClass]),
								style: (0, vue.normalizeStyle)(props.contentStyle)
							}, [require_vdom.normalizeVNode(() => slots.default?.())], 6)) : null;
						})),
						require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(slots.footer, (children) => {
							return children ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
								key: 4,
								class: require_vdom.normalizeClass([`${mergedClsPrefix}-popover__footer`, props.footerClass]),
								style: (0, vue.normalizeStyle)(props.footerStyle)
							}, [require_vdom.normalizeVNode(() => children)], 6)) : null;
						}))
					], 64)) : props.scrollable ? slots.default?.() : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 5,
						class: require_vdom.normalizeClass([`${mergedClsPrefix}-popover__content`, props.contentClass]),
						style: (0, vue.normalizeStyle)(props.contentStyle)
					}, [require_vdom.normalizeVNode(() => slots.default?.())], 6));
					return [props.scrollable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.XScrollbar, {
						key: 6,
						themeOverrides: themeRef.value.peerOverrides.Scrollbar,
						theme: themeRef.value.peers.Scrollbar,
						contentClass: hasHeaderOrFooter ? void 0 : `${mergedClsPrefix}-popover__content ${props.contentClass ?? ""}`,
						contentStyle: hasHeaderOrFooter ? void 0 : props.contentStyle
					}, { default: () => body }, 1032, [
						"themeOverrides",
						"theme",
						"contentClass",
						"contentStyle"
					])) : body, props.showArrow ? renderArrow({
						arrowClass: props.arrowClass,
						arrowStyle: props.arrowStyle,
						arrowWrapperClass: props.arrowWrapperClass,
						arrowWrapperStyle: props.arrowWrapperStyle,
						clsPrefix: mergedClsPrefix
					}) : null];
				};
				contentNode = (0, vue.h)("div", (0, vue.mergeProps)({
					class: [
						`${mergedClsPrefix}-popover`,
						`${mergedClsPrefix}-popover-shared`,
						rtlEnabledRef?.value && `${mergedClsPrefix}-popover--rtl`,
						themeClassHandle?.themeClass.value,
						extraClass.map((v) => `${mergedClsPrefix}-${v}`),
						{
							[`${mergedClsPrefix}-popover--scrollable`]: props.scrollable,
							[`${mergedClsPrefix}-popover--show-header-or-footer`]: hasHeaderOrFooter,
							[`${mergedClsPrefix}-popover--raw`]: props.raw,
							[`${mergedClsPrefix}-popover-shared--overlap`]: props.overlap,
							[`${mergedClsPrefix}-popover-shared--show-arrow`]: props.showArrow,
							[`${mergedClsPrefix}-popover-shared--center-arrow`]: props.arrowPointToCenter
						}
					],
					ref: bodyRef,
					style: styleRef.value,
					onKeydown: NPopover.handleKeydown,
					onMouseenter: handleMouseEnter,
					onMouseleave: handleMouseLeave
				}, attrs), internalTrapFocus ? ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFocusTrap, {
					key: 7,
					active: props.show,
					autoFocus: true
				}, { default: renderContentInnerNode }, 1032, ["active"])) : renderContentInnerNode());
			} else contentNode = renderBody([
				`${mergedClsPrefix}-popover-shared`,
				rtlEnabledRef?.value && `${mergedClsPrefix}-popover--rtl`,
				themeClassHandle?.themeClass.value,
				props.overlap && `${mergedClsPrefix}-popover-shared--overlap`,
				props.showArrow && `${mergedClsPrefix}-popover-shared--show-arrow`,
				props.arrowPointToCenter && `${mergedClsPrefix}-popover-shared--center-arrow`
			], bodyRef, styleRef.value, handleMouseEnter, handleMouseLeave);
			return (0, vue.withDirectives)(contentNode, directivesRef.value);
		}
		return {
			displayed: displayedRef,
			namespace: namespaceRef,
			isMounted: NPopover.isMountedRef,
			zIndex: NPopover.zIndexRef,
			followerRef,
			adjustedTo: require__utils_composable_use_adjusted_to.useAdjustedTo(props),
			followerEnabled: followerEnabledRef,
			renderContentNode
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFollower, {
			ref: "followerRef",
			zIndex: this.zIndex,
			show: this.show,
			enabled: this.followerEnabled,
			to: this.adjustedTo,
			x: this.x,
			y: this.y,
			flip: this.flip,
			placement: this.placement,
			containerClass: this.namespace,
			overlap: this.overlap,
			width: this.width === "trigger" ? "target" : void 0,
			teleportDisabled: this.adjustedTo === require__utils_composable_use_adjusted_to.useAdjustedTo.tdkey
		}, {
			_: 1,
			default: require_vdom.normalizeSlot(() => {
				return this.animated ? ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
					key: 8,
					name: "popover-transition",
					appear: this.isMounted,
					onEnter: () => {
						this.followerEnabled = true;
					},
					onAfterLeave: () => {
						this.internalOnAfterLeave?.();
						this.followerEnabled = false;
						this.displayed = false;
					}
				}, { default: this.renderContentNode }, 1032, [
					"appear",
					"onEnter",
					"onAfterLeave"
				])) : this.renderContentNode();
			})
		}, 8, [
			"zIndex",
			"show",
			"enabled",
			"to",
			"x",
			"y",
			"flip",
			"placement",
			"containerClass",
			"overlap",
			"width",
			"teleportDisabled"
		]);
	}
});
//#endregion
exports.default = PopoverBody_default;
exports.popoverBodyProps = popoverBodyProps;
exports.renderArrow = renderArrow;
