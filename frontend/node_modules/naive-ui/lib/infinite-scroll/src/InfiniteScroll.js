Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
let vue = require("vue");
//#region src/infinite-scroll/src/InfiniteScroll.tsx
const infiniteScrollProps = {
	distance: {
		type: Number,
		default: 0
	},
	onLoad: Function,
	scrollbarProps: Object
};
var InfiniteScroll_default = (0, vue.defineComponent)({
	name: "InfiniteScroll",
	props: infiniteScrollProps,
	setup(props) {
		const scrollbarInstRef = (0, vue.ref)(null);
		let loading = false;
		const handleCheckBottom = async () => {
			const { value: scrollbarInst } = scrollbarInstRef;
			if (scrollbarInst) {
				const { containerRef } = scrollbarInst;
				const scrollHeight = containerRef?.scrollHeight;
				const clientHeight = containerRef?.clientHeight;
				const scrollTop = containerRef?.scrollTop;
				if (containerRef && scrollHeight !== void 0 && clientHeight !== void 0 && scrollTop !== void 0) {
					if (scrollTop + clientHeight >= scrollHeight - props.distance) {
						loading = true;
						try {
							await props.onLoad?.();
						} catch {}
						loading = false;
					}
				}
			}
		};
		const handleScroll = () => {
			if (loading) return;
			handleCheckBottom();
		};
		const handleWheel = (e) => {
			if (e.deltaY <= 0) return;
			if (loading) return;
			handleCheckBottom();
		};
		return {
			scrollbarInstRef,
			handleScroll,
			handleWheel
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.XScrollbar, (0, vue.mergeProps)(this.scrollbarProps, {
			ref: "scrollbarInstRef",
			onWheel: this.handleWheel,
			onScroll: this.handleScroll
		}), {
			_: 1,
			default: require_vdom.normalizeSlot(() => {
				return require__utils_vue_resolve_slot.resolveSlot(this.$slots.default, () => []);
			})
		}, 16, ["onWheel", "onScroll"]);
	}
});
//#endregion
exports.default = InfiniteScroll_default;
exports.infiniteScrollProps = infiniteScrollProps;
