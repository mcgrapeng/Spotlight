Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_adjusted_to = require("../../_utils/composable/use-adjusted-to.js");
const require__utils_event_index = require("../../_utils/event/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_select_menu_src_SelectMenu = require("../../_internal/select-menu/src/SelectMenu.js");
const require__internal_selection_src_Selection = require("../../_internal/selection/src/Selection.js");
const require_select_src_utils = require("./utils.js");
const require_select_styles_light = require("../styles/light.js");
const require_select_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
let treemate = require("treemate");
let vdirs = require("vdirs");
//#region src/select/src/Select.tsx
const selectProps = {
	...require__mixins_use_theme.default.props,
	to: require__utils_composable_use_adjusted_to.useAdjustedTo.propTo,
	bordered: {
		type: Boolean,
		default: void 0
	},
	clearable: Boolean,
	clearCreatedOptionsOnClear: {
		type: Boolean,
		default: true
	},
	clearFilterAfterSelect: {
		type: Boolean,
		default: true
	},
	options: {
		type: Array,
		default: () => []
	},
	defaultValue: {
		type: [
			String,
			Number,
			Array
		],
		default: null
	},
	keyboard: {
		type: Boolean,
		default: true
	},
	value: [
		String,
		Number,
		Array
	],
	placeholder: String,
	menuProps: Object,
	multiple: Boolean,
	size: String,
	menuSize: { type: String },
	filterable: Boolean,
	disabled: {
		type: Boolean,
		default: void 0
	},
	remote: Boolean,
	loading: Boolean,
	filter: Function,
	placement: {
		type: String,
		default: "bottom-start"
	},
	widthMode: {
		type: String,
		default: "trigger"
	},
	tag: Boolean,
	onCreate: Function,
	fallbackOption: {
		type: [Function, Boolean],
		default: void 0
	},
	show: {
		type: Boolean,
		default: void 0
	},
	showArrow: {
		type: Boolean,
		default: true
	},
	maxTagCount: [Number, String],
	ellipsisTagPopoverProps: Object,
	consistentMenuWidth: {
		type: Boolean,
		default: true
	},
	virtualScroll: {
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
	childrenField: {
		type: String,
		default: "children"
	},
	renderLabel: Function,
	renderOption: Function,
	renderTag: Function,
	"onUpdate:value": [Function, Array],
	inputProps: Object,
	nodeProps: Function,
	ignoreComposition: {
		type: Boolean,
		default: true
	},
	showOnFocus: Boolean,
	onUpdateValue: [Function, Array],
	onBlur: [Function, Array],
	onClear: [Function, Array],
	onFocus: [Function, Array],
	onScroll: [Function, Array],
	onSearch: [Function, Array],
	onUpdateShow: [Function, Array],
	"onUpdate:show": [Function, Array],
	displayDirective: {
		type: String,
		default: "show"
	},
	resetMenuOnOptionsChange: {
		type: Boolean,
		default: true
	},
	status: String,
	showCheckmark: {
		type: Boolean,
		default: true
	},
	scrollbarProps: Object,
	/** deprecated */
	onChange: [Function, Array],
	items: Array
};
var Select_default = (0, vue.defineComponent)({
	name: "Select",
	props: selectProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.items !== void 0) require__utils_naive_warn.warnOnce("select", "`items` is deprecated, please use `options` instead.");
			if (props.onChange !== void 0) require__utils_naive_warn.warnOnce("select", "`on-change` is deprecated, please use `on-update:value` instead.");
		});
		const { mergedClsPrefixRef, mergedBorderedRef, namespaceRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Select", "-select", require_select_src_styles_index_cssr, require_select_styles_light.default, props, mergedClsPrefixRef);
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const controlledValueRef = (0, vue.toRef)(props, "value");
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		const focusedRef = (0, vue.ref)(false);
		const patternRef = (0, vue.ref)("");
		const compitableOptionsRef = (0, vooks.useCompitable)(props, ["items", "options"]);
		const createdOptionsRef = (0, vue.ref)([]);
		const beingCreatedOptionsRef = (0, vue.ref)([]);
		const localOptionsRef = (0, vue.computed)(() => {
			return beingCreatedOptionsRef.value.concat(createdOptionsRef.value).concat(compitableOptionsRef.value);
		});
		const resolvedFilterRef = (0, vue.computed)(() => {
			const { filter } = props;
			if (filter) return filter;
			const { labelField, valueField } = props;
			return (pattern, option) => {
				if (!option) return false;
				const label = option[labelField];
				if (typeof label === "string") return require_select_src_utils.patternMatched(pattern, label);
				const value = option[valueField];
				if (typeof value === "string") return require_select_src_utils.patternMatched(pattern, value);
				if (typeof value === "number") return require_select_src_utils.patternMatched(pattern, String(value));
				return false;
			};
		});
		const filteredOptionsRef = (0, vue.computed)(() => {
			if (props.remote) return compitableOptionsRef.value;
			else {
				const { value: localOptions } = localOptionsRef;
				const { value: pattern } = patternRef;
				if (!pattern.length || !props.filterable) return localOptions;
				else return require_select_src_utils.filterOptions(localOptions, resolvedFilterRef.value, pattern, props.childrenField);
			}
		});
		const treeMateRef = (0, vue.computed)(() => {
			const { valueField, childrenField } = props;
			const options = require_select_src_utils.createTmOptions(valueField, childrenField);
			return (0, treemate.createTreeMate)(filteredOptionsRef.value, options);
		});
		const valOptMapRef = (0, vue.computed)(() => require_select_src_utils.createValOptMap(localOptionsRef.value, props.valueField, props.childrenField));
		const uncontrolledShowRef = (0, vue.ref)(false);
		const mergedShowRef = (0, vooks.useMergedState)((0, vue.toRef)(props, "show"), uncontrolledShowRef);
		const triggerRef = (0, vue.ref)(null);
		const followerRef = (0, vue.ref)(null);
		const menuRef = (0, vue.ref)(null);
		const { localeRef } = require__mixins_use_locale("Select");
		const localizedPlaceholderRef = (0, vue.computed)(() => {
			return props.placeholder ?? localeRef.value.placeholder;
		});
		const emptyArray = [];
		const memoValOptMapRef = (0, vue.ref)(/* @__PURE__ */ new Map());
		const wrappedFallbackOptionRef = (0, vue.computed)(() => {
			const { fallbackOption } = props;
			if (fallbackOption === void 0) {
				const { labelField, valueField } = props;
				return (value) => ({
					[labelField]: String(value),
					[valueField]: value
				});
			}
			if (fallbackOption === false) return false;
			return (value) => {
				return Object.assign(fallbackOption(value), { value });
			};
		});
		function getMergedOptions(values) {
			const remote = props.remote;
			const { value: memoValOptMap } = memoValOptMapRef;
			const { value: valOptMap } = valOptMapRef;
			const { value: wrappedFallbackOption } = wrappedFallbackOptionRef;
			const options = [];
			values.forEach((value) => {
				if (valOptMap.has(value)) options.push(valOptMap.get(value));
				else if (remote && memoValOptMap.has(value)) options.push(memoValOptMap.get(value));
				else if (wrappedFallbackOption) {
					const option = wrappedFallbackOption(value);
					if (option) options.push(option);
				}
			});
			return options;
		}
		const selectedOptionsRef = (0, vue.computed)(() => {
			if (props.multiple) {
				const { value: values } = mergedValueRef;
				if (!Array.isArray(values)) return [];
				return getMergedOptions(values);
			}
			return null;
		});
		const selectedOptionRef = (0, vue.computed)(() => {
			const { value: mergedValue } = mergedValueRef;
			if (!props.multiple && !Array.isArray(mergedValue)) {
				if (mergedValue === null) return null;
				return getMergedOptions([mergedValue])[0] || null;
			}
			return null;
		});
		const formItem = require__mixins_use_form_item.default(props, { mergedSize: (NFormItem) => {
			const { size } = props;
			if (size) return size;
			const { mergedSize: formItemSize } = NFormItem || {};
			if (formItemSize?.value) return formItemSize.value;
			const configSize = mergedComponentPropsRef?.value?.Select?.size;
			if (configSize) return configSize;
			return "medium";
		} });
		const { mergedSizeRef, mergedDisabledRef, mergedStatusRef } = formItem;
		function doUpdateValue(value, option) {
			const { onChange, "onUpdate:value": _onUpdateValue, onUpdateValue } = props;
			const { nTriggerFormChange, nTriggerFormInput } = formItem;
			if (onChange) require__utils_vue_call.call(onChange, value, option);
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value, option);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value, option);
			uncontrolledValueRef.value = value;
			nTriggerFormChange();
			nTriggerFormInput();
		}
		function doBlur(e) {
			const { onBlur } = props;
			const { nTriggerFormBlur } = formItem;
			if (onBlur) require__utils_vue_call.call(onBlur, e);
			nTriggerFormBlur();
		}
		function doClear() {
			const { onClear } = props;
			if (onClear) require__utils_vue_call.call(onClear);
		}
		function doFocus(e) {
			const { onFocus, showOnFocus } = props;
			const { nTriggerFormFocus } = formItem;
			if (onFocus) require__utils_vue_call.call(onFocus, e);
			nTriggerFormFocus();
			if (showOnFocus) openMenu();
		}
		function doSearch(value) {
			const { onSearch } = props;
			if (onSearch) require__utils_vue_call.call(onSearch, value);
		}
		function doScroll(e) {
			const { onScroll } = props;
			if (onScroll) require__utils_vue_call.call(onScroll, e);
		}
		function updateMemorizedOptions() {
			const { remote, multiple } = props;
			if (remote) {
				const { value: memoValOptMap } = memoValOptMapRef;
				if (multiple) {
					const { valueField } = props;
					selectedOptionsRef.value?.forEach((option) => {
						memoValOptMap.set(option[valueField], option);
					});
				} else {
					const option = selectedOptionRef.value;
					if (option) memoValOptMap.set(option[props.valueField], option);
				}
			}
		}
		function doUpdateShow(value) {
			const { onUpdateShow, "onUpdate:show": _onUpdateShow } = props;
			if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, value);
			if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, value);
			uncontrolledShowRef.value = value;
		}
		function openMenu() {
			if (!mergedDisabledRef.value) {
				doUpdateShow(true);
				uncontrolledShowRef.value = true;
				if (props.filterable) focusSelectionInput();
			}
		}
		function closeMenu() {
			doUpdateShow(false);
		}
		function handleMenuAfterLeave() {
			patternRef.value = "";
			beingCreatedOptionsRef.value = emptyArray;
		}
		const activeWithoutMenuOpenRef = (0, vue.ref)(false);
		function onTriggerInputFocus() {
			if (props.filterable) activeWithoutMenuOpenRef.value = true;
		}
		function onTriggerInputBlur() {
			if (props.filterable) {
				activeWithoutMenuOpenRef.value = false;
				if (!mergedShowRef.value) handleMenuAfterLeave();
			}
		}
		function handleTriggerClick() {
			if (mergedDisabledRef.value) return;
			if (!mergedShowRef.value) openMenu();
			else if (!props.filterable) closeMenu();
			else focusSelectionInput();
		}
		function handleTriggerBlur(e) {
			if (menuRef.value?.selfRef?.contains(e.relatedTarget)) return;
			focusedRef.value = false;
			doBlur(e);
			closeMenu();
		}
		function handleTriggerFocus(e) {
			doFocus(e);
			focusedRef.value = true;
		}
		function handleMenuFocus() {
			focusedRef.value = true;
		}
		function handleMenuBlur(e) {
			if (triggerRef.value?.$el.contains(e.relatedTarget)) return;
			focusedRef.value = false;
			doBlur(e);
			closeMenu();
		}
		function handleMenuTabOut() {
			triggerRef.value?.focus();
			closeMenu();
		}
		function handleMenuClickOutside(e) {
			if (mergedShowRef.value) {
				if (!triggerRef.value?.$el.contains((0, seemly.getPreciseEventTarget)(e))) closeMenu();
			}
		}
		function createClearedMultipleSelectValue(value) {
			if (!Array.isArray(value)) return [];
			if (wrappedFallbackOptionRef.value) return Array.from(value);
			else {
				const { remote } = props;
				const { value: valOptMap } = valOptMapRef;
				if (remote) {
					const { value: memoValOptMap } = memoValOptMapRef;
					return value.filter((v) => valOptMap.has(v) || memoValOptMap.has(v));
				} else return value.filter((v) => valOptMap.has(v));
			}
		}
		function handleToggleByTmNode(tmNode) {
			handleToggleByOption(tmNode.rawNode);
		}
		function handleToggleByOption(option) {
			if (mergedDisabledRef.value) return;
			const { tag, remote, clearFilterAfterSelect, valueField } = props;
			if (tag && !remote) {
				const { value: beingCreatedOptions } = beingCreatedOptionsRef;
				const beingCreatedOption = beingCreatedOptions[0] || null;
				if (beingCreatedOption) {
					const createdOptions = createdOptionsRef.value;
					if (!createdOptions.length) createdOptionsRef.value = [beingCreatedOption];
					else createdOptions.push(beingCreatedOption);
					beingCreatedOptionsRef.value = emptyArray;
				}
			}
			if (remote) memoValOptMapRef.value.set(option[valueField], option);
			if (props.multiple) {
				const changedValue = createClearedMultipleSelectValue(mergedValueRef.value);
				const index = changedValue.findIndex((value) => value === option[valueField]);
				if (~index) {
					changedValue.splice(index, 1);
					if (tag && !remote) {
						const createdOptionIndex = getCreatedOptionIndex(option[valueField]);
						if (~createdOptionIndex) {
							createdOptionsRef.value.splice(createdOptionIndex, 1);
							if (clearFilterAfterSelect) patternRef.value = "";
						}
					}
				} else {
					changedValue.push(option[valueField]);
					if (clearFilterAfterSelect) patternRef.value = "";
				}
				doUpdateValue(changedValue, getMergedOptions(changedValue));
			} else {
				if (tag && !remote) {
					const createdOptionIndex = getCreatedOptionIndex(option[valueField]);
					if (~createdOptionIndex) createdOptionsRef.value = [createdOptionsRef.value[createdOptionIndex]];
					else createdOptionsRef.value = emptyArray;
				}
				focusSelection();
				closeMenu();
				doUpdateValue(option[valueField], option);
			}
		}
		function getCreatedOptionIndex(optionValue) {
			return createdOptionsRef.value.findIndex((createdOption) => createdOption[props.valueField] === optionValue);
		}
		function handlePatternInput(e) {
			if (!mergedShowRef.value) openMenu();
			const { value } = e.target;
			patternRef.value = value;
			const { tag, remote } = props;
			doSearch(value);
			if (tag && !remote) {
				if (!value) {
					beingCreatedOptionsRef.value = emptyArray;
					return;
				}
				const { onCreate } = props;
				const optionBeingCreated = onCreate ? onCreate(value) : {
					[props.labelField]: value,
					[props.valueField]: value
				};
				const { valueField, labelField } = props;
				if (compitableOptionsRef.value.some((option) => {
					return option[valueField] === optionBeingCreated[valueField] || option[labelField] === optionBeingCreated[labelField];
				}) || createdOptionsRef.value.some((option) => {
					return option[valueField] === optionBeingCreated[valueField] || option[labelField] === optionBeingCreated[labelField];
				})) beingCreatedOptionsRef.value = emptyArray;
				else beingCreatedOptionsRef.value = [optionBeingCreated];
			}
		}
		function handleClear(e) {
			e.stopPropagation();
			const { multiple, tag, remote, clearCreatedOptionsOnClear } = props;
			if (!multiple && props.filterable) closeMenu();
			if (tag && !remote && clearCreatedOptionsOnClear) createdOptionsRef.value = emptyArray;
			doClear();
			if (multiple) doUpdateValue([], []);
			else doUpdateValue(null, null);
		}
		function handleMenuMousedown(e) {
			if (!(0, seemly.happensIn)(e, "action") && !(0, seemly.happensIn)(e, "empty") && !(0, seemly.happensIn)(e, "header")) e.preventDefault();
		}
		function handleMenuScroll(e) {
			doScroll(e);
		}
		function handleKeydown(e) {
			if (!props.keyboard) {
				e.preventDefault();
				return;
			}
			switch (e.key) {
				case " ": if (props.filterable) break;
				else e.preventDefault();
				case "Enter":
					if (!triggerRef.value?.isComposing) {
						if (mergedShowRef.value) {
							const pendingTmNode = menuRef.value?.getPendingTmNode();
							if (pendingTmNode) handleToggleByTmNode(pendingTmNode);
							else if (!props.filterable) {
								closeMenu();
								focusSelection();
							}
						} else {
							openMenu();
							if (props.tag && activeWithoutMenuOpenRef.value) {
								const beingCreatedOption = beingCreatedOptionsRef.value[0];
								if (beingCreatedOption) {
									const optionValue = beingCreatedOption[props.valueField];
									const { value: mergedValue } = mergedValueRef;
									if (props.multiple) {
										if (Array.isArray(mergedValue) && mergedValue.includes(optionValue)) {} else handleToggleByOption(beingCreatedOption);
									} else handleToggleByOption(beingCreatedOption);
								}
							}
						}
					}
					e.preventDefault();
					break;
				case "ArrowUp":
					e.preventDefault();
					if (props.loading) return;
					if (mergedShowRef.value) menuRef.value?.prev();
					break;
				case "ArrowDown":
					e.preventDefault();
					if (props.loading) return;
					if (mergedShowRef.value) menuRef.value?.next();
					else openMenu();
					break;
				case "Escape":
					if (mergedShowRef.value) {
						require__utils_event_index.markEventEffectPerformed(e);
						closeMenu();
					}
					triggerRef.value?.focus();
			}
		}
		function focusSelection() {
			triggerRef.value?.focus();
		}
		function focusSelectionInput() {
			triggerRef.value?.focusInput();
		}
		function handleTriggerOrMenuResize() {
			if (!mergedShowRef.value) return;
			followerRef.value?.syncPosition();
		}
		updateMemorizedOptions();
		(0, vue.watch)((0, vue.toRef)(props, "options"), updateMemorizedOptions);
		const exposedMethods = {
			focus: () => {
				triggerRef.value?.focus();
			},
			focusInput: () => {
				triggerRef.value?.focusInput();
			},
			blur: () => {
				triggerRef.value?.blur();
			},
			blurInput: () => {
				triggerRef.value?.blurInput();
			}
		};
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { menuBoxShadow } } = themeRef.value;
			return { "--n-menu-box-shadow": menuBoxShadow };
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("select", void 0, cssVarsRef, props) : void 0;
		return {
			...exposedMethods,
			mergedStatus: mergedStatusRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedBordered: mergedBorderedRef,
			namespace: namespaceRef,
			treeMate: treeMateRef,
			isMounted: (0, vooks.useIsMounted)(),
			triggerRef,
			menuRef,
			pattern: patternRef,
			uncontrolledShow: uncontrolledShowRef,
			mergedShow: mergedShowRef,
			adjustedTo: require__utils_composable_use_adjusted_to.useAdjustedTo(props),
			uncontrolledValue: uncontrolledValueRef,
			mergedValue: mergedValueRef,
			followerRef,
			localizedPlaceholder: localizedPlaceholderRef,
			selectedOption: selectedOptionRef,
			selectedOptions: selectedOptionsRef,
			mergedSize: mergedSizeRef,
			mergedDisabled: mergedDisabledRef,
			focused: focusedRef,
			activeWithoutMenuOpen: activeWithoutMenuOpenRef,
			inlineThemeDisabled,
			onTriggerInputFocus,
			onTriggerInputBlur,
			handleTriggerOrMenuResize,
			handleMenuFocus,
			handleMenuBlur,
			handleMenuTabOut,
			handleTriggerClick,
			handleToggle: handleToggleByTmNode,
			handleDeleteOption: handleToggleByOption,
			handlePatternInput,
			handleClear,
			handleTriggerBlur,
			handleTriggerFocus,
			handleKeydown,
			handleMenuAfterLeave,
			handleMenuClickOutside,
			handleMenuScroll,
			handleMenuKeydown: handleKeydown,
			handleMenuMousedown,
			mergedTheme: themeRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${this.mergedClsPrefix}-select`) }, [(0, vue.createVNode)(vueuc.VBinder, null, {
			_: 1,
			default: require_vdom.normalizeSlot(() => [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VTarget, null, {
				_: 1,
				default: require_vdom.normalizeSlot(() => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_selection_src_Selection, {
					ref: "triggerRef",
					inlineThemeDisabled: this.inlineThemeDisabled,
					status: this.mergedStatus,
					inputProps: this.inputProps,
					clsPrefix: this.mergedClsPrefix,
					showArrow: this.showArrow,
					maxTagCount: this.maxTagCount,
					ellipsisTagPopoverProps: this.ellipsisTagPopoverProps,
					bordered: this.mergedBordered,
					active: this.activeWithoutMenuOpen || this.mergedShow,
					pattern: this.pattern,
					placeholder: this.localizedPlaceholder,
					selectedOption: this.selectedOption,
					selectedOptions: this.selectedOptions,
					multiple: this.multiple,
					renderTag: this.renderTag,
					renderLabel: this.renderLabel,
					filterable: this.filterable,
					clearable: this.clearable,
					disabled: this.mergedDisabled,
					size: this.mergedSize,
					theme: this.mergedTheme.peers.InternalSelection,
					labelField: this.labelField,
					valueField: this.valueField,
					themeOverrides: this.mergedTheme.peerOverrides.InternalSelection,
					loading: this.loading,
					focused: this.focused,
					onClick: this.handleTriggerClick,
					onDeleteOption: this.handleDeleteOption,
					onPatternInput: this.handlePatternInput,
					onClear: this.handleClear,
					onBlur: this.handleTriggerBlur,
					onFocus: this.handleTriggerFocus,
					onKeydown: this.handleKeydown,
					onPatternBlur: this.onTriggerInputBlur,
					onPatternFocus: this.onTriggerInputFocus,
					onResize: this.handleTriggerOrMenuResize,
					ignoreComposition: this.ignoreComposition
				}, {
					_: 1,
					arrow: require_vdom.normalizeSlot(() => [this.$slots.arrow?.()])
				}, 8, [
					"inlineThemeDisabled",
					"status",
					"inputProps",
					"clsPrefix",
					"showArrow",
					"maxTagCount",
					"ellipsisTagPopoverProps",
					"bordered",
					"active",
					"pattern",
					"placeholder",
					"selectedOption",
					"selectedOptions",
					"multiple",
					"renderTag",
					"renderLabel",
					"filterable",
					"clearable",
					"disabled",
					"size",
					"theme",
					"labelField",
					"valueField",
					"themeOverrides",
					"loading",
					"focused",
					"onClick",
					"onDeleteOption",
					"onPatternInput",
					"onClear",
					"onBlur",
					"onFocus",
					"onKeydown",
					"onPatternBlur",
					"onPatternFocus",
					"onResize",
					"ignoreComposition"
				])))
			})), ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFollower, {
				ref: "followerRef",
				show: this.mergedShow,
				to: this.adjustedTo,
				teleportDisabled: this.adjustedTo === require__utils_composable_use_adjusted_to.useAdjustedTo.tdkey,
				containerClass: this.namespace,
				width: this.consistentMenuWidth ? "target" : void 0,
				minWidth: "target",
				placement: this.placement
			}, {
				_: 1,
				default: require_vdom.normalizeSlot(() => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
					name: "fade-in-scale-up-transition",
					appear: this.isMounted,
					onAfterLeave: this.handleMenuAfterLeave
				}, {
					_: 1,
					default: require_vdom.normalizeSlot(() => {
						if (!(this.mergedShow || this.displayDirective === "show")) return null;
						this.onRender?.();
						return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_select_menu_src_SelectMenu, (0, vue.mergeProps)(this.menuProps, {
							ref: "menuRef",
							onResize: this.handleTriggerOrMenuResize,
							inlineThemeDisabled: this.inlineThemeDisabled,
							virtualScroll: this.consistentMenuWidth && this.virtualScroll,
							class: [
								`${this.mergedClsPrefix}-select-menu`,
								this.themeClass,
								this.menuProps?.class
							],
							clsPrefix: this.mergedClsPrefix,
							focusable: true,
							labelField: this.labelField,
							valueField: this.valueField,
							autoPending: true,
							nodeProps: this.nodeProps,
							theme: this.mergedTheme.peers.InternalSelectMenu,
							themeOverrides: this.mergedTheme.peerOverrides.InternalSelectMenu,
							treeMate: this.treeMate,
							multiple: this.multiple,
							size: this.menuSize,
							renderOption: this.renderOption,
							renderLabel: this.renderLabel,
							value: this.mergedValue,
							style: [this.menuProps?.style, this.cssVars],
							onToggle: this.handleToggle,
							onScroll: this.handleMenuScroll,
							onFocus: this.handleMenuFocus,
							onBlur: this.handleMenuBlur,
							onKeydown: this.handleMenuKeydown,
							onTabOut: this.handleMenuTabOut,
							onMousedown: this.handleMenuMousedown,
							show: this.mergedShow,
							showCheckmark: this.showCheckmark,
							resetMenuOnOptionsChange: this.resetMenuOnOptionsChange,
							scrollbarProps: this.scrollbarProps
						}), {
							_: 1,
							empty: require_vdom.normalizeSlot(() => [this.$slots.empty?.()]),
							header: require_vdom.normalizeSlot(() => [this.$slots.header?.()]),
							action: require_vdom.normalizeSlot(() => [this.$slots.action?.()])
						}, 16, [
							"onResize",
							"inlineThemeDisabled",
							"virtualScroll",
							"class",
							"clsPrefix",
							"labelField",
							"valueField",
							"nodeProps",
							"theme",
							"themeOverrides",
							"treeMate",
							"multiple",
							"size",
							"renderOption",
							"renderLabel",
							"value",
							"style",
							"onToggle",
							"onScroll",
							"onFocus",
							"onBlur",
							"onKeydown",
							"onTabOut",
							"onMousedown",
							"show",
							"showCheckmark",
							"resetMenuOnOptionsChange",
							"scrollbarProps"
						])), this.displayDirective === "show" ? [[vue.vShow, this.mergedShow], [
							vdirs.clickoutside,
							this.handleMenuClickOutside,
							void 0,
							{ capture: true }
						]] : [[
							vdirs.clickoutside,
							this.handleMenuClickOutside,
							void 0,
							{ capture: true }
						]]);
					})
				}, 8, ["appear", "onAfterLeave"])))
			}, 8, [
				"show",
				"to",
				"teleportDisabled",
				"containerClass",
				"width",
				"placement"
			]))])
		})], 2);
	}
});
//#endregion
exports.default = Select_default;
exports.selectProps = selectProps;
