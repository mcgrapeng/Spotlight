Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_adjusted_to = require("../../_utils/composable/use-adjusted-to.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_slider_styles_light = require("../styles/light.js");
const require_slider_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_slider_src_utils = require("./utils.js");
let vue = require("vue");
let evtd = require("evtd");
let vooks = require("vooks");
let vueuc = require("vueuc");
//#region src/slider/src/Slider.tsx
const _hoisted_1 = [
	"tabindex",
	"aria-valuenow",
	"aria-valuemin",
	"aria-valuemax",
	"aria-orientation",
	"aria-disabled",
	"onFocus",
	"onBlur",
	"onMouseenter",
	"onMouseleave"
];
const _hoisted_2 = [
	"onKeydown",
	"onMousedown",
	"onTouchstart"
];
const eventButtonLeft = 0;
const sliderProps = {
	...require__mixins_use_theme.default.props,
	to: require__utils_composable_use_adjusted_to.useAdjustedTo.propTo,
	defaultValue: {
		type: [Number, Array],
		default: 0
	},
	marks: Object,
	disabled: {
		type: Boolean,
		default: void 0
	},
	formatTooltip: Function,
	keyboard: {
		type: Boolean,
		default: true
	},
	min: {
		type: Number,
		default: 0
	},
	max: {
		type: Number,
		default: 100
	},
	step: {
		type: [Number, String],
		default: 1
	},
	range: Boolean,
	value: [Number, Array],
	placement: String,
	showTooltip: {
		type: Boolean,
		default: void 0
	},
	tooltip: {
		type: Boolean,
		default: true
	},
	vertical: Boolean,
	reverse: Boolean,
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	onDragstart: [Function],
	onDragend: [Function]
};
var Slider_default = (0, vue.defineComponent)({
	name: "Slider",
	props: sliderProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, namespaceRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Slider", "-slider", require_slider_src_styles_index_cssr, require_slider_styles_light, props, mergedClsPrefixRef);
		const handleRailRef = (0, vue.ref)(null);
		const [handleRefs, setHandleRefs] = require_slider_src_utils.useRefs();
		const [followerRefs, setFollowerRefs] = require_slider_src_utils.useRefs();
		const followerEnabledIndexSetRef = (0, vue.ref)(/* @__PURE__ */ new Set());
		const formItem = require__mixins_use_form_item.default(props);
		const { mergedDisabledRef } = formItem;
		const precisionRef = (0, vue.computed)(() => {
			const { step } = props;
			if (Number(step) <= 0 || step === "mark") return 0;
			const stepString = step.toString();
			let precision = 0;
			if (stepString.includes(".")) precision = stepString.length - stepString.indexOf(".") - 1;
			return precision;
		});
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const controlledValueRef = (0, vue.toRef)(props, "value");
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		const arrifiedValueRef = (0, vue.computed)(() => {
			const { value: mergedValue } = mergedValueRef;
			return (props.range ? mergedValue : [mergedValue]).map(clampValue);
		});
		const handleCountExceeds2Ref = (0, vue.computed)(() => arrifiedValueRef.value.length > 2);
		const mergedPlacementRef = (0, vue.computed)(() => {
			return props.placement === void 0 ? props.vertical ? "right" : "top" : props.placement;
		});
		const markValuesRef = (0, vue.computed)(() => {
			const { marks } = props;
			return marks ? Object.keys(marks).map(Number.parseFloat) : null;
		});
		const activeIndexRef = (0, vue.ref)(-1);
		const previousIndexRef = (0, vue.ref)(-1);
		const hoverIndexRef = (0, vue.ref)(-1);
		const draggingRef = (0, vue.ref)(false);
		const dotTransitionDisabledRef = (0, vue.ref)(false);
		const styleDirectionRef = (0, vue.computed)(() => {
			const { vertical, reverse } = props;
			return vertical ? reverse ? "top" : "bottom" : reverse ? "right" : "left";
		});
		const fillStyleRef = (0, vue.computed)(() => {
			if (handleCountExceeds2Ref.value) return;
			const values = arrifiedValueRef.value;
			const start = valueToPercentage(props.range ? Math.min(...values) : props.min);
			const end = valueToPercentage(props.range ? Math.max(...values) : values[0]);
			const { value: styleDirection } = styleDirectionRef;
			return props.vertical ? {
				[styleDirection]: `${start}%`,
				height: `${end - start}%`
			} : {
				[styleDirection]: `${start}%`,
				width: `${end - start}%`
			};
		});
		const markInfosRef = (0, vue.computed)(() => {
			const mergedMarks = [];
			const { marks } = props;
			if (marks) {
				const orderValues = arrifiedValueRef.value.slice();
				orderValues.sort((a, b) => a - b);
				const { value: styleDirection } = styleDirectionRef;
				const { value: handleCountExceeds2 } = handleCountExceeds2Ref;
				const { range } = props;
				const isActive = handleCountExceeds2 ? () => false : (num) => range ? num >= orderValues[0] && num <= orderValues[orderValues.length - 1] : num <= orderValues[0];
				for (const key of Object.keys(marks)) {
					const num = Number(key);
					mergedMarks.push({
						active: isActive(num),
						key: num,
						label: marks[key],
						style: { [styleDirection]: `${valueToPercentage(num)}%` }
					});
				}
			}
			return mergedMarks;
		});
		function getHandleStyle(value, index) {
			const percentage = valueToPercentage(value);
			const { value: styleDirection } = styleDirectionRef;
			return {
				[styleDirection]: `${percentage}%`,
				zIndex: index === activeIndexRef.value ? 1 : 0
			};
		}
		function isShowTooltip(index) {
			return props.showTooltip || hoverIndexRef.value === index || activeIndexRef.value === index && draggingRef.value;
		}
		function shouldKeepTooltipTransition(index) {
			if (!draggingRef.value) return true;
			return !(activeIndexRef.value === index && previousIndexRef.value === index);
		}
		function focusActiveHandle(index) {
			if (~index) {
				activeIndexRef.value = index;
				handleRefs.get(index)?.focus();
			}
		}
		function syncPosition() {
			followerRefs.forEach((inst, index) => {
				if (isShowTooltip(index)) inst.syncPosition();
			});
		}
		function doUpdateValue(value) {
			const { "onUpdate:value": _onUpdateValue, onUpdateValue } = props;
			const { nTriggerFormInput, nTriggerFormChange } = formItem;
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value);
			uncontrolledValueRef.value = value;
			nTriggerFormInput();
			nTriggerFormChange();
		}
		function dispatchValueUpdate(value) {
			const { range } = props;
			if (range) {
				if (Array.isArray(value)) {
					const { value: oldValues } = arrifiedValueRef;
					if (value.join() !== oldValues.join()) doUpdateValue(value);
				}
			} else if (!Array.isArray(value)) {
				if (arrifiedValueRef.value[0] !== value) doUpdateValue(value);
			}
		}
		function doDispatchValue(value, index) {
			if (props.range) {
				const values = arrifiedValueRef.value.slice();
				values.splice(index, 1, value);
				dispatchValueUpdate(values);
			} else dispatchValueUpdate(value);
		}
		function sanitizeValue(value, currentValue, stepBuffer) {
			const stepping = stepBuffer !== void 0;
			if (!stepBuffer) stepBuffer = value - currentValue > 0 ? 1 : -1;
			const markValues = markValuesRef.value || [];
			const { step } = props;
			if (step === "mark") {
				const closestMark = getClosestMark(value, markValues.concat(currentValue), stepping ? stepBuffer : void 0);
				return closestMark ? closestMark.value : currentValue;
			}
			if (step <= 0) return currentValue;
			const { value: precision } = precisionRef;
			let closestMark;
			if (stepping) {
				const currentStep = Number((currentValue / step).toFixed(precision));
				const actualStep = Math.floor(currentStep);
				const leftStep = currentStep > actualStep ? actualStep : actualStep - 1;
				const rightStep = currentStep < actualStep ? actualStep : actualStep + 1;
				closestMark = getClosestMark(currentValue, [
					Number((leftStep * step).toFixed(precision)),
					Number((rightStep * step).toFixed(precision)),
					...markValues
				], stepBuffer);
			} else {
				const roundValue = getRoundValue(value);
				closestMark = getClosestMark(value, [...markValues, roundValue]);
			}
			return closestMark ? clampValue(closestMark.value) : currentValue;
		}
		function clampValue(value) {
			return Math.min(props.max, Math.max(props.min, value));
		}
		function valueToPercentage(value) {
			const { max, min } = props;
			return (value - min) / (max - min) * 100;
		}
		function percentageToValue(percentage) {
			const { max, min } = props;
			return min + (max - min) * percentage;
		}
		function getRoundValue(value) {
			const { step, min } = props;
			if (Number(step) <= 0 || step === "mark") return value;
			const newValue = Math.round((value - min) / step) * step + min;
			return Number(newValue.toFixed(precisionRef.value));
		}
		function getClosestMark(currentValue, markValues = markValuesRef.value, buffer) {
			if (!markValues?.length) return null;
			let closestMark = null;
			let index = -1;
			while (++index < markValues.length) {
				const diff = markValues[index] - currentValue;
				const distance = Math.abs(diff);
				if ((buffer === void 0 || diff * buffer > 0) && (closestMark === null || distance < closestMark.distance)) closestMark = {
					index,
					distance,
					value: markValues[index]
				};
			}
			return closestMark;
		}
		function getPointValue(event) {
			const railEl = handleRailRef.value;
			if (!railEl) return;
			const touchEvent = require_slider_src_utils.isTouchEvent(event) ? event.touches[0] : event;
			const railRect = railEl.getBoundingClientRect();
			let percentage;
			if (props.vertical) percentage = (railRect.bottom - touchEvent.clientY) / railRect.height;
			else percentage = (touchEvent.clientX - railRect.left) / railRect.width;
			if (props.reverse) percentage = 1 - percentage;
			return percentageToValue(percentage);
		}
		function handleRailKeyDown(e) {
			if (mergedDisabledRef.value || !props.keyboard) return;
			const { vertical, reverse } = props;
			switch (e.key) {
				case "ArrowUp":
					e.preventDefault();
					handleStepValue(vertical && reverse ? -1 : 1);
					break;
				case "ArrowRight":
					e.preventDefault();
					handleStepValue(!vertical && reverse ? -1 : 1);
					break;
				case "ArrowDown":
					e.preventDefault();
					handleStepValue(vertical && reverse ? 1 : -1);
					break;
				case "ArrowLeft":
					e.preventDefault();
					handleStepValue(!vertical && reverse ? 1 : -1);
			}
		}
		function handleStepValue(ratio) {
			const activeIndex = activeIndexRef.value;
			if (activeIndex === -1) return;
			const { step } = props;
			const currentValue = arrifiedValueRef.value[activeIndex];
			doDispatchValue(sanitizeValue(Number(step) <= 0 || step === "mark" ? currentValue : currentValue + step * ratio, currentValue, ratio > 0 ? 1 : -1), activeIndex);
		}
		function handleRailMouseDown(event) {
			if (mergedDisabledRef.value) return;
			if (!require_slider_src_utils.isTouchEvent(event) && event.button !== eventButtonLeft) return;
			const pointValue = getPointValue(event);
			if (pointValue === void 0) return;
			const values = arrifiedValueRef.value.slice();
			const activeIndex = props.range ? getClosestMark(pointValue, values)?.index ?? -1 : 0;
			if (activeIndex !== -1) {
				event.preventDefault();
				focusActiveHandle(activeIndex);
				startDragging();
				doDispatchValue(sanitizeValue(pointValue, arrifiedValueRef.value[activeIndex]), activeIndex);
			}
		}
		function startDragging() {
			if (!draggingRef.value) {
				draggingRef.value = true;
				if (props.onDragstart) require__utils_vue_call.call(props.onDragstart);
				(0, evtd.on)("touchend", document, handleMouseUp);
				(0, evtd.on)("mouseup", document, handleMouseUp);
				(0, evtd.on)("touchmove", document, handleMouseMove);
				(0, evtd.on)("mousemove", document, handleMouseMove);
			}
		}
		function stopDragging() {
			if (draggingRef.value) {
				draggingRef.value = false;
				if (props.onDragend) require__utils_vue_call.call(props.onDragend);
				(0, evtd.off)("touchend", document, handleMouseUp);
				(0, evtd.off)("mouseup", document, handleMouseUp);
				(0, evtd.off)("touchmove", document, handleMouseMove);
				(0, evtd.off)("mousemove", document, handleMouseMove);
			}
		}
		function handleMouseMove(event) {
			const { value: activeIndex } = activeIndexRef;
			if (!draggingRef.value || activeIndex === -1) {
				stopDragging();
				return;
			}
			const pointValue = getPointValue(event);
			if (pointValue === void 0) return;
			doDispatchValue(sanitizeValue(pointValue, arrifiedValueRef.value[activeIndex]), activeIndex);
		}
		function handleMouseUp() {
			stopDragging();
		}
		function handleHandleFocus(index) {
			activeIndexRef.value = index;
			if (!mergedDisabledRef.value) hoverIndexRef.value = index;
		}
		function handleHandleBlur(index) {
			if (activeIndexRef.value === index) {
				activeIndexRef.value = -1;
				stopDragging();
			}
			if (hoverIndexRef.value === index) hoverIndexRef.value = -1;
		}
		function handleHandleMouseEnter(index) {
			hoverIndexRef.value = index;
		}
		function handleHandleMouseLeave(index) {
			if (hoverIndexRef.value === index) hoverIndexRef.value = -1;
		}
		(0, vue.watch)(activeIndexRef, (_, previous) => void (0, vue.nextTick)(() => previousIndexRef.value = previous));
		(0, vue.watch)(mergedValueRef, () => {
			if (props.marks) {
				if (dotTransitionDisabledRef.value) return;
				dotTransitionDisabledRef.value = true;
				(0, vue.nextTick)(() => {
					dotTransitionDisabledRef.value = false;
				});
			}
			(0, vue.nextTick)(syncPosition);
		});
		(0, vue.onBeforeUnmount)(() => {
			stopDragging();
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { markFontSize, railColor, railColorHover, fillColor, fillColorHover, handleColor, opacityDisabled, dotColor, dotColorModal, handleBoxShadow, handleBoxShadowHover, handleBoxShadowActive, handleBoxShadowFocus, dotBorder, dotBoxShadow, railHeight, railWidthVertical, handleSize, dotHeight, dotWidth, dotBorderRadius, fontSize, dotBorderActive, dotColorPopover }, common: { cubicBezierEaseInOut } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-dot-border": dotBorder,
				"--n-dot-border-active": dotBorderActive,
				"--n-dot-border-radius": dotBorderRadius,
				"--n-dot-box-shadow": dotBoxShadow,
				"--n-dot-color": dotColor,
				"--n-dot-color-modal": dotColorModal,
				"--n-dot-color-popover": dotColorPopover,
				"--n-dot-height": dotHeight,
				"--n-dot-width": dotWidth,
				"--n-fill-color": fillColor,
				"--n-fill-color-hover": fillColorHover,
				"--n-font-size": fontSize,
				"--n-handle-box-shadow": handleBoxShadow,
				"--n-handle-box-shadow-active": handleBoxShadowActive,
				"--n-handle-box-shadow-focus": handleBoxShadowFocus,
				"--n-handle-box-shadow-hover": handleBoxShadowHover,
				"--n-handle-color": handleColor,
				"--n-handle-size": handleSize,
				"--n-opacity-disabled": opacityDisabled,
				"--n-rail-color": railColor,
				"--n-rail-color-hover": railColorHover,
				"--n-rail-height": railHeight,
				"--n-rail-width-vertical": railWidthVertical,
				"--n-mark-font-size": markFontSize
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("slider", void 0, cssVarsRef, props) : void 0;
		const indicatorCssVarsRef = (0, vue.computed)(() => {
			const { self: { fontSize, indicatorColor, indicatorBoxShadow, indicatorTextColor, indicatorBorderRadius } } = themeRef.value;
			return {
				"--n-font-size": fontSize,
				"--n-indicator-border-radius": indicatorBorderRadius,
				"--n-indicator-box-shadow": indicatorBoxShadow,
				"--n-indicator-color": indicatorColor,
				"--n-indicator-text-color": indicatorTextColor
			};
		});
		const indicatorThemeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("slider-indicator", void 0, indicatorCssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			namespace: namespaceRef,
			uncontrolledValue: uncontrolledValueRef,
			mergedValue: mergedValueRef,
			mergedDisabled: mergedDisabledRef,
			mergedPlacement: mergedPlacementRef,
			isMounted: (0, vooks.useIsMounted)(),
			adjustedTo: require__utils_composable_use_adjusted_to.useAdjustedTo(props),
			dotTransitionDisabled: dotTransitionDisabledRef,
			markInfos: markInfosRef,
			isShowTooltip,
			shouldKeepTooltipTransition,
			handleRailRef,
			setHandleRefs,
			setFollowerRefs,
			fillStyle: fillStyleRef,
			getHandleStyle,
			activeIndex: activeIndexRef,
			arrifiedValues: arrifiedValueRef,
			followerEnabledIndexSet: followerEnabledIndexSetRef,
			handleRailMouseDown,
			handleHandleFocus,
			handleHandleBlur,
			handleHandleMouseEnter,
			handleHandleMouseLeave,
			handleRailKeyDown,
			indicatorCssVars: inlineThemeDisabled ? void 0 : indicatorCssVarsRef,
			indicatorThemeClass: indicatorThemeClassHandle?.themeClass,
			indicatorOnRender: indicatorThemeClassHandle?.onRender,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix, themeClass, formatTooltip } = this;
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-slider`,
				themeClass,
				{
					[`${mergedClsPrefix}-slider--disabled`]: this.mergedDisabled,
					[`${mergedClsPrefix}-slider--active`]: this.activeIndex !== -1,
					[`${mergedClsPrefix}-slider--with-mark`]: this.marks,
					[`${mergedClsPrefix}-slider--vertical`]: this.vertical,
					[`${mergedClsPrefix}-slider--reverse`]: this.reverse
				}
			]),
			style: (0, vue.normalizeStyle)(this.cssVars),
			onKeydown: this.handleRailKeyDown,
			onMousedown: this.handleRailMouseDown,
			onTouchstart: this.handleRailMouseDown
		}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-slider-rail`) }, [
			(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-slider-rail__fill`),
				style: (0, vue.normalizeStyle)(this.fillStyle)
			}, null, 6),
			this.marks ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-slider-dots`, this.dotTransitionDisabled && `${mergedClsPrefix}-slider-dots--transition-disabled`])
			}, [require_vdom.normalizeVNode(() => this.markInfos.map((mark) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: mark.key,
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-slider-dot`, { [`${mergedClsPrefix}-slider-dot--active`]: mark.active }]),
				style: (0, vue.normalizeStyle)(mark.style)
			}, null, 6))))], 2)) : require_vdom.normalizeVNode(() => null),
			(0, vue.createElementVNode)("div", {
				ref: "handleRailRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-slider-handles`)
			}, [require_vdom.normalizeVNode(() => this.arrifiedValues.map((value, index) => {
				const showTooltip = this.isShowTooltip(index);
				return (0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VBinder, null, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VTarget, null, { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					ref: this.setHandleRefs(index),
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-slider-handle-wrapper`),
					tabindex: this.mergedDisabled ? -1 : 0,
					role: "slider",
					"aria-valuenow": value,
					"aria-valuemin": this.min,
					"aria-valuemax": this.max,
					"aria-orientation": this.vertical ? "vertical" : "horizontal",
					"aria-disabled": this.disabled,
					style: (0, vue.normalizeStyle)(this.getHandleStyle(value, index)),
					onFocus: () => {
						this.handleHandleFocus(index);
					},
					onBlur: () => {
						this.handleHandleBlur(index);
					},
					onMouseenter: () => {
						this.handleHandleMouseEnter(index);
					},
					onMouseleave: () => {
						this.handleHandleMouseLeave(index);
					}
				}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(this.$slots.thumb, () => [((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-slider-handle`) }, null, 2))]))], 46, _hoisted_1)) }, 1024)), this.tooltip && ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFollower, {
					ref: this.setFollowerRefs(index),
					show: showTooltip,
					to: this.adjustedTo,
					enabled: this.showTooltip && !this.range || this.followerEnabledIndexSet.has(index),
					teleportDisabled: this.adjustedTo === require__utils_composable_use_adjusted_to.useAdjustedTo.tdkey,
					placement: this.mergedPlacement,
					containerClass: this.namespace
				}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
					name: "fade-in-scale-up-transition",
					appear: this.isMounted,
					css: this.shouldKeepTooltipTransition(index),
					onEnter: () => {
						this.followerEnabledIndexSet.add(index);
					},
					onAfterLeave: () => {
						this.followerEnabledIndexSet.delete(index);
					}
				}, { default: () => {
					if (showTooltip) {
						this.indicatorOnRender?.();
						return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
							key: 1,
							class: require_vdom.normalizeClass([
								`${mergedClsPrefix}-slider-handle-indicator`,
								this.indicatorThemeClass,
								`${mergedClsPrefix}-slider-handle-indicator--${this.mergedPlacement}`
							]),
							style: (0, vue.normalizeStyle)(this.indicatorCssVars)
						}, [typeof formatTooltip === "function" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => formatTooltip(value))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => value)], 64))], 6);
					}
					return null;
				} }, 1032, [
					"appear",
					"css",
					"onEnter",
					"onAfterLeave"
				])) }, 1032, [
					"show",
					"to",
					"enabled",
					"teleportDisabled",
					"placement",
					"containerClass"
				]))] }, 1024);
			}))], 2),
			this.marks ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-slider-marks`)
			}, [require_vdom.normalizeVNode(() => this.markInfos.map((mark) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: mark.key,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-slider-mark`),
				style: (0, vue.normalizeStyle)(mark.style)
			}, [typeof mark.label === "function" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => mark.label())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => mark.label)], 64))], 6))))], 2)) : require_vdom.normalizeVNode(() => null)
		], 2)], 46, _hoisted_2);
	}
});
//#endregion
exports.default = Slider_default;
exports.sliderProps = sliderProps;
