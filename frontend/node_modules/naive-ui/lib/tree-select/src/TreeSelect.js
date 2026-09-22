Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_adjusted_to = require("../../_utils/composable/use-adjusted-to.js");
const require__utils_composable_use_resize = require("../../_utils/composable/use-resize.js");
const require__utils_event_index = require("../../_utils/event/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_focus_detector_index = require("../../_internal/focus-detector/index.js");
const require_empty_src_Empty = require("../../empty/src/Empty.js");
const require__internal_selection_src_Selection = require("../../_internal/selection/src/Selection.js");
const require_tree_select_styles_light = require("../styles/light.js");
const require_tree_select_src_interface = require("./interface.js");
const require_tree_src_utils = require("../../tree/src/utils.js");
const require_tree_src_Tree = require("../../tree/src/Tree.js");
const require_tree_select_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_tree_select_src_utils = require("./utils.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
let treemate = require("treemate");
let vdirs = require("vdirs");
//#region src/tree-select/src/TreeSelect.tsx
const _hoisted_1 = [
	"onMousedown",
	"onKeydown",
	"onFocusin",
	"onFocusout"
];
const treeSelectProps = {
	...require__mixins_use_theme.default.props,
	bordered: {
		type: Boolean,
		default: true
	},
	cascade: Boolean,
	checkable: Boolean,
	clearable: Boolean,
	clearFilterAfterSelect: {
		type: Boolean,
		default: true
	},
	consistentMenuWidth: {
		type: Boolean,
		default: true
	},
	defaultShow: Boolean,
	defaultValue: {
		type: [
			String,
			Number,
			Array
		],
		default: null
	},
	disabled: {
		type: Boolean,
		default: void 0
	},
	filterable: Boolean,
	checkStrategy: {
		type: String,
		default: "all"
	},
	loading: Boolean,
	maxTagCount: [String, Number],
	multiple: Boolean,
	showLine: Boolean,
	showPath: Boolean,
	separator: {
		type: String,
		default: " / "
	},
	options: {
		type: Array,
		default: () => []
	},
	placeholder: String,
	placement: {
		type: String,
		default: "bottom-start"
	},
	show: {
		type: Boolean,
		default: void 0
	},
	size: String,
	value: [
		String,
		Number,
		Array
	],
	to: require__utils_composable_use_adjusted_to.useAdjustedTo.propTo,
	menuProps: Object,
	virtualScroll: {
		type: Boolean,
		default: true
	},
	status: String,
	renderTag: Function,
	ellipsisTagPopoverProps: Object,
	...require_tree_src_Tree.treeSharedProps,
	renderLabel: Function,
	renderPrefix: Function,
	renderSuffix: Function,
	nodeProps: Function,
	watchProps: Array,
	getChildren: Function,
	onBlur: Function,
	onFocus: Function,
	onLoad: Function,
	onUpdateShow: [Function, Array],
	onUpdateValue: [Function, Array],
	"onUpdate:value": [Function, Array],
	"onUpdate:show": [Function, Array],
	/**
	* @deprecated
	*/
	leafOnly: Boolean
};
var TreeSelect_default = (0, vue.defineComponent)({
	name: "TreeSelect",
	props: treeSelectProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.leafOnly) require__utils_naive_warn.warnOnce("tree-select", "`leaf-only` is deprecated, please use `check-strategy=\"child\"` instead.");
		});
		const followerInstRef = (0, vue.ref)(null);
		const triggerInstRef = (0, vue.ref)(null);
		const treeInstRef = (0, vue.ref)(null);
		const menuElRef = (0, vue.ref)(null);
		const { mergedClsPrefixRef, namespaceRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const { localeRef } = require__mixins_use_locale("Select");
		const { mergedSizeRef, mergedDisabledRef, mergedStatusRef, nTriggerFormBlur, nTriggerFormChange, nTriggerFormFocus, nTriggerFormInput } = require__mixins_use_form_item.default(props, { mergedSize: (NFormItem) => {
			const { size } = props;
			if (size) return size;
			const { mergedSize: formItemSize } = NFormItem || {};
			if (formItemSize?.value) return formItemSize.value;
			const configSize = mergedComponentPropsRef?.value?.TreeSelect?.size;
			if (configSize) return configSize;
			return "medium";
		} });
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const controlledValueRef = (0, vue.toRef)(props, "value");
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		const uncontrolledShowRef = (0, vue.ref)(props.defaultShow);
		const controlledShowRef = (0, vue.toRef)(props, "show");
		const mergedShowRef = (0, vooks.useMergedState)(controlledShowRef, uncontrolledShowRef);
		const patternRef = (0, vue.ref)("");
		const mergedFilterRef = (0, vue.computed)(() => {
			const { filter } = props;
			if (filter) return filter;
			const { labelField } = props;
			return (pattern, node) => {
				if (!pattern.length) return true;
				return node[labelField].toLowerCase().includes(pattern.toLowerCase());
			};
		});
		const dataTreeMateRef = (0, vue.computed)(() => (0, treemate.createTreeMate)(props.options, require_tree_src_Tree.createTreeMateOptions(props.keyField, props.childrenField, props.disabledField, void 0)));
		const { value: initMergedValue } = mergedValueRef;
		const pendingNodeKeyRef = (0, vue.ref)(props.checkable ? null : Array.isArray(initMergedValue) && initMergedValue.length ? initMergedValue[initMergedValue.length - 1] : null);
		const mergedCascadeRef = (0, vue.computed)(() => {
			return props.multiple && props.cascade && props.checkable;
		});
		const uncontrolledExpandedKeysRef = (0, vue.ref)(props.defaultExpandAll ? void 0 : props.defaultExpandedKeys || props.expandedKeys);
		const controlledExpandedKeysRef = (0, vue.toRef)(props, "expandedKeys");
		const mergedExpandedKeysRef = (0, vooks.useMergedState)(controlledExpandedKeysRef, uncontrolledExpandedKeysRef);
		const focusedRef = (0, vue.ref)(false);
		const mergedPlaceholderRef = (0, vue.computed)(() => {
			const { placeholder } = props;
			if (placeholder !== void 0) return placeholder;
			return localeRef.value.placeholder;
		});
		const treeCheckedKeysRef = (0, vue.computed)(() => {
			const { value: mergedValue } = mergedValueRef;
			if (props.multiple) {
				if (Array.isArray(mergedValue)) return mergedValue;
				else return [];
			} else if (mergedValue === null || Array.isArray(mergedValue)) return [];
			else return [mergedValue];
		});
		const treeSelectedKeysRef = (0, vue.computed)(() => {
			if (props.checkable) return [];
			return treeCheckedKeysRef.value;
		});
		const selectedOptionRef = (0, vue.computed)(() => {
			const { multiple, showPath, separator, labelField } = props;
			if (multiple) return null;
			const { value: mergedValue } = mergedValueRef;
			if (!Array.isArray(mergedValue) && mergedValue !== null) {
				const { value: treeMate } = dataTreeMateRef;
				const tmNode = treeMate.getNode(mergedValue);
				if (tmNode !== null) return showPath ? require_tree_select_src_utils.treeOption2SelectOptionWithPath(tmNode, treeMate.getPath(mergedValue).treeNodePath, separator, labelField) : require_tree_select_src_utils.treeOption2SelectOption(tmNode, labelField);
			}
			return null;
		});
		const selectedOptionsRef = (0, vue.computed)(() => {
			const { multiple, showPath, separator } = props;
			if (!multiple) return null;
			const { value: mergedValue } = mergedValueRef;
			if (Array.isArray(mergedValue)) {
				const res = [];
				const { value: treeMate } = dataTreeMateRef;
				const { checkedKeys } = treeMate.getCheckedKeys(mergedValue, {
					checkStrategy: props.checkStrategy,
					cascade: mergedCascadeRef.value,
					allowNotLoaded: props.allowCheckingNotLoaded
				});
				const { labelField } = props;
				checkedKeys.forEach((value) => {
					const tmNode = treeMate.getNode(value);
					if (tmNode !== null) res.push(showPath ? require_tree_select_src_utils.treeOption2SelectOptionWithPath(tmNode, treeMate.getPath(value).treeNodePath, separator, labelField) : require_tree_select_src_utils.treeOption2SelectOption(tmNode, labelField));
				});
				return res;
			}
			return [];
		});
		function focusSelection() {
			triggerInstRef.value?.focus();
		}
		function focusSelectionInput() {
			triggerInstRef.value?.focusInput();
		}
		function doUpdateShow(value) {
			const { onUpdateShow, "onUpdate:show": _onUpdateShow } = props;
			if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, value);
			if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, value);
			uncontrolledShowRef.value = value;
		}
		function doUpdateValue(value, option, meta) {
			const { onUpdateValue, "onUpdate:value": _onUpdateValue } = props;
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value, option, meta);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value, option, meta);
			uncontrolledValueRef.value = value;
			nTriggerFormInput();
			nTriggerFormChange();
		}
		function doUpdateIndeterminateKeys(value, option) {
			const { onUpdateIndeterminateKeys, "onUpdate:indeterminateKeys": _onUpdateIndeterminateKeys } = props;
			if (onUpdateIndeterminateKeys) require__utils_vue_call.call(onUpdateIndeterminateKeys, value, option);
			if (_onUpdateIndeterminateKeys) require__utils_vue_call.call(_onUpdateIndeterminateKeys, value, option);
		}
		function doUpdateExpandedKeys(keys, option, meta) {
			const { onUpdateExpandedKeys, "onUpdate:expandedKeys": _onUpdateExpandedKeys } = props;
			if (onUpdateExpandedKeys) require__utils_vue_call.call(onUpdateExpandedKeys, keys, option, meta);
			if (_onUpdateExpandedKeys) require__utils_vue_call.call(_onUpdateExpandedKeys, keys, option, meta);
			uncontrolledExpandedKeysRef.value = keys;
		}
		function doFocus(e) {
			const { onFocus } = props;
			if (onFocus) onFocus(e);
			nTriggerFormFocus();
		}
		function doBlur(e) {
			closeMenu();
			const { onBlur } = props;
			if (onBlur) onBlur(e);
			nTriggerFormBlur();
		}
		function closeMenu() {
			doUpdateShow(false);
		}
		function openMenu() {
			if (!mergedDisabledRef.value) {
				patternRef.value = "";
				doUpdateShow(true);
				if (props.filterable) focusSelectionInput();
			}
		}
		function handleMenuLeave() {
			patternRef.value = "";
		}
		function handleMenuClickoutside(e) {
			if (mergedShowRef.value) {
				if (!triggerInstRef.value?.$el.contains((0, seemly.getPreciseEventTarget)(e))) closeMenu();
			}
		}
		function handleTriggerClick() {
			if (mergedDisabledRef.value) return;
			if (!mergedShowRef.value) openMenu();
			else if (!props.filterable) closeMenu();
		}
		function getOptionsByKeys(keys) {
			const { value: { getNode } } = dataTreeMateRef;
			return keys.map((key) => getNode(key)?.rawNode || null);
		}
		function handleUpdateCheckedKeys(keys, _, meta) {
			const options = getOptionsByKeys(keys);
			const action = meta.action === "check" ? "select" : "unselect";
			const node = meta.node;
			if (props.multiple) {
				doUpdateValue(keys, options, {
					node,
					action
				});
				if (props.filterable) {
					focusSelectionInput();
					if (props.clearFilterAfterSelect) patternRef.value = "";
				}
			} else {
				if (keys.length) doUpdateValue(keys[0], options[0] || null, {
					node,
					action
				});
				else doUpdateValue(null, null, {
					node,
					action
				});
				closeMenu();
				focusSelection();
			}
		}
		function handleUpdateIndeterminateKeys(keys) {
			if (props.checkable) doUpdateIndeterminateKeys(keys, getOptionsByKeys(keys));
		}
		function handleTriggerFocus(e) {
			if (menuElRef.value?.contains(e.relatedTarget)) return;
			focusedRef.value = true;
			doFocus(e);
		}
		function handleTriggerBlur(e) {
			if (menuElRef.value?.contains(e.relatedTarget)) return;
			focusedRef.value = false;
			doBlur(e);
		}
		function handleMenuFocusin(e) {
			if (menuElRef.value?.contains(e.relatedTarget) || triggerInstRef.value?.$el?.contains(e.relatedTarget)) return;
			focusedRef.value = true;
			doFocus(e);
		}
		function handleMenuFocusout(e) {
			if (menuElRef.value?.contains(e.relatedTarget) || triggerInstRef.value?.$el?.contains(e.relatedTarget)) return;
			focusedRef.value = false;
			doBlur(e);
		}
		function handleClear(e) {
			e.stopPropagation();
			const { multiple } = props;
			if (!multiple && props.filterable) closeMenu();
			if (multiple) doUpdateValue([], [], {
				node: null,
				action: "clear"
			});
			else doUpdateValue(null, null, {
				node: null,
				action: "clear"
			});
		}
		function handleDeleteOption(option) {
			const { value: mergedValue } = mergedValueRef;
			if (Array.isArray(mergedValue)) {
				const { value: treeMate } = dataTreeMateRef;
				const { checkedKeys: checkedKeysValue } = treeMate.getCheckedKeys(mergedValue, {
					cascade: mergedCascadeRef.value,
					allowNotLoaded: props.allowCheckingNotLoaded
				});
				const index = checkedKeysValue.findIndex((key) => key === option.value);
				if (~index) {
					const checkedKeyToBeRemoved = checkedKeysValue[index];
					const checkOptionToBeRemoved = getOptionsByKeys([checkedKeyToBeRemoved])[0];
					if (props.checkable) {
						const { checkedKeys } = treeMate.uncheck(option.value, checkedKeysValue, {
							checkStrategy: props.checkStrategy,
							cascade: mergedCascadeRef.value,
							allowNotLoaded: props.allowCheckingNotLoaded
						});
						doUpdateValue(checkedKeys, getOptionsByKeys(checkedKeys), {
							node: checkOptionToBeRemoved,
							action: "delete"
						});
					} else {
						const nextValue = Array.from(checkedKeysValue);
						nextValue.splice(index, 1);
						doUpdateValue(nextValue, getOptionsByKeys(nextValue), {
							node: checkOptionToBeRemoved,
							action: "delete"
						});
					}
				}
			}
		}
		function handlePatternInput(e) {
			const { value } = e.target;
			patternRef.value = value;
		}
		function treeHandleKeydown(e) {
			const { value: treeInst } = treeInstRef;
			if (treeInst) return treeInst.handleKeydown(e);
			return { enterBehavior: null };
		}
		function handleKeydown(e) {
			if (e.key === "Enter") {
				if (mergedShowRef.value) {
					const { enterBehavior } = treeHandleKeydown(e);
					if (!props.multiple) switch (enterBehavior) {
						case "default":
						case "toggleSelect":
							closeMenu();
							focusSelection();
					}
				} else openMenu();
				e.preventDefault();
			} else if (e.key === "Escape") {
				if (mergedShowRef.value) {
					require__utils_event_index.markEventEffectPerformed(e);
					closeMenu();
					focusSelection();
				}
			} else if (mergedShowRef.value) treeHandleKeydown(e);
			else if (e.key === "ArrowDown") openMenu();
		}
		function handleTabOut() {
			closeMenu();
			focusSelection();
		}
		function handleMenuMousedown(e) {
			if (!(0, seemly.happensIn)(e, "action") && !(0, seemly.happensIn)(e, "header")) e.preventDefault();
		}
		const selectionRenderTagRef = (0, vue.computed)(() => {
			const { renderTag } = props;
			if (!renderTag) return void 0;
			return function selectionRenderTag({ option, handleClose }) {
				const { value } = option;
				if (value !== void 0) {
					const treeOption = dataTreeMateRef.value.getNode(value);
					if (treeOption) return renderTag({
						option: treeOption.rawNode,
						handleClose
					});
				}
				return value;
			};
		});
		(0, vue.provide)(require_tree_select_src_interface.treeSelectInjectionKey, {
			pendingNodeKeyRef,
			dataTreeMate: dataTreeMateRef
		});
		function handleTriggerOrMenuResize() {
			if (!mergedShowRef.value) return;
			followerInstRef.value?.syncPosition();
		}
		require__utils_composable_use_resize.useOnResize(menuElRef, handleTriggerOrMenuResize);
		const mergedCheckStrategyRef = require_tree_src_utils.useMergedCheckStrategy(props);
		const exposedCheckedStatusRef = (0, vue.computed)(() => {
			if (props.checkable) {
				const mergedValue = mergedValueRef.value;
				if (props.multiple && Array.isArray(mergedValue)) return dataTreeMateRef.value.getCheckedKeys(mergedValue, {
					cascade: props.cascade,
					checkStrategy: mergedCheckStrategyRef.value,
					allowNotLoaded: props.allowCheckingNotLoaded
				});
				else return {
					checkedKeys: Array.isArray(mergedValue) || mergedValue === null ? [] : [mergedValue],
					indeterminateKeys: []
				};
			}
			return {
				checkedKeys: [],
				indeterminateKeys: []
			};
		});
		const exposedMethods = {
			getCheckedData: () => {
				const { checkedKeys } = exposedCheckedStatusRef.value;
				return {
					keys: checkedKeys,
					options: getOptionsByKeys(checkedKeys)
				};
			},
			getIndeterminateData: () => {
				const { indeterminateKeys } = exposedCheckedStatusRef.value;
				return {
					keys: indeterminateKeys,
					options: getOptionsByKeys(indeterminateKeys)
				};
			},
			focus: () => triggerInstRef.value?.focus(),
			focusInput: () => triggerInstRef.value?.focusInput(),
			blur: () => triggerInstRef.value?.blur(),
			blurInput: () => triggerInstRef.value?.blurInput()
		};
		const themeRef = require__mixins_use_theme.default("TreeSelect", "-tree-select", require_tree_select_src_styles_index_cssr, require_tree_select_styles_light.default, props, mergedClsPrefixRef);
		const mergedRenderEmptyRef = (0, vue.computed)(() => {
			return mergedComponentPropsRef?.value?.TreeSelect?.renderEmpty;
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { menuBoxShadow, menuBorderRadius, menuColor, menuHeight, actionPadding, actionDividerColor, actionTextColor, headerDividerColor, headerPadding, headerTextColor } } = themeRef.value;
			return {
				"--n-menu-box-shadow": menuBoxShadow,
				"--n-menu-border-radius": menuBorderRadius,
				"--n-menu-color": menuColor,
				"--n-menu-height": menuHeight,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-action-padding": actionPadding,
				"--n-action-text-color": actionTextColor,
				"--n-action-divider-color": actionDividerColor,
				"--n-header-padding": headerPadding,
				"--n-header-text-color": headerTextColor,
				"--n-header-divider-color": headerDividerColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("tree-select", void 0, cssVarsRef, props) : void 0;
		const menuPaddingRef = (0, vue.computed)(() => {
			const { self: { menuPadding } } = themeRef.value;
			return menuPadding;
		});
		return {
			...exposedMethods,
			menuElRef,
			mergedStatus: mergedStatusRef,
			triggerInstRef,
			followerInstRef,
			treeInstRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedValue: mergedValueRef,
			mergedShow: mergedShowRef,
			namespace: namespaceRef,
			adjustedTo: require__utils_composable_use_adjusted_to.useAdjustedTo(props),
			isMounted: (0, vooks.useIsMounted)(),
			focused: focusedRef,
			menuPadding: menuPaddingRef,
			mergedPlaceholder: mergedPlaceholderRef,
			mergedExpandedKeys: mergedExpandedKeysRef,
			treeSelectedKeys: treeSelectedKeysRef,
			treeCheckedKeys: treeCheckedKeysRef,
			mergedSize: mergedSizeRef,
			mergedDisabled: mergedDisabledRef,
			selectedOption: selectedOptionRef,
			selectedOptions: selectedOptionsRef,
			pattern: patternRef,
			pendingNodeKey: pendingNodeKeyRef,
			mergedCascade: mergedCascadeRef,
			mergedFilter: mergedFilterRef,
			selectionRenderTag: selectionRenderTagRef,
			handleTriggerOrMenuResize,
			doUpdateExpandedKeys,
			handleMenuLeave,
			handleTriggerClick,
			handleMenuClickoutside,
			handleUpdateCheckedKeys,
			handleUpdateIndeterminateKeys,
			handleTriggerFocus,
			handleTriggerBlur,
			handleMenuFocusin,
			handleMenuFocusout,
			handleClear,
			handleDeleteOption,
			handlePatternInput,
			handleKeydown,
			handleTabOut,
			handleMenuMousedown,
			mergedTheme: themeRef,
			mergedRenderEmpty: mergedRenderEmptyRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedTheme, mergedClsPrefix, $slots } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-tree-select`) }, [(0, vue.createVNode)(vueuc.VBinder, null, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VTarget, null, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_selection_src_Selection, {
			ref: "triggerInstRef",
			onResize: this.handleTriggerOrMenuResize,
			status: this.mergedStatus,
			focused: this.focused,
			clsPrefix: mergedClsPrefix,
			theme: mergedTheme.peers.InternalSelection,
			themeOverrides: mergedTheme.peerOverrides.InternalSelection,
			ellipsisTagPopoverProps: this.ellipsisTagPopoverProps,
			renderTag: this.selectionRenderTag,
			selectedOption: this.selectedOption,
			selectedOptions: this.selectedOptions,
			size: this.mergedSize,
			bordered: this.bordered,
			placeholder: this.mergedPlaceholder,
			disabled: this.mergedDisabled,
			active: this.mergedShow,
			loading: this.loading,
			multiple: this.multiple,
			maxTagCount: this.maxTagCount,
			showArrow: true,
			filterable: this.filterable,
			clearable: this.clearable,
			pattern: this.pattern,
			onPatternInput: this.handlePatternInput,
			onClear: this.handleClear,
			onClick: this.handleTriggerClick,
			onFocus: this.handleTriggerFocus,
			onBlur: this.handleTriggerBlur,
			onDeleteOption: this.handleDeleteOption,
			onKeydown: this.handleKeydown
		}, { arrow: () => [this.$slots.arrow?.()] }, 1032, [
			"onResize",
			"status",
			"focused",
			"clsPrefix",
			"theme",
			"themeOverrides",
			"ellipsisTagPopoverProps",
			"renderTag",
			"selectedOption",
			"selectedOptions",
			"size",
			"bordered",
			"placeholder",
			"disabled",
			"active",
			"loading",
			"multiple",
			"maxTagCount",
			"filterable",
			"clearable",
			"pattern",
			"onPatternInput",
			"onClear",
			"onClick",
			"onFocus",
			"onBlur",
			"onDeleteOption",
			"onKeydown"
		])) }, 1024)), ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFollower, {
			ref: "followerInstRef",
			show: this.mergedShow,
			placement: this.placement,
			to: this.adjustedTo,
			teleportDisabled: this.adjustedTo === require__utils_composable_use_adjusted_to.useAdjustedTo.tdkey,
			containerClass: this.namespace,
			width: this.consistentMenuWidth ? "target" : void 0,
			minWidth: "target"
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "fade-in-scale-up-transition",
			appear: this.isMounted,
			onLeave: this.handleMenuLeave
		}, { default: () => {
			if (!this.mergedShow) return null;
			const { mergedClsPrefix, checkable, multiple, menuProps, options } = this;
			this.onRender?.();
			return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createElementBlock)("div", (0, vue.mergeProps)(menuProps, {
				class: [
					`${mergedClsPrefix}-tree-select-menu`,
					menuProps?.class,
					this.themeClass
				],
				ref: "menuElRef",
				style: [menuProps?.style || "", this.cssVars],
				tabindex: 0,
				onMousedown: this.handleMenuMousedown,
				onKeydown: this.handleKeydown,
				onFocusin: this.handleMenuFocusin,
				onFocusout: this.handleMenuFocusout
			}), [
				require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.header, (children) => {
					return children ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 1,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-tree-select-menu__header`),
						"data-header": true
					}, [require_vdom.normalizeVNode(() => children)], 2)) : null;
				})),
				((0, vue.openBlock)(), (0, vue.createBlock)(require_tree_src_Tree.default, {
					ref: "treeInstRef",
					blockLine: true,
					allowCheckingNotLoaded: this.allowCheckingNotLoaded,
					showIrrelevantNodes: false,
					animated: false,
					pattern: this.pattern,
					getChildren: this.getChildren,
					filter: this.mergedFilter,
					data: options,
					cancelable: multiple,
					labelField: this.labelField,
					keyField: this.keyField,
					disabledField: this.disabledField,
					childrenField: this.childrenField,
					theme: mergedTheme.peers.Tree,
					themeOverrides: mergedTheme.peerOverrides.Tree,
					defaultExpandAll: this.defaultExpandAll,
					defaultExpandedKeys: this.defaultExpandedKeys,
					indent: this.indent,
					expandedKeys: this.mergedExpandedKeys,
					checkedKeys: this.treeCheckedKeys,
					selectedKeys: this.treeSelectedKeys,
					checkable,
					checkStrategy: this.checkStrategy,
					cascade: this.mergedCascade,
					leafOnly: this.leafOnly,
					multiple: this.multiple,
					showLine: this.showLine,
					renderLabel: this.renderLabel,
					renderPrefix: this.renderPrefix,
					renderSuffix: this.renderSuffix,
					renderSwitcherIcon: this.renderSwitcherIcon,
					nodeProps: this.nodeProps,
					watchProps: this.watchProps,
					virtualScroll: this.consistentMenuWidth && this.virtualScroll,
					overrideDefaultNodeClickBehavior: this.overrideDefaultNodeClickBehavior,
					internalTreeSelect: true,
					internalUnifySelectCheck: true,
					internalScrollable: true,
					internalScrollablePadding: this.menuPadding,
					internalFocusable: false,
					internalCheckboxFocusable: false,
					internalRenderEmpty: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-tree-select-menu__empty`) }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots.empty, () => {
						return [this.mergedRenderEmpty?.() || ((0, vue.openBlock)(), (0, vue.createBlock)(require_empty_src_Empty.default, {
							theme: mergedTheme.peers.Empty,
							themeOverrides: mergedTheme.peerOverrides.Empty
						}, null, 8, ["theme", "themeOverrides"]))];
					}))], 2)),
					onLoad: this.onLoad,
					onUpdateCheckedKeys: this.handleUpdateCheckedKeys,
					onUpdateIndeterminateKeys: this.handleUpdateIndeterminateKeys,
					onUpdateExpandedKeys: this.doUpdateExpandedKeys
				}, null, 8, [
					"allowCheckingNotLoaded",
					"pattern",
					"getChildren",
					"filter",
					"data",
					"cancelable",
					"labelField",
					"keyField",
					"disabledField",
					"childrenField",
					"theme",
					"themeOverrides",
					"defaultExpandAll",
					"defaultExpandedKeys",
					"indent",
					"expandedKeys",
					"checkedKeys",
					"selectedKeys",
					"checkable",
					"checkStrategy",
					"cascade",
					"leafOnly",
					"multiple",
					"showLine",
					"renderLabel",
					"renderPrefix",
					"renderSuffix",
					"renderSwitcherIcon",
					"nodeProps",
					"watchProps",
					"virtualScroll",
					"overrideDefaultNodeClickBehavior",
					"internalScrollablePadding",
					"onLoad",
					"onUpdateCheckedKeys",
					"onUpdateIndeterminateKeys",
					"onUpdateExpandedKeys"
				])),
				require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.action, (children) => {
					return children ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 2,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-tree-select-menu__action`),
						"data-action": true
					}, [require_vdom.normalizeVNode(() => children)], 2)) : null;
				})),
				((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_focus_detector_index, { onFocus: this.handleTabOut }, null, 8, ["onFocus"]))
			], 16, _hoisted_1)), [[
				vdirs.clickoutside,
				this.handleMenuClickoutside,
				void 0,
				{ capture: true }
			]]);
		} }, 1032, ["appear", "onLeave"])) }, 1032, [
			"show",
			"placement",
			"to",
			"teleportDisabled",
			"containerClass",
			"width"
		]))] }, 1024)], 2);
	}
});
//#endregion
exports.default = TreeSelect_default;
exports.treeSelectProps = treeSelectProps;
