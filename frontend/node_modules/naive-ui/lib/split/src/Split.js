Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_split_styles_light = require("../styles/light.js");
const require_split_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let evtd = require("evtd");
let vooks = require("vooks");
//#region src/split/src/Split.tsx
const _hoisted_1 = ["onMousedown"];
const splitProps = {
	...require__mixins_use_theme.default.props,
	direction: {
		type: String,
		default: "horizontal"
	},
	resizeTriggerSize: {
		type: Number,
		default: 3
	},
	disabled: Boolean,
	defaultSize: {
		type: [String, Number],
		default: .5
	},
	"onUpdate:size": [Function, Array],
	onUpdateSize: [Function, Array],
	size: [String, Number],
	min: {
		type: [String, Number],
		default: 0
	},
	max: {
		type: [String, Number],
		default: 1
	},
	pane1Class: String,
	pane1Style: [Object, String],
	pane2Class: String,
	pane2Style: [Object, String],
	onDragStart: Function,
	onDragMove: Function,
	onDragEnd: Function,
	watchProps: Array
};
var Split_default = (0, vue.defineComponent)({
	name: "Split",
	props: splitProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Split", "-split", require_split_src_styles_index_cssr, require_split_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { resizableTriggerColor, resizableTriggerColorHover } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-resize-trigger-color": resizableTriggerColor,
				"--n-resize-trigger-color-hover": resizableTriggerColorHover
			};
		});
		const resizeTriggerElRef = (0, vue.ref)(null);
		const isDraggingRef = (0, vue.ref)(false);
		const controlledSizeRef = (0, vue.toRef)(props, "size");
		const uncontrolledSizeRef = (0, vue.ref)(props.defaultSize);
		if (props.watchProps?.includes("defaultSize")) (0, vue.watchEffect)(() => uncontrolledSizeRef.value = props.defaultSize);
		const doUpdateSize = (size) => {
			const _onUpdateSize = props["onUpdate:size"];
			if (props.onUpdateSize) require__utils_vue_call.call(props.onUpdateSize, size);
			if (_onUpdateSize) require__utils_vue_call.call(_onUpdateSize, size);
			uncontrolledSizeRef.value = size;
		};
		const mergedSizeRef = (0, vooks.useMergedState)(controlledSizeRef, uncontrolledSizeRef);
		const firstPaneStyle = (0, vue.computed)(() => {
			const sizeValue = mergedSizeRef.value;
			if (typeof sizeValue === "string") return { flex: `0 0 ${sizeValue}` };
			else if (typeof sizeValue === "number") {
				const size = sizeValue * 100;
				return { flex: `0 0 calc(${size}% - ${props.resizeTriggerSize * size / 100}px)` };
			}
		});
		const resizeTriggerStyle = (0, vue.computed)(() => {
			return props.direction === "horizontal" ? {
				width: `${props.resizeTriggerSize}px`,
				height: "100%"
			} : {
				width: "100%",
				height: `${props.resizeTriggerSize}px`
			};
		});
		const resizeTriggerWrapperStyle = (0, vue.computed)(() => {
			const horizontal = props.direction === "horizontal";
			return {
				width: horizontal ? `${props.resizeTriggerSize}px` : "",
				height: horizontal ? "" : `${props.resizeTriggerSize}px`,
				cursor: props.direction === "horizontal" ? "col-resize" : "row-resize"
			};
		});
		let offset = 0;
		const handleMouseDown = (e) => {
			e.preventDefault();
			isDraggingRef.value = true;
			if (props.onDragStart) props.onDragStart(e);
			const mouseMoveEvent = "mousemove";
			const mouseUpEvent = "mouseup";
			const onMouseMove = (e) => {
				updateSize(e);
				if (props.onDragMove) props.onDragMove(e);
			};
			const onMouseUp = () => {
				(0, evtd.off)(mouseMoveEvent, document, onMouseMove);
				(0, evtd.off)(mouseUpEvent, document, onMouseUp);
				isDraggingRef.value = false;
				if (props.onDragEnd) props.onDragEnd(e);
				document.body.style.cursor = "";
			};
			document.body.style.cursor = resizeTriggerWrapperStyle.value.cursor;
			(0, evtd.on)(mouseMoveEvent, document, onMouseMove);
			(0, evtd.on)(mouseUpEvent, document, onMouseUp);
			const resizeTriggerEl = resizeTriggerElRef.value;
			if (resizeTriggerEl) {
				const elRect = resizeTriggerEl.getBoundingClientRect();
				if (props.direction === "horizontal") offset = e.clientX - elRect.left;
				else offset = elRect.top - e.clientY;
			}
			updateSize(e);
		};
		function updateSize(event) {
			const containerRect = resizeTriggerElRef.value?.parentElement?.getBoundingClientRect();
			if (!containerRect) return;
			const { direction } = props;
			const containerUsableWidth = containerRect.width - props.resizeTriggerSize;
			const containerUsableHeight = containerRect.height - props.resizeTriggerSize;
			const containerUsableSize = direction === "horizontal" ? containerUsableWidth : containerUsableHeight;
			const newPxSize = direction === "horizontal" ? event.clientX - containerRect.left - offset : event.clientY - containerRect.top + offset;
			const { min, max } = props;
			const pxMin = typeof min === "string" ? (0, seemly.depx)(min) : min * containerUsableSize;
			const pxMax = typeof max === "string" ? (0, seemly.depx)(max) : max * containerUsableSize;
			let nextPxSize = newPxSize;
			nextPxSize = Math.max(nextPxSize, pxMin);
			nextPxSize = Math.min(nextPxSize, pxMax, containerUsableSize);
			if (typeof mergedSizeRef.value === "string") doUpdateSize(`${nextPxSize}px`);
			else doUpdateSize(nextPxSize / containerUsableSize);
		}
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("split", void 0, cssVarsRef, props) : void 0;
		return {
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			resizeTriggerElRef,
			isDragging: isDraggingRef,
			mergedClsPrefix: mergedClsPrefixRef,
			resizeTriggerWrapperStyle,
			resizeTriggerStyle,
			handleMouseDown,
			firstPaneStyle
		};
	},
	render() {
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${this.mergedClsPrefix}-split`,
				`${this.mergedClsPrefix}-split--${this.direction}`,
				this.themeClass
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [
			(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass([`${this.mergedClsPrefix}-split-pane-1`, this.pane1Class]),
				style: (0, vue.normalizeStyle)([this.firstPaneStyle, this.pane1Style])
			}, [require_vdom.normalizeVNode(() => this.$slots[1]?.())], 6),
			require_vdom.normalizeVNode(() => !this.disabled && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				ref: "resizeTriggerElRef",
				class: require_vdom.normalizeClass(`${this.mergedClsPrefix}-split__resize-trigger-wrapper`),
				style: (0, vue.normalizeStyle)(this.resizeTriggerWrapperStyle),
				onMousedown: this.handleMouseDown
			}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(this.$slots["resize-trigger"], () => [((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				style: (0, vue.normalizeStyle)(this.resizeTriggerStyle),
				class: require_vdom.normalizeClass([`${this.mergedClsPrefix}-split__resize-trigger`, this.isDragging && `${this.mergedClsPrefix}-split__resize-trigger--hover`])
			}, null, 6))]))], 46, _hoisted_1))),
			(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass([`${this.mergedClsPrefix}-split-pane-2`, this.pane2Class]),
				style: (0, vue.normalizeStyle)(this.pane2Style)
			}, [require_vdom.normalizeVNode(() => this.$slots[2]?.())], 6)
		], 6);
	}
});
//#endregion
exports.default = Split_default;
exports.splitProps = splitProps;
