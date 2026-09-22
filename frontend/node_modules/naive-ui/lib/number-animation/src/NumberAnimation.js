Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require_number_animation_src_utils = require("./utils.js");
let vue = require("vue");
let lodash_es = require("lodash");
//#region src/number-animation/src/NumberAnimation.tsx
const numberAnimationProps = {
	to: {
		type: Number,
		default: 0
	},
	precision: {
		type: Number,
		default: 0
	},
	showSeparator: Boolean,
	locale: String,
	from: {
		type: Number,
		default: 0
	},
	active: {
		type: Boolean,
		default: true
	},
	duration: {
		type: Number,
		default: 2e3
	},
	onFinish: Function
};
var NumberAnimation_default = (0, vue.defineComponent)({
	name: "NumberAnimation",
	props: numberAnimationProps,
	setup(props) {
		const { localeRef } = require__mixins_use_locale("name");
		const { duration } = props;
		const displayedValueRef = (0, vue.ref)(props.from);
		const mergedLocaleRef = (0, vue.computed)(() => {
			const { locale } = props;
			if (locale !== void 0) return locale;
			return localeRef.value;
		});
		let animating = false;
		const onUpdate = (currentValue) => {
			displayedValueRef.value = currentValue;
		};
		const onFinish = () => {
			displayedValueRef.value = props.to;
			animating = false;
			props.onFinish?.();
		};
		const animate = (from = props.from, to = props.to) => {
			animating = true;
			displayedValueRef.value = props.from;
			if (from !== to) require_number_animation_src_utils.tween({
				from,
				to,
				duration,
				onUpdate,
				onFinish
			});
		};
		const formattedValueRef = (0, vue.computed)(() => {
			const splitValue = (0, lodash_es.round)(displayedValueRef.value, props.precision).toFixed(props.precision).split(".");
			const numberFormatter = new Intl.NumberFormat(mergedLocaleRef.value);
			const decimalSeparator = numberFormatter.formatToParts(.5).find((part) => part.type === "decimal")?.value;
			return {
				integer: props.showSeparator ? numberFormatter.format(Number(splitValue[0])) : splitValue[0],
				decimal: splitValue[1],
				decimalSeparator
			};
		});
		function play() {
			if (animating) return;
			animate();
		}
		(0, vue.onMounted)(() => {
			(0, vue.watchEffect)(() => {
				if (props.active) animate();
			});
		});
		return {
			formattedValue: formattedValueRef,
			play
		};
	},
	render() {
		const { formattedValue: { integer, decimal, decimalSeparator } } = this;
		return [
			integer,
			decimal ? decimalSeparator : null,
			decimal
		];
	}
});
//#endregion
exports.default = NumberAnimation_default;
exports.numberAnimationProps = numberAnimationProps;
