Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Add = require("../../_internal/icons/Add.js");
const require__internal_icons_ArrowDown = require("../../_internal/icons/ArrowDown.js");
const require__internal_icons_ArrowUp = require("../../_internal/icons/ArrowUp.js");
const require__internal_icons_Remove = require("../../_internal/icons/Remove.js");
const require_button_src_Button = require("../../button/src/Button.js");
const require_button_group_src_ButtonGroup = require("../../button-group/src/ButtonGroup.js");
const require_dynamic_input_styles_light = require("../styles/light.js");
const require_dynamic_input_src_interface = require("./interface.js");
const require_dynamic_input_src_InputPreset = require("./InputPreset.js");
const require_dynamic_input_src_PairPreset = require("./PairPreset.js");
const require_dynamic_input_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/dynamic-input/src/DynamicInput.tsx
const _hoisted_1 = ["data-key"];
const globalDataKeyMap = /* @__PURE__ */ new WeakMap();
const dynamicInputProps = {
	...require__mixins_use_theme.default.props,
	max: Number,
	min: {
		type: Number,
		default: 0
	},
	value: Array,
	defaultValue: {
		type: Array,
		default: () => []
	},
	preset: {
		type: String,
		default: "input"
	},
	keyField: String,
	itemClass: String,
	itemStyle: [String, Object],
	keyPlaceholder: {
		type: String,
		default: ""
	},
	valuePlaceholder: {
		type: String,
		default: ""
	},
	placeholder: {
		type: String,
		default: ""
	},
	disabled: Boolean,
	showSortButton: Boolean,
	createButtonProps: Object,
	onCreate: Function,
	onRemove: Function,
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	onClear: Function,
	onInput: [Function, Array]
};
var DynamicInput_default = (0, vue.defineComponent)({
	name: "DynamicInput",
	props: dynamicInputProps,
	setup(props, { slots }) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onClear !== void 0) require__utils_naive_warn.warnOnce("dynamic-input", "`on-clear` is deprecated, it is out of usage anymore.");
			if (props.onInput !== void 0) require__utils_naive_warn.warnOnce("dynamic-input", "`on-input` is deprecated, please use `on-update:value` instead.");
		});
		const { mergedComponentPropsRef, mergedClsPrefixRef, mergedRtlRef, inlineThemeDisabled } = require__mixins_use_config.default();
		const NFormItem = (0, vue.inject)(require__mixins_use_form_item.formItemInjectionKey, null);
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const controlledValueRef = (0, vue.toRef)(props, "value");
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		const themeRef = require__mixins_use_theme.default("DynamicInput", "-dynamic-input", require_dynamic_input_src_styles_index_cssr, require_dynamic_input_styles_light, props, mergedClsPrefixRef);
		const insertionDisabledRef = (0, vue.computed)(() => {
			const { value: mergedValue } = mergedValueRef;
			if (Array.isArray(mergedValue)) {
				const { max } = props;
				return max !== void 0 && mergedValue.length >= max;
			}
			return false;
		});
		const removeDisabledRef = (0, vue.computed)(() => {
			const { value: mergedValue } = mergedValueRef;
			if (Array.isArray(mergedValue)) return mergedValue.length <= props.min;
			return true;
		});
		const buttonSizeRef = (0, vue.computed)(() => {
			return mergedComponentPropsRef?.value?.DynamicInput?.buttonSize;
		});
		function doUpdateValue(value) {
			const { onInput, "onUpdate:value": _onUpdateValue, onUpdateValue } = props;
			if (onInput) require__utils_vue_call.call(onInput, value);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value);
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value);
			uncontrolledValueRef.value = value;
		}
		function ensureKey(value, index) {
			if (value === void 0 || value === null) return index;
			if (typeof value !== "object") return index;
			const rawValue = (0, vue.isProxy)(value) ? (0, vue.toRaw)(value) : value;
			let key = globalDataKeyMap.get(rawValue);
			if (key === void 0) globalDataKeyMap.set(rawValue, key = (0, seemly.createId)());
			return key;
		}
		function handleValueChange(index, value) {
			const { value: mergedValue } = mergedValueRef;
			const newValue = Array.from(mergedValue ?? []);
			const originalItem = newValue[index];
			newValue[index] = value;
			if (originalItem && value && typeof originalItem === "object" && typeof value === "object") {
				const rawOriginal = (0, vue.isProxy)(originalItem) ? (0, vue.toRaw)(originalItem) : originalItem;
				const rawNew = (0, vue.isProxy)(value) ? (0, vue.toRaw)(value) : value;
				const originalKey = globalDataKeyMap.get(rawOriginal);
				if (originalKey !== void 0) globalDataKeyMap.set(rawNew, originalKey);
			}
			doUpdateValue(newValue);
		}
		function handleCreateClick() {
			createItem(-1);
		}
		function createItem(index) {
			const { value: mergedValue } = mergedValueRef;
			const { onCreate } = props;
			const newValue = Array.from(mergedValue ?? []);
			if (onCreate) {
				newValue.splice(index + 1, 0, onCreate(index + 1));
				doUpdateValue(newValue);
			} else if (slots.default) {
				newValue.splice(index + 1, 0, null);
				doUpdateValue(newValue);
			} else switch (props.preset) {
				case "input":
					newValue.splice(index + 1, 0, "");
					doUpdateValue(newValue);
					break;
				case "pair":
					newValue.splice(index + 1, 0, {
						key: "",
						value: ""
					});
					doUpdateValue(newValue);
			}
		}
		function remove(index) {
			const { value: mergedValue } = mergedValueRef;
			if (!Array.isArray(mergedValue)) return;
			const { min } = props;
			if (mergedValue.length <= min) return;
			const { onRemove } = props;
			if (onRemove) onRemove(index);
			const newValue = Array.from(mergedValue);
			newValue.splice(index, 1);
			doUpdateValue(newValue);
		}
		function swap(array, currentIndex, targetIndex) {
			if (currentIndex < 0 || targetIndex < 0 || currentIndex >= array.length || targetIndex >= array.length) return;
			if (currentIndex === targetIndex) return;
			const currentItem = array[currentIndex];
			array[currentIndex] = array[targetIndex];
			array[targetIndex] = currentItem;
		}
		function move(type, index) {
			const { value: mergedValue } = mergedValueRef;
			if (!Array.isArray(mergedValue)) return;
			const newValue = Array.from(mergedValue);
			if (type === "up") swap(newValue, index, index - 1);
			if (type === "down") swap(newValue, index, index + 1);
			doUpdateValue(newValue);
		}
		(0, vue.provide)(require_dynamic_input_src_interface.dynamicInputInjectionKey, {
			mergedThemeRef: themeRef,
			keyPlaceholderRef: (0, vue.toRef)(props, "keyPlaceholder"),
			valuePlaceholderRef: (0, vue.toRef)(props, "valuePlaceholder"),
			placeholderRef: (0, vue.toRef)(props, "placeholder")
		});
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("DynamicInput", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { actionMargin, actionMarginRtl } } = themeRef.value;
			return {
				"--action-margin": actionMargin,
				"--action-margin-rtl": actionMarginRtl
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("dynamic-input", void 0, cssVarsRef, props) : void 0;
		return {
			locale: require__mixins_use_locale("DynamicInput").localeRef,
			rtlEnabled: rtlEnabledRef,
			buttonSize: buttonSizeRef,
			mergedClsPrefix: mergedClsPrefixRef,
			NFormItem,
			uncontrolledValue: uncontrolledValueRef,
			mergedValue: mergedValueRef,
			insertionDisabled: insertionDisabledRef,
			removeDisabled: removeDisabledRef,
			handleCreateClick,
			ensureKey,
			handleValueChange,
			remove,
			move,
			createItem,
			mergedTheme: themeRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { $slots, itemClass, buttonSize, mergedClsPrefix, mergedValue, locale, mergedTheme, keyField, itemStyle, preset, showSortButton, NFormItem, ensureKey, handleValueChange, remove, createItem, move, onRender, disabled } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-dynamic-input`,
				this.rtlEnabled && `${mergedClsPrefix}-dynamic-input--rtl`,
				this.themeClass
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [!Array.isArray(mergedValue) || mergedValue.length === 0 ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, (0, vue.mergeProps)({
			key: 0,
			block: true,
			ghost: true,
			dashed: true,
			size: buttonSize
		}, this.createButtonProps, {
			disabled: this.insertionDisabled || disabled,
			theme: mergedTheme.peers.Button,
			themeOverrides: mergedTheme.peerOverrides.Button,
			onClick: this.handleCreateClick
		}), {
			default: () => require__utils_vue_resolve_slot.resolveSlot($slots["create-button-default"], () => [locale.create]),
			icon: () => require__utils_vue_resolve_slot.resolveSlot($slots["create-button-icon"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Add)) }, 1032, ["clsPrefix"]))])
		}, 1040, [
			"size",
			"disabled",
			"theme",
			"themeOverrides",
			"onClick"
		])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => mergedValue.map((_, index) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: keyField ? _[keyField] : ensureKey(_, index),
			"data-key": keyField ? _[keyField] : ensureKey(_, index),
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-dynamic-input-item`, itemClass]),
			style: (0, vue.normalizeStyle)(itemStyle)
		}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps($slots.default, {
			value: mergedValue[index],
			index
		}, () => {
			return [preset === "input" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_dynamic_input_src_InputPreset, {
				key: 1,
				disabled,
				clsPrefix: mergedClsPrefix,
				value: mergedValue[index],
				parentPath: NFormItem ? NFormItem.path.value : void 0,
				path: NFormItem?.path.value ? `${NFormItem.path.value}[${index}]` : void 0,
				onUpdateValue: (v) => {
					handleValueChange(index, v);
				}
			}, null, 8, [
				"disabled",
				"clsPrefix",
				"value",
				"parentPath",
				"path",
				"onUpdateValue"
			])) : preset === "pair" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_dynamic_input_src_PairPreset, {
				key: 2,
				disabled,
				clsPrefix: mergedClsPrefix,
				value: mergedValue[index],
				parentPath: NFormItem ? NFormItem.path.value : void 0,
				path: NFormItem?.path.value ? `${NFormItem.path.value}[${index}]` : void 0,
				onUpdateValue: (v) => {
					handleValueChange(index, v);
				}
			}, null, 8, [
				"disabled",
				"clsPrefix",
				"value",
				"parentPath",
				"path",
				"onUpdateValue"
			])) : null];
		})), require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps($slots.action, {
			value: mergedValue[index],
			index,
			create: createItem,
			remove,
			move
		}, () => [((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-dynamic-input-item__action`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_button_group_src_ButtonGroup.default, { size: buttonSize }, { default: () => [
			((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
				disabled: this.removeDisabled || disabled,
				theme: mergedTheme.peers.Button,
				themeOverrides: mergedTheme.peerOverrides.Button,
				circle: true,
				onClick: () => {
					remove(index);
				}
			}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Remove)) }, 1032, ["clsPrefix"])) }, 1032, [
				"disabled",
				"theme",
				"themeOverrides",
				"onClick"
			])),
			((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
				disabled: this.insertionDisabled || disabled,
				circle: true,
				theme: mergedTheme.peers.Button,
				themeOverrides: mergedTheme.peerOverrides.Button,
				onClick: () => {
					createItem(index);
				}
			}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Add)) }, 1032, ["clsPrefix"])) }, 1032, [
				"disabled",
				"theme",
				"themeOverrides",
				"onClick"
			])),
			showSortButton ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
				key: 3,
				disabled: index === 0 || disabled,
				circle: true,
				theme: mergedTheme.peers.Button,
				themeOverrides: mergedTheme.peerOverrides.Button,
				onClick: () => {
					move("up", index);
				}
			}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ArrowUp)) }, 1032, ["clsPrefix"])) }, 1032, [
				"disabled",
				"theme",
				"themeOverrides",
				"onClick"
			])) : null,
			showSortButton ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
				key: 4,
				disabled: index === mergedValue.length - 1 || disabled,
				circle: true,
				theme: mergedTheme.peers.Button,
				themeOverrides: mergedTheme.peerOverrides.Button,
				onClick: () => {
					move("down", index);
				}
			}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ArrowDown)) }, 1032, ["clsPrefix"])) }, 1032, [
				"disabled",
				"theme",
				"themeOverrides",
				"onClick"
			])) : null
		] }, 1032, ["size"]))], 2))]))], 14, _hoisted_1))))], 64))], 6);
	}
});
//#endregion
exports.default = DynamicInput_default;
exports.dynamicInputProps = dynamicInputProps;
