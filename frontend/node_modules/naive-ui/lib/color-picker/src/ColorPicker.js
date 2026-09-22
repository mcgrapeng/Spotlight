Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_adjusted_to = require("../../_utils/composable/use-adjusted-to.js");
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require__utils_vue_merge_handlers = require("../../_utils/vue/merge-handlers.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_button_src_Button = require("../../button/src/Button.js");
const require_color_picker_styles_light = require("../styles/light.js");
const require_color_picker_src_utils = require("./utils.js");
const require_color_picker_src_AlphaSlider = require("./AlphaSlider.js");
const require_color_picker_src_context = require("./context.js");
const require_color_picker_src_ColorInput = require("./ColorInput.js");
const require_color_picker_src_ColorPickerSwatches = require("./ColorPickerSwatches.js");
const require_color_picker_src_ColorPickerTrigger = require("./ColorPickerTrigger.js");
const require_color_picker_src_ColorPreview = require("./ColorPreview.js");
const require_color_picker_src_HueSlider = require("./HueSlider.js");
const require_color_picker_src_Pallete = require("./Pallete.js");
const require_color_picker_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
let vdirs = require("vdirs");
//#region src/color-picker/src/ColorPicker.tsx
const colorPickerProps = {
	...require__mixins_use_theme.default.props,
	value: String,
	show: {
		type: Boolean,
		default: void 0
	},
	defaultShow: Boolean,
	defaultValue: String,
	modes: {
		type: Array,
		default: () => [
			"rgb",
			"hex",
			"hsl"
		]
	},
	placement: {
		type: String,
		default: "bottom-start"
	},
	to: require__utils_composable_use_adjusted_to.useAdjustedTo.propTo,
	showAlpha: {
		type: Boolean,
		default: true
	},
	showPreview: Boolean,
	swatches: Array,
	disabled: {
		type: Boolean,
		default: void 0
	},
	actions: {
		type: Array,
		default: null
	},
	internalActions: Array,
	size: String,
	renderLabel: Function,
	onComplete: Function,
	onConfirm: Function,
	onClear: Function,
	"onUpdate:show": [Function, Array],
	onUpdateShow: [Function, Array],
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array]
};
var ColorPicker_default = (0, vue.defineComponent)({
	name: "ColorPicker",
	inheritAttrs: false,
	props: colorPickerProps,
	slots: Object,
	setup(props, { slots }) {
		let triggerRef = null;
		function setTriggerRef(el) {
			triggerRef = el;
		}
		let upcomingValue = null;
		const { mergedClsPrefixRef, namespaceRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const formItem = require__mixins_use_form_item.default(props, { mergedSize: (NFormItem) => {
			const { size } = props;
			if (size) return size;
			const { mergedSize: formItemSize } = NFormItem || {};
			if (formItemSize?.value) return formItemSize.value;
			const configSize = mergedComponentPropsRef?.value?.ColorPicker?.size;
			if (configSize) return configSize;
			return "medium";
		} });
		const { mergedSizeRef, mergedDisabledRef } = formItem;
		const { localeRef } = require__mixins_use_locale("global");
		const themeRef = require__mixins_use_theme.default("ColorPicker", "-color-picker", require_color_picker_src_styles_index_cssr, require_color_picker_styles_light.default, props, mergedClsPrefixRef);
		(0, vue.provide)(require_color_picker_src_context.colorPickerInjectionKey, {
			themeRef,
			renderLabelRef: (0, vue.toRef)(props, "renderLabel"),
			colorPickerSlots: slots
		});
		const uncontrolledShowRef = (0, vue.ref)(props.defaultShow);
		const mergedShowRef = (0, vooks.useMergedState)((0, vue.toRef)(props, "show"), uncontrolledShowRef);
		function doUpdateShow(value) {
			const { onUpdateShow, "onUpdate:show": _onUpdateShow } = props;
			if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, value);
			if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, value);
			uncontrolledShowRef.value = value;
		}
		const { defaultValue } = props;
		const uncontrolledValueRef = (0, vue.ref)(defaultValue === void 0 ? require_color_picker_src_utils.deriveDefaultValue(props.modes, props.showAlpha) : defaultValue);
		const mergedValueRef = (0, vooks.useMergedState)((0, vue.toRef)(props, "value"), uncontrolledValueRef);
		const undoStackRef = (0, vue.ref)([mergedValueRef.value]);
		const valueIndexRef = (0, vue.ref)(0);
		const valueModeRef = (0, vue.computed)(() => require_color_picker_src_utils.getModeFromValue(mergedValueRef.value));
		const { modes } = props;
		const displayedModeRef = (0, vue.ref)(require_color_picker_src_utils.getModeFromValue(mergedValueRef.value) || modes[0] || "rgb");
		function handleUpdateDisplayedMode() {
			const { modes } = props;
			const { value: displayedMode } = displayedModeRef;
			const currentModeIndex = modes.findIndex((mode) => mode === displayedMode);
			if (~currentModeIndex) displayedModeRef.value = modes[(currentModeIndex + 1) % modes.length];
			else displayedModeRef.value = "rgb";
		}
		let _h, s, l, v, r, g, b, a;
		const hsvaRef = (0, vue.computed)(() => {
			const { value: mergedValue } = mergedValueRef;
			if (!mergedValue) return null;
			switch (valueModeRef.value) {
				case "hsv": return (0, seemly.hsva)(mergedValue);
				case "hsl":
					[_h, s, l, a] = (0, seemly.hsla)(mergedValue);
					return [...(0, seemly.hsl2hsv)(_h, s, l), a];
				case "rgb":
				case "hex":
					[r, g, b, a] = (0, seemly.rgba)(mergedValue);
					return [...(0, seemly.rgb2hsv)(r, g, b), a];
			}
		});
		const rgbaRef = (0, vue.computed)(() => {
			const { value: mergedValue } = mergedValueRef;
			if (!mergedValue) return null;
			switch (valueModeRef.value) {
				case "rgb":
				case "hex": return (0, seemly.rgba)(mergedValue);
				case "hsv":
					[_h, s, v, a] = (0, seemly.hsva)(mergedValue);
					return [...(0, seemly.hsv2rgb)(_h, s, v), a];
				case "hsl":
					[_h, s, l, a] = (0, seemly.hsla)(mergedValue);
					return [...(0, seemly.hsl2rgb)(_h, s, l), a];
			}
		});
		const hslaRef = (0, vue.computed)(() => {
			const { value: mergedValue } = mergedValueRef;
			if (!mergedValue) return null;
			switch (valueModeRef.value) {
				case "hsl": return (0, seemly.hsla)(mergedValue);
				case "hsv":
					[_h, s, v, a] = (0, seemly.hsva)(mergedValue);
					return [...(0, seemly.hsv2hsl)(_h, s, v), a];
				case "rgb":
				case "hex":
					[r, g, b, a] = (0, seemly.rgba)(mergedValue);
					return [...(0, seemly.rgb2hsl)(r, g, b), a];
			}
		});
		const mergedValueArrRef = (0, vue.computed)(() => {
			switch (displayedModeRef.value) {
				case "rgb":
				case "hex": return rgbaRef.value;
				case "hsv": return hsvaRef.value;
				case "hsl": return hslaRef.value;
			}
		});
		const displayedHueRef = (0, vue.ref)(0);
		const displayedAlphaRef = (0, vue.ref)(1);
		const displayedSvRef = (0, vue.ref)([0, 0]);
		function handleUpdateSv(s, v) {
			const { value: hsvaArr } = hsvaRef;
			const hue = displayedHueRef.value;
			const alpha = hsvaArr ? hsvaArr[3] : 1;
			displayedSvRef.value = [s, v];
			const { showAlpha } = props;
			switch (displayedModeRef.value) {
				case "hsv":
					doUpdateValue((showAlpha ? seemly.toHsvaString : seemly.toHsvString)([
						hue,
						s,
						v,
						alpha
					]), "cursor");
					break;
				case "hsl":
					doUpdateValue((showAlpha ? seemly.toHslaString : seemly.toHslString)([...(0, seemly.hsv2hsl)(hue, s, v), alpha]), "cursor");
					break;
				case "rgb":
					doUpdateValue((showAlpha ? seemly.toRgbaString : seemly.toRgbString)([...(0, seemly.hsv2rgb)(hue, s, v), alpha]), "cursor");
					break;
				case "hex": doUpdateValue((showAlpha ? seemly.toHexaString : seemly.toHexString)([...(0, seemly.hsv2rgb)(hue, s, v), alpha]), "cursor");
			}
		}
		function handleUpdateHue(hue) {
			displayedHueRef.value = hue;
			const { value: hsvaArr } = hsvaRef;
			if (!hsvaArr) return;
			const [, s, v, a] = hsvaArr;
			const { showAlpha } = props;
			switch (displayedModeRef.value) {
				case "hsv":
					doUpdateValue((showAlpha ? seemly.toHsvaString : seemly.toHsvString)([
						hue,
						s,
						v,
						a
					]), "cursor");
					break;
				case "rgb":
					doUpdateValue((showAlpha ? seemly.toRgbaString : seemly.toRgbString)([...(0, seemly.hsv2rgb)(hue, s, v), a]), "cursor");
					break;
				case "hex":
					doUpdateValue((showAlpha ? seemly.toHexaString : seemly.toHexString)([...(0, seemly.hsv2rgb)(hue, s, v), a]), "cursor");
					break;
				case "hsl": doUpdateValue((showAlpha ? seemly.toHslaString : seemly.toHslString)([...(0, seemly.hsv2hsl)(hue, s, v), a]), "cursor");
			}
		}
		function handleUpdateAlpha(alpha) {
			switch (displayedModeRef.value) {
				case "hsv":
					[_h, s, v] = hsvaRef.value;
					doUpdateValue((0, seemly.toHsvaString)([
						_h,
						s,
						v,
						alpha
					]), "cursor");
					break;
				case "rgb":
					[r, g, b] = rgbaRef.value;
					doUpdateValue((0, seemly.toRgbaString)([
						r,
						g,
						b,
						alpha
					]), "cursor");
					break;
				case "hex":
					[r, g, b] = rgbaRef.value;
					doUpdateValue((0, seemly.toHexaString)([
						r,
						g,
						b,
						alpha
					]), "cursor");
					break;
				case "hsl":
					[_h, s, l] = hslaRef.value;
					doUpdateValue((0, seemly.toHslaString)([
						_h,
						s,
						l,
						alpha
					]), "cursor");
			}
			displayedAlphaRef.value = alpha;
		}
		function doUpdateValue(value, updateSource) {
			if (updateSource === "cursor") upcomingValue = value;
			else upcomingValue = null;
			const { nTriggerFormChange, nTriggerFormInput } = formItem;
			const { onUpdateValue, "onUpdate:value": _onUpdateValue } = props;
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value);
			nTriggerFormChange();
			nTriggerFormInput();
			uncontrolledValueRef.value = value;
		}
		function handleInputUpdateValue(value) {
			doUpdateValue(value, "input");
			(0, vue.nextTick)(handleComplete);
		}
		function handleComplete(pushStack = true) {
			const { value } = mergedValueRef;
			if (value) {
				const { nTriggerFormChange, nTriggerFormInput } = formItem;
				const { onComplete } = props;
				if (onComplete) onComplete(value);
				const { value: undoStack } = undoStackRef;
				const { value: valueIndex } = valueIndexRef;
				if (pushStack) {
					undoStack.splice(valueIndex + 1, undoStack.length, value);
					valueIndexRef.value = valueIndex + 1;
				}
				nTriggerFormChange();
				nTriggerFormInput();
			}
		}
		function undo() {
			const { value: valueIndex } = valueIndexRef;
			if (valueIndex - 1 < 0) return;
			doUpdateValue(undoStackRef.value[valueIndex - 1], "input");
			handleComplete(false);
			valueIndexRef.value = valueIndex - 1;
		}
		function redo() {
			const { value: valueIndex } = valueIndexRef;
			if (valueIndex < 0 || valueIndex + 1 >= undoStackRef.value.length) return;
			doUpdateValue(undoStackRef.value[valueIndex + 1], "input");
			handleComplete(false);
			valueIndexRef.value = valueIndex + 1;
		}
		function handleClear() {
			doUpdateValue(null, "input");
			const { onClear } = props;
			if (onClear) onClear();
			doUpdateShow(false);
		}
		function handleConfirm() {
			const { value } = mergedValueRef;
			const { onConfirm } = props;
			if (onConfirm) onConfirm(value);
			doUpdateShow(false);
		}
		const undoableRef = (0, vue.computed)(() => valueIndexRef.value >= 1);
		const redoableRef = (0, vue.computed)(() => {
			const { value: undoStack } = undoStackRef;
			return undoStack.length > 1 && valueIndexRef.value < undoStack.length - 1;
		});
		(0, vue.watch)(mergedShowRef, (value) => {
			if (!value) {
				undoStackRef.value = [mergedValueRef.value];
				valueIndexRef.value = 0;
			}
		});
		(0, vue.watchEffect)(() => {
			if (upcomingValue && upcomingValue === mergedValueRef.value) {} else {
				const { value } = hsvaRef;
				if (value) {
					displayedHueRef.value = value[0];
					displayedAlphaRef.value = value[3];
					displayedSvRef.value = [value[1], value[2]];
				}
			}
			upcomingValue = null;
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { value: mergedSize } = mergedSizeRef;
			const { common: { cubicBezierEaseInOut }, self: { textColor, color, panelFontSize, boxShadow, border, borderRadius, dividerColor, [require__utils_cssr_index.createKey("height", mergedSize)]: height, [require__utils_cssr_index.createKey("fontSize", mergedSize)]: fontSize } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-text-color": textColor,
				"--n-color": color,
				"--n-panel-font-size": panelFontSize,
				"--n-font-size": fontSize,
				"--n-box-shadow": boxShadow,
				"--n-border": border,
				"--n-border-radius": borderRadius,
				"--n-height": height,
				"--n-divider-color": dividerColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("color-picker", (0, vue.computed)(() => {
			return mergedSizeRef.value[0];
		}), cssVarsRef, props) : void 0;
		function renderPanel() {
			const { value: rgba } = rgbaRef;
			const { value: displayedHue } = displayedHueRef;
			const { internalActions, modes, actions } = props;
			const { value: mergedTheme } = themeRef;
			const { value: mergedClsPrefix } = mergedClsPrefixRef;
			return (() => {
				const _cache = require_vdom.createVNodeCache("550d4636453f407b");
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-color-picker-panel`, themeClassHandle?.themeClass.value]),
					onDragstart: _cache[0] || (_cache[0] = (e) => {
						e.preventDefault();
					}),
					style: (0, vue.normalizeStyle)(inlineThemeDisabled ? void 0 : cssVarsRef.value)
				}, [
					(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-color-picker-control`) }, [
						((0, vue.openBlock)(), (0, vue.createBlock)(require_color_picker_src_Pallete, {
							clsPrefix: mergedClsPrefix,
							rgba,
							displayedHue,
							displayedSv: displayedSvRef.value,
							onUpdateSV: handleUpdateSv,
							onComplete: handleComplete
						}, null, 8, [
							"clsPrefix",
							"rgba",
							"displayedHue",
							"displayedSv",
							"onUpdateSV",
							"onComplete"
						])),
						(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-color-picker-preview`) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-color-picker-preview__sliders`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_color_picker_src_HueSlider, {
							clsPrefix: mergedClsPrefix,
							hue: displayedHue,
							onUpdateHue: handleUpdateHue,
							onComplete: handleComplete
						}, null, 8, [
							"clsPrefix",
							"hue",
							"onUpdateHue",
							"onComplete"
						])), props.showAlpha ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_color_picker_src_AlphaSlider, {
							key: 0,
							clsPrefix: mergedClsPrefix,
							rgba,
							alpha: displayedAlphaRef.value,
							onUpdateAlpha: handleUpdateAlpha,
							onComplete: handleComplete
						}, null, 8, [
							"clsPrefix",
							"rgba",
							"alpha",
							"onUpdateAlpha",
							"onComplete"
						])) : require_vdom.normalizeVNode(() => null)], 2), props.showPreview ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_color_picker_src_ColorPreview, {
							key: 0,
							clsPrefix: mergedClsPrefix,
							mode: displayedModeRef.value,
							color: rgbaRef.value && (0, seemly.toHexString)(rgbaRef.value),
							onUpdateColor: _cache[1] || (_cache[1] = (color) => {
								doUpdateValue(color, "input");
							})
						}, null, 8, [
							"clsPrefix",
							"mode",
							"color"
						])) : require_vdom.normalizeVNode(() => null)], 2),
						((0, vue.openBlock)(), (0, vue.createBlock)(require_color_picker_src_ColorInput, {
							clsPrefix: mergedClsPrefix,
							showAlpha: props.showAlpha,
							mode: displayedModeRef.value,
							modes,
							onUpdateMode: handleUpdateDisplayedMode,
							value: mergedValueRef.value,
							valueArr: mergedValueArrRef.value,
							onUpdateValue: handleInputUpdateValue
						}, null, 8, [
							"clsPrefix",
							"showAlpha",
							"mode",
							"modes",
							"onUpdateMode",
							"value",
							"valueArr",
							"onUpdateValue"
						])),
						require_vdom.normalizeVNode(() => props.swatches?.length && (() => {
							const _cache = require_vdom.createVNodeCache("1de0b88852ebf5cb");
							return (0, vue.openBlock)(), (0, vue.createBlock)(require_color_picker_src_ColorPickerSwatches, {
								clsPrefix: mergedClsPrefix,
								mode: displayedModeRef.value,
								swatches: props.swatches,
								onUpdateColor: _cache[0] || (_cache[0] = (color) => {
									doUpdateValue(color, "input");
								})
							}, null, 8, [
								"clsPrefix",
								"mode",
								"swatches"
							]);
						})())
					], 2),
					actions?.length ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 0,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-color-picker-action`)
					}, [require_vdom.normalizeVNode(() => actions.includes("confirm") && ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
						size: "small",
						onClick: handleConfirm,
						theme: mergedTheme.peers.Button,
						themeOverrides: mergedTheme.peerOverrides.Button
					}, { default: () => localeRef.value.confirm }, 1032, [
						"onClick",
						"theme",
						"themeOverrides"
					]))), require_vdom.normalizeVNode(() => actions.includes("clear") && ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
						size: "small",
						onClick: handleClear,
						disabled: !mergedValueRef.value,
						theme: mergedTheme.peers.Button,
						themeOverrides: mergedTheme.peerOverrides.Button
					}, { default: () => localeRef.value.clear }, 1032, [
						"onClick",
						"disabled",
						"theme",
						"themeOverrides"
					])))], 2)) : require_vdom.normalizeVNode(() => null),
					slots.action ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 2,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-color-picker-action`)
					}, [require_vdom.normalizeVNode(() => slots.action?.())], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 3 }, [internalActions ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 0,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-color-picker-action`)
					}, [require_vdom.normalizeVNode(() => internalActions.includes("undo") && ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
						size: "small",
						onClick: undo,
						disabled: !undoableRef.value,
						theme: mergedTheme.peers.Button,
						themeOverrides: mergedTheme.peerOverrides.Button
					}, { default: () => localeRef.value.undo }, 1032, [
						"onClick",
						"disabled",
						"theme",
						"themeOverrides"
					]))), require_vdom.normalizeVNode(() => internalActions.includes("redo") && ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
						size: "small",
						onClick: redo,
						disabled: !redoableRef.value,
						theme: mergedTheme.peers.Button,
						themeOverrides: mergedTheme.peerOverrides.Button
					}, { default: () => localeRef.value.redo }, 1032, [
						"onClick",
						"disabled",
						"theme",
						"themeOverrides"
					])))], 2)) : require_vdom.normalizeVNode(() => null)], 64))
				], 38);
			})();
		}
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			namespace: namespaceRef,
			hsla: hslaRef,
			rgba: rgbaRef,
			mergedShow: mergedShowRef,
			mergedDisabled: mergedDisabledRef,
			isMounted: (0, vooks.useIsMounted)(),
			adjustedTo: require__utils_composable_use_adjusted_to.useAdjustedTo(props),
			mergedValue: mergedValueRef,
			handleTriggerClick() {
				if (mergedDisabledRef.value) return;
				doUpdateShow(true);
			},
			setTriggerRef,
			handleClickOutside(e) {
				if (triggerRef instanceof Element) {
					if (triggerRef.contains((0, seemly.getPreciseEventTarget)(e))) return;
				} else if (triggerRef) {
					if (triggerRef.$el.contains((0, seemly.getPreciseEventTarget)(e))) return;
				}
				doUpdateShow(false);
			},
			renderPanel,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix, onRender } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VBinder, null, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VTarget, null, { default: () => {
			const triggerProps = (0, vue.mergeProps)(this.$attrs, {
				ref: this.setTriggerRef,
				value: this.mergedValue,
				style: this.cssVars,
				class: this.themeClass
			});
			triggerProps.onClick = require__utils_vue_merge_handlers.mergeEventHandlers([this.mergedDisabled ? void 0 : this.handleTriggerClick, this.$attrs.onClick]);
			return require__utils_vue_resolve_slot.resolveWrappedSlotWithProps(this.$slots.trigger, require__utils_vue_keep.keep(triggerProps, [
				"value",
				"onClick",
				"ref"
			]), (children) => {
				return children || ((0, vue.openBlock)(), (0, vue.createBlock)(require_color_picker_src_ColorPickerTrigger, (0, vue.mergeProps)(triggerProps, {
					clsPrefix: mergedClsPrefix,
					hsla: this.hsla,
					disabled: this.mergedDisabled
				}), null, 16, [
					"clsPrefix",
					"hsla",
					"disabled"
				]));
			});
		} }, 1024)), ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFollower, {
			placement: this.placement,
			show: this.mergedShow,
			containerClass: this.namespace,
			teleportDisabled: this.adjustedTo === require__utils_composable_use_adjusted_to.useAdjustedTo.tdkey,
			to: this.adjustedTo
		}, {
			_: 1,
			default: require_vdom.normalizeSlot(() => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
				name: "fade-in-scale-up-transition",
				appear: this.isMounted
			}, {
				_: 1,
				default: require_vdom.normalizeSlot(() => this.mergedShow ? (0, vue.withDirectives)(this.renderPanel(), [[
					vdirs.clickoutside,
					this.handleClickOutside,
					void 0,
					{ capture: true }
				]]) : null)
			}, 8, ["appear"])))
		}, 8, [
			"placement",
			"show",
			"containerClass",
			"teleportDisabled",
			"to"
		]))] }, 1024);
	}
});
//#endregion
exports.colorPickerProps = colorPickerProps;
exports.default = ColorPicker_default;
