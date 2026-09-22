const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_marquee_styles_light = require("../styles/light.js");
const require_marquee_src_props = require("./props.js");
const require_marquee_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vueuc = require("vueuc");
//#region src/marquee/src/Marquee.tsx
const _hoisted_1 = ["onAnimationiteration"];
const _hoisted_2 = ["onAnimationiteration"];
var Marquee_default = (0, vue.defineComponent)({
	name: "Marquee",
	props: require_marquee_src_props.marqueeProps,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		require__mixins_use_theme.default("Marquee", "-marquee", require_marquee_src_styles_index_cssr, require_marquee_styles_light.default, props, mergedClsPrefixRef);
		const containerElRef = (0, vue.ref)(null);
		const contentWidthRef = (0, vue.ref)(-1);
		const containerWidthRef = (0, vue.ref)(-1);
		const playStateRef = (0, vue.ref)("running");
		const repeatCountInOneGroupRef = (0, vue.computed)(() => {
			if (!props.autoFill) return 1;
			const { value: contentWidth } = contentWidthRef;
			const { value: containerWidth } = containerWidthRef;
			if (contentWidth === -1 || containerWidth === -1) return 1;
			return Math.ceil(containerWidthRef.value / contentWidth);
		});
		const durationRef = (0, vue.computed)(() => {
			const { value: contentWidth } = contentWidthRef;
			if (contentWidth === -1) return 0;
			return contentWidth * repeatCountInOneGroupRef.value / props.speed;
		});
		const animationCssVarsRef = (0, vue.computed)(() => {
			return {
				"--n-play": playStateRef.value,
				"--n-direction": "normal",
				"--n-duration": `${durationRef.value}s`,
				"--n-delay": "0s",
				"--n-iteration-count": "infinite",
				"--n-min-width": "auto"
			};
		});
		function resetScrollState() {
			playStateRef.value = "paused";
			(0, vue.nextTick)().then(() => {
				containerElRef.value?.offsetTop;
				playStateRef.value = "running";
			});
		}
		function handleContainerResize(entry) {
			containerWidthRef.value = entry.contentRect.width;
		}
		function handleContentResize(entry) {
			contentWidthRef.value = entry.contentRect.width;
		}
		function handleAnimationIteration() {
			resetScrollState();
		}
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			animationCssVars: animationCssVarsRef,
			containerElRef,
			repeatCountInOneGroup: repeatCountInOneGroupRef,
			handleContainerResize,
			handleContentResize,
			handleAnimationIteration
		};
	},
	render() {
		const { $slots, mergedClsPrefix, animationCssVars, repeatCountInOneGroup, handleAnimationIteration } = this;
		const originalNode = ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VResizeObserver, { onResize: this.handleContentResize }, { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-marquee__item ${mergedClsPrefix}-marquee__original-item`) }, [require_vdom.normalizeVNode(() => $slots.default?.())], 2)) }, 1032, ["onResize"]));
		const mirrorNode = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-marquee__item`) }, [require_vdom.normalizeVNode(() => $slots.default?.())], 2));
		if (this.autoFill) return (0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VResizeObserver, {
			key: 1,
			onResize: this.handleContainerResize
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-marquee ${mergedClsPrefix}-marquee--auto-fill`),
			ref: "containerElRef",
			style: (0, vue.normalizeStyle)(animationCssVars)
		}, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-marquee__group`),
			onAnimationiteration: handleAnimationIteration
		}, [require_vdom.normalizeVNode(() => originalNode), require_vdom.normalizeVNode(() => (0, seemly.repeat)(repeatCountInOneGroup - 1, mirrorNode))], 42, _hoisted_1), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-marquee__group`) }, [require_vdom.normalizeVNode(() => (0, seemly.repeat)(repeatCountInOneGroup, mirrorNode))], 2)], 6)) }, 1032, ["onResize"]);
		else return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 2,
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-marquee`]),
			ref: "containerElRef",
			style: (0, vue.normalizeStyle)(animationCssVars)
		}, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-marquee__group`),
			onAnimationiteration: handleAnimationIteration
		}, [require_vdom.normalizeVNode(() => originalNode)], 42, _hoisted_2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-marquee__group`) }, [require_vdom.normalizeVNode(() => mirrorNode)], 2)], 6);
	}
});
//#endregion
module.exports = Marquee_default;
