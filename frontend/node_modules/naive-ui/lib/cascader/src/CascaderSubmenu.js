const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_cascader_src_interface = require("./interface.js");
const require_cascader_src_CascaderOption = require("./CascaderOption.js");
let seemly = require("seemly");
let vue = require("vue");
let vueuc = require("vueuc");
//#region src/cascader/src/CascaderSubmenu.tsx
var CascaderSubmenu_default = (0, vue.defineComponent)({
	name: "CascaderSubmenu",
	props: {
		depth: {
			type: Number,
			required: true
		},
		tmNodes: {
			type: Array,
			required: true
		}
	},
	setup() {
		const { virtualScrollRef, mergedClsPrefixRef, mergedThemeRef, optionHeightRef } = (0, vue.inject)(require_cascader_src_interface.cascaderInjectionKey);
		const scrollbarInstRef = (0, vue.ref)(null);
		const vlInstRef = (0, vue.ref)(null);
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedTheme: mergedThemeRef,
			scrollbarInstRef,
			vlInstRef,
			virtualScroll: virtualScrollRef,
			itemSize: (0, vue.computed)(() => (0, seemly.depx)(optionHeightRef.value)),
			handleVlScroll: () => {
				scrollbarInstRef.value?.sync();
			},
			getVlContainer: () => {
				return vlInstRef.value?.listElRef;
			},
			getVlContent: () => {
				return vlInstRef.value?.itemsElRef;
			},
			scroll(index, elSize) {
				if (virtualScrollRef.value) vlInstRef.value?.scrollTo({ index });
				else scrollbarInstRef.value?.scrollTo({
					index,
					elSize
				});
			}
		};
	},
	render() {
		const { mergedClsPrefix, mergedTheme, virtualScroll } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass([virtualScroll && `${mergedClsPrefix}-cascader-submenu--virtual`, `${mergedClsPrefix}-cascader-submenu`]) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
			ref: "scrollbarInstRef",
			theme: mergedTheme.peers.Scrollbar,
			themeOverrides: mergedTheme.peerOverrides.Scrollbar,
			container: virtualScroll ? this.getVlContainer : void 0,
			content: virtualScroll ? this.getVlContent : void 0
		}, { default: () => virtualScroll ? ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VirtualList, {
			key: 1,
			items: this.tmNodes,
			itemSize: this.itemSize,
			onScroll: this.handleVlScroll,
			showScrollbar: false,
			ref: "vlInstRef"
		}, {
			_: 1,
			default: require_vdom.normalizeSlot(({ item: tmNode }) => ((0, vue.openBlock)(), (0, vue.createBlock)(require_cascader_src_CascaderOption, {
				key: tmNode.key,
				tmNode
			}, null, 8, ["tmNode"])))
		}, 8, [
			"items",
			"itemSize",
			"onScroll"
		])) : this.tmNodes.map((tmNode) => ((0, vue.openBlock)(), (0, vue.createBlock)(require_cascader_src_CascaderOption, {
			key: tmNode.key,
			tmNode
		}, null, 8, ["tmNode"]))) }, 1032, [
			"theme",
			"themeOverrides",
			"container",
			"content"
		]))], 2);
	}
});
//#endregion
module.exports = CascaderSubmenu_default;
