Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_flatten = require("../../_utils/vue/flatten.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_tabs_styles_light = require("../styles/light.js");
const require_tabs_src_interface = require("./interface.js");
const require_tabs_src_Tab = require("./Tab.js");
const require_tabs_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_tabs_src_TabsButton = require("./TabsButton.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
//#region src/tabs/src/Tabs.tsx
const throttle = require("lodash").throttle;
const tabsProps = {
	...require__mixins_use_theme.default.props,
	value: [String, Number],
	defaultValue: [String, Number],
	trigger: {
		type: String,
		default: "click"
	},
	type: {
		type: String,
		default: "bar"
	},
	closable: Boolean,
	justifyContent: String,
	size: String,
	placement: {
		type: String,
		default: "top"
	},
	tabStyle: [String, Object],
	tabClass: String,
	addTabStyle: [String, Object],
	addTabClass: String,
	barWidth: Number,
	paneClass: String,
	paneStyle: [String, Object],
	paneWrapperClass: String,
	paneWrapperStyle: [String, Object],
	addable: [Boolean, Object],
	tabsPadding: {
		type: Number,
		default: 0
	},
	animated: Boolean,
	onBeforeLeave: Function,
	onAdd: Function,
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	onClose: [Function, Array],
	labelSize: String,
	activeName: [String, Number],
	onActiveNameChange: [Function, Array],
	showScrollButton: Boolean,
	centerActiveTab: Boolean
};
var Tabs_default = (0, vue.defineComponent)({
	name: "Tabs",
	props: tabsProps,
	slots: Object,
	setup(props, { slots }) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.labelSize !== void 0) require__utils_naive_warn.warnOnce("tabs", "`label-size` is deprecated, please use `size` instead.");
			if (props.activeName !== void 0) require__utils_naive_warn.warnOnce("tabs", "`active-name` is deprecated, please use `value` instead.");
			if (props.onActiveNameChange !== void 0) require__utils_naive_warn.warnOnce("tabs", "`on-active-name-change` is deprecated, please use `on-update:value` instead.");
		});
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedComponentPropsRef, mergedRtlRef } = require__mixins_use_config.default(props);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Tabs", mergedRtlRef, mergedClsPrefixRef);
		const mergedPlacementRef = (0, vue.computed)(() => {
			const { placement } = props;
			if (placement === "start") return rtlEnabledRef?.value ? "right" : "left";
			if (placement === "end") return rtlEnabledRef?.value ? "left" : "right";
			return placement;
		});
		const themeRef = require__mixins_use_theme.default("Tabs", "-tabs", require_tabs_src_styles_index_cssr, require_tabs_styles_light.default, props, mergedClsPrefixRef);
		const tabsElRef = (0, vue.ref)(null);
		const selfElRef = (0, vue.ref)(null);
		const barElRef = (0, vue.ref)(null);
		const scrollWrapperElRef = (0, vue.ref)(null);
		const addTabInstRef = (0, vue.ref)(null);
		const xScrollInstRef = (0, vue.ref)(null);
		const yScrollElRef = (0, vue.ref)(null);
		const startReachedRef = (0, vue.ref)(true);
		const endReachedRef = (0, vue.ref)(true);
		const compitableSizeRef = (0, vooks.useCompitable)(props, ["labelSize", "size"]);
		const mergedSizeRef = (0, vue.computed)(() => {
			if (compitableSizeRef.value) return compitableSizeRef.value;
			const configSize = mergedComponentPropsRef?.value?.Tabs?.size;
			if (configSize) return configSize;
			return "medium";
		});
		const compitableValueRef = (0, vooks.useCompitable)(props, ["activeName", "value"]);
		const uncontrolledValueRef = (0, vue.ref)(compitableValueRef.value ?? props.defaultValue ?? (slots.default ? require__utils_vue_flatten.flatten(slots.default())[0]?.props?.name : null));
		const mergedValueRef = (0, vooks.useMergedState)(compitableValueRef, uncontrolledValueRef);
		const tabChangeIdRef = { id: 0 };
		const tabWrapperStyleRef = (0, vue.computed)(() => {
			if (!props.justifyContent || props.type === "card") return void 0;
			return {
				display: "flex",
				justifyContent: props.justifyContent
			};
		});
		(0, vue.watch)(mergedValueRef, () => {
			tabChangeIdRef.id = 0;
			updateCurrentBarStyle();
			(0, vue.nextTick)(() => {
				updateCurrentScrollPosition();
			});
		});
		function getCurrentEl() {
			const { value } = mergedValueRef;
			if (value === null) return null;
			return tabsElRef.value?.querySelector(`[data-name="${value}"]`);
		}
		function updateBarStyle(tabEl) {
			if (props.type === "card") return;
			const { value: barEl } = barElRef;
			if (!barEl) return;
			const barIsHide = barEl.style.opacity === "0";
			if (tabEl) {
				const disabledClassName = `${mergedClsPrefixRef.value}-tabs-bar--disabled`;
				const { barWidth } = props;
				const placement = mergedPlacementRef.value;
				if (tabEl.dataset.disabled === "true") barEl.classList.add(disabledClassName);
				else barEl.classList.remove(disabledClassName);
				if (["top", "bottom"].includes(placement)) {
					clearBarStyle([
						"top",
						"maxHeight",
						"height"
					]);
					if (typeof barWidth === "number" && tabEl.offsetWidth >= barWidth) {
						const offsetDiffLeft = Math.floor((tabEl.offsetWidth - barWidth) / 2) + tabEl.offsetLeft;
						barEl.style.left = `${offsetDiffLeft}px`;
						barEl.style.maxWidth = `${barWidth}px`;
					} else {
						barEl.style.left = `${tabEl.offsetLeft}px`;
						barEl.style.maxWidth = `${tabEl.offsetWidth}px`;
					}
					barEl.style.width = "8192px";
					if (barIsHide) barEl.style.transition = "none";
					barEl.offsetWidth;
					if (barIsHide) {
						barEl.style.transition = "";
						barEl.style.opacity = "1";
					}
				} else {
					clearBarStyle([
						"left",
						"maxWidth",
						"width"
					]);
					if (typeof barWidth === "number" && tabEl.offsetHeight >= barWidth) {
						const offsetDiffTop = Math.floor((tabEl.offsetHeight - barWidth) / 2) + tabEl.offsetTop;
						barEl.style.top = `${offsetDiffTop}px`;
						barEl.style.maxHeight = `${barWidth}px`;
					} else {
						barEl.style.top = `${tabEl.offsetTop}px`;
						barEl.style.maxHeight = `${tabEl.offsetHeight}px`;
					}
					barEl.style.height = "8192px";
					if (barIsHide) barEl.style.transition = "none";
					barEl.offsetHeight;
					if (barIsHide) {
						barEl.style.transition = "";
						barEl.style.opacity = "1";
					}
				}
			}
		}
		function hideBarStyle() {
			if (props.type === "card") return;
			const { value: barEl } = barElRef;
			if (!barEl) return;
			barEl.style.opacity = "0";
		}
		function clearBarStyle(styleProps) {
			const { value: barEl } = barElRef;
			if (!barEl) return;
			for (const prop of styleProps) barEl.style[prop] = "";
		}
		function updateCurrentBarStyle() {
			if (props.type === "card") return;
			const tabEl = getCurrentEl();
			if (tabEl) updateBarStyle(tabEl);
			else hideBarStyle();
		}
		function scrollToElement(scrollContainer, targetElement, isHorizontal, centerActiveTab) {
			const containerRect = scrollContainer.getBoundingClientRect();
			const targetRect = targetElement.getBoundingClientRect();
			const start = isHorizontal ? "left" : "top";
			const end = isHorizontal ? "right" : "bottom";
			let delta = 0;
			if (centerActiveTab) delta = (targetRect[start] + targetRect[end]) / 2 - (containerRect[start] + containerRect[end]) / 2;
			else if (targetRect[start] < containerRect[start]) delta = targetRect[start] - containerRect[start];
			else if (targetRect[end] > containerRect[end]) delta = targetRect[end] - containerRect[end];
			if (delta !== 0) scrollContainer.scrollBy({
				[start]: delta,
				behavior: "smooth"
			});
		}
		function updateCurrentScrollPosition() {
			const isHorizontal = ["top", "bottom"].includes(mergedPlacementRef.value);
			const tabEl = getCurrentEl();
			if (!tabEl) return;
			if (isHorizontal) {
				const scrollWrapperEl = xScrollInstRef.value?.$el;
				if (!scrollWrapperEl) return;
				scrollToElement(scrollWrapperEl, tabEl, isHorizontal, props.centerActiveTab);
			} else {
				const { value: yScrollInst } = yScrollElRef;
				if (!yScrollInst) return;
				scrollToElement(yScrollInst, tabEl, isHorizontal, props.centerActiveTab);
			}
		}
		const tabsPaneWrapperRef = (0, vue.ref)(null);
		let fromHeight = 0;
		let hangingTransition = null;
		function onAnimationBeforeLeave(el) {
			const tabsPaneWrapperEl = tabsPaneWrapperRef.value;
			if (tabsPaneWrapperEl) {
				fromHeight = el.getBoundingClientRect().height;
				const fromHeightPx = `${fromHeight}px`;
				const applyFromStyle = () => {
					tabsPaneWrapperEl.style.height = fromHeightPx;
					tabsPaneWrapperEl.style.maxHeight = fromHeightPx;
				};
				if (!hangingTransition) hangingTransition = applyFromStyle;
				else {
					applyFromStyle();
					hangingTransition();
					hangingTransition = null;
				}
			}
		}
		function onAnimationEnter(el) {
			const tabsPaneWrapperEl = tabsPaneWrapperRef.value;
			if (tabsPaneWrapperEl) {
				const targetHeight = el.getBoundingClientRect().height;
				const applyTargetStyle = () => {
					document.body.offsetHeight;
					tabsPaneWrapperEl.style.maxHeight = `${targetHeight}px`;
					tabsPaneWrapperEl.style.height = `${Math.max(fromHeight, targetHeight)}px`;
				};
				if (!hangingTransition) hangingTransition = applyTargetStyle;
				else {
					hangingTransition();
					hangingTransition = null;
					applyTargetStyle();
				}
			}
		}
		function onAnimationAfterEnter() {
			const tabsPaneWrapperEl = tabsPaneWrapperRef.value;
			if (tabsPaneWrapperEl) {
				tabsPaneWrapperEl.style.maxHeight = "";
				tabsPaneWrapperEl.style.height = "";
				const { paneWrapperStyle } = props;
				if (typeof paneWrapperStyle === "string") tabsPaneWrapperEl.style.cssText = paneWrapperStyle;
				else if (paneWrapperStyle) {
					const { maxHeight, height } = paneWrapperStyle;
					if (maxHeight !== void 0) tabsPaneWrapperEl.style.maxHeight = maxHeight;
					if (height !== void 0) tabsPaneWrapperEl.style.height = height;
				}
			}
		}
		const renderNameListRef = { value: [] };
		const animationDirectionRef = (0, vue.ref)("next");
		function activateTab(panelName) {
			const currentValue = mergedValueRef.value;
			let dir = "next";
			for (const name of renderNameListRef.value) {
				if (name === currentValue) break;
				if (name === panelName) {
					dir = "prev";
					break;
				}
			}
			animationDirectionRef.value = dir;
			doUpdateValue(panelName);
		}
		function doUpdateValue(panelName) {
			const { onActiveNameChange, onUpdateValue, "onUpdate:value": _onUpdateValue } = props;
			if (onActiveNameChange) require__utils_vue_call.call(onActiveNameChange, panelName);
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, panelName);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, panelName);
			uncontrolledValueRef.value = panelName;
		}
		function handleClose(panelName) {
			const { onClose } = props;
			if (onClose) require__utils_vue_call.call(onClose, panelName);
		}
		function handleButtonClick(type) {
			if (["top", "bottom"].includes(mergedPlacementRef.value)) {
				const { value: xScrollInst } = xScrollInstRef;
				if (!xScrollInst) return;
				const el = xScrollInst.$el;
				if (!el) return;
				const offsetWidth = el.offsetWidth;
				const rtl = !!rtlEnabledRef?.value;
				const delta = type === "next" ? offsetWidth : -offsetWidth;
				el.scrollBy({
					left: rtl ? -delta : delta,
					behavior: "smooth"
				});
			} else {
				const { value: yScrollInst } = yScrollElRef;
				if (!yScrollInst) return;
				const offsetHeight = yScrollInst.offsetHeight;
				const top = type === "next" ? yScrollInst.scrollTop + offsetHeight : yScrollInst.scrollTop - offsetHeight;
				yScrollInst.scrollTo({
					top,
					left: 0,
					behavior: "smooth"
				});
			}
		}
		let firstTimeUpdatePosition = true;
		function updateBarPositionInstantly() {
			const { value: barEl } = barElRef;
			if (!barEl) return;
			if (firstTimeUpdatePosition) firstTimeUpdatePosition = false;
			const disableTransitionClassName = "transition-disabled";
			barEl.classList.add(disableTransitionClassName);
			updateCurrentBarStyle();
			barEl.classList.remove(disableTransitionClassName);
		}
		const segmentCapsuleElRef = (0, vue.ref)(null);
		function updateSegmentPosition({ transitionDisabled }) {
			const tabsEl = tabsElRef.value;
			if (!tabsEl) return;
			if (transitionDisabled) tabsEl.classList.add("transition-disabled");
			const activeTabEl = getCurrentEl();
			if (activeTabEl && segmentCapsuleElRef.value) {
				segmentCapsuleElRef.value.style.width = `${activeTabEl.offsetWidth}px`;
				segmentCapsuleElRef.value.style.height = `${activeTabEl.offsetHeight}px`;
				segmentCapsuleElRef.value.style.transform = `translate(${activeTabEl.offsetLeft}px, ${activeTabEl.offsetTop}px)`;
				if (transitionDisabled) segmentCapsuleElRef.value.offsetWidth;
			}
			if (transitionDisabled) tabsEl.classList.remove("transition-disabled");
		}
		(0, vue.watch)([mergedValueRef], () => {
			if (props.type === "segment") (0, vue.nextTick)(() => {
				updateSegmentPosition({ transitionDisabled: false });
			});
		});
		(0, vue.onMounted)(() => {
			if (props.type === "segment") updateSegmentPosition({ transitionDisabled: true });
		});
		let memorizedWidth = 0;
		function _handleNavResize(entry) {
			if (entry.contentRect.width === 0 && entry.contentRect.height === 0) return;
			if (memorizedWidth === entry.contentRect.width) return;
			memorizedWidth = entry.contentRect.width;
			const { type } = props;
			if (type === "line" || type === "bar") {
				if (firstTimeUpdatePosition || props.justifyContent?.startsWith("space")) updateBarPositionInstantly();
			}
			if (type !== "segment") deriveScrollShadow(getScrollEl());
		}
		const handleNavResize = throttle(_handleNavResize, 64);
		function updateIndicatorPositionInstantly() {
			const { type } = props;
			if (type === "line" || type === "bar") updateBarPositionInstantly();
			else if (type === "segment") updateSegmentPosition({ transitionDisabled: true });
		}
		(0, vue.watch)([() => props.justifyContent, () => props.size], () => {
			(0, vue.nextTick)(() => {
				if (props.type === "line" || props.type === "bar") updateBarPositionInstantly();
			});
		});
		(0, vue.watch)([mergedPlacementRef, () => rtlEnabledRef?.value], () => {
			(0, vue.nextTick)(() => {
				updateIndicatorPositionInstantly();
				deriveScrollShadow(getScrollEl(), { instantly: true });
			});
		});
		(0, vue.watch)(() => props.type, () => {
			(0, vue.nextTick)(() => {
				const selfEl = selfElRef.value;
				if (!selfEl) return;
				selfEl.classList.add("transition-disabled");
				updateIndicatorPositionInstantly();
				selfEl.offsetWidth;
				selfEl.classList.remove("transition-disabled");
			});
		});
		const addTabFixedRef = (0, vue.ref)(false);
		function _handleTabsResize(entry) {
			const { target, contentRect: { width, height } } = entry;
			const containerWidth = target.parentElement.parentElement.offsetWidth;
			const containerHeight = target.parentElement.parentElement.offsetHeight;
			const placement = mergedPlacementRef.value;
			if (!addTabFixedRef.value) {
				if (placement === "top" || placement === "bottom") {
					if (containerWidth < width) addTabFixedRef.value = true;
				} else if (containerHeight < height) addTabFixedRef.value = true;
			} else {
				const { value: addTabInst } = addTabInstRef;
				if (!addTabInst) return;
				if (placement === "top" || placement === "bottom") {
					if (containerWidth - width > addTabInst.$el.offsetWidth) addTabFixedRef.value = false;
				} else if (containerHeight - height > addTabInst.$el.offsetHeight) addTabFixedRef.value = false;
			}
			deriveScrollShadow(xScrollInstRef.value?.$el || null);
		}
		const handleTabsResize = throttle(_handleTabsResize, 64);
		function handleAdd() {
			const { onAdd } = props;
			if (onAdd) onAdd();
		}
		const isOverflowRef = (0, vue.ref)(false);
		function getScrollEl() {
			const placement = mergedPlacementRef.value;
			return (placement === "top" || placement === "bottom" ? xScrollInstRef.value?.$el : yScrollElRef.value) || null;
		}
		function deriveScrollShadow(el, options = { instantly: false }) {
			if (!el) return;
			const wrapperEl = options.instantly ? scrollWrapperElRef.value : null;
			if (wrapperEl) wrapperEl.classList.add("transition-disabled");
			const SCROLL_POSITION_EPSILON = 1;
			const placement = mergedPlacementRef.value;
			if (placement === "top" || placement === "bottom") {
				const { scrollLeft, scrollWidth, offsetWidth } = el;
				const scrolled = Math.abs(scrollLeft);
				startReachedRef.value = scrolled <= SCROLL_POSITION_EPSILON;
				endReachedRef.value = scrolled + offsetWidth >= scrollWidth - SCROLL_POSITION_EPSILON;
				isOverflowRef.value = offsetWidth < scrollWidth - SCROLL_POSITION_EPSILON;
			} else {
				const { scrollTop, scrollHeight, offsetHeight } = el;
				startReachedRef.value = scrollTop <= SCROLL_POSITION_EPSILON;
				endReachedRef.value = scrollTop + offsetHeight >= scrollHeight - SCROLL_POSITION_EPSILON;
				isOverflowRef.value = offsetHeight < scrollHeight - SCROLL_POSITION_EPSILON;
			}
			if (wrapperEl) {
				wrapperEl.offsetWidth;
				wrapperEl.classList.remove("transition-disabled");
			}
		}
		const handleScroll = throttle((e) => {
			deriveScrollShadow(e.target);
		}, 64);
		(0, vue.provide)(require_tabs_src_interface.tabsInjectionKey, {
			triggerRef: (0, vue.toRef)(props, "trigger"),
			tabStyleRef: (0, vue.toRef)(props, "tabStyle"),
			tabClassRef: (0, vue.toRef)(props, "tabClass"),
			addTabStyleRef: (0, vue.toRef)(props, "addTabStyle"),
			addTabClassRef: (0, vue.toRef)(props, "addTabClass"),
			paneClassRef: (0, vue.toRef)(props, "paneClass"),
			paneStyleRef: (0, vue.toRef)(props, "paneStyle"),
			mergedClsPrefixRef,
			typeRef: (0, vue.toRef)(props, "type"),
			closableRef: (0, vue.toRef)(props, "closable"),
			valueRef: mergedValueRef,
			tabChangeIdRef,
			onBeforeLeaveRef: (0, vue.toRef)(props, "onBeforeLeave"),
			activateTab,
			handleClose,
			handleAdd
		});
		(0, vooks.onFontsReady)(() => {
			updateCurrentBarStyle();
			updateCurrentScrollPosition();
		});
		(0, vue.watchEffect)(() => {
			const { value: el } = scrollWrapperElRef;
			if (!el) return;
			const { value: clsPrefix } = mergedClsPrefixRef;
			const shadowStartClass = `${clsPrefix}-tabs-nav-scroll-wrapper--shadow-start`;
			const shadowEndClass = `${clsPrefix}-tabs-nav-scroll-wrapper--shadow-end`;
			if (startReachedRef.value) el.classList.remove(shadowStartClass);
			else el.classList.add(shadowStartClass);
			if (endReachedRef.value) el.classList.remove(shadowEndClass);
			else el.classList.add(shadowEndClass);
		});
		const exposedMethods = {
			syncBarPosition: () => {
				updateCurrentBarStyle();
			},
			scrollToCurrentTab: () => {
				updateCurrentScrollPosition();
			}
		};
		const handleSegmentResize = () => {
			updateSegmentPosition({ transitionDisabled: true });
		};
		const cssVarsRef = (0, vue.computed)(() => {
			const { value: size } = mergedSizeRef;
			const { type } = props;
			const sizeType = `${size}${{
				card: "Card",
				bar: "Bar",
				line: "Line",
				segment: "Segment"
			}[type]}`;
			const { self: { barColor, closeIconColor, closeIconColorHover, closeIconColorPressed, tabColor, tabBorderColor, paneTextColor, tabFontWeight, tabBorderRadius, tabFontWeightActive, colorSegment, fontWeightStrong, tabColorSegment, closeSize, closeIconSize, closeColorHover, closeColorPressed, closeBorderRadius, [require__utils_cssr_index.createKey("panePadding", size)]: panePadding, [require__utils_cssr_index.createKey("tabPadding", sizeType)]: tabPadding, [require__utils_cssr_index.createKey("tabPaddingVertical", sizeType)]: tabPaddingVertical, [require__utils_cssr_index.createKey("tabGap", sizeType)]: tabGap, [require__utils_cssr_index.createKey("tabGap", `${sizeType}Vertical`)]: tabGapVertical, [require__utils_cssr_index.createKey("tabTextColor", type)]: tabTextColor, [require__utils_cssr_index.createKey("tabTextColorActive", type)]: tabTextColorActive, [require__utils_cssr_index.createKey("tabTextColorHover", type)]: tabTextColorHover, [require__utils_cssr_index.createKey("tabTextColorDisabled", type)]: tabTextColorDisabled, [require__utils_cssr_index.createKey("tabFontSize", size)]: tabFontSize }, common: { cubicBezierEaseInOut } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-color-segment": colorSegment,
				"--n-bar-color": barColor,
				"--n-tab-font-size": tabFontSize,
				"--n-tab-text-color": tabTextColor,
				"--n-tab-text-color-active": tabTextColorActive,
				"--n-tab-text-color-disabled": tabTextColorDisabled,
				"--n-tab-text-color-hover": tabTextColorHover,
				"--n-pane-text-color": paneTextColor,
				"--n-tab-border-color": tabBorderColor,
				"--n-tab-border-radius": tabBorderRadius,
				"--n-close-size": closeSize,
				"--n-close-icon-size": closeIconSize,
				"--n-close-color-hover": closeColorHover,
				"--n-close-color-pressed": closeColorPressed,
				"--n-close-border-radius": closeBorderRadius,
				"--n-close-icon-color": closeIconColor,
				"--n-close-icon-color-hover": closeIconColorHover,
				"--n-close-icon-color-pressed": closeIconColorPressed,
				"--n-tab-color": tabColor,
				"--n-tab-font-weight": tabFontWeight,
				"--n-tab-font-weight-active": tabFontWeightActive,
				"--n-tab-padding": tabPadding,
				"--n-tab-padding-vertical": tabPaddingVertical,
				"--n-tab-gap": tabGap,
				"--n-tab-gap-vertical": tabGapVertical,
				"--n-pane-padding-left": (0, seemly.getPadding)(panePadding, "left"),
				"--n-pane-padding-right": (0, seemly.getPadding)(panePadding, "right"),
				"--n-pane-padding-top": (0, seemly.getPadding)(panePadding, "top"),
				"--n-pane-padding-bottom": (0, seemly.getPadding)(panePadding, "bottom"),
				"--n-font-weight-strong": fontWeightStrong,
				"--n-tab-color-segment": tabColorSegment
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("tabs", (0, vue.computed)(() => {
			return `${mergedSizeRef.value[0]}${props.type[0]}`;
		}), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedValue: mergedValueRef,
			renderedNames: /* @__PURE__ */ new Set(),
			segmentCapsuleElRef,
			tabsPaneWrapperRef,
			tabsElRef,
			selfElRef,
			barElRef,
			addTabInstRef,
			xScrollInstRef,
			scrollWrapperElRef,
			addTabFixed: addTabFixedRef,
			tabWrapperStyle: tabWrapperStyleRef,
			handleNavResize,
			mergedSize: mergedSizeRef,
			handleScroll,
			handleTabsResize,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			animationDirection: animationDirectionRef,
			renderNameListRef,
			yScrollElRef,
			handleSegmentResize,
			onAnimationBeforeLeave,
			onAnimationEnter,
			onAnimationAfterEnter,
			onRender: themeClassHandle?.onRender,
			startReachedRef,
			endReachedRef,
			isOverflow: isOverflowRef,
			handleButtonClick,
			mergedTheme: themeRef,
			rtlEnabled: rtlEnabledRef,
			mergedPlacement: mergedPlacementRef,
			...exposedMethods
		};
	},
	render() {
		const { mergedClsPrefix, type, mergedPlacement: placement, addTabFixed, addable, mergedSize, renderNameListRef, onRender, paneWrapperClass, paneWrapperStyle, startReachedRef, endReachedRef, isOverflow, showScrollButton, handleButtonClick, mergedTheme, rtlEnabled, $slots: { default: defaultSlot, prefix: prefixSlot, suffix: suffixSlot } } = this;
		onRender?.();
		const tabPaneChildren = defaultSlot ? require__utils_vue_flatten.flatten(defaultSlot()).filter((v) => {
			return v.type.__TAB_PANE__ === true;
		}) : [];
		const tabChildren = defaultSlot ? require__utils_vue_flatten.flatten(defaultSlot()).filter((v) => {
			return v.type.__TAB__ === true;
		}) : [];
		const showPane = !tabChildren.length;
		const isCard = type === "card";
		const isSegment = type === "segment";
		const mergedJustifyContent = !isCard && !isSegment && this.justifyContent;
		renderNameListRef.value = [];
		const scrollContent = () => {
			const tabs = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				style: (0, vue.normalizeStyle)(this.tabWrapperStyle),
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-wrapper`)
			}, [
				mergedJustifyContent ? require_vdom.normalizeVNode(() => null) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 1,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-scroll-padding`),
					style: (0, vue.normalizeStyle)(placement === "top" || placement === "bottom" ? { width: `${this.tabsPadding}px` } : { height: `${this.tabsPadding}px` })
				}, null, 6)),
				showPane ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [require_vdom.normalizeVNode(() => tabPaneChildren.map((tabPaneVNode, index) => {
					renderNameListRef.value.push(tabPaneVNode.props.name);
					return justifyTabDynamicProps(((0, vue.openBlock)(), (0, vue.createBlock)(require_tabs_src_Tab.default, (0, vue.mergeProps)(tabPaneVNode.props, {
						internalCreatedByPane: true,
						internalLeftPadded: index !== 0 && (!mergedJustifyContent || mergedJustifyContent === "center" || mergedJustifyContent === "start" || mergedJustifyContent === "end")
					}), require_vdom.normalizeSlots(tabPaneVNode.children ? { default: tabPaneVNode.children.tab } : void 0), 1040, ["internalLeftPadded"])));
				}))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 3 }, [require_vdom.normalizeVNode(() => tabChildren.map((tabVNode, index) => {
					renderNameListRef.value.push(tabVNode.props.name);
					if (index !== 0 && !mergedJustifyContent) return justifyTabDynamicProps(createLeftPaddedTabVNode(tabVNode));
					else return justifyTabDynamicProps(tabVNode);
				}))], 64)),
				!addTabFixed && addable && isCard ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 4 }, [require_vdom.normalizeVNode(() => createAddTag(addable, (showPane ? tabPaneChildren.length : tabChildren.length) !== 0))], 64)) : require_vdom.normalizeVNode(() => null),
				mergedJustifyContent ? require_vdom.normalizeVNode(() => null) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 7,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-scroll-padding`),
					style: (0, vue.normalizeStyle)({ width: `${this.tabsPadding}px` })
				}, null, 6)),
				isCard ? require_vdom.normalizeVNode(() => null) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 9,
					ref: "barElRef",
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-bar`)
				}, null, 2))
			], 6));
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				ref: "tabsElRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-nav-scroll-content`)
			}, [isCard && addable ? ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VResizeObserver, {
				key: 0,
				onResize: this.handleTabsResize
			}, { default: () => tabs }, 1032, ["onResize"])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => tabs)], 64)), isCard ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-pad`)
			}, null, 2)) : require_vdom.normalizeVNode(() => null)], 2);
		};
		const resolvedPlacement = isSegment ? "top" : placement;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "selfElRef",
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-tabs`,
				this.themeClass,
				`${mergedClsPrefix}-tabs--${type}-type`,
				`${mergedClsPrefix}-tabs--${mergedSize}-size`,
				mergedJustifyContent && `${mergedClsPrefix}-tabs--flex`,
				`${mergedClsPrefix}-tabs--${resolvedPlacement}`,
				rtlEnabled && `${mergedClsPrefix}-tabs--rtl`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass([
			`${mergedClsPrefix}-tabs-nav--${type}-type`,
			`${mergedClsPrefix}-tabs-nav--${resolvedPlacement}`,
			`${mergedClsPrefix}-tabs-nav`
		]) }, [
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(prefixSlot, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-nav__prefix`) }, [require_vdom.normalizeVNode(() => children)], 2)))),
			isSegment ? ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VResizeObserver, {
				key: 0,
				onResize: this.handleSegmentResize
			}, { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-rail`),
				ref: "tabsElRef"
			}, [(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-capsule`),
				ref: "segmentCapsuleElRef"
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-wrapper`) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-tab`) }, null, 2)], 2)], 2), showPane ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => tabPaneChildren.map((tabPaneVNode, index) => {
				renderNameListRef.value.push(tabPaneVNode.props.name);
				return (0, vue.openBlock)(), (0, vue.createBlock)(require_tabs_src_Tab.default, (0, vue.mergeProps)(tabPaneVNode.props, {
					internalCreatedByPane: true,
					internalLeftPadded: index !== 0
				}), require_vdom.normalizeSlots(tabPaneVNode.children ? { default: tabPaneVNode.children.tab } : void 0), 1040, ["internalLeftPadded"]);
			}))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => tabChildren.map((tabVNode, index) => {
				renderNameListRef.value.push(tabVNode.props.name);
				if (index === 0) return tabVNode;
				else return createLeftPaddedTabVNode(tabVNode);
			}))], 64))], 2)) }, 1032, ["onResize"])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [
				require_vdom.normalizeVNode(() => showScrollButton && isOverflow && ((0, vue.openBlock)(), (0, vue.createBlock)(require_tabs_src_TabsButton, {
					mergedClsPrefix,
					type: "prev",
					vertical: resolvedPlacement === "left" || resolvedPlacement === "right",
					disabled: startReachedRef,
					rtl: !!rtlEnabled,
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					onClick: handleButtonClick
				}, null, 8, [
					"mergedClsPrefix",
					"vertical",
					"disabled",
					"rtl",
					"theme",
					"themeOverrides",
					"onClick"
				]))),
				((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VResizeObserver, { onResize: this.handleNavResize }, { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-nav-scroll-wrapper`),
					ref: "scrollWrapperElRef"
				}, [["top", "bottom"].includes(resolvedPlacement) ? ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VXScroll, {
					key: 0,
					ref: "xScrollInstRef",
					onScroll: this.handleScroll
				}, { default: scrollContent }, 1032, ["onScroll"])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 1,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-nav-y-scroll`),
					onScroll: this.handleScroll,
					ref: "yScrollElRef"
				}, [require_vdom.normalizeVNode(() => scrollContent())], 42, ["onScroll"]))], 2)) }, 1032, ["onResize"])),
				require_vdom.normalizeVNode(() => showScrollButton && isOverflow && ((0, vue.openBlock)(), (0, vue.createBlock)(require_tabs_src_TabsButton, {
					mergedClsPrefix,
					type: "next",
					vertical: resolvedPlacement === "left" || resolvedPlacement === "right",
					disabled: endReachedRef,
					rtl: !!rtlEnabled,
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					onClick: handleButtonClick
				}, null, 8, [
					"mergedClsPrefix",
					"vertical",
					"disabled",
					"rtl",
					"theme",
					"themeOverrides",
					"onClick"
				])))
			], 64)),
			addTabFixed && addable && isCard ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [require_vdom.normalizeVNode(() => createAddTag(addable, true))], 64)) : require_vdom.normalizeVNode(() => null),
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(suffixSlot, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-tabs-nav__suffix`) }, [require_vdom.normalizeVNode(() => children)], 2))))
		], 2), require_vdom.normalizeVNode(() => showPane && (this.animated && (resolvedPlacement === "top" || resolvedPlacement === "bottom") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 1,
			ref: "tabsPaneWrapperRef",
			style: (0, vue.normalizeStyle)(paneWrapperStyle),
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-tabs-pane-wrapper`, paneWrapperClass])
		}, [require_vdom.normalizeVNode(() => filterMapTabPanes(tabPaneChildren, this.mergedValue, this.renderedNames, this.onAnimationBeforeLeave, this.onAnimationEnter, this.onAnimationAfterEnter, this.animationDirection))], 6)) : filterMapTabPanes(tabPaneChildren, this.mergedValue, this.renderedNames)))], 6);
	}
});
function filterMapTabPanes(tabPaneVNodes, value, renderedNames, onBeforeLeave, onEnter, onAfterEnter, animationDirection) {
	const children = [];
	tabPaneVNodes.forEach((vNode) => {
		const { name, displayDirective, "display-directive": _displayDirective } = vNode.props;
		const matchDisplayDirective = (directive) => displayDirective === directive || _displayDirective === directive;
		const show = value === name;
		if (vNode.key !== void 0) vNode.key = name;
		if (show || matchDisplayDirective("show") || matchDisplayDirective("show:lazy") && renderedNames.has(name)) {
			if (!renderedNames.has(name)) renderedNames.add(name);
			const useVShow = !matchDisplayDirective("if");
			children.push(useVShow ? (0, vue.withDirectives)(vNode, [[vue.vShow, show]]) : vNode);
		}
	});
	if (!animationDirection) return children;
	return (0, vue.openBlock)(), (0, vue.createBlock)(vue.TransitionGroup, {
		name: `${animationDirection}-transition`,
		onBeforeLeave,
		onEnter,
		onAfterEnter
	}, { default: () => children }, 1032, [
		"name",
		"onBeforeLeave",
		"onEnter",
		"onAfterEnter"
	]);
}
function createAddTag(addable, internalLeftPadded) {
	return (0, vue.openBlock)(), (0, vue.createBlock)(require_tabs_src_Tab.default, {
		ref: "addTabInstRef",
		key: "__addable",
		name: "__addable",
		internalCreatedByPane: true,
		internalAddable: true,
		internalLeftPadded,
		disabled: typeof addable === "object" && addable.disabled
	}, null, 8, ["internalLeftPadded", "disabled"]);
}
function createLeftPaddedTabVNode(tabVNode) {
	const modifiedVNode = (0, vue.cloneVNode)(tabVNode);
	if (modifiedVNode.props) modifiedVNode.props.internalLeftPadded = true;
	else modifiedVNode.props = { internalLeftPadded: true };
	return modifiedVNode;
}
function justifyTabDynamicProps(tabVNode) {
	if (Array.isArray(tabVNode.dynamicProps)) {
		if (!tabVNode.dynamicProps.includes("internalLeftPadded")) tabVNode.dynamicProps.push("internalLeftPadded");
	} else tabVNode.dynamicProps = ["internalLeftPadded"];
	return tabVNode;
}
//#endregion
exports.default = Tabs_default;
exports.tabsProps = tabsProps;
