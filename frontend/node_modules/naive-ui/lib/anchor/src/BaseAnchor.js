Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_anchor_src_Link = require("./Link.js");
const require_anchor_src_utils = require("./utils.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/anchor/src/BaseAnchor.tsx
const baseAnchorProps = {
	type: {
		type: String,
		default: "rail"
	},
	showRail: {
		type: Boolean,
		default: true
	},
	showBackground: {
		type: Boolean,
		default: true
	},
	bound: {
		type: Number,
		default: 12
	},
	internalScrollable: Boolean,
	ignoreGap: Boolean,
	offsetTarget: [
		String,
		Object,
		Function
	]
};
const baseAnchorPropKeys = require__utils_vue_keysOf.keysOf(baseAnchorProps);
var BaseAnchor_default = (0, vue.defineComponent)({
	name: "BaseAnchor",
	props: {
		...baseAnchorProps,
		mergedClsPrefix: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const collectedLinkHrefs = [];
		const titleEls = [];
		const activeHrefRef = (0, vue.ref)(null);
		const slotRef = (0, vue.ref)(null);
		const barRef = (0, vue.ref)(null);
		const selfRef = (0, vue.ref)(null);
		let skipScrollHandling = false;
		const isBlockTypeRef = (0, vue.computed)(() => {
			return props.type === "block";
		});
		const mergedShowRailRef = (0, vue.computed)(() => {
			return !isBlockTypeRef.value && props.showRail;
		});
		function disableTransitionOneTick() {
			const { value: barEl } = barRef;
			const { value: slotEl } = slotRef;
			if (barEl) barEl.style.transition = "none";
			if (slotEl) slotEl.style.transition = "none";
			if (titleEls) titleEls.forEach((titleEl) => {
				titleEl.style.transition = "none";
			});
			(0, vue.nextTick)(() => {
				const { value: nextBarEl } = barRef;
				const { value: nextSlotEl } = slotRef;
				if (nextBarEl) {
					nextBarEl.offsetWidth;
					nextBarEl.style.transition = "";
				}
				if (nextSlotEl) {
					nextSlotEl.offsetWidth;
					nextSlotEl.style.transition = "";
				}
				if (titleEls) titleEls.forEach((titleEl) => {
					titleEl.offsetWidth;
					titleEl.style.transition = "";
				});
			});
		}
		function updateBarPosition(linkTitleEl, transition = true) {
			const { value: barEl } = barRef;
			const { value: slotEl } = slotRef;
			const { value: selfEl } = selfRef;
			if (!selfEl || !barEl) return;
			if (!transition) {
				barEl.style.transition = "none";
				if (slotEl) slotEl.style.transition = "none";
			}
			const { offsetHeight, offsetWidth } = linkTitleEl;
			const { top: linkTitleClientTop, left: linkTitleClientLeft } = linkTitleEl.getBoundingClientRect();
			const { top: anchorClientTop, left: anchorClientLeft } = selfEl.getBoundingClientRect();
			const offsetTop = linkTitleClientTop - anchorClientTop;
			const offsetLeft = linkTitleClientLeft - anchorClientLeft;
			barEl.style.top = `${offsetTop}px`;
			barEl.style.height = `${offsetHeight}px`;
			if (slotEl) {
				slotEl.style.top = `${offsetTop}px`;
				slotEl.style.height = `${offsetHeight}px`;
				slotEl.style.maxWidth = `${offsetWidth + offsetLeft}px`;
			}
			barEl.offsetHeight;
			if (slotEl) slotEl.offsetHeight;
			if (!transition) {
				barEl.style.transition = "";
				if (slotEl) slotEl.style.transition = "";
			}
		}
		let currentThrottleTimerId;
		let hasTrailingThrottledTask = false;
		let isInThrottledPeriod = false;
		const handleScroll = () => {
			if (isInThrottledPeriod) hasTrailingThrottledTask = true;
			else {
				if (skipScrollHandling) return;
				_handleScroll(true);
				isInThrottledPeriod = true;
				clearTimeout(currentThrottleTimerId);
				currentThrottleTimerId = setTimeout(() => {
					isInThrottledPeriod = false;
					if (hasTrailingThrottledTask) {
						hasTrailingThrottledTask = false;
						handleScroll();
					}
				}, 128);
			}
		};
		function setActiveHref(href, transition = true) {
			const idMatchResult = /^#([^#]+)$/.exec(href);
			if (!idMatchResult) return;
			const linkEl = document.getElementById(idMatchResult[1]);
			if (!linkEl) return;
			skipScrollHandling = true;
			activeHrefRef.value = href;
			linkEl.scrollIntoView();
			if (!transition) disableTransitionOneTick();
			hasTrailingThrottledTask = false;
			setTimeout(() => {
				skipScrollHandling = false;
			}, 0);
		}
		function _handleScroll(transition = true) {
			const links = [];
			const offsetTarget = (0, seemly.unwrapElement)(props.offsetTarget ?? document);
			collectedLinkHrefs.forEach((href) => {
				const idMatchResult = /#([^#]+)$/.exec(href);
				if (!idMatchResult) return;
				const linkEl = document.getElementById(idMatchResult[1]);
				if (linkEl && offsetTarget) {
					const { top, height } = require_anchor_src_utils.getOffset(linkEl, offsetTarget);
					links.push({
						top,
						height,
						href
					});
				}
			});
			links.sort((a, b) => {
				if (a.top > b.top) return 1;
				else if (a.top === b.top && a.height < b.height) return -1;
				return -1;
			});
			const currentActiveHref = activeHrefRef.value;
			const { bound, ignoreGap } = props;
			const activeLink = links.reduce((prevLink, link) => {
				if (link.top + link.height < 0) {
					if (ignoreGap) return link;
					else return prevLink;
				}
				if (link.top <= bound) {
					if (prevLink === null) return link;
					else if (link.top === prevLink.top) {
						if (link.href === currentActiveHref) return link;
						else return prevLink;
					} else if (link.top > prevLink.top) return link;
					else return prevLink;
				}
				return prevLink;
			}, null);
			if (!transition) disableTransitionOneTick();
			if (activeLink) activeHrefRef.value = activeLink.href;
			else activeHrefRef.value = null;
		}
		(0, vue.provide)(require_anchor_src_Link.anchorInjectionKey, {
			activeHref: activeHrefRef,
			mergedClsPrefix: (0, vue.toRef)(props, "mergedClsPrefix"),
			updateBarPosition,
			setActiveHref,
			collectedLinkHrefs,
			titleEls
		});
		(0, vue.onMounted)(() => {
			document.addEventListener("scroll", handleScroll, true);
			setActiveHref(window.location.hash);
			_handleScroll(false);
		});
		(0, vooks.onFontsReady)(() => {
			setActiveHref(window.location.hash);
			_handleScroll(false);
		});
		(0, vue.onBeforeUnmount)(() => {
			clearTimeout(currentThrottleTimerId);
			document.removeEventListener("scroll", handleScroll, true);
		});
		(0, vue.watch)(activeHrefRef, (value) => {
			if (value === null) {
				const { value: slotEl } = slotRef;
				if (slotEl && !isBlockTypeRef.value) slotEl.style.maxWidth = "0";
			}
		});
		return {
			selfRef,
			barRef,
			slotRef,
			setActiveHref,
			activeHref: activeHrefRef,
			isBlockType: isBlockTypeRef,
			mergedShowRail: mergedShowRailRef
		};
	},
	render() {
		const { mergedClsPrefix, mergedShowRail, isBlockType, $slots } = this;
		const Anchor = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-anchor`,
				isBlockType && `${mergedClsPrefix}-anchor--block`,
				mergedShowRail && `${mergedClsPrefix}-anchor--show-rail`
			]),
			ref: "selfRef"
		}, [
			mergedShowRail && this.showBackground ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				ref: "slotRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-anchor-link-background`)
			}, null, 2)) : require_vdom.normalizeVNode(() => null),
			mergedShowRail ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-anchor-rail`)
			}, [(0, vue.createElementVNode)("div", {
				ref: "barRef",
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-anchor-rail__bar`, this.activeHref !== null && `${mergedClsPrefix}-anchor-rail__bar--active`])
			}, null, 2)], 2)) : require_vdom.normalizeVNode(() => null),
			require_vdom.normalizeVNode(() => $slots.default?.())
		], 2));
		return this.internalScrollable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, { key: 1 }, { default: () => Anchor }, 1024)) : Anchor;
	}
});
//#endregion
exports.baseAnchorPropKeys = baseAnchorPropKeys;
exports.baseAnchorProps = baseAnchorProps;
exports.default = BaseAnchor_default;
