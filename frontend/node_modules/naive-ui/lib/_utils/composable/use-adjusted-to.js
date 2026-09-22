Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__internal_select_menu_src_interface = require("../../_internal/select-menu/src/interface.js");
const require_drawer_src_interface = require("../../drawer/src/interface.js");
const require_modal_src_interface = require("../../modal/src/interface.js");
const require_popover_src_interface = require("../../popover/src/interface.js");
let vue = require("vue");
let evtd = require("evtd");
let vooks = require("vooks");
//#region src/_utils/composable/use-adjusted-to.ts
const teleportDisabled = "__disabled__";
function useAdjustedTo(props) {
	const modal = (0, vue.inject)(require_modal_src_interface.modalBodyInjectionKey, null);
	const drawer = (0, vue.inject)(require_drawer_src_interface.drawerBodyInjectionKey, null);
	const popover = (0, vue.inject)(require_popover_src_interface.popoverBodyInjectionKey, null);
	const selectMenu = (0, vue.inject)(require__internal_select_menu_src_interface.internalSelectionMenuBodyInjectionKey, null);
	const fullscreenElementRef = (0, vue.ref)();
	if (typeof document !== "undefined") {
		fullscreenElementRef.value = document.fullscreenElement;
		const handleFullscreenChange = () => {
			fullscreenElementRef.value = document.fullscreenElement;
		};
		(0, vue.onMounted)(() => {
			(0, evtd.on)("fullscreenchange", document, handleFullscreenChange);
		});
		(0, vue.onBeforeUnmount)(() => {
			(0, evtd.off)("fullscreenchange", document, handleFullscreenChange);
		});
	}
	return (0, vooks.useMemo)(() => {
		const { to } = props;
		if (to !== void 0) {
			if (to === false) return teleportDisabled;
			if (to === true) return fullscreenElementRef.value || "body";
			return to;
		}
		if (modal?.value) return modal.value.$el ?? modal.value;
		if (drawer?.value) return drawer.value;
		if (popover?.value) return popover.value;
		if (selectMenu?.value) return selectMenu.value;
		return to ?? (fullscreenElementRef.value || "body");
	});
}
useAdjustedTo.tdkey = teleportDisabled;
useAdjustedTo.propTo = {
	type: [
		String,
		Object,
		Boolean
	],
	default: void 0
};
//#endregion
exports.useAdjustedTo = useAdjustedTo;
