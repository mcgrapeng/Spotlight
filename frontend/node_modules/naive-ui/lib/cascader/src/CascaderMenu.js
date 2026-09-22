const require__utils_composable_use_resize = require("../../_utils/composable/use-resize.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_focus_detector_index = require("../../_internal/focus-detector/index.js");
const require__internal_menu_mask_src_MenuMask = require("../../_internal/menu-mask/src/MenuMask.js");
const require_empty_src_Empty = require("../../empty/src/Empty.js");
const require_cascader_src_interface = require("./interface.js");
const require_cascader_src_CascaderSubmenu = require("./CascaderSubmenu.js");
let vue = require("vue");
let vdirs = require("vdirs");
//#region src/cascader/src/CascaderMenu.tsx
const _hoisted_1 = [
	"onMousedown",
	"onFocusin",
	"onFocusout",
	"onKeydown"
];
var CascaderMenu_default = (0, vue.defineComponent)({
	name: "NCascaderMenu",
	props: {
		value: [
			String,
			Number,
			Array
		],
		placement: {
			type: String,
			default: "bottom-start"
		},
		show: Boolean,
		menuModel: {
			type: Array,
			required: true
		},
		loading: Boolean,
		onFocus: {
			type: Function,
			required: true
		},
		onBlur: {
			type: Function,
			required: true
		},
		onKeydown: {
			type: Function,
			required: true
		},
		onMousedown: {
			type: Function,
			required: true
		},
		onTabout: {
			type: Function,
			required: true
		}
	},
	setup(props) {
		const { localeRef, isMountedRef, mergedClsPrefixRef, syncCascaderMenuPosition, handleCascaderMenuClickOutside, mergedThemeRef, getColumnStyleRef } = (0, vue.inject)(require_cascader_src_interface.cascaderInjectionKey);
		const { mergedComponentPropsRef } = require__mixins_use_config.default();
		const submenuInstRefs = [];
		const maskInstRef = (0, vue.ref)(null);
		const selfElRef = (0, vue.ref)(null);
		function handleResize() {
			syncCascaderMenuPosition();
		}
		require__utils_composable_use_resize.useOnResize(selfElRef, handleResize);
		function showErrorMessage(label) {
			const { value: { loadingRequiredMessage } } = localeRef;
			maskInstRef.value?.showOnce(loadingRequiredMessage(label));
		}
		function handleClickOutside(e) {
			handleCascaderMenuClickOutside(e);
		}
		function handleFocusin(e) {
			const { value: selfEl } = selfElRef;
			if (!selfEl) return;
			if (!selfEl.contains(e.relatedTarget)) props.onFocus(e);
		}
		function handleFocusout(e) {
			const { value: selfEl } = selfElRef;
			if (!selfEl) return;
			if (!selfEl.contains(e.relatedTarget)) props.onBlur(e);
		}
		const exposedRef = {
			scroll(depth, index, elSize) {
				const submenuInst = submenuInstRefs[depth];
				if (submenuInst) submenuInst.scroll(index, elSize);
			},
			showErrorMessage
		};
		return {
			isMounted: isMountedRef,
			mergedClsPrefix: mergedClsPrefixRef,
			selfElRef,
			submenuInstRefs,
			maskInstRef,
			mergedTheme: mergedThemeRef,
			mergedRenderEmpty: (0, vue.computed)(() => {
				return mergedComponentPropsRef?.value?.Cascader?.renderEmpty;
			}),
			getColumnStyle: getColumnStyleRef,
			handleFocusin,
			handleFocusout,
			handleClickOutside,
			...exposedRef
		};
	},
	render() {
		const { submenuInstRefs, mergedClsPrefix, mergedTheme } = this;
		return (0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "fade-in-scale-up-transition",
			appear: this.isMounted
		}, { default: () => {
			if (!this.show) return null;
			return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				tabindex: "0",
				ref: "selfElRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-cascader-menu`),
				onMousedown: this.onMousedown,
				onFocusin: this.handleFocusin,
				onFocusout: this.handleFocusout,
				onKeydown: this.onKeydown
			}, [
				this.menuModel[0].length ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-cascader-submenu-wrapper`)
				}, [require_vdom.normalizeVNode(() => this.menuModel.map((submenuOptions, index) => ((0, vue.openBlock)(), (0, vue.createBlock)(require_cascader_src_CascaderSubmenu, {
					style: (0, vue.normalizeStyle)(this.getColumnStyle?.({ level: index })),
					ref: ((instance) => {
						if (instance) submenuInstRefs[index] = instance;
					}),
					key: index,
					tmNodes: submenuOptions,
					depth: index + 1
				}, null, 8, [
					"style",
					"tmNodes",
					"depth"
				])))), ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_menu_mask_src_MenuMask, {
					clsPrefix: mergedClsPrefix,
					ref: "maskInstRef"
				}, null, 8, ["clsPrefix"]))], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 1,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-cascader-menu__empty`)
				}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(this.$slots.empty, () => {
					return [this.mergedRenderEmpty?.() || ((0, vue.openBlock)(), (0, vue.createBlock)(require_empty_src_Empty.default, {
						theme: mergedTheme.peers.Empty,
						themeOverrides: mergedTheme.peerOverrides.Empty
					}, null, 8, ["theme", "themeOverrides"]))];
				}))], 2)),
				require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(this.$slots.action, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-cascader-menu-action`),
					"data-action": true
				}, [require_vdom.normalizeVNode(() => children)], 2)))),
				((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_focus_detector_index, { onFocus: this.onTabout }, null, 8, ["onFocus"]))
			], 42, _hoisted_1)), [[
				vdirs.clickoutside,
				this.handleClickOutside,
				void 0,
				{ capture: true }
			]]);
		} }, 1032, ["appear"]);
	}
});
//#endregion
module.exports = CascaderMenu_default;
