const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/_internal/slot-machine/src/SlotMachineNumber.tsx
var SlotMachineNumber_default = (0, vue.defineComponent)({
	name: "SlotMachineNumber",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		value: {
			type: [Number, String],
			required: true
		},
		oldOriginalNumber: {
			type: Number,
			default: void 0
		},
		newOriginalNumber: {
			type: Number,
			default: void 0
		}
	},
	setup(props) {
		const numberRef = (0, vue.ref)(null);
		const oldNumberRef = (0, vue.ref)(props.value);
		const newNumberRef = (0, vue.ref)(props.value);
		const scrollAnimationDirectionRef = (0, vue.ref)("up");
		const activeRef = (0, vue.ref)(false);
		const newNumberScrollAnimationClassRef = (0, vue.computed)(() => {
			return activeRef.value ? `${props.clsPrefix}-base-slot-machine-current-number--${scrollAnimationDirectionRef.value}-scroll` : null;
		});
		const oldNumberScrollAnimationClassRef = (0, vue.computed)(() => {
			return activeRef.value ? `${props.clsPrefix}-base-slot-machine-old-number--${scrollAnimationDirectionRef.value}-scroll` : null;
		});
		(0, vue.watch)((0, vue.toRef)(props, "value"), (value, oldValue) => {
			oldNumberRef.value = oldValue;
			newNumberRef.value = value;
			(0, vue.nextTick)(scroll);
		});
		function scroll() {
			const newOriginalNumber = props.newOriginalNumber;
			const oldOriginalNumber = props.oldOriginalNumber;
			if (oldOriginalNumber === void 0 || newOriginalNumber === void 0) return;
			if (newOriginalNumber > oldOriginalNumber) scrollByDir("up");
			else if (oldOriginalNumber > newOriginalNumber) scrollByDir("down");
		}
		function scrollByDir(dir) {
			scrollAnimationDirectionRef.value = dir;
			activeRef.value = false;
			(0, vue.nextTick)(() => {
				numberRef.value?.offsetWidth;
				activeRef.value = true;
			});
		}
		return () => {
			const { clsPrefix } = props;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				ref: numberRef,
				class: require_vdom.normalizeClass(`${clsPrefix}-base-slot-machine-number`)
			}, [
				oldNumberRef.value !== null ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
					key: 0,
					class: require_vdom.normalizeClass([`${clsPrefix}-base-slot-machine-old-number ${clsPrefix}-base-slot-machine-old-number--top`, oldNumberScrollAnimationClassRef.value])
				}, [require_vdom.normalizeVNode(() => oldNumberRef.value)], 2)) : require_vdom.normalizeVNode(() => null),
				(0, vue.createElementVNode)("span", { class: require_vdom.normalizeClass([`${clsPrefix}-base-slot-machine-current-number`, newNumberScrollAnimationClassRef.value]) }, [(0, vue.createElementVNode)("span", {
					ref: "numberWrapper",
					class: require_vdom.normalizeClass([`${clsPrefix}-base-slot-machine-current-number__inner`, typeof props.value !== "number" && `${clsPrefix}-base-slot-machine-current-number__inner--not-number`])
				}, [require_vdom.normalizeVNode(() => newNumberRef.value)], 2)], 2),
				oldNumberRef.value !== null ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
					key: 2,
					class: require_vdom.normalizeClass([`${clsPrefix}-base-slot-machine-old-number ${clsPrefix}-base-slot-machine-old-number--bottom`, oldNumberScrollAnimationClassRef.value])
				}, [require_vdom.normalizeVNode(() => oldNumberRef.value)], 2)) : require_vdom.normalizeVNode(() => null)
			], 2);
		};
	}
});
//#endregion
module.exports = SlotMachineNumber_default;
