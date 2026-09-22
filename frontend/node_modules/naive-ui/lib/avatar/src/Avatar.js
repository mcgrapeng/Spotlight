Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_css_color_to_class = require("../../_utils/css/color-to-class.js");
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_tag_src_Tag = require("../../tag/src/Tag.js");
const require__utils_env_is_native_lazy_load = require("../../_utils/env/is-native-lazy-load.js");
const require_image_src_utils = require("../../image/src/utils.js");
const require_avatar_styles_light = require("../styles/light.js");
const require_avatar_src_context = require("./context.js");
const require_avatar_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
let vueuc = require("vueuc");
//#region src/avatar/src/Avatar.tsx
const _hoisted_1 = ["src"];
const avatarProps = {
	...require__mixins_use_theme.default.props,
	size: [String, Number],
	src: String,
	circle: {
		type: Boolean,
		default: void 0
	},
	objectFit: String,
	round: {
		type: Boolean,
		default: void 0
	},
	bordered: {
		type: Boolean,
		default: void 0
	},
	onError: Function,
	fallbackSrc: String,
	intersectionObserverOptions: Object,
	lazy: Boolean,
	onLoad: Function,
	renderPlaceholder: Function,
	renderFallback: Function,
	imgProps: Object,
	/** @deprecated */
	color: String
};
var Avatar_default = (0, vue.defineComponent)({
	name: "Avatar",
	props: avatarProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const hasLoadErrorRef = (0, vue.ref)(false);
		let memoedTextHtml = null;
		const textRef = (0, vue.ref)(null);
		const selfRef = (0, vue.ref)(null);
		const fitTextTransform = () => {
			const { value: textEl } = textRef;
			if (textEl) {
				if (memoedTextHtml === null || memoedTextHtml !== textEl.innerHTML) {
					memoedTextHtml = textEl.innerHTML;
					const { value: selfEl } = selfRef;
					if (selfEl) {
						const { offsetWidth: elWidth, offsetHeight: elHeight } = selfEl;
						const { offsetWidth: textWidth, offsetHeight: textHeight } = textEl;
						const radix = .9;
						const ratio = Math.min(elWidth / textWidth * radix, elHeight / textHeight * radix, 1);
						textEl.style.transform = `translateX(-50%) translateY(-50%) scale(${ratio})`;
					}
				}
			}
		};
		const NAvatarGroup = (0, vue.inject)(require_avatar_src_context.avatarGroupInjectionKey, null);
		const mergedSizeRef = (0, vue.computed)(() => {
			const { size } = props;
			if (size) return size;
			const { size: avatarGroupSize } = NAvatarGroup || {};
			if (avatarGroupSize) return avatarGroupSize;
			return "medium";
		});
		const themeRef = require__mixins_use_theme.default("Avatar", "-avatar", require_avatar_src_styles_index_cssr, require_avatar_styles_light.default, props, mergedClsPrefixRef);
		const TagInjection = (0, vue.inject)(require_tag_src_Tag.tagInjectionKey, null);
		const mergedRoundRef = (0, vue.computed)(() => {
			if (NAvatarGroup) return true;
			const { round, circle } = props;
			if (round !== void 0 || circle !== void 0) return round || circle;
			if (TagInjection) return TagInjection.roundRef.value;
			return false;
		});
		const mergedBorderedRef = (0, vue.computed)(() => {
			if (NAvatarGroup) return true;
			return props.bordered || false;
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const size = mergedSizeRef.value;
			const round = mergedRoundRef.value;
			const bordered = mergedBorderedRef.value;
			const { color: propColor } = props;
			const { self: { borderRadius, fontSize, color, border, colorModal, colorPopover }, common: { cubicBezierEaseInOut } } = themeRef.value;
			let height;
			if (typeof size === "number") height = `${size}px`;
			else height = themeRef.value.self[require__utils_cssr_index.createKey("height", size)];
			return {
				"--n-font-size": fontSize,
				"--n-border": bordered ? border : "none",
				"--n-border-radius": round ? "50%" : borderRadius,
				"--n-color": propColor || color,
				"--n-color-modal": propColor || colorModal,
				"--n-color-popover": propColor || colorPopover,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-merged-size": `var(--n-avatar-size-override, ${height})`
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("avatar", (0, vue.computed)(() => {
			const size = mergedSizeRef.value;
			const round = mergedRoundRef.value;
			const bordered = mergedBorderedRef.value;
			const { color } = props;
			let hash = "";
			if (size) {
				if (typeof size === "number") hash += `a${size}`;
				else hash += size[0];
			}
			if (round) hash += "b";
			if (bordered) hash += "c";
			if (color) hash += require__utils_css_color_to_class.color2Class(color);
			return hash;
		}), cssVarsRef, props) : void 0;
		const shouldStartLoadingRef = (0, vue.ref)(!props.lazy);
		(0, vue.onMounted)(() => {
			if (props.lazy && props.intersectionObserverOptions) {
				let unobserve;
				const stopWatchHandle = (0, vue.watchEffect)(() => {
					unobserve?.();
					unobserve = void 0;
					if (props.lazy) unobserve = require_image_src_utils.observeIntersection(selfRef.value, props.intersectionObserverOptions, shouldStartLoadingRef);
				});
				(0, vue.onBeforeUnmount)(() => {
					stopWatchHandle();
					unobserve?.();
				});
			}
		});
		(0, vue.watch)(() => props.src || props.imgProps?.src, () => {
			hasLoadErrorRef.value = false;
		});
		const loadedRef = (0, vue.ref)(!props.lazy);
		return {
			textRef,
			selfRef,
			mergedRoundRef,
			mergedClsPrefix: mergedClsPrefixRef,
			fitTextTransform,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			hasLoadError: hasLoadErrorRef,
			shouldStartLoading: shouldStartLoadingRef,
			loaded: loadedRef,
			mergedOnError: (e) => {
				if (!shouldStartLoadingRef.value) return;
				hasLoadErrorRef.value = true;
				const { onError, imgProps: { onError: imgPropsOnError } = {} } = props;
				onError?.(e);
				imgPropsOnError?.(e);
			},
			mergedOnLoad: (e) => {
				const { onLoad, imgProps: { onLoad: imgPropsOnLoad } = {} } = props;
				onLoad?.(e);
				imgPropsOnLoad?.(e);
				loadedRef.value = true;
			}
		};
	},
	render() {
		const { $slots, src, mergedClsPrefix, lazy, onRender, loaded, hasLoadError, imgProps = {} } = this;
		onRender?.();
		let img;
		const placeholderNode = !loaded && !hasLoadError && (this.renderPlaceholder ? this.renderPlaceholder() : this.$slots.placeholder?.());
		if (this.hasLoadError) img = this.renderFallback ? this.renderFallback() : require__utils_vue_resolve_slot.resolveSlot($slots.fallback, () => [((0, vue.openBlock)(), (0, vue.createElementBlock)("img", {
			src: this.fallbackSrc,
			style: (0, vue.normalizeStyle)({ objectFit: this.objectFit })
		}, null, 12, _hoisted_1))]);
		else img = require__utils_vue_resolve_slot.resolveWrappedSlot($slots.default, (children) => {
			if (children) return (0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VResizeObserver, {
				key: 1,
				onResize: this.fitTextTransform
			}, { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				ref: "textRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-avatar__text`)
			}, [require_vdom.normalizeVNode(() => children)], 2)) }, 1032, ["onResize"]);
			else if (src || imgProps.src) {
				const loadSrc = this.src || imgProps.src;
				return (0, vue.h)("img", {
					...imgProps,
					loading: require__utils_env_is_native_lazy_load.isImageSupportNativeLazy && !this.intersectionObserverOptions && lazy ? "lazy" : "eager",
					src: lazy && this.intersectionObserverOptions ? this.shouldStartLoading ? loadSrc : void 0 : loadSrc,
					"data-image-src": loadSrc,
					onLoad: this.mergedOnLoad,
					onError: this.mergedOnError,
					style: [
						imgProps.style || "",
						{ objectFit: this.objectFit },
						placeholderNode ? {
							height: "0",
							width: "0",
							visibility: "hidden",
							position: "absolute"
						} : ""
					]
				});
			}
		});
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
			ref: "selfRef",
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-avatar`, this.themeClass]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => img), require_vdom.normalizeVNode(() => lazy && placeholderNode)], 6);
	}
});
//#endregion
exports.avatarProps = avatarProps;
exports.default = Avatar_default;
