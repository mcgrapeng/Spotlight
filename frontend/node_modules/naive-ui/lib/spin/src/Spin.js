Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_loading_src_Loading = require("../../_internal/loading/src/Loading.js");
const require_spin_styles_light = require("../styles/light.js");
const require_spin_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/spin/src/Spin.tsx
const STROKE_WIDTH = {
	small: 20,
	medium: 18,
	large: 16
};
const spinProps = {
	...require__mixins_use_theme.default.props,
	contentClass: String,
	contentStyle: [Object, String],
	description: String,
	size: {
		type: [String, Number],
		default: "medium"
	},
	show: {
		type: Boolean,
		default: true
	},
	rotate: {
		type: Boolean,
		default: true
	},
	spinning: {
		type: Boolean,
		validator: () => {
			return true;
		},
		default: void 0
	},
	delay: Number,
	...require__internal_loading_src_Loading.exposedLoadingProps,
	strokeWidth: Number
};
var Spin_default = (0, vue.defineComponent)({
	name: "Spin",
	props: spinProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.spinning !== void 0) require__utils_naive_warn.warnOnce("spin", "`spinning` is deprecated, please use `show` instead.");
		});
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Spin", "-spin", require_spin_src_styles_index_cssr, require_spin_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { size: spinSize } = props;
			const { common: { cubicBezierEaseInOut }, self } = themeRef.value;
			const { opacitySpinning, color, textColor } = self;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-opacity-spinning": opacitySpinning,
				"--n-size": typeof spinSize === "number" ? (0, seemly.pxfy)(spinSize) : self[require__utils_cssr_index.createKey("size", spinSize)],
				"--n-color": color,
				"--n-text-color": textColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("spin", (0, vue.computed)(() => {
			const { size } = props;
			return typeof size === "number" ? String(size) : size[0];
		}), cssVarsRef, props) : void 0;
		const compitableShow = (0, vooks.useCompitable)(props, ["spinning", "show"]);
		const activeRef = (0, vue.ref)(false);
		(0, vue.watchEffect)((onCleanup) => {
			let timerId;
			if (compitableShow.value) {
				const { delay } = props;
				if (delay) {
					timerId = window.setTimeout(() => {
						activeRef.value = true;
					}, delay);
					onCleanup(() => {
						clearTimeout(timerId);
					});
					return;
				}
			}
			activeRef.value = compitableShow.value;
		});
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			active: activeRef,
			mergedStrokeWidth: (0, vue.computed)(() => {
				const { strokeWidth } = props;
				if (strokeWidth !== void 0) return strokeWidth;
				const { size } = props;
				return STROKE_WIDTH[typeof size === "number" ? "medium" : size];
			}),
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { $slots, mergedClsPrefix, description } = this;
		const rotate = $slots.icon && this.rotate;
		const descriptionNode = (description || $slots.description) && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-spin-description`) }, [require_vdom.normalizeVNode(() => description || $slots.description?.())], 2));
		const icon = $slots.icon ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 1,
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-spin-body`, this.themeClass])
		}, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-spin`, rotate && `${mergedClsPrefix}-spin--rotate`]),
			style: (0, vue.normalizeStyle)($slots.default ? "" : this.cssVars)
		}, [require_vdom.normalizeVNode(() => $slots.icon())], 6), require_vdom.normalizeVNode(() => descriptionNode)], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 2,
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-spin-body`, this.themeClass])
		}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_loading_src_Loading.default, {
			clsPrefix: mergedClsPrefix,
			style: (0, vue.normalizeStyle)($slots.default ? "" : this.cssVars),
			stroke: this.stroke,
			"stroke-width": this.mergedStrokeWidth,
			radius: this.radius,
			scale: this.scale,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-spin`)
		}, null, 8, [
			"clsPrefix",
			"style",
			"stroke",
			"stroke-width",
			"radius",
			"scale",
			"class"
		])), require_vdom.normalizeVNode(() => descriptionNode)], 2));
		this.onRender?.();
		return $slots.default ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 3,
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-spin-container`, this.themeClass]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-spin-content`,
				this.active && `${mergedClsPrefix}-spin-content--spinning`,
				this.contentClass
			]),
			style: (0, vue.normalizeStyle)(this.contentStyle)
		}, [require_vdom.normalizeVNode(() => $slots.default?.())], 6), (0, vue.createVNode)(vue.Transition, { name: "fade-in-transition" }, { default: () => this.active ? icon : null }, 1024)], 6)) : icon;
	}
});
//#endregion
exports.default = Spin_default;
exports.spinProps = spinProps;
