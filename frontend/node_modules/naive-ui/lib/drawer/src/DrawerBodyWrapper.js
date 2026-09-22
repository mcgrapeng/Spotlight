const require_drawer_src_interface = require("./interface.js");
const require_modal_src_interface = require("../../modal/src/interface.js");
const require_popover_src_interface = require("../../popover/src/interface.js");
const require__utils_composable_use_lock_html_scroll = require("../../_utils/composable/use-lock-html-scroll.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
let vue = require("vue");
let vueuc = require("vueuc");
let vdirs = require("vdirs");
//#region src/drawer/src/DrawerBodyWrapper.tsx
const _hoisted_1 = [
	"onMouseenter",
	"onMouseleave",
	"onMousedown"
];
const _hoisted_2 = {
	key: 1,
	role: "none"
};
var DrawerBodyWrapper_default = (0, vue.defineComponent)({
	name: "NDrawerContent",
	inheritAttrs: false,
	props: {
		blockScroll: Boolean,
		show: {
			type: Boolean,
			default: void 0
		},
		displayDirective: {
			type: String,
			required: true
		},
		placement: {
			type: String,
			required: true
		},
		contentClass: String,
		contentStyle: [Object, String],
		nativeScrollbar: {
			type: Boolean,
			required: true
		},
		scrollbarProps: Object,
		trapFocus: {
			type: Boolean,
			default: true
		},
		autoFocus: {
			type: Boolean,
			default: true
		},
		showMask: {
			type: [Boolean, String],
			required: true
		},
		maxWidth: Number,
		maxHeight: Number,
		minWidth: Number,
		minHeight: Number,
		resizable: Boolean,
		onClickoutside: Function,
		onAfterLeave: Function,
		onAfterEnter: Function,
		onEsc: Function
	},
	setup(props) {
		const displayedRef = (0, vue.ref)(!!props.show);
		const bodyRef = (0, vue.ref)(null);
		const NDrawer = (0, vue.inject)(require_drawer_src_interface.drawerInjectionKey);
		let startPosition = 0;
		let memoizedBodyStyleCursor = "";
		let hoverTimerId = null;
		const isHoverOnResizeTriggerRef = (0, vue.ref)(false);
		const isDraggingRef = (0, vue.ref)(false);
		const isVertical = (0, vue.computed)(() => {
			return props.placement === "top" || props.placement === "bottom";
		});
		const { mergedClsPrefixRef, mergedRtlRef } = require__mixins_use_config.default(props);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Drawer", mergedRtlRef, mergedClsPrefixRef);
		const handleBodyMouseleave = handleBodyMouseup;
		const handleMousedownResizeTrigger = (e) => {
			isDraggingRef.value = true;
			startPosition = isVertical.value ? e.clientY : e.clientX;
			memoizedBodyStyleCursor = document.body.style.cursor;
			document.body.style.cursor = isVertical.value ? "ns-resize" : "ew-resize";
			document.body.addEventListener("mousemove", handleBodyMousemove);
			document.body.addEventListener("mouseleave", handleBodyMouseleave);
			document.body.addEventListener("mouseup", handleBodyMouseup);
		};
		const handleMouseenterResizeTrigger = () => {
			if (hoverTimerId !== null) {
				window.clearTimeout(hoverTimerId);
				hoverTimerId = null;
			}
			if (isDraggingRef.value) isHoverOnResizeTriggerRef.value = true;
			else hoverTimerId = window.setTimeout(() => {
				isHoverOnResizeTriggerRef.value = true;
			}, 300);
		};
		const handleMouseleaveResizeTrigger = () => {
			if (hoverTimerId !== null) {
				window.clearTimeout(hoverTimerId);
				hoverTimerId = null;
			}
			isHoverOnResizeTriggerRef.value = false;
		};
		const { doUpdateHeight, doUpdateWidth } = NDrawer;
		const regulateWidth = (size) => {
			const { maxWidth } = props;
			if (maxWidth && size > maxWidth) return maxWidth;
			const { minWidth } = props;
			if (minWidth && size < minWidth) return minWidth;
			return size;
		};
		const regulateHeight = (size) => {
			const { maxHeight } = props;
			if (maxHeight && size > maxHeight) return maxHeight;
			const { minHeight } = props;
			if (minHeight && size < minHeight) return minHeight;
			return size;
		};
		function handleBodyMousemove(e) {
			if (isDraggingRef.value) {
				if (isVertical.value) {
					let height = bodyRef.value?.offsetHeight || 0;
					const increment = startPosition - e.clientY;
					height += props.placement === "bottom" ? increment : -increment;
					height = regulateHeight(height);
					doUpdateHeight(height);
					startPosition = e.clientY;
				} else {
					let width = bodyRef.value?.offsetWidth || 0;
					const increment = startPosition - e.clientX;
					width += props.placement === "right" ? increment : -increment;
					width = regulateWidth(width);
					doUpdateWidth(width);
					startPosition = e.clientX;
				}
			}
		}
		function handleBodyMouseup() {
			if (isDraggingRef.value) {
				startPosition = 0;
				isDraggingRef.value = false;
				document.body.style.cursor = memoizedBodyStyleCursor;
				document.body.removeEventListener("mousemove", handleBodyMousemove);
				document.body.removeEventListener("mouseup", handleBodyMouseup);
				document.body.removeEventListener("mouseleave", handleBodyMouseleave);
			}
		}
		(0, vue.watchEffect)(() => {
			if (props.show) displayedRef.value = true;
		});
		(0, vue.watch)(() => props.show, (value) => {
			if (!value) handleBodyMouseup();
		});
		(0, vue.onBeforeUnmount)(() => {
			handleBodyMouseup();
		});
		const bodyDirectivesRef = (0, vue.computed)(() => {
			const { show } = props;
			const directives = [[vue.vShow, show]];
			if (!props.showMask) directives.push([
				vdirs.clickoutside,
				props.onClickoutside,
				void 0,
				{ capture: true }
			]);
			return directives;
		});
		function handleAfterLeave() {
			displayedRef.value = false;
			props.onAfterLeave?.();
		}
		require__utils_composable_use_lock_html_scroll.useLockHtmlScroll((0, vue.computed)(() => props.blockScroll && displayedRef.value));
		(0, vue.provide)(require_drawer_src_interface.drawerBodyInjectionKey, bodyRef);
		(0, vue.provide)(require_popover_src_interface.popoverBodyInjectionKey, null);
		(0, vue.provide)(require_modal_src_interface.modalBodyInjectionKey, null);
		return {
			bodyRef,
			rtlEnabled: rtlEnabledRef,
			mergedClsPrefix: NDrawer.mergedClsPrefixRef,
			isMounted: NDrawer.isMountedRef,
			mergedTheme: NDrawer.mergedThemeRef,
			displayed: displayedRef,
			transitionName: (0, vue.computed)(() => {
				return {
					right: "slide-in-from-right-transition",
					left: "slide-in-from-left-transition",
					top: "slide-in-from-top-transition",
					bottom: "slide-in-from-bottom-transition"
				}[props.placement];
			}),
			handleAfterLeave,
			bodyDirectives: bodyDirectivesRef,
			handleMousedownResizeTrigger,
			handleMouseenterResizeTrigger,
			handleMouseleaveResizeTrigger,
			isDragging: isDraggingRef,
			isHoverOnResizeTrigger: isHoverOnResizeTriggerRef
		};
	},
	render() {
		const { $slots, mergedClsPrefix } = this;
		return this.displayDirective === "show" || this.displayed || this.show ? (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_2, [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFocusTrap, {
			disabled: !this.showMask || !this.trapFocus,
			active: this.show,
			autoFocus: this.autoFocus,
			onEsc: this.onEsc
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: this.transitionName,
			appear: this.isMounted,
			onAfterEnter: this.onAfterEnter,
			onAfterLeave: this.handleAfterLeave
		}, { default: () => (0, vue.withDirectives)((0, vue.h)("div", (0, vue.mergeProps)(this.$attrs, {
			role: "dialog",
			ref: "bodyRef",
			"aria-modal": "true",
			class: [
				`${mergedClsPrefix}-drawer`,
				this.rtlEnabled && `${mergedClsPrefix}-drawer--rtl`,
				`${mergedClsPrefix}-drawer--${this.placement}-placement`,
				this.isDragging && `${mergedClsPrefix}-drawer--unselectable`,
				this.nativeScrollbar && `${mergedClsPrefix}-drawer--native-scrollbar`
			]
		}), [this.resizable ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 2,
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-drawer__resize-trigger`, (this.isDragging || this.isHoverOnResizeTrigger) && `${mergedClsPrefix}-drawer__resize-trigger--hover`]),
			onMouseenter: this.handleMouseenterResizeTrigger,
			onMouseleave: this.handleMouseleaveResizeTrigger,
			onMousedown: this.handleMousedownResizeTrigger
		}, null, 42, _hoisted_1)) : null, this.nativeScrollbar ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 3,
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-drawer-content-wrapper`, this.contentClass]),
			style: (0, vue.normalizeStyle)(this.contentStyle),
			role: "none"
		}, [require_vdom.normalizeVNode(() => $slots.default?.())], 6)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, (0, vue.mergeProps)({ key: 4 }, this.scrollbarProps, {
			contentStyle: this.contentStyle,
			contentClass: [`${mergedClsPrefix}-drawer-content-wrapper`, this.contentClass],
			theme: this.mergedTheme.peers.Scrollbar,
			themeOverrides: this.mergedTheme.peerOverrides.Scrollbar
		}), require_vdom.normalizeSlots($slots), 1040, [
			"contentStyle",
			"contentClass",
			"theme",
			"themeOverrides"
		]))]), this.bodyDirectives) }, 1032, [
			"name",
			"appear",
			"onAfterEnter",
			"onAfterLeave"
		])) }, 1032, [
			"disabled",
			"active",
			"autoFocus",
			"onEsc"
		]))])), [[vue.vShow, this.displayDirective === "if" || this.displayed || this.show]]) : null;
	}
});
//#endregion
module.exports = DrawerBodyWrapper_default;
