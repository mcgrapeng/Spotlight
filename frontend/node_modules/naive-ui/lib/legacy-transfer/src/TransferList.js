const require__mixins_use_config = require("../../_mixins/use-config.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_empty_src_Empty = require("../../empty/src/Empty.js");
const require_legacy_transfer_src_interface = require("./interface.js");
const require_legacy_transfer_src_TransferListItem = require("./TransferListItem.js");
let vue = require("vue");
let vueuc = require("vueuc");
//#region src/legacy-transfer/src/TransferList.tsx
var TransferList_default = (0, vue.defineComponent)({
	name: "TransferList",
	props: {
		virtualScroll: {
			type: Boolean,
			required: true
		},
		itemSize: {
			type: Number,
			required: true
		},
		options: {
			type: Array,
			required: true
		},
		disabled: {
			type: Boolean,
			required: true
		},
		isMounted: {
			type: Boolean,
			required: true
		},
		isInputing: {
			type: Boolean,
			required: true
		},
		source: Boolean
	},
	setup() {
		const { mergedThemeRef, mergedClsPrefixRef } = (0, vue.inject)(require_legacy_transfer_src_interface.transferInjectionKey);
		const { mergedComponentPropsRef } = require__mixins_use_config.default();
		const scrollerInstRef = (0, vue.ref)(null);
		const vlInstRef = (0, vue.ref)(null);
		const mergedRenderEmptyRef = (0, vue.computed)(() => {
			return mergedComponentPropsRef?.value?.Transfer?.renderEmpty;
		});
		function syncVLScroller() {
			scrollerInstRef.value?.sync();
		}
		function scrollContainer() {
			const { value } = vlInstRef;
			if (!value) return null;
			const { listElRef } = value;
			return listElRef;
		}
		function scrollContent() {
			const { value } = vlInstRef;
			if (!value) return null;
			const { itemsElRef } = value;
			return itemsElRef;
		}
		return {
			mergedTheme: mergedThemeRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedRenderEmpty: mergedRenderEmptyRef,
			scrollerInstRef,
			vlInstRef,
			syncVLScroller,
			scrollContainer,
			scrollContent
		};
	},
	render() {
		const { mergedTheme, mergedClsPrefix, virtualScroll, syncVLScroller } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
			ref: "scrollerInstRef",
			theme: mergedTheme.peers.Scrollbar,
			themeOverrides: mergedTheme.peerOverrides.Scrollbar,
			container: virtualScroll ? this.scrollContainer : void 0,
			content: virtualScroll ? this.scrollContent : void 0
		}, { default: () => virtualScroll ? ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VirtualList, {
			key: 1,
			ref: "vlInstRef",
			style: { height: "100%" },
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list-content`),
			items: this.options,
			itemSize: this.itemSize,
			showScrollbar: false,
			onResize: syncVLScroller,
			onScroll: syncVLScroller,
			keyField: "value"
		}, { default: ({ item }) => {
			const { source, disabled } = this;
			return (0, vue.openBlock)(), (0, vue.createBlock)(require_legacy_transfer_src_TransferListItem, {
				source,
				key: item.value,
				value: item.value,
				disabled: item.disabled || disabled,
				label: item.label
			}, null, 8, [
				"source",
				"value",
				"disabled",
				"label"
			]);
		} }, 1032, [
			"class",
			"items",
			"itemSize",
			"onResize",
			"onScroll"
		])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 2,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list-content`)
		}, [((0, vue.openBlock)(), (0, vue.createBlock)(vue.TransitionGroup, {
			name: "item",
			appear: this.isMounted,
			css: !this.isInputing
		}, { default: () => {
			const { source, disabled } = this;
			return this.options.map((option) => ((0, vue.openBlock)(), (0, vue.createBlock)(require_legacy_transfer_src_TransferListItem, {
				source,
				key: option.value,
				value: option.value,
				disabled: option.disabled || disabled,
				label: option.label
			}, null, 8, [
				"source",
				"value",
				"disabled",
				"label"
			])));
		} }, 1032, ["appear", "css"]))], 2)) }, 1032, [
			"theme",
			"themeOverrides",
			"container",
			"content"
		])), ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "fade-in-transition",
			appear: this.isMounted,
			css: !this.isInputing
		}, { default: () => this.options.length ? null : this.mergedRenderEmpty?.() || ((0, vue.openBlock)(), (0, vue.createBlock)(require_empty_src_Empty.default, {
			key: 3,
			theme: mergedTheme.peers.Empty,
			themeOverrides: mergedTheme.peerOverrides.Empty
		}, null, 8, ["theme", "themeOverrides"])) }, 1032, ["appear", "css"]))], 64);
	}
});
//#endregion
module.exports = TransferList_default;
