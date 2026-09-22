Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_adjusted_to = require("../../_utils/composable/use-adjusted-to.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_get_first_slot_vnode = require("../../_utils/vue/get-first-slot-vnode.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_select_menu_src_SelectMenu = require("../../_internal/select-menu/src/SelectMenu.js");
const require_input_src_Input = require("../../input/src/Input.js");
const require_select_src_utils = require("../../select/src/utils.js");
const require_auto_complete_styles_light = require("../styles/light.js");
const require_auto_complete_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_auto_complete_src_utils = require("./utils.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
let treemate = require("treemate");
let vdirs = require("vdirs");
//#region src/auto-complete/src/AutoComplete.tsx
const _hoisted_1 = [
	"onKeydown",
	"onCompositionstart",
	"onCompositionend"
];
const autoCompleteProps = {
	...require__mixins_use_theme.default.props,
	to: require__utils_composable_use_adjusted_to.useAdjustedTo.propTo,
	menuProps: Object,
	append: Boolean,
	bordered: {
		type: Boolean,
		default: void 0
	},
	clearable: {
		type: Boolean,
		default: void 0
	},
	defaultValue: {
		type: String,
		default: null
	},
	loading: {
		type: Boolean,
		default: void 0
	},
	disabled: {
		type: Boolean,
		default: void 0
	},
	placeholder: String,
	placement: {
		type: String,
		default: "bottom-start"
	},
	value: String,
	blurAfterSelect: Boolean,
	clearAfterSelect: Boolean,
	getShow: Function,
	showEmpty: Boolean,
	inputProps: Object,
	renderOption: Function,
	renderLabel: Function,
	size: String,
	options: {
		type: Array,
		default: () => []
	},
	zIndex: Number,
	status: String,
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	onSelect: [Function, Array],
	onBlur: [Function, Array],
	onFocus: [Function, Array],
	scrollbarProps: Object,
	onInput: [Function, Array]
};
var AutoComplete_default = (0, vue.defineComponent)({
	name: "AutoComplete",
	props: autoCompleteProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onInput !== void 0) require__utils_naive_warn.warnOnce("auto-complete", "`on-input` is deprecated, please use `on-update:value` instead.");
		});
		const { mergedBorderedRef, namespaceRef, mergedClsPrefixRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const formItem = require__mixins_use_form_item.default(props, { mergedSize: (NFormItem) => {
			const { size } = props;
			if (size) return size;
			const { mergedSize: formItemSize } = NFormItem || {};
			if (formItemSize?.value) return formItemSize.value;
			const configSize = mergedComponentPropsRef?.value?.AutoComplete?.size;
			if (configSize) return configSize;
			return "medium";
		} });
		const { mergedSizeRef, mergedDisabledRef, mergedStatusRef } = formItem;
		const triggerElRef = (0, vue.ref)(null);
		const menuInstRef = (0, vue.ref)(null);
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const controlledValueRef = (0, vue.toRef)(props, "value");
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		const canBeActivatedRef = (0, vue.ref)(false);
		const isComposingRef = (0, vue.ref)(false);
		const themeRef = require__mixins_use_theme.default("AutoComplete", "-auto-complete", require_auto_complete_src_styles_index_cssr, require_auto_complete_styles_light.default, props, mergedClsPrefixRef);
		const selectOptionsRef = (0, vue.computed)(() => {
			return require_auto_complete_src_utils.mapAutoCompleteOptionsToSelectOptions(props.options);
		});
		const mergedShowOptionsRef = (0, vue.computed)(() => {
			const { getShow } = props;
			if (getShow) return getShow(mergedValueRef.value || "");
			return !!mergedValueRef.value;
		});
		const activeRef = (0, vue.computed)(() => {
			return mergedShowOptionsRef.value && canBeActivatedRef.value && (props.showEmpty ? true : !!selectOptionsRef.value.length);
		});
		const treeMateRef = (0, vue.computed)(() => (0, treemate.createTreeMate)(selectOptionsRef.value, require_select_src_utils.createTmOptions("value", "children")));
		function doUpdateValue(value) {
			const { "onUpdate:value": _onUpdateValue, onUpdateValue, onInput } = props;
			const { nTriggerFormInput, nTriggerFormChange } = formItem;
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value);
			if (onInput) require__utils_vue_call.call(onInput, value);
			uncontrolledValueRef.value = value;
			nTriggerFormInput();
			nTriggerFormChange();
		}
		function doSelect(value) {
			const { onSelect } = props;
			const { nTriggerFormInput, nTriggerFormChange } = formItem;
			if (onSelect) require__utils_vue_call.call(onSelect, value);
			nTriggerFormInput();
			nTriggerFormChange();
		}
		function doBlur(e) {
			const { onBlur } = props;
			const { nTriggerFormBlur } = formItem;
			if (onBlur) require__utils_vue_call.call(onBlur, e);
			nTriggerFormBlur();
		}
		function doFocus(e) {
			const { onFocus } = props;
			const { nTriggerFormFocus } = formItem;
			if (onFocus) require__utils_vue_call.call(onFocus, e);
			nTriggerFormFocus();
		}
		function handleCompositionStart() {
			isComposingRef.value = true;
		}
		function handleCompositionEnd() {
			window.setTimeout(() => {
				isComposingRef.value = false;
			}, 0);
		}
		function handleKeyDown(e) {
			switch (e.key) {
				case "Enter":
					if (!isComposingRef.value) {
						const pendingOptionTmNode = menuInstRef.value?.getPendingTmNode();
						if (pendingOptionTmNode) {
							select(pendingOptionTmNode.rawNode);
							e.preventDefault();
						}
					}
					break;
				case "ArrowDown":
					menuInstRef.value?.next();
					break;
				case "ArrowUp": menuInstRef.value?.prev();
			}
		}
		function select(option) {
			if (option?.value !== void 0) {
				doSelect(option.value);
				if (props.clearAfterSelect) doUpdateValue(null);
				else if (option.label !== void 0) doUpdateValue(props.append ? `${mergedValueRef.value}${option.label}` : option.label);
				canBeActivatedRef.value = false;
				if (props.blurAfterSelect) blur();
			}
		}
		function handleClear() {
			doUpdateValue(null);
		}
		function handleFocus(e) {
			canBeActivatedRef.value = true;
			doFocus(e);
		}
		function handleBlur(e) {
			canBeActivatedRef.value = false;
			doBlur(e);
		}
		function handleInput(value) {
			canBeActivatedRef.value = true;
			doUpdateValue(value);
		}
		function handleToggle(option) {
			select(option.rawNode);
		}
		function handleClickOutsideMenu(e) {
			if (!triggerElRef.value?.contains((0, seemly.getPreciseEventTarget)(e))) canBeActivatedRef.value = false;
		}
		function blur() {
			if (triggerElRef.value?.contains(document.activeElement)) document.activeElement?.blur();
		}
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { menuBoxShadow } } = themeRef.value;
			return {
				"--n-menu-box-shadow": menuBoxShadow,
				"--n-bezier": cubicBezierEaseInOut
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("auto-complete", void 0, cssVarsRef, props) : void 0;
		const inputInstRef = (0, vue.ref)(null);
		const exposedMethods = {
			focus: () => {
				inputInstRef.value?.focus();
			},
			blur: () => {
				inputInstRef.value?.blur();
			}
		};
		return {
			focus: exposedMethods.focus,
			blur: exposedMethods.blur,
			inputInstRef,
			uncontrolledValue: uncontrolledValueRef,
			mergedValue: mergedValueRef,
			isMounted: (0, vooks.useIsMounted)(),
			adjustedTo: require__utils_composable_use_adjusted_to.useAdjustedTo(props),
			menuInstRef,
			triggerElRef,
			treeMate: treeMateRef,
			mergedSize: mergedSizeRef,
			mergedDisabled: mergedDisabledRef,
			active: activeRef,
			mergedStatus: mergedStatusRef,
			handleClear,
			handleFocus,
			handleBlur,
			handleInput,
			handleToggle,
			handleClickOutsideMenu,
			handleCompositionStart,
			handleCompositionEnd,
			handleKeyDown,
			mergedTheme: themeRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			mergedBordered: mergedBorderedRef,
			namespace: namespaceRef,
			mergedClsPrefix: mergedClsPrefixRef
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-auto-complete`),
			ref: "triggerElRef",
			onKeydown: this.handleKeyDown,
			onCompositionstart: this.handleCompositionStart,
			onCompositionend: this.handleCompositionEnd
		}, [(0, vue.createVNode)(vueuc.VBinder, null, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VTarget, null, {
			_: 1,
			default: require_vdom.normalizeSlot(() => {
				const defaultSlot = this.$slots.default;
				if (defaultSlot) return require__utils_vue_get_first_slot_vnode.getFirstSlotVNodeWithTypedProps("default", defaultSlot, {
					handleInput: this.handleInput,
					handleFocus: this.handleFocus,
					handleBlur: this.handleBlur,
					value: this.mergedValue
				});
				const { mergedTheme } = this;
				return (0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
					ref: "inputInstRef",
					status: this.mergedStatus,
					theme: mergedTheme.peers.Input,
					themeOverrides: mergedTheme.peerOverrides.Input,
					bordered: this.mergedBordered,
					value: this.mergedValue,
					placeholder: this.placeholder,
					size: this.mergedSize,
					disabled: this.mergedDisabled,
					clearable: this.clearable,
					loading: this.loading,
					inputProps: this.inputProps,
					onClear: this.handleClear,
					onFocus: this.handleFocus,
					onUpdateValue: this.handleInput,
					onBlur: this.handleBlur
				}, {
					suffix: () => this.$slots.suffix?.(),
					prefix: () => this.$slots.prefix?.()
				}, 1032, [
					"status",
					"theme",
					"themeOverrides",
					"bordered",
					"value",
					"placeholder",
					"size",
					"disabled",
					"clearable",
					"loading",
					"inputProps",
					"onClear",
					"onFocus",
					"onUpdateValue",
					"onBlur"
				]);
			})
		})), ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFollower, {
			show: this.active,
			to: this.adjustedTo,
			containerClass: this.namespace,
			zIndex: this.zIndex,
			teleportDisabled: this.adjustedTo === require__utils_composable_use_adjusted_to.useAdjustedTo.tdkey,
			placement: this.placement,
			width: "target"
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "fade-in-scale-up-transition",
			appear: this.isMounted
		}, { default: () => {
			this.onRender?.();
			if (!this.active) return null;
			const { menuProps } = this;
			return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_select_menu_src_SelectMenu, (0, vue.mergeProps)(menuProps, {
				clsPrefix: mergedClsPrefix,
				ref: "menuInstRef",
				theme: this.mergedTheme.peers.InternalSelectMenu,
				themeOverrides: this.mergedTheme.peerOverrides.InternalSelectMenu,
				"auto-pending": true,
				class: [
					`${mergedClsPrefix}-auto-complete-menu`,
					this.themeClass,
					menuProps?.class
				],
				style: [menuProps?.style, this.cssVars],
				treeMate: this.treeMate,
				multiple: false,
				renderLabel: this.renderLabel,
				renderOption: this.renderOption,
				size: "medium",
				onToggle: this.handleToggle,
				scrollbarProps: this.scrollbarProps
			}), { empty: () => this.$slots.empty?.() }, 1040, [
				"clsPrefix",
				"theme",
				"themeOverrides",
				"class",
				"style",
				"treeMate",
				"renderLabel",
				"renderOption",
				"onToggle",
				"scrollbarProps"
			])), [[
				vdirs.clickoutside,
				this.handleClickOutsideMenu,
				void 0,
				{ capture: true }
			]]);
		} }, 1032, ["appear"])) }, 1032, [
			"show",
			"to",
			"containerClass",
			"zIndex",
			"teleportDisabled",
			"placement"
		]))] }, 1024)], 42, _hoisted_1);
	}
});
//#endregion
exports.autoCompleteProps = autoCompleteProps;
exports.default = AutoComplete_default;
