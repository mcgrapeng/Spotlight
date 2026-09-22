const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require_data_table_src_interface = require("../interface.js");
let vue = require("vue");
let evtd = require("evtd");
//#region src/data-table/src/HeaderButton/ResizeButton.tsx
const _hoisted_1 = ["onMousedown"];
var ResizeButton_default = (0, vue.defineComponent)({
	name: "ColumnResizeButton",
	props: {
		onResizeStart: Function,
		onResize: Function,
		onResizeEnd: Function
	},
	setup(props) {
		const { mergedClsPrefixRef } = (0, vue.inject)(require_data_table_src_interface.dataTableInjectionKey);
		const activeRef = (0, vue.ref)(false);
		let startX = 0;
		function getMouseX(e) {
			return e.clientX;
		}
		function handleMousedown(e) {
			e.preventDefault();
			const alreadyStarted = activeRef.value;
			startX = getMouseX(e);
			activeRef.value = true;
			if (!alreadyStarted) {
				(0, evtd.on)("mousemove", window, handleMousemove);
				(0, evtd.on)("mouseup", window, handleMouseup);
				props.onResizeStart?.();
			}
		}
		function handleMousemove(e) {
			props.onResize?.(getMouseX(e) - startX);
		}
		function handleMouseup() {
			activeRef.value = false;
			props.onResizeEnd?.();
			(0, evtd.off)("mousemove", window, handleMousemove);
			(0, evtd.off)("mouseup", window, handleMouseup);
		}
		(0, vue.onBeforeUnmount)(() => {
			(0, evtd.off)("mousemove", window, handleMousemove);
			(0, evtd.off)("mouseup", window, handleMouseup);
		});
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			active: activeRef,
			handleMousedown
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
			"data-data-table-resizable": true,
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-data-table-resize-button`, this.active && `${mergedClsPrefix}-data-table-resize-button--active`]),
			onMousedown: this.handleMousedown
		}, null, 42, _hoisted_1);
	}
});
//#endregion
module.exports = ResizeButton_default;
