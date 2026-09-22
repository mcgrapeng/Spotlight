const require__internal_select_menu_src_interface = require("./interface.js");
const require__utils_composable_use_resize = require("../../../_utils/composable/use-resize.js");
const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__utils_vue_resolve_slot = require("../../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../../_mixins/use-theme.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_focus_detector_index = require("../../focus-detector/index.js");
const require__internal_loading_src_Loading = require("../../loading/src/Loading.js");
const require__internal_scrollbar_src_Scrollbar = require("../../scrollbar/src/Scrollbar.js");
const require_empty_src_Empty = require("../../../empty/src/Empty.js");
const require__internal_select_menu_styles_light = require("../styles/light.js");
const require__internal_select_menu_src_SelectGroupHeader = require("./SelectGroupHeader.js");
const require__internal_select_menu_src_SelectOption = require("./SelectOption.js");
const require__internal_select_menu_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vueuc = require("vueuc");
let treemate = require("treemate");
//#region src/_internal/select-menu/src/SelectMenu.tsx
const _hoisted_1 = [
	"tabindex",
	"onFocusin",
	"onFocusout",
	"onKeyup",
	"onKeydown",
	"onMousedown",
	"onMouseenter",
	"onMouseleave"
];
var SelectMenu_default = (0, vue.defineComponent)({
	name: "InternalSelectMenu",
	props: {
		...require__mixins_use_theme.default.props,
		clsPrefix: {
			type: String,
			required: true
		},
		scrollable: {
			type: Boolean,
			default: true
		},
		treeMate: {
			type: Object,
			required: true
		},
		multiple: Boolean,
		size: {
			type: String,
			default: "medium"
		},
		value: {
			type: [
				String,
				Number,
				Array
			],
			default: null
		},
		autoPending: Boolean,
		virtualScroll: {
			type: Boolean,
			default: true
		},
		show: {
			type: Boolean,
			default: true
		},
		labelField: {
			type: String,
			default: "label"
		},
		valueField: {
			type: String,
			default: "value"
		},
		loading: Boolean,
		focusable: Boolean,
		renderLabel: Function,
		renderOption: Function,
		nodeProps: Function,
		showCheckmark: {
			type: Boolean,
			default: true
		},
		onMousedown: Function,
		onScroll: Function,
		onFocus: Function,
		onBlur: Function,
		onKeyup: Function,
		onKeydown: Function,
		onTabOut: Function,
		onMouseenter: Function,
		onMouseleave: Function,
		onResize: Function,
		resetMenuOnOptionsChange: {
			type: Boolean,
			default: true
		},
		inlineThemeDisabled: Boolean,
		scrollbarProps: Object,
		onToggle: Function
	},
	setup(props) {
		const { mergedClsPrefixRef, mergedRtlRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("InternalSelectMenu", mergedRtlRef, mergedClsPrefixRef);
		const themeRef = require__mixins_use_theme.default("InternalSelectMenu", "-internal-select-menu", require__internal_select_menu_src_styles_index_cssr, require__internal_select_menu_styles_light.default, props, (0, vue.toRef)(props, "clsPrefix"));
		const selfRef = (0, vue.ref)(null);
		const virtualListRef = (0, vue.ref)(null);
		const scrollbarRef = (0, vue.ref)(null);
		const flattenedNodesRef = (0, vue.computed)(() => props.treeMate.getFlattenedNodes());
		const fIndexGetterRef = (0, vue.computed)(() => (0, treemate.createIndexGetter)(flattenedNodesRef.value));
		const pendingNodeRef = (0, vue.ref)(null);
		function initPendingNode() {
			const { treeMate } = props;
			let defaultPendingNode = null;
			const { value } = props;
			if (value === null) defaultPendingNode = treeMate.getFirstAvailableNode();
			else {
				if (props.multiple) defaultPendingNode = treeMate.getNode((value || [])[(value || []).length - 1]);
				else defaultPendingNode = treeMate.getNode(value);
				if (!defaultPendingNode || defaultPendingNode.disabled) defaultPendingNode = treeMate.getFirstAvailableNode();
			}
			if (defaultPendingNode) setPendingTmNode(defaultPendingNode);
			else setPendingTmNode(null);
		}
		function clearPendingNodeIfInvalid() {
			const { value: pendingNode } = pendingNodeRef;
			if (pendingNode && !props.treeMate.getNode(pendingNode.key)) pendingNodeRef.value = null;
		}
		let initPendingNodeWatchStopHandle;
		(0, vue.watch)(() => props.show, (show) => {
			if (show) initPendingNodeWatchStopHandle = (0, vue.watch)(() => props.treeMate, () => {
				if (props.resetMenuOnOptionsChange) {
					if (props.autoPending) initPendingNode();
					else clearPendingNodeIfInvalid();
					(0, vue.nextTick)(scrollToPendingNode);
				} else clearPendingNodeIfInvalid();
			}, { immediate: true });
			else initPendingNodeWatchStopHandle?.();
		}, { immediate: true });
		(0, vue.onBeforeUnmount)(() => {
			initPendingNodeWatchStopHandle?.();
		});
		const itemSizeRef = (0, vue.computed)(() => {
			return (0, seemly.depx)(themeRef.value.self[require__utils_cssr_index.createKey("optionHeight", props.size)]);
		});
		const paddingRef = (0, vue.computed)(() => {
			return (0, seemly.getPadding)(themeRef.value.self[require__utils_cssr_index.createKey("padding", props.size)]);
		});
		const valueSetRef = (0, vue.computed)(() => {
			if (props.multiple && Array.isArray(props.value)) return new Set(props.value);
			return /* @__PURE__ */ new Set();
		});
		const emptyRef = (0, vue.computed)(() => {
			const tmNodes = flattenedNodesRef.value;
			return tmNodes && tmNodes.length === 0;
		});
		const mergedRenderEmptyRef = (0, vue.computed)(() => {
			return mergedComponentPropsRef?.value?.Select?.renderEmpty;
		});
		function doToggle(tmNode) {
			const { onToggle } = props;
			if (onToggle) onToggle(tmNode);
		}
		function doScroll(e) {
			const { onScroll } = props;
			if (onScroll) onScroll(e);
		}
		function handleVirtualListScroll(e) {
			scrollbarRef.value?.sync();
			doScroll(e);
		}
		function handleVirtualListResize() {
			scrollbarRef.value?.sync();
		}
		function getPendingTmNode() {
			const { value: pendingTmNode } = pendingNodeRef;
			if (pendingTmNode) return pendingTmNode;
			return null;
		}
		function handleOptionMouseEnter(e, tmNode) {
			if (tmNode.disabled) return;
			setPendingTmNode(tmNode, false);
		}
		function handleOptionClick(e, tmNode) {
			if (tmNode.disabled) return;
			doToggle(tmNode);
		}
		function handleKeyUp(e) {
			if ((0, seemly.happensIn)(e, "action")) return;
			props.onKeyup?.(e);
		}
		function handleKeyDown(e) {
			if ((0, seemly.happensIn)(e, "action")) return;
			props.onKeydown?.(e);
		}
		function handleMouseDown(e) {
			props.onMousedown?.(e);
			if (props.focusable) return;
			e.preventDefault();
		}
		function next() {
			const { value: pendingTmNode } = pendingNodeRef;
			if (pendingTmNode) setPendingTmNode(pendingTmNode.getNext({ loop: true }), true);
		}
		function prev() {
			const { value: pendingTmNode } = pendingNodeRef;
			if (pendingTmNode) setPendingTmNode(pendingTmNode.getPrev({ loop: true }), true);
		}
		function setPendingTmNode(tmNode, doScroll = false) {
			pendingNodeRef.value = tmNode;
			if (doScroll) scrollToPendingNode();
		}
		function scrollToPendingNode() {
			const tmNode = pendingNodeRef.value;
			if (!tmNode) return;
			const fIndex = fIndexGetterRef.value(tmNode.key);
			if (fIndex === null) return;
			if (props.virtualScroll) virtualListRef.value?.scrollTo({ index: fIndex });
			else scrollbarRef.value?.scrollTo({
				index: fIndex,
				elSize: itemSizeRef.value
			});
		}
		function handleFocusin(e) {
			if (selfRef.value?.contains(e.target)) props.onFocus?.(e);
		}
		function handleFocusout(e) {
			if (!selfRef.value?.contains(e.relatedTarget)) props.onBlur?.(e);
		}
		(0, vue.provide)(require__internal_select_menu_src_interface.internalSelectionMenuInjectionKey, {
			handleOptionMouseEnter,
			handleOptionClick,
			valueSetRef,
			pendingTmNodeRef: pendingNodeRef,
			nodePropsRef: (0, vue.toRef)(props, "nodeProps"),
			showCheckmarkRef: (0, vue.toRef)(props, "showCheckmark"),
			multipleRef: (0, vue.toRef)(props, "multiple"),
			valueRef: (0, vue.toRef)(props, "value"),
			renderLabelRef: (0, vue.toRef)(props, "renderLabel"),
			renderOptionRef: (0, vue.toRef)(props, "renderOption"),
			labelFieldRef: (0, vue.toRef)(props, "labelField"),
			valueFieldRef: (0, vue.toRef)(props, "valueField")
		});
		(0, vue.provide)(require__internal_select_menu_src_interface.internalSelectionMenuBodyInjectionKey, selfRef);
		(0, vue.onMounted)(() => {
			const { value } = scrollbarRef;
			if (value) value.sync();
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { size } = props;
			const { common: { cubicBezierEaseInOut }, self: { height, borderRadius, color, groupHeaderTextColor, actionDividerColor, optionTextColorPressed, optionTextColor, optionTextColorDisabled, optionTextColorActive, optionOpacityDisabled, optionCheckColor, actionTextColor, optionColorPending, optionColorActive, loadingColor, loadingSize, optionColorActivePending, [require__utils_cssr_index.createKey("optionFontSize", size)]: fontSize, [require__utils_cssr_index.createKey("optionHeight", size)]: optionHeight, [require__utils_cssr_index.createKey("optionPadding", size)]: optionPadding } } = themeRef.value;
			return {
				"--n-height": height,
				"--n-action-divider-color": actionDividerColor,
				"--n-action-text-color": actionTextColor,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-border-radius": borderRadius,
				"--n-color": color,
				"--n-option-font-size": fontSize,
				"--n-group-header-text-color": groupHeaderTextColor,
				"--n-option-check-color": optionCheckColor,
				"--n-option-color-pending": optionColorPending,
				"--n-option-color-active": optionColorActive,
				"--n-option-color-active-pending": optionColorActivePending,
				"--n-option-height": optionHeight,
				"--n-option-opacity-disabled": optionOpacityDisabled,
				"--n-option-text-color": optionTextColor,
				"--n-option-text-color-active": optionTextColorActive,
				"--n-option-text-color-disabled": optionTextColorDisabled,
				"--n-option-text-color-pressed": optionTextColorPressed,
				"--n-option-padding": optionPadding,
				"--n-option-padding-left": (0, seemly.getPadding)(optionPadding, "left"),
				"--n-option-padding-right": (0, seemly.getPadding)(optionPadding, "right"),
				"--n-loading-color": loadingColor,
				"--n-loading-size": loadingSize
			};
		});
		const { inlineThemeDisabled } = props;
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("internal-select-menu", (0, vue.computed)(() => props.size[0]), cssVarsRef, props) : void 0;
		const exposedProps = {
			selfRef,
			next,
			prev,
			getPendingTmNode
		};
		require__utils_composable_use_resize.useOnResize(selfRef, props.onResize);
		return {
			mergedTheme: themeRef,
			mergedClsPrefix: mergedClsPrefixRef,
			rtlEnabled: rtlEnabledRef,
			virtualListRef,
			scrollbarRef,
			itemSize: itemSizeRef,
			padding: paddingRef,
			flattenedNodes: flattenedNodesRef,
			empty: emptyRef,
			mergedRenderEmpty: mergedRenderEmptyRef,
			virtualListContainer() {
				const { value } = virtualListRef;
				return value?.listElRef;
			},
			virtualListContent() {
				const { value } = virtualListRef;
				return value?.itemsElRef;
			},
			doScroll,
			handleFocusin,
			handleFocusout,
			handleKeyUp,
			handleKeyDown,
			handleMouseDown,
			handleVirtualListResize,
			handleVirtualListScroll,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			...exposedProps
		};
	},
	render() {
		const { $slots, virtualScroll, clsPrefix, mergedTheme, themeClass, onRender } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "selfRef",
			tabindex: this.focusable ? 0 : -1,
			class: require_vdom.normalizeClass([
				`${clsPrefix}-base-select-menu`,
				`${clsPrefix}-base-select-menu--${this.size}-size`,
				this.rtlEnabled && `${clsPrefix}-base-select-menu--rtl`,
				themeClass,
				this.multiple && `${clsPrefix}-base-select-menu--multiple`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars),
			onFocusin: this.handleFocusin,
			onFocusout: this.handleFocusout,
			onKeyup: this.handleKeyUp,
			onKeydown: this.handleKeyDown,
			onMousedown: this.handleMouseDown,
			onMouseenter: this.onMouseenter,
			onMouseleave: this.onMouseleave
		}, [
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.header, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-base-select-menu__header`),
				"data-header": true,
				key: "header"
			}, [require_vdom.normalizeVNode(() => children)], 2)))),
			this.loading ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${clsPrefix}-base-select-menu__loading`)
			}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_loading_src_Loading.default, {
				clsPrefix,
				strokeWidth: 20
			}, null, 8, ["clsPrefix"]))], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [!this.empty ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, (0, vue.mergeProps)({
				key: 0,
				ref: "scrollbarRef",
				theme: mergedTheme.peers.Scrollbar,
				themeOverrides: mergedTheme.peerOverrides.Scrollbar,
				scrollable: this.scrollable,
				container: virtualScroll ? this.virtualListContainer : void 0,
				content: virtualScroll ? this.virtualListContent : void 0,
				onScroll: virtualScroll ? void 0 : this.doScroll
			}, this.scrollbarProps), { default: () => {
				return virtualScroll ? ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VirtualList, {
					key: 1,
					ref: "virtualListRef",
					class: require_vdom.normalizeClass(`${clsPrefix}-virtual-list`),
					items: this.flattenedNodes,
					itemSize: this.itemSize,
					showScrollbar: false,
					paddingTop: this.padding.top,
					paddingBottom: this.padding.bottom,
					onResize: this.handleVirtualListResize,
					onScroll: this.handleVirtualListScroll,
					itemResizable: true
				}, { default: ({ item: tmNode }) => {
					return tmNode.isGroup ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_select_menu_src_SelectGroupHeader, {
						key: tmNode.key,
						clsPrefix,
						tmNode
					}, null, 8, ["clsPrefix", "tmNode"])) : tmNode.ignored ? null : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_select_menu_src_SelectOption, {
						clsPrefix,
						key: tmNode.key,
						tmNode
					}, null, 8, ["clsPrefix", "tmNode"]));
				} }, 1032, [
					"class",
					"items",
					"itemSize",
					"paddingTop",
					"paddingBottom",
					"onResize",
					"onScroll"
				])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 4,
					class: require_vdom.normalizeClass(`${clsPrefix}-base-select-menu-option-wrapper`),
					style: (0, vue.normalizeStyle)({
						paddingTop: this.padding.top,
						paddingBottom: this.padding.bottom
					})
				}, [require_vdom.normalizeVNode(() => this.flattenedNodes.map((tmNode) => tmNode.isGroup ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_select_menu_src_SelectGroupHeader, {
					key: tmNode.key,
					clsPrefix,
					tmNode
				}, null, 8, ["clsPrefix", "tmNode"])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_select_menu_src_SelectOption, {
					clsPrefix,
					key: tmNode.key,
					tmNode
				}, null, 8, ["clsPrefix", "tmNode"]))))], 6));
			} }, 1040, [
				"theme",
				"themeOverrides",
				"scrollable",
				"container",
				"content",
				"onScroll"
			])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 1,
				class: require_vdom.normalizeClass(`${clsPrefix}-base-select-menu__empty`),
				"data-empty": true
			}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots.empty, () => {
				return [this.mergedRenderEmpty?.() || ((0, vue.openBlock)(), (0, vue.createBlock)(require_empty_src_Empty.default, {
					theme: mergedTheme.peers.Empty,
					themeOverrides: mergedTheme.peerOverrides.Empty,
					size: this.size
				}, null, 8, [
					"theme",
					"themeOverrides",
					"size"
				]))];
			}))], 2))], 64)),
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.action, (children) => children && [((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-base-select-menu__action`),
				"data-action": true,
				key: "action"
			}, [require_vdom.normalizeVNode(() => children)], 2)), ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_focus_detector_index, {
				onFocus: this.onTabOut,
				key: "focus-detector"
			}, null, 8, ["onFocus"]))]))
		], 46, _hoisted_1);
	}
});
//#endregion
module.exports = SelectMenu_default;
