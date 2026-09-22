Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
let vue = require("vue");
let vueuc = require("vueuc");
//#region src/virtual-list/src/VirtualList.tsx
const virtualListProps = {
	scrollbarProps: Object,
	items: {
		type: Array,
		default: () => []
	},
	itemSize: {
		type: Number,
		required: true
	},
	itemResizable: Boolean,
	itemsStyle: [String, Object],
	visibleItemsTag: {
		type: [String, Object],
		default: "div"
	},
	visibleItemsProps: Object,
	ignoreItemResize: Boolean,
	onScroll: Function,
	onWheel: Function,
	onResize: Function,
	defaultScrollKey: [Number, String],
	defaultScrollIndex: Number,
	keyField: {
		type: String,
		default: "key"
	},
	paddingTop: {
		type: [Number, String],
		default: 0
	},
	paddingBottom: {
		type: [Number, String],
		default: 0
	}
};
var VirtualList_default = (0, vue.defineComponent)({
	name: "VirtualList",
	props: virtualListProps,
	setup(props) {
		const scrollbarInstRef = (0, vue.ref)(null);
		const virtualListInstRef = (0, vue.ref)(null);
		function syncScrollbar() {
			const { value: scrollbarInst } = scrollbarInstRef;
			if (scrollbarInst) scrollbarInst.sync();
		}
		function handleScroll(e) {
			syncScrollbar();
			props.onScroll?.(e);
		}
		function handleResize(e) {
			syncScrollbar();
			props.onResize?.(e);
		}
		function handleWheel(e) {
			props.onWheel?.(e);
		}
		function scrollTo(options, y) {
			if (typeof options === "number") virtualListInstRef.value?.scrollTo(options, y ?? 0);
			else virtualListInstRef.value?.scrollTo(options);
		}
		function getScrollContainer() {
			return virtualListInstRef.value?.listElRef;
		}
		function getScrollContent() {
			return virtualListInstRef.value?.itemsElRef;
		}
		return {
			scrollTo,
			scrollbarInstRef,
			virtualListInstRef,
			getScrollContainer,
			getScrollContent,
			handleScroll,
			handleResize,
			handleWheel
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.XScrollbar, (0, vue.mergeProps)(this.scrollbarProps, {
			ref: "scrollbarInstRef",
			container: this.getScrollContainer,
			content: this.getScrollContent
		}), {
			_: 1,
			default: require_vdom.normalizeSlot(() => {
				return (0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VVirtualList, {
					ref: "virtualListInstRef",
					showScrollbar: false,
					items: this.items,
					itemSize: this.itemSize,
					itemResizable: this.itemResizable,
					itemsStyle: this.itemsStyle,
					visibleItemsTag: this.visibleItemsTag,
					visibleItemsProps: this.visibleItemsProps,
					ignoreItemResize: this.ignoreItemResize,
					keyField: this.keyField,
					defaultScrollKey: this.defaultScrollKey,
					defaultScrollIndex: this.defaultScrollIndex,
					paddingTop: this.paddingTop,
					paddingBottom: this.paddingBottom,
					onScroll: this.handleScroll,
					onResize: this.handleResize,
					onWheel: this.handleWheel
				}, {
					_: 1,
					default: require_vdom.normalizeSlot(({ item, index }) => this.$slots.default?.({
						item,
						index
					}))
				}, 8, [
					"items",
					"itemSize",
					"itemResizable",
					"itemsStyle",
					"visibleItemsTag",
					"visibleItemsProps",
					"ignoreItemResize",
					"keyField",
					"defaultScrollKey",
					"defaultScrollIndex",
					"paddingTop",
					"paddingBottom",
					"onScroll",
					"onResize",
					"onWheel"
				]);
			})
		}, 16, ["container", "content"]);
	}
});
//#endregion
exports.default = VirtualList_default;
exports.virtualListProps = virtualListProps;
