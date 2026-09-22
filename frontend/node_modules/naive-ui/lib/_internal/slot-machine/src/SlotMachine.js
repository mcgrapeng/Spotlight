const require__mixins_use_style = require("../../../_mixins/use-style.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_fade_in_expand_transition_src_FadeInExpandTransition = require("../../fade-in-expand-transition/src/FadeInExpandTransition.js");
const require__internal_slot_machine_src_SlotMachineNumber = require("./SlotMachineNumber.js");
const require__internal_slot_machine_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/_internal/slot-machine/src/SlotMachine.tsx
var SlotMachine_default = (0, vue.defineComponent)({
	name: "BaseSlotMachine",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		value: {
			type: [Number, String],
			default: 0
		},
		max: {
			type: Number,
			default: void 0
		},
		appeared: {
			type: Boolean,
			required: true
		}
	},
	setup(props) {
		require__mixins_use_style("-base-slot-machine", require__internal_slot_machine_src_styles_index_cssr, (0, vue.toRef)(props, "clsPrefix"));
		const oldValueRef = (0, vue.ref)();
		const newValueRef = (0, vue.ref)();
		const numbersRef = (0, vue.computed)(() => {
			if (typeof props.value === "string") return [];
			if (props.value < 1) return [0];
			const numbers = [];
			let value = props.value;
			if (props.max !== void 0) value = Math.min(props.max, value);
			while (value >= 1) {
				numbers.push(value % 10);
				value /= 10;
				value = Math.floor(value);
			}
			numbers.reverse();
			return numbers;
		});
		(0, vue.watch)((0, vue.toRef)(props, "value"), (value, oldValue) => {
			if (typeof value === "string") {
				newValueRef.value = void 0;
				oldValueRef.value = void 0;
			} else if (typeof oldValue === "string") {
				newValueRef.value = value;
				oldValueRef.value = void 0;
			} else {
				newValueRef.value = value;
				oldValueRef.value = oldValue;
			}
		});
		return () => {
			const { value, clsPrefix } = props;
			return typeof value === "number" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				key: 1,
				class: require_vdom.normalizeClass(`${clsPrefix}-base-slot-machine`)
			}, [(0, vue.createVNode)(vue.TransitionGroup, {
				name: "fade-up-width-expand-transition",
				tag: "span"
			}, { default: () => numbersRef.value.map((number, i) => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_slot_machine_src_SlotMachineNumber, {
				clsPrefix,
				key: numbersRef.value.length - i - 1,
				oldOriginalNumber: oldValueRef.value,
				newOriginalNumber: newValueRef.value,
				value: number
			}, null, 8, [
				"clsPrefix",
				"oldOriginalNumber",
				"newOriginalNumber",
				"value"
			]))) }, 1024), (0, vue.createVNode)(require__internal_fade_in_expand_transition_src_FadeInExpandTransition, {
				key: "+",
				width: true
			}, { default: () => props.max !== void 0 && props.max < value ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_slot_machine_src_SlotMachineNumber, {
				key: 2,
				clsPrefix,
				value: "+"
			}, null, 8, ["clsPrefix"])) : null }, 1024)], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				key: 3,
				class: require_vdom.normalizeClass(`${clsPrefix}-base-slot-machine`)
			}, [require_vdom.normalizeVNode(() => value)], 2));
		};
	}
});
//#endregion
module.exports = SlotMachine_default;
