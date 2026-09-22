Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_css_color_to_class = require("../../_utils/css/color-to-class.js");
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require_rate_styles_light = require("../styles/light.js");
const require_rate_src_StarIcon = require("./StarIcon.js");
const require_rate_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/rate/src/Rate.tsx
const _hoisted_1 = [
	"onClick",
	"onMouseenter",
	"onMousemove"
];
const _hoisted_2 = ["onMouseleave"];
const rateProps = {
	...require__mixins_use_theme.default.props,
	allowHalf: Boolean,
	count: {
		type: Number,
		default: 5
	},
	value: Number,
	defaultValue: {
		type: Number,
		default: null
	},
	readonly: Boolean,
	size: [String, Number],
	clearable: Boolean,
	color: String,
	onClear: Function,
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	"onUpdate:hoverValue": [Function, Array],
	onUpdateHoverValue: [Function, Array]
};
var Rate_default = (0, vue.defineComponent)({
	name: "Rate",
	props: rateProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Rate", "-rate", require_rate_src_styles_index_cssr, require_rate_styles_light, props, mergedClsPrefixRef);
		const controlledValueRef = (0, vue.toRef)(props, "value");
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const hoverIndexRef = (0, vue.ref)(null);
		const formItem = require__mixins_use_form_item.default(props, { mergedSize(NFormItem) {
			if (props.size !== void 0) return props.size;
			if (NFormItem) return NFormItem.mergedSize.value;
			const configSize = mergedComponentPropsRef?.value?.Rate?.size;
			if (configSize !== void 0) return configSize;
			return "medium";
		} });
		const mergedValue = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		function doUpdateValue(value) {
			const { "onUpdate:value": _onUpdateValue, onUpdateValue } = props;
			const { nTriggerFormChange, nTriggerFormInput } = formItem;
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value);
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value);
			uncontrolledValueRef.value = value;
			nTriggerFormChange();
			nTriggerFormInput();
		}
		function getDerivedValue(index, e) {
			if (props.allowHalf) {
				if (e.offsetX >= Math.floor(e.currentTarget.offsetWidth / 2)) return index + 1;
				else return index + .5;
			} else return index + 1;
		}
		let cleared = false;
		function updateHoverIndex(value) {
			if (hoverIndexRef.value === value) return;
			hoverIndexRef.value = value;
			const { "onUpdate:hoverValue": _onUpdateHoverValue, onUpdateHoverValue } = props;
			if (_onUpdateHoverValue) require__utils_vue_call.call(_onUpdateHoverValue, value);
			if (onUpdateHoverValue) require__utils_vue_call.call(onUpdateHoverValue, value);
		}
		function handleMouseMove(index, e) {
			if (cleared) return;
			updateHoverIndex(getDerivedValue(index, e));
		}
		function handleMouseLeave() {
			updateHoverIndex(null);
		}
		function handleClick(index, e) {
			const { clearable } = props;
			const derivedValue = getDerivedValue(index, e);
			if (clearable && derivedValue === mergedValue.value) {
				cleared = true;
				props.onClear?.();
				updateHoverIndex(null);
				doUpdateValue(null);
			} else doUpdateValue(derivedValue);
		}
		function handleMouseEnterSomeStar() {
			cleared = false;
		}
		const { mergedSizeRef: _mergedSizeRef } = formItem;
		const mergedSizeRef = (0, vue.computed)(() => {
			const size = _mergedSizeRef.value;
			const { self } = themeRef.value;
			if (typeof size === "number") return `${size}px`;
			else return self[require__utils_cssr_index.createKey("size", size)];
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self } = themeRef.value;
			const { itemColor, itemColorActive } = self;
			const { color } = props;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-item-color": itemColor,
				"--n-item-color-active": color || itemColorActive,
				"--n-item-size": mergedSizeRef.value
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("rate", (0, vue.computed)(() => {
			const size = mergedSizeRef.value;
			const { color } = props;
			let hash = "";
			if (size) hash += size[0];
			if (color) hash += require__utils_css_color_to_class.color2Class(color);
			return hash;
		}), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedValue,
			hoverIndex: hoverIndexRef,
			handleMouseMove,
			handleClick,
			handleMouseLeave,
			handleMouseEnterSomeStar,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { readonly, hoverIndex, mergedValue, mergedClsPrefix, onRender, $slots: { default: defaultSlot } } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-rate`,
				{ [`${mergedClsPrefix}-rate--readonly`]: readonly },
				this.themeClass
			]),
			style: (0, vue.normalizeStyle)(this.cssVars),
			onMouseleave: this.handleMouseLeave
		}, [require_vdom.normalizeVNode(() => (0, vue.renderList)(this.count, (_, index) => {
			const icon = defaultSlot ? defaultSlot({ index }) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
				key: 1,
				clsPrefix: mergedClsPrefix
			}, { default: require_rate_src_StarIcon }, 1032, ["clsPrefix"]));
			const entireStarActive = hoverIndex !== null ? index + 1 <= hoverIndex : index + 1 <= (mergedValue || 0);
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: index,
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-rate__item`, entireStarActive && `${mergedClsPrefix}-rate__item--active`]),
				onClick: readonly ? void 0 : (e) => {
					this.handleClick(index, e);
				},
				onMouseenter: this.handleMouseEnterSomeStar,
				onMousemove: readonly ? void 0 : (e) => {
					this.handleMouseMove(index, e);
				}
			}, [require_vdom.normalizeVNode(() => icon), this.allowHalf ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-rate__half`, { [`${mergedClsPrefix}-rate__half--active`]: !entireStarActive && hoverIndex !== null ? index + .5 <= hoverIndex : index + .5 <= (mergedValue || 0) }])
			}, [require_vdom.normalizeVNode(() => icon)], 2)) : require_vdom.normalizeVNode(() => null)], 42, _hoisted_1);
		}))], 46, _hoisted_2);
	}
});
//#endregion
exports.default = Rate_default;
exports.rateProps = rateProps;
