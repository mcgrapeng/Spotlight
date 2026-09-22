const require_drawer_src_interface = require("../../drawer/src/interface.js");
const require_modal_src_interface = require("./interface.js");
const require_popover_src_interface = require("../../popover/src/interface.js");
const require__utils_composable_use_lock_html_scroll = require("../../_utils/composable/use-lock-html-scroll.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_get_first_slot_vnode = require("../../_utils/vue/get-first-slot-vnode.js");
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_card_src_Card = require("../../card/src/Card.js");
const require_dialog_src_dialogProps = require("../../dialog/src/dialogProps.js");
const require_dialog_src_Dialog = require("../../dialog/src/Dialog.js");
const require_modal_src_composables = require("./composables.js");
const require_modal_src_presetProps = require("./presetProps.js");
let vue = require("vue");
let vueuc = require("vueuc");
let vdirs = require("vdirs");
//#region src/modal/src/BodyWrapper.tsx
var BodyWrapper_default = (0, vue.defineComponent)({
	name: "ModalBody",
	inheritAttrs: false,
	slots: Object,
	props: {
		show: {
			type: Boolean,
			required: true
		},
		preset: String,
		displayDirective: {
			type: String,
			required: true
		},
		trapFocus: {
			type: Boolean,
			default: true
		},
		autoFocus: {
			type: Boolean,
			default: true
		},
		blockScroll: Boolean,
		draggable: {
			type: [Boolean, Object],
			default: false
		},
		maskHidden: Boolean,
		...require_modal_src_presetProps.presetProps,
		onClickoutside: {
			type: Function,
			required: true
		},
		onBeforeLeave: {
			type: Function,
			required: true
		},
		onAfterLeave: {
			type: Function,
			required: true
		},
		onPositiveClick: {
			type: Function,
			required: true
		},
		onNegativeClick: {
			type: Function,
			required: true
		},
		onClose: {
			type: Function,
			required: true
		},
		onAfterEnter: Function,
		onEsc: Function
	},
	setup(props) {
		const bodyRef = (0, vue.ref)(null);
		const scrollbarRef = (0, vue.ref)(null);
		const displayedRef = (0, vue.ref)(props.show);
		const transformOriginXRef = (0, vue.ref)(null);
		const transformOriginYRef = (0, vue.ref)(null);
		const NModal = (0, vue.inject)(require_modal_src_interface.modalInjectionKey);
		let mousePosition = null;
		(0, vue.watch)((0, vue.toRef)(props, "show"), (value) => {
			if (value) mousePosition = NModal.getMousePosition();
		}, { immediate: true });
		const { stopDrag, startDrag, draggableRef, draggableClassRef, dragX, dragY } = require_modal_src_composables.useDragModal((0, vue.toRef)(props, "draggable"), { onEnd: (el) => {
			syncTransformOrigin(el);
		} });
		const dialogTitleClassRef = (0, vue.computed)(() => {
			return (0, vue.normalizeClass)([props.titleClass, draggableClassRef.value]);
		});
		const cardHeaderClassRef = (0, vue.computed)(() => {
			return (0, vue.normalizeClass)([props.headerClass, draggableClassRef.value]);
		});
		(0, vue.watch)((0, vue.toRef)(props, "show"), (value) => {
			if (value) displayedRef.value = true;
		});
		require__utils_composable_use_lock_html_scroll.useLockHtmlScroll((0, vue.computed)(() => props.blockScroll && displayedRef.value));
		function styleTransformOrigin() {
			if (NModal.transformOriginRef.value === "center") return "";
			const { value: transformOriginX } = transformOriginXRef;
			const { value: transformOriginY } = transformOriginYRef;
			if (transformOriginX === null || transformOriginY === null) return "";
			else if (scrollbarRef.value) return `${transformOriginX}px ${transformOriginY + scrollbarRef.value.containerScrollTop}px`;
			return "";
		}
		function syncTransformOrigin(el) {
			if (NModal.transformOriginRef.value === "center") return;
			if (!mousePosition) return;
			if (!scrollbarRef.value) return;
			const scrollTop = scrollbarRef.value.containerScrollTop;
			const { offsetLeft, offsetTop } = el;
			const top = mousePosition.y;
			const left = mousePosition.x;
			transformOriginXRef.value = -(offsetLeft - left);
			transformOriginYRef.value = -(offsetTop - top - scrollTop);
			el.style.transformOrigin = styleTransformOrigin();
		}
		function handleEnter(el) {
			(0, vue.nextTick)(() => {
				syncTransformOrigin(el);
			});
		}
		function handleBeforeLeave(el) {
			el.style.transformOrigin = styleTransformOrigin();
			props.onBeforeLeave();
		}
		function handleAfterEnter(el) {
			const element = el;
			draggableRef.value && startDrag(element);
			props.onAfterEnter && props.onAfterEnter(element);
		}
		function handleAfterLeave() {
			displayedRef.value = false;
			transformOriginXRef.value = null;
			transformOriginYRef.value = null;
			stopDrag();
			props.onAfterLeave();
		}
		function handleCloseClick() {
			const { onClose } = props;
			if (onClose) onClose();
		}
		function handleNegativeClick() {
			props.onNegativeClick();
		}
		function handlePositiveClick() {
			props.onPositiveClick();
		}
		const childNodeRef = (0, vue.ref)(null);
		(0, vue.watch)(childNodeRef, (node) => {
			if (node) (0, vue.nextTick)(() => {
				const el = node.el;
				if (el && bodyRef.value !== el) bodyRef.value = el;
			});
		});
		(0, vue.provide)(require_modal_src_interface.modalBodyInjectionKey, bodyRef);
		(0, vue.provide)(require_drawer_src_interface.drawerBodyInjectionKey, null);
		(0, vue.provide)(require_popover_src_interface.popoverBodyInjectionKey, null);
		return {
			mergedTheme: NModal.mergedThemeRef,
			appear: NModal.appearRef,
			isMounted: NModal.isMountedRef,
			mergedClsPrefix: NModal.mergedClsPrefixRef,
			bodyRef,
			scrollbarRef,
			draggableClass: draggableClassRef,
			displayed: displayedRef,
			childNodeRef,
			cardHeaderClass: cardHeaderClassRef,
			dialogTitleClass: dialogTitleClassRef,
			handlePositiveClick,
			handleNegativeClick,
			handleCloseClick,
			handleAfterEnter,
			handleAfterLeave,
			handleBeforeLeave,
			handleEnter,
			dragX,
			dragY
		};
	},
	render() {
		const { $slots, $attrs, handleEnter, handleAfterEnter, handleAfterLeave, handleBeforeLeave, preset, mergedClsPrefix, dragX, dragY } = this;
		const effectiveAttrs = { ...$attrs };
		if (dragX !== null && dragY !== null) effectiveAttrs.style = (0, vue.normalizeStyle)([effectiveAttrs.style, {
			left: `${dragX}px`,
			top: `${dragY}px`
		}]);
		let childNode = null;
		if (!preset) {
			childNode = require__utils_vue_get_first_slot_vnode.getFirstSlotVNodeWithTypedProps("default", $slots.default, { draggableClass: this.draggableClass });
			if (!childNode) {
				require__utils_naive_warn.warn("modal", "default slot is empty");
				return;
			}
			childNode = (0, vue.cloneVNode)(childNode);
			childNode.props = (0, vue.mergeProps)({ class: `${mergedClsPrefix}-modal` }, effectiveAttrs, childNode.props || {});
		}
		return this.displayDirective === "show" || this.displayed || this.show ? (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 1,
			role: "none",
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-modal-body-wrapper`, this.maskHidden && `${mergedClsPrefix}-modal-body-wrapper--mask-hidden`])
		}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
			ref: "scrollbarRef",
			theme: this.mergedTheme.peers.Scrollbar,
			themeOverrides: this.mergedTheme.peerOverrides.Scrollbar,
			contentClass: `${mergedClsPrefix}-modal-scroll-content`
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFocusTrap, {
			disabled: !this.trapFocus || this.maskHidden,
			active: this.show,
			onEsc: this.onEsc,
			autoFocus: this.autoFocus
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "fade-in-scale-up-transition",
			appear: this.appear ?? this.isMounted,
			onEnter: handleEnter,
			onAfterEnter: handleAfterEnter,
			onAfterLeave: handleAfterLeave,
			onBeforeLeave: handleBeforeLeave
		}, { default: () => {
			const dirs = [[vue.vShow, this.show]];
			dirs.push([
				vdirs.clickoutside,
				this.onClickoutside,
				void 0,
				{ capture: true }
			]);
			return (0, vue.withDirectives)(this.preset === "confirm" || this.preset === "dialog" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_dialog_src_Dialog.NDialog, (0, vue.mergeProps)({ key: 2 }, effectiveAttrs, {
				class: [`${mergedClsPrefix}-modal`, effectiveAttrs.class],
				ref: "bodyRef",
				theme: this.mergedTheme.peers.Dialog,
				themeOverrides: this.mergedTheme.peerOverrides.Dialog
			}, require__utils_vue_keep.keep(this.$props, require_dialog_src_dialogProps.dialogPropKeys), {
				titleClass: this.dialogTitleClass,
				"aria-modal": "true"
			}), require_vdom.normalizeSlots($slots), 1040, [
				"class",
				"theme",
				"themeOverrides",
				"titleClass"
			])) : this.preset === "card" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_card_src_Card.default, (0, vue.mergeProps)({ key: 3 }, effectiveAttrs, {
				ref: "bodyRef",
				class: [`${mergedClsPrefix}-modal`, effectiveAttrs.class],
				theme: this.mergedTheme.peers.Card,
				themeOverrides: this.mergedTheme.peerOverrides.Card
			}, require__utils_vue_keep.keep(this.$props, require_card_src_Card.cardBasePropKeys), {
				headerClass: this.cardHeaderClass,
				"aria-modal": "true",
				role: "dialog"
			}), require_vdom.normalizeSlots($slots), 1040, [
				"class",
				"theme",
				"themeOverrides",
				"headerClass"
			])) : this.childNodeRef = childNode, dirs);
		} }, 1032, [
			"appear",
			"onEnter",
			"onAfterEnter",
			"onAfterLeave",
			"onBeforeLeave"
		])) }, 1032, [
			"disabled",
			"active",
			"onEsc",
			"autoFocus"
		])) }, 1032, [
			"theme",
			"themeOverrides",
			"contentClass"
		]))], 2)), [[vue.vShow, this.displayDirective === "if" || this.displayed || this.show]]) : null;
	}
});
//#endregion
module.exports = BodyWrapper_default;
