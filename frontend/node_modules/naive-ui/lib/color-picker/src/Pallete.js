const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
let evtd = require("evtd");
//#region src/color-picker/src/Pallete.tsx
const _hoisted_1 = ["onMousedown"];
const HANDLE_SIZE = "12px";
const RADIUS = "6px";
var Pallete_default = (0, vue.defineComponent)({
	name: "Pallete",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		rgba: {
			type: Array,
			default: null
		},
		displayedHue: {
			type: Number,
			required: true
		},
		displayedSv: {
			type: Array,
			required: true
		},
		onUpdateSV: {
			type: Function,
			required: true
		},
		onComplete: Function
	},
	setup(props) {
		const palleteRef = (0, vue.ref)(null);
		function handleMouseDown(e) {
			if (!palleteRef.value) return;
			(0, evtd.on)("mousemove", document, handleMouseMove);
			(0, evtd.on)("mouseup", document, handleMouseUp);
			handleMouseMove(e);
		}
		function handleMouseMove(e) {
			const { value: palleteEl } = palleteRef;
			if (!palleteEl) return;
			const { width, height, left, bottom } = palleteEl.getBoundingClientRect();
			const newV = (bottom - e.clientY) / height;
			const newS = (e.clientX - left) / width;
			const normalizedNewS = 100 * (newS > 1 ? 1 : newS < 0 ? 0 : newS);
			const normalizedNewV = 100 * (newV > 1 ? 1 : newV < 0 ? 0 : newV);
			props.onUpdateSV(normalizedNewS, normalizedNewV);
		}
		function handleMouseUp() {
			(0, evtd.off)("mousemove", document, handleMouseMove);
			(0, evtd.off)("mouseup", document, handleMouseUp);
			props.onComplete?.();
		}
		return {
			palleteRef,
			handleColor: (0, vue.computed)(() => {
				const { rgba } = props;
				if (!rgba) return "";
				return `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`;
			}),
			handleMouseDown
		};
	},
	render() {
		const { clsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-pallete`),
			onMousedown: this.handleMouseDown,
			ref: "palleteRef"
		}, [
			(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-pallete__layer`),
				style: (0, vue.normalizeStyle)({ backgroundImage: `linear-gradient(90deg, white, hsl(${this.displayedHue}, 100%, 50%))` })
			}, null, 6),
			(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-pallete__layer ${clsPrefix}-color-picker-pallete__layer--shadowed`),
				style: { backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0%), rgba(0, 0, 0, 100%))" }
			}, null, 2),
			require_vdom.normalizeVNode(() => this.rgba && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-handle`),
				style: (0, vue.normalizeStyle)({
					width: HANDLE_SIZE,
					height: HANDLE_SIZE,
					borderRadius: RADIUS,
					left: `calc(${this.displayedSv[0]}% - ${RADIUS})`,
					bottom: `calc(${this.displayedSv[1]}% - ${RADIUS})`
				})
			}, [(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-handle__fill`),
				style: (0, vue.normalizeStyle)({
					backgroundColor: this.handleColor,
					borderRadius: RADIUS,
					width: HANDLE_SIZE,
					height: HANDLE_SIZE
				})
			}, null, 6)], 6)))
		], 42, _hoisted_1);
	}
});
//#endregion
module.exports = Pallete_default;
