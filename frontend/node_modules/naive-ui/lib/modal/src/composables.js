Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_modal_src_context = require("./context.js");
let vue = require("vue");
let evtd = require("evtd");
//#region src/modal/src/composables.ts
function useModal() {
	const modal = (0, vue.inject)(require_modal_src_context.modalApiInjectionKey, null);
	if (modal === null) require__utils_naive_warn.throwError("use-modal", "No outer <n-modal-provider /> founded.");
	return modal;
}
function useModalReactiveList() {
	const modalReactiveList = (0, vue.inject)(require_modal_src_context.modalReactiveListInjectionKey, null);
	if (modalReactiveList === null) require__utils_naive_warn.throwError("use-modal-reactive-list", "No outer <n-modal-provider /> founded.");
	return modalReactiveList;
}
const DRAGGABLE_CLASS = "n-draggable";
function useDragModal(draggablePropsRef, options) {
	let cleanup;
	const dragXRef = (0, vue.ref)(null);
	const dragYRef = (0, vue.ref)(null);
	const draggableRef = (0, vue.computed)(() => {
		return draggablePropsRef.value !== false;
	});
	const draggableClassRef = (0, vue.computed)(() => {
		return draggableRef.value ? DRAGGABLE_CLASS : "";
	});
	const boundsToWindowRef = (0, vue.computed)(() => {
		const draggableProps = draggablePropsRef.value;
		if (draggableProps === true || draggableProps === false) return true;
		else if (draggableProps) return draggableProps.bounds !== "none";
		else return true;
	});
	function startDrag(modal) {
		const header = modal.querySelector(`.${DRAGGABLE_CLASS}`);
		if (!header || !draggableClassRef.value) return;
		let maxMoveX = 0;
		let minMoveX = 0;
		let maxMoveY = 0;
		let minMoveY = 0;
		let prevMoveY = 0;
		let prevMoveX = 0;
		let mousedownEvent;
		let rafId = null;
		let pendingPosition = null;
		function handleMouseDown(event) {
			event.preventDefault();
			mousedownEvent = event;
			const { x, y, right, bottom } = modal.getBoundingClientRect();
			minMoveX = x;
			minMoveY = y;
			maxMoveX = window.innerWidth - right;
			maxMoveY = window.innerHeight - bottom;
			if (dragXRef.value !== null && dragYRef.value !== null) {
				prevMoveX = dragXRef.value;
				prevMoveY = dragYRef.value;
			} else {
				const { left, top } = modal.style;
				prevMoveY = +top.slice(0, -2);
				prevMoveX = +left.slice(0, -2);
			}
		}
		function updatePosition() {
			if (pendingPosition) {
				dragXRef.value = pendingPosition.x;
				dragYRef.value = pendingPosition.y;
				pendingPosition = null;
			}
			rafId = null;
		}
		function handleMouseMove(event) {
			if (!mousedownEvent) return;
			const { clientX: downX, clientY: downY } = mousedownEvent;
			let moveX = event.clientX - downX;
			let moveY = event.clientY - downY;
			if (boundsToWindowRef.value) {
				if (moveX > maxMoveX) moveX = maxMoveX;
				else if (-moveX > minMoveX) moveX = -minMoveX;
				if (moveY > maxMoveY) moveY = maxMoveY;
				else if (-moveY > minMoveY) moveY = -minMoveY;
			}
			pendingPosition = {
				x: moveX + prevMoveX,
				y: moveY + prevMoveY
			};
			if (!rafId) rafId = requestAnimationFrame(updatePosition);
		}
		function handleMouseUp() {
			mousedownEvent = void 0;
			if (rafId) {
				cancelAnimationFrame(rafId);
				rafId = null;
			}
			if (pendingPosition) {
				dragXRef.value = pendingPosition.x;
				dragYRef.value = pendingPosition.y;
				pendingPosition = null;
			}
			(0, vue.nextTick)(() => {
				options.onEnd(modal);
			});
		}
		(0, evtd.on)("mousedown", header, handleMouseDown);
		(0, evtd.on)("mousemove", window, handleMouseMove);
		(0, evtd.on)("mouseup", window, handleMouseUp);
		cleanup = () => {
			if (rafId) cancelAnimationFrame(rafId);
			(0, evtd.off)("mousedown", header, handleMouseDown);
			(0, evtd.off)("mousemove", window, handleMouseMove);
			(0, evtd.off)("mouseup", window, handleMouseUp);
		};
	}
	function stopDrag() {
		if (cleanup) {
			cleanup();
			cleanup = void 0;
		}
		dragXRef.value = null;
		dragYRef.value = null;
	}
	(0, vue.onUnmounted)(stopDrag);
	return {
		stopDrag,
		startDrag,
		draggableRef,
		draggableClassRef,
		dragX: dragXRef,
		dragY: dragYRef
	};
}
//#endregion
exports.DRAGGABLE_CLASS = DRAGGABLE_CLASS;
exports.useDragModal = useDragModal;
exports.useModal = useModal;
exports.useModalReactiveList = useModalReactiveList;
