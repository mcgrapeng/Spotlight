Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_prop = require("../../_utils/naive/prop.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Add = require("../../_internal/icons/Add.js");
const require_tag_src_common_props = require("../../tag/src/common-props.js");
const require_tag_src_Tag = require("../../tag/src/Tag.js");
const require_input_src_Input = require("../../input/src/Input.js");
const require_button_src_Button = require("../../button/src/Button.js");
const require_space_src_Space = require("../../space/src/Space.js");
const require_dynamic_tags_styles_light = require("../styles/light.js");
const require_dynamic_tags_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/dynamic-tags/src/DynamicTags.tsx
const dynamicTagsProps = {
	...require__mixins_use_theme.default.props,
	...require_tag_src_common_props,
	size: String,
	closable: {
		type: Boolean,
		default: true
	},
	defaultValue: {
		type: Array,
		default: () => []
	},
	value: Array,
	inputClass: String,
	inputStyle: [String, Object],
	inputProps: Object,
	max: Number,
	tagClass: String,
	tagStyle: [String, Object],
	renderTag: Function,
	onCreate: {
		type: Function,
		default: (label) => label
	},
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	onChange: [Function, Array]
};
var DynamicTags_default = (0, vue.defineComponent)({
	name: "DynamicTags",
	props: dynamicTagsProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onChange !== void 0) require__utils_naive_warn.warnOnce("dynamic-tags", "`on-change` is deprecated, please use `on-update:value` instead.");
		});
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const mergedSizeRef = (0, vue.computed)(() => {
			return props.size || mergedComponentPropsRef?.value?.DynamicTags?.size || "medium";
		});
		const { localeRef } = require__mixins_use_locale("DynamicTags");
		const formItem = require__mixins_use_form_item.default(props);
		const { mergedDisabledRef } = formItem;
		const inputValueRef = (0, vue.ref)("");
		const showInputRef = (0, vue.ref)(false);
		const inputForceFocusedRef = (0, vue.ref)(true);
		const inputInstRef = (0, vue.ref)(null);
		const themeRef = require__mixins_use_theme.default("DynamicTags", "-dynamic-tags", require_dynamic_tags_src_styles_index_cssr, require_dynamic_tags_styles_light.default, props, mergedClsPrefixRef);
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const controlledValueRef = (0, vue.toRef)(props, "value");
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		const localizedAddRef = (0, vue.computed)(() => {
			return localeRef.value.add;
		});
		const inputSizeRef = (0, vue.computed)(() => {
			return require__utils_naive_prop.smallerSize(mergedSizeRef.value);
		});
		const triggerDisabledRef = (0, vue.computed)(() => {
			return mergedDisabledRef.value || !!props.max && mergedValueRef.value.length >= props.max;
		});
		function doChange(value) {
			const { onChange, "onUpdate:value": _onUpdateValue, onUpdateValue } = props;
			const { nTriggerFormInput, nTriggerFormChange } = formItem;
			if (onChange) require__utils_vue_call.call(onChange, value);
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value);
			uncontrolledValueRef.value = value;
			nTriggerFormInput();
			nTriggerFormChange();
		}
		function handleCloseClick(index) {
			const tags = mergedValueRef.value.slice(0);
			tags.splice(index, 1);
			doChange(tags);
		}
		function handleInputKeyDown(e) {
			if (inputInstRef.value?.isCompositing) return;
			switch (e.key) {
				case "Enter": handleInputConfirm();
			}
		}
		function handleInputConfirm(externalValue) {
			const nextValue = externalValue ?? inputValueRef.value;
			if (nextValue) {
				const tags = mergedValueRef.value.slice(0);
				tags.push(props.onCreate(nextValue));
				doChange(tags);
			}
			showInputRef.value = false;
			inputForceFocusedRef.value = true;
			inputValueRef.value = "";
		}
		function handleInputBlur() {
			handleInputConfirm();
		}
		function handleAddClick() {
			showInputRef.value = true;
			(0, vue.nextTick)(() => {
				inputInstRef.value?.focus();
				inputForceFocusedRef.value = false;
			});
		}
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { inputWidth } } = themeRef.value;
			return { "--n-input-width": inputWidth };
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("dynamic-tags", void 0, cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			inputInstRef,
			localizedAdd: localizedAddRef,
			inputSize: inputSizeRef,
			mergedSize: mergedSizeRef,
			inputValue: inputValueRef,
			showInput: showInputRef,
			inputForceFocused: inputForceFocusedRef,
			mergedValue: mergedValueRef,
			mergedDisabled: mergedDisabledRef,
			triggerDisabled: triggerDisabledRef,
			handleInputKeyDown,
			handleAddClick,
			handleInputBlur,
			handleCloseClick,
			handleInputConfirm,
			mergedTheme: themeRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedTheme, cssVars, mergedClsPrefix, onRender, renderTag } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createBlock)(require_space_src_Space.default, {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-dynamic-tags`, this.themeClass]),
			size: "small",
			style: (0, vue.normalizeStyle)(cssVars),
			theme: mergedTheme.peers.Space,
			themeOverrides: mergedTheme.peerOverrides.Space,
			itemStyle: "display: flex;"
		}, { default: () => {
			const { mergedTheme, tagClass, tagStyle, type, round, mergedSize, color, closable, mergedDisabled, showInput, inputValue, inputClass, inputStyle, inputSize, inputForceFocused, triggerDisabled, handleInputKeyDown, handleInputBlur, handleAddClick, handleCloseClick, handleInputConfirm, $slots } = this;
			return this.mergedValue.map((tag, index) => renderTag ? renderTag(tag, index) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_tag_src_Tag.default, {
				key: index,
				theme: mergedTheme.peers.Tag,
				themeOverrides: mergedTheme.peerOverrides.Tag,
				class: require_vdom.normalizeClass(tagClass),
				style: (0, vue.normalizeStyle)(tagStyle),
				type,
				round,
				size: mergedSize,
				color,
				closable,
				disabled: mergedDisabled,
				onClose: () => {
					handleCloseClick(index);
				}
			}, { default: () => typeof tag === "string" ? tag : tag.label }, 1032, [
				"theme",
				"themeOverrides",
				"class",
				"style",
				"type",
				"round",
				"size",
				"color",
				"closable",
				"disabled",
				"onClose"
			]))).concat(showInput ? $slots.input ? $slots.input({
				submit: handleInputConfirm,
				deactivate: handleInputBlur
			}) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, (0, vue.mergeProps)({
				key: 2,
				placeholder: "",
				size: inputSize,
				style: inputStyle,
				class: inputClass,
				autosize: true
			}, this.inputProps, {
				ref: "inputInstRef",
				value: inputValue,
				onUpdateValue: (v) => {
					this.inputValue = v;
				},
				theme: mergedTheme.peers.Input,
				themeOverrides: mergedTheme.peerOverrides.Input,
				onKeydown: handleInputKeyDown,
				onBlur: handleInputBlur,
				internalForceFocus: inputForceFocused
			}), null, 16, [
				"size",
				"style",
				"class",
				"value",
				"onUpdateValue",
				"theme",
				"themeOverrides",
				"onKeydown",
				"onBlur",
				"internalForceFocus"
			])) : $slots.trigger ? $slots.trigger({
				activate: handleAddClick,
				disabled: triggerDisabled
			}) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
				key: 3,
				dashed: true,
				disabled: triggerDisabled,
				theme: mergedTheme.peers.Button,
				themeOverrides: mergedTheme.peerOverrides.Button,
				size: inputSize,
				onClick: handleAddClick
			}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Add)) }, 1032, ["clsPrefix"])) }, 1032, [
				"disabled",
				"theme",
				"themeOverrides",
				"size",
				"onClick"
			])));
		} }, 1032, [
			"class",
			"style",
			"theme",
			"themeOverrides"
		]);
	}
});
//#endregion
exports.default = DynamicTags_default;
exports.dynamicTagsProps = dynamicTagsProps;
