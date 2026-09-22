Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_adjusted_to = require("../../_utils/composable/use-adjusted-to.js");
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_prop = require("../../_utils/naive/prop.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Backward = require("../../_internal/icons/Backward.js");
const require__internal_icons_FastBackward = require("../../_internal/icons/FastBackward.js");
const require__internal_icons_FastForward = require("../../_internal/icons/FastForward.js");
const require__internal_icons_Forward = require("../../_internal/icons/Forward.js");
const require__internal_icons_More = require("../../_internal/icons/More.js");
const require_input_src_Input = require("../../input/src/Input.js");
const require_popselect_src_Popselect = require("../../popselect/src/Popselect.js");
const require_select_src_Select = require("../../select/src/Select.js");
const require_pagination_styles_light = require("../styles/light.js");
const require_pagination_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_pagination_src_utils = require("./utils.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/pagination/src/Pagination.tsx
const _hoisted_1 = [
	"onClick",
	"onMouseenter",
	"onMouseleave"
];
const _hoisted_2 = ["onClick"];
const _hoisted_3 = ["onClick"];
const paginationProps = {
	...require__mixins_use_theme.default.props,
	simple: Boolean,
	page: Number,
	defaultPage: {
		type: Number,
		default: 1
	},
	itemCount: Number,
	pageCount: Number,
	defaultPageCount: {
		type: Number,
		default: 1
	},
	showSizePicker: Boolean,
	pageSize: Number,
	defaultPageSize: Number,
	pageSizes: {
		type: Array,
		default() {
			return [10];
		}
	},
	showQuickJumper: Boolean,
	size: String,
	disabled: Boolean,
	pageSlot: {
		type: Number,
		default: 9
	},
	selectProps: Object,
	prev: Function,
	next: Function,
	goto: Function,
	prefix: Function,
	suffix: Function,
	label: Function,
	displayOrder: {
		type: Array,
		default: [
			"pages",
			"size-picker",
			"quick-jumper"
		]
	},
	to: require__utils_composable_use_adjusted_to.useAdjustedTo.propTo,
	showQuickJumpDropdown: {
		type: Boolean,
		default: true
	},
	scrollbarProps: Object,
	"onUpdate:page": [Function, Array],
	onUpdatePage: [Function, Array],
	"onUpdate:pageSize": [Function, Array],
	onUpdatePageSize: [Function, Array],
	/** @deprecated */
	onPageSizeChange: [Function, Array],
	/** @deprecated */
	onChange: [Function, Array]
};
var Pagination_default = (0, vue.defineComponent)({
	name: "Pagination",
	props: paginationProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.pageCount !== void 0 && props.itemCount !== void 0) require__utils_naive_warn.warn("pagination", "`page-count` and `item-count` should't be specified together. Only `item-count` will take effect.");
			if (props.onPageSizeChange) require__utils_naive_warn.warnOnce("pagination", "`on-page-size-change` is deprecated, please use `on-update:page-size` instead.");
			if (props.onChange) require__utils_naive_warn.warnOnce("pagination", "`on-change` is deprecated, please use `on-update:page` instead.");
		});
		const { mergedComponentPropsRef, mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const mergedSizeRef = (0, vue.computed)(() => {
			return props.size || mergedComponentPropsRef?.value?.Pagination?.size || "medium";
		});
		const themeRef = require__mixins_use_theme.default("Pagination", "-pagination", require_pagination_src_styles_index_cssr, require_pagination_styles_light.default, props, mergedClsPrefixRef);
		const { localeRef } = require__mixins_use_locale("Pagination");
		const selfRef = (0, vue.ref)(null);
		const uncontrolledPageRef = (0, vue.ref)(props.defaultPage);
		const uncontrolledPageSizeRef = (0, vue.ref)(require_pagination_src_utils.getDefaultPageSize(props));
		const mergedPageRef = (0, vooks.useMergedState)((0, vue.toRef)(props, "page"), uncontrolledPageRef);
		const mergedPageSizeRef = (0, vooks.useMergedState)((0, vue.toRef)(props, "pageSize"), uncontrolledPageSizeRef);
		const mergedPageCountRef = (0, vue.computed)(() => {
			const { itemCount } = props;
			if (itemCount !== void 0) return Math.max(1, Math.ceil(itemCount / mergedPageSizeRef.value));
			const { pageCount } = props;
			if (pageCount !== void 0) return Math.max(pageCount, 1);
			return 1;
		});
		const jumperValueRef = (0, vue.ref)("");
		(0, vue.watchEffect)(() => {
			props.simple;
			jumperValueRef.value = String(mergedPageRef.value);
		});
		const fastForwardActiveRef = (0, vue.ref)(false);
		const fastBackwardActiveRef = (0, vue.ref)(false);
		const showFastForwardMenuRef = (0, vue.ref)(false);
		const showFastBackwardMenuRef = (0, vue.ref)(false);
		const handleFastForwardMouseenter = () => {
			if (props.disabled) return;
			fastForwardActiveRef.value = true;
			disableTransitionOneTick();
		};
		const handleFastForwardMouseleave = () => {
			if (props.disabled) return;
			fastForwardActiveRef.value = false;
			disableTransitionOneTick();
		};
		const handleFastBackwardMouseenter = () => {
			fastBackwardActiveRef.value = true;
			disableTransitionOneTick();
		};
		const handleFastBackwardMouseleave = () => {
			fastBackwardActiveRef.value = false;
			disableTransitionOneTick();
		};
		const handleMenuSelect = (value) => {
			doUpdatePage(value);
		};
		const pageItemsInfo = (0, vue.computed)(() => require_pagination_src_utils.createPageItemsInfo(mergedPageRef.value, mergedPageCountRef.value, props.pageSlot, props.showQuickJumpDropdown));
		(0, vue.watchEffect)(() => {
			if (!pageItemsInfo.value.hasFastBackward) {
				fastBackwardActiveRef.value = false;
				showFastBackwardMenuRef.value = false;
			} else if (!pageItemsInfo.value.hasFastForward) {
				fastForwardActiveRef.value = false;
				showFastForwardMenuRef.value = false;
			}
		});
		const pageSizeOptionsRef = (0, vue.computed)(() => {
			const suffix = localeRef.value.selectionSuffix;
			return props.pageSizes.map((size) => {
				if (typeof size === "number") return {
					label: `${size} / ${suffix}`,
					value: size
				};
				else return size;
			});
		});
		const inputSizeRef = (0, vue.computed)(() => {
			return mergedComponentPropsRef?.value?.Pagination?.inputSize || require__utils_naive_prop.smallerSize(mergedSizeRef.value);
		});
		const selectSizeRef = (0, vue.computed)(() => {
			return mergedComponentPropsRef?.value?.Pagination?.selectSize || require__utils_naive_prop.smallerSize(mergedSizeRef.value);
		});
		const startIndexRef = (0, vue.computed)(() => {
			return (mergedPageRef.value - 1) * mergedPageSizeRef.value;
		});
		const endIndexRef = (0, vue.computed)(() => {
			const endIndex = mergedPageRef.value * mergedPageSizeRef.value - 1;
			const { itemCount } = props;
			if (itemCount !== void 0) return endIndex > itemCount - 1 ? itemCount - 1 : endIndex;
			return endIndex;
		});
		const mergedItemCountRef = (0, vue.computed)(() => {
			const { itemCount } = props;
			if (itemCount !== void 0) return itemCount;
			return (props.pageCount || 1) * mergedPageSizeRef.value;
		});
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Pagination", mergedRtlRef, mergedClsPrefixRef);
		function disableTransitionOneTick() {
			(0, vue.nextTick)(() => {
				const { value: selfEl } = selfRef;
				if (!selfEl) return;
				selfEl.classList.add("transition-disabled");
				selfRef.value?.offsetWidth;
				selfEl.classList.remove("transition-disabled");
			});
		}
		function doUpdatePage(page) {
			if (page === mergedPageRef.value) return;
			const { "onUpdate:page": _onUpdatePage, onUpdatePage, onChange, simple } = props;
			if (_onUpdatePage) require__utils_vue_call.call(_onUpdatePage, page);
			if (onUpdatePage) require__utils_vue_call.call(onUpdatePage, page);
			if (onChange) require__utils_vue_call.call(onChange, page);
			uncontrolledPageRef.value = page;
			if (simple) jumperValueRef.value = String(page);
		}
		function doUpdatePageSize(pageSize) {
			if (pageSize === mergedPageSizeRef.value) return;
			const { "onUpdate:pageSize": _onUpdatePageSize, onUpdatePageSize, onPageSizeChange } = props;
			if (_onUpdatePageSize) require__utils_vue_call.call(_onUpdatePageSize, pageSize);
			if (onUpdatePageSize) require__utils_vue_call.call(onUpdatePageSize, pageSize);
			if (onPageSizeChange) require__utils_vue_call.call(onPageSizeChange, pageSize);
			uncontrolledPageSizeRef.value = pageSize;
			if (mergedPageCountRef.value < mergedPageRef.value) doUpdatePage(mergedPageCountRef.value);
		}
		function forward() {
			if (props.disabled) return;
			doUpdatePage(Math.min(mergedPageRef.value + 1, mergedPageCountRef.value));
		}
		function backward() {
			if (props.disabled) return;
			doUpdatePage(Math.max(mergedPageRef.value - 1, 1));
		}
		function fastForward() {
			if (props.disabled) return;
			doUpdatePage(Math.min(pageItemsInfo.value.fastForwardTo, mergedPageCountRef.value));
		}
		function fastBackward() {
			if (props.disabled) return;
			doUpdatePage(Math.max(pageItemsInfo.value.fastBackwardTo, 1));
		}
		function handleSizePickerChange(value) {
			doUpdatePageSize(value);
		}
		function doQuickJump() {
			const page = Number.parseInt(jumperValueRef.value);
			if (Number.isNaN(page)) return;
			doUpdatePage(Math.max(1, Math.min(page, mergedPageCountRef.value)));
			if (!props.simple) jumperValueRef.value = "";
		}
		function handleQuickJumperChange() {
			doQuickJump();
		}
		function handlePageItemClick(pageItem) {
			if (props.disabled) return;
			switch (pageItem.type) {
				case "page":
					doUpdatePage(pageItem.label);
					break;
				case "fast-backward":
					fastBackward();
					break;
				case "fast-forward": fastForward();
			}
		}
		function handleJumperInput(value) {
			jumperValueRef.value = value.replace(/\D+/g, "");
		}
		(0, vue.watchEffect)(() => {
			mergedPageRef.value;
			mergedPageSizeRef.value;
			disableTransitionOneTick();
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const size = mergedSizeRef.value;
			const { self: { buttonBorder, buttonBorderHover, buttonBorderPressed, buttonIconColor, buttonIconColorHover, buttonIconColorPressed, itemTextColor, itemTextColorHover, itemTextColorPressed, itemTextColorActive, itemTextColorDisabled, itemColor, itemColorHover, itemColorPressed, itemColorActive, itemColorActiveHover, itemColorDisabled, itemBorder, itemBorderHover, itemBorderPressed, itemBorderActive, itemBorderDisabled, itemBorderRadius, jumperTextColor, jumperTextColorDisabled, buttonColor, buttonColorHover, buttonColorPressed, [require__utils_cssr_index.createKey("itemPadding", size)]: itemPadding, [require__utils_cssr_index.createKey("itemMargin", size)]: itemMargin, [require__utils_cssr_index.createKey("inputWidth", size)]: inputWidth, [require__utils_cssr_index.createKey("selectWidth", size)]: selectWidth, [require__utils_cssr_index.createKey("inputMargin", size)]: inputMargin, [require__utils_cssr_index.createKey("selectMargin", size)]: selectMargin, [require__utils_cssr_index.createKey("jumperFontSize", size)]: jumperFontSize, [require__utils_cssr_index.createKey("prefixMargin", size)]: prefixMargin, [require__utils_cssr_index.createKey("suffixMargin", size)]: suffixMargin, [require__utils_cssr_index.createKey("itemSize", size)]: itemSize, [require__utils_cssr_index.createKey("buttonIconSize", size)]: buttonIconSize, [require__utils_cssr_index.createKey("itemFontSize", size)]: itemFontSize, [`${require__utils_cssr_index.createKey("itemMargin", size)}Rtl`]: itemMarginRtl, [`${require__utils_cssr_index.createKey("inputMargin", size)}Rtl`]: inputMarginRtl }, common: { cubicBezierEaseInOut } } = themeRef.value;
			return {
				"--n-prefix-margin": prefixMargin,
				"--n-suffix-margin": suffixMargin,
				"--n-item-font-size": itemFontSize,
				"--n-select-width": selectWidth,
				"--n-select-margin": selectMargin,
				"--n-input-width": inputWidth,
				"--n-input-margin": inputMargin,
				"--n-input-margin-rtl": inputMarginRtl,
				"--n-item-size": itemSize,
				"--n-item-text-color": itemTextColor,
				"--n-item-text-color-disabled": itemTextColorDisabled,
				"--n-item-text-color-hover": itemTextColorHover,
				"--n-item-text-color-active": itemTextColorActive,
				"--n-item-text-color-pressed": itemTextColorPressed,
				"--n-item-color": itemColor,
				"--n-item-color-hover": itemColorHover,
				"--n-item-color-disabled": itemColorDisabled,
				"--n-item-color-active": itemColorActive,
				"--n-item-color-active-hover": itemColorActiveHover,
				"--n-item-color-pressed": itemColorPressed,
				"--n-item-border": itemBorder,
				"--n-item-border-hover": itemBorderHover,
				"--n-item-border-disabled": itemBorderDisabled,
				"--n-item-border-active": itemBorderActive,
				"--n-item-border-pressed": itemBorderPressed,
				"--n-item-padding": itemPadding,
				"--n-item-border-radius": itemBorderRadius,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-jumper-font-size": jumperFontSize,
				"--n-jumper-text-color": jumperTextColor,
				"--n-jumper-text-color-disabled": jumperTextColorDisabled,
				"--n-item-margin": itemMargin,
				"--n-item-margin-rtl": itemMarginRtl,
				"--n-button-icon-size": buttonIconSize,
				"--n-button-icon-color": buttonIconColor,
				"--n-button-icon-color-hover": buttonIconColorHover,
				"--n-button-icon-color-pressed": buttonIconColorPressed,
				"--n-button-color-hover": buttonColorHover,
				"--n-button-color": buttonColor,
				"--n-button-color-pressed": buttonColorPressed,
				"--n-button-border": buttonBorder,
				"--n-button-border-hover": buttonBorderHover,
				"--n-button-border-pressed": buttonBorderPressed
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("pagination", (0, vue.computed)(() => {
			let hash = "";
			hash += mergedSizeRef.value[0];
			return hash;
		}), cssVarsRef, props) : void 0;
		return {
			rtlEnabled: rtlEnabledRef,
			mergedClsPrefix: mergedClsPrefixRef,
			locale: localeRef,
			selfRef,
			mergedPage: mergedPageRef,
			pageItems: (0, vue.computed)(() => {
				return pageItemsInfo.value.items;
			}),
			mergedItemCount: mergedItemCountRef,
			jumperValue: jumperValueRef,
			pageSizeOptions: pageSizeOptionsRef,
			mergedPageSize: mergedPageSizeRef,
			inputSize: inputSizeRef,
			selectSize: selectSizeRef,
			mergedTheme: themeRef,
			mergedPageCount: mergedPageCountRef,
			startIndex: startIndexRef,
			endIndex: endIndexRef,
			showFastForwardMenu: showFastForwardMenuRef,
			showFastBackwardMenu: showFastBackwardMenuRef,
			fastForwardActive: fastForwardActiveRef,
			fastBackwardActive: fastBackwardActiveRef,
			handleMenuSelect,
			handleFastForwardMouseenter,
			handleFastForwardMouseleave,
			handleFastBackwardMouseenter,
			handleFastBackwardMouseleave,
			handleJumperInput,
			handleBackwardClick: backward,
			handleForwardClick: forward,
			handlePageItemClick,
			handleSizePickerChange,
			handleQuickJumperChange,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { $slots, mergedClsPrefix, disabled, cssVars, mergedPage, mergedPageCount, pageItems, showSizePicker, showQuickJumper, mergedTheme, locale, inputSize, selectSize, mergedPageSize, pageSizeOptions, jumperValue, simple, prev, next, prefix, suffix, label, goto, handleJumperInput, handleSizePickerChange, handleBackwardClick, handlePageItemClick, handleForwardClick, handleQuickJumperChange, onRender } = this;
		onRender?.();
		const renderPrefix = prefix || $slots.prefix;
		const renderSuffix = suffix || $slots.suffix;
		const renderPrev = prev || $slots.prev;
		const renderNext = next || $slots.next;
		const renderLabel = label || $slots.label;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "selfRef",
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-pagination`,
				this.themeClass,
				this.rtlEnabled && `${mergedClsPrefix}-pagination--rtl`,
				disabled && `${mergedClsPrefix}-pagination--disabled`,
				simple && `${mergedClsPrefix}-pagination--simple`
			]),
			style: (0, vue.normalizeStyle)(cssVars)
		}, [
			renderPrefix ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-pagination-prefix`)
			}, [require_vdom.normalizeVNode(() => renderPrefix({
				page: mergedPage,
				pageSize: mergedPageSize,
				pageCount: mergedPageCount,
				startIndex: this.startIndex,
				endIndex: this.endIndex,
				itemCount: this.mergedItemCount
			}))], 2)) : require_vdom.normalizeVNode(() => null),
			require_vdom.normalizeVNode(() => this.displayOrder.map((part) => {
				switch (part) {
					case "pages": return (() => {
						const _cache = require_vdom.createVNodeCache("9d36e2972681a71c");
						return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: "pages" }, [
							(0, vue.createElementVNode)("div", {
								class: require_vdom.normalizeClass([
									`${mergedClsPrefix}-pagination-item`,
									!renderPrev && `${mergedClsPrefix}-pagination-item--button`,
									(mergedPage <= 1 || mergedPage > mergedPageCount || disabled) && `${mergedClsPrefix}-pagination-item--disabled`
								]),
								onClick: handleBackwardClick
							}, [renderPrev ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderPrev({
								page: mergedPage,
								pageSize: mergedPageSize,
								pageCount: mergedPageCount,
								startIndex: this.startIndex,
								endIndex: this.endIndex,
								itemCount: this.mergedItemCount
							}))], 64)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
								key: 1,
								clsPrefix: mergedClsPrefix
							}, { default: () => this.rtlEnabled ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Forward, { key: 2 })) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Backward, { key: 3 })) }, 1032, ["clsPrefix"]))], 10, _hoisted_2),
							simple ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [
								(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-pagination-quick-jumper`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
									value: jumperValue,
									onUpdateValue: handleJumperInput,
									size: inputSize,
									placeholder: "",
									disabled,
									theme: mergedTheme.peers.Input,
									themeOverrides: mergedTheme.peerOverrides.Input,
									onChange: handleQuickJumperChange
								}, null, 8, [
									"value",
									"onUpdateValue",
									"size",
									"disabled",
									"theme",
									"themeOverrides",
									"onChange"
								]))], 2),
								_cache[0] || (_cache[0] = require_vdom.normalizeVNode("\xA0/", -1)),
								_cache[1] || (_cache[1] = require_vdom.normalizeVNode(" ", -1)),
								require_vdom.normalizeVNode(() => mergedPageCount)
							], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => pageItems.map((pageItem) => {
								let contentNode;
								let onMouseenter;
								let onMouseleave;
								const { type } = pageItem;
								const itemKey = type === "page" ? `page-${pageItem.label}` : type;
								switch (type) {
									case "page":
										const pageNode = pageItem.label;
										if (renderLabel) contentNode = renderLabel({
											type: "page",
											node: pageNode,
											active: pageItem.active
										});
										else contentNode = pageNode;
										break;
									case "fast-forward":
										const fastForwardNode = this.fastForwardActive ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
											key: 6,
											clsPrefix: mergedClsPrefix
										}, { default: () => this.rtlEnabled ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_FastBackward, { key: 7 })) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_FastForward, { key: 8 })) }, 1032, ["clsPrefix"])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
											key: 9,
											clsPrefix: mergedClsPrefix
										}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_More)) }, 1032, ["clsPrefix"]));
										if (renderLabel) contentNode = renderLabel({
											type: "fast-forward",
											node: fastForwardNode,
											active: this.fastForwardActive || this.showFastForwardMenu
										});
										else contentNode = fastForwardNode;
										onMouseenter = this.handleFastForwardMouseenter;
										onMouseleave = this.handleFastForwardMouseleave;
										break;
									case "fast-backward":
										const fastBackwardNode = this.fastBackwardActive ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
											key: 10,
											clsPrefix: mergedClsPrefix
										}, { default: () => this.rtlEnabled ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_FastForward, { key: 11 })) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_FastBackward, { key: 12 })) }, 1032, ["clsPrefix"])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
											key: 13,
											clsPrefix: mergedClsPrefix
										}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_More)) }, 1032, ["clsPrefix"]));
										if (renderLabel) contentNode = renderLabel({
											type: "fast-backward",
											node: fastBackwardNode,
											active: this.fastBackwardActive || this.showFastBackwardMenu
										});
										else contentNode = fastBackwardNode;
										onMouseenter = this.handleFastBackwardMouseenter;
										onMouseleave = this.handleFastBackwardMouseleave;
								}
								const itemNode = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
									key: itemKey,
									class: require_vdom.normalizeClass([
										`${mergedClsPrefix}-pagination-item`,
										pageItem.active && `${mergedClsPrefix}-pagination-item--active`,
										type !== "page" && (type === "fast-backward" && this.showFastBackwardMenu || type === "fast-forward" && this.showFastForwardMenu) && `${mergedClsPrefix}-pagination-item--hover`,
										disabled && `${mergedClsPrefix}-pagination-item--disabled`,
										type === "page" && `${mergedClsPrefix}-pagination-item--clickable`
									]),
									onClick: () => {
										handlePageItemClick(pageItem);
									},
									onMouseenter,
									onMouseleave
								}, [require_vdom.normalizeVNode(() => contentNode)], 42, _hoisted_1));
								if (type === "page" || !pageItem.options) return itemNode;
								return (0, vue.openBlock)(), (0, vue.createBlock)(require_popselect_src_Popselect.default, {
									to: this.to,
									key: itemKey,
									disabled,
									trigger: "hover",
									virtualScroll: true,
									style: { width: "60px" },
									theme: mergedTheme.peers.Popselect,
									themeOverrides: mergedTheme.peerOverrides.Popselect,
									builtinThemeOverrides: { peers: { InternalSelectMenu: { height: "calc(var(--n-option-height) * 4.6)" } } },
									nodeProps: () => ({ style: { justifyContent: "center" } }),
									show: type === "fast-backward" ? this.showFastBackwardMenu : this.showFastForwardMenu,
									onUpdateShow: (value) => {
										if (value) {
											if (type === "fast-backward") this.showFastBackwardMenu = value;
											else this.showFastForwardMenu = value;
										} else {
											this.showFastBackwardMenu = false;
											this.showFastForwardMenu = false;
										}
									},
									options: pageItem.options,
									onUpdateValue: this.handleMenuSelect,
									scrollable: true,
									scrollbarProps: this.scrollbarProps,
									showCheckmark: false
								}, { default: () => itemNode }, 1032, [
									"to",
									"disabled",
									"theme",
									"themeOverrides",
									"show",
									"onUpdateShow",
									"options",
									"onUpdateValue",
									"scrollbarProps"
								]);
							}))], 64)),
							(0, vue.createElementVNode)("div", {
								class: require_vdom.normalizeClass([
									`${mergedClsPrefix}-pagination-item`,
									!renderNext && `${mergedClsPrefix}-pagination-item--button`,
									{ [`${mergedClsPrefix}-pagination-item--disabled`]: mergedPage < 1 || mergedPage >= mergedPageCount || disabled }
								]),
								onClick: handleForwardClick
							}, [renderNext ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderNext({
								page: mergedPage,
								pageSize: mergedPageSize,
								pageCount: mergedPageCount,
								itemCount: this.mergedItemCount,
								startIndex: this.startIndex,
								endIndex: this.endIndex
							}))], 64)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
								key: 1,
								clsPrefix: mergedClsPrefix
							}, { default: () => this.rtlEnabled ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Backward, { key: 4 })) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Forward, { key: 5 })) }, 1032, ["clsPrefix"]))], 10, _hoisted_3)
						], 64);
					})();
					case "size-picker": return !simple && showSizePicker ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_select_src_Select.default, (0, vue.mergeProps)({
						key: 14,
						consistentMenuWidth: false,
						placeholder: "",
						showCheckmark: false,
						to: this.to
					}, this.selectProps, {
						size: selectSize,
						options: pageSizeOptions,
						value: mergedPageSize,
						disabled,
						scrollbarProps: this.scrollbarProps,
						theme: mergedTheme.peers.Select,
						themeOverrides: mergedTheme.peerOverrides.Select,
						onUpdateValue: handleSizePickerChange
					}), null, 16, [
						"to",
						"size",
						"options",
						"value",
						"disabled",
						"scrollbarProps",
						"theme",
						"themeOverrides",
						"onUpdateValue"
					])) : null;
					case "quick-jumper": return !simple && showQuickJumper ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 15,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-pagination-quick-jumper`)
					}, [goto ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => goto())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(this.$slots.goto, () => [locale.goto]))], 64)), ((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
						value: jumperValue,
						onUpdateValue: handleJumperInput,
						size: inputSize,
						placeholder: "",
						disabled,
						theme: mergedTheme.peers.Input,
						themeOverrides: mergedTheme.peerOverrides.Input,
						onChange: handleQuickJumperChange
					}, null, 8, [
						"value",
						"onUpdateValue",
						"size",
						"disabled",
						"theme",
						"themeOverrides",
						"onChange"
					]))], 2)) : null;
					default: return null;
				}
			})),
			renderSuffix ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-pagination-suffix`)
			}, [require_vdom.normalizeVNode(() => renderSuffix({
				page: mergedPage,
				pageSize: mergedPageSize,
				pageCount: mergedPageCount,
				startIndex: this.startIndex,
				endIndex: this.endIndex,
				itemCount: this.mergedItemCount
			}))], 2)) : require_vdom.normalizeVNode(() => null)
		], 6);
	}
});
//#endregion
exports.default = Pagination_default;
exports.paginationProps = paginationProps;
