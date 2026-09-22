Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_adjusted_to = require("../../_utils/composable/use-adjusted-to.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_select_menu_src_SelectMenu = require("../../_internal/select-menu/src/SelectMenu.js");
const require_input_src_Input = require("../../input/src/Input.js");
const require_mention_styles_light = require("../styles/light.js");
const require_mention_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_mention_src_utils = require("./utils.js");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
let treemate = require("treemate");
//#region src/mention/src/Mention.tsx
const mentionProps = {
	...require__mixins_use_theme.default.props,
	to: require__utils_composable_use_adjusted_to.useAdjustedTo.propTo,
	autosize: [Boolean, Object],
	options: {
		type: Array,
		default: []
	},
	filter: {
		type: Function,
		default: (pattern, option) => {
			if (!pattern) return true;
			if (typeof option.label === "string") return option.label.startsWith(pattern);
			if (typeof option.value === "string") return option.value.startsWith(pattern);
			return false;
		}
	},
	type: {
		type: String,
		default: "text"
	},
	separator: {
		type: String,
		validator: (separator) => {
			if (separator.length !== 1) {
				require__utils_naive_warn.warn("mention", "`separator`'s length must be 1.");
				return false;
			}
			return true;
		},
		default: " "
	},
	bordered: {
		type: Boolean,
		default: void 0
	},
	disabled: Boolean,
	value: String,
	defaultValue: {
		type: String,
		default: ""
	},
	loading: Boolean,
	prefix: {
		type: [String, Array],
		default: "@"
	},
	placeholder: {
		type: String,
		default: ""
	},
	placement: {
		type: String,
		default: "bottom-start"
	},
	size: String,
	renderLabel: Function,
	status: String,
	"onUpdate:show": [Array, Function],
	onUpdateShow: [Array, Function],
	"onUpdate:value": [Array, Function],
	onUpdateValue: [Array, Function],
	onSearch: Function,
	onSelect: Function,
	onFocus: Function,
	onBlur: Function,
	scrollbarProps: Object,
	internalDebug: Boolean
};
var Mention_default = (0, vue.defineComponent)({
	name: "Mention",
	props: mentionProps,
	slots: Object,
	setup(props) {
		const { namespaceRef, mergedClsPrefixRef, mergedBorderedRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Mention", "-mention", require_mention_src_styles_index_cssr, require_mention_styles_light, props, mergedClsPrefixRef);
		const formItem = require__mixins_use_form_item.default(props, { mergedSize: (NFormItem) => {
			const { size } = props;
			if (size) return size;
			const { mergedSize: formItemSize } = NFormItem || {};
			if (formItemSize?.value) return formItemSize.value;
			const configSize = mergedComponentPropsRef?.value?.Mention?.size;
			if (configSize) return configSize;
			return "medium";
		} });
		const inputInstRef = (0, vue.ref)(null);
		const cursorRef = (0, vue.ref)(null);
		const followerRef = (0, vue.ref)(null);
		const wrapperElRef = (0, vue.ref)(null);
		const partialPatternRef = (0, vue.ref)("");
		let cachedPrefix = null;
		let cachedPartialPatternStart = null;
		let cachedPartialPatternEnd = null;
		const filteredOptionsRef = (0, vue.computed)(() => {
			const { value: pattern } = partialPatternRef;
			return props.options.filter((option) => props.filter(pattern, option));
		});
		const treeMateRef = (0, vue.computed)(() => {
			return (0, treemate.createTreeMate)(filteredOptionsRef.value, { getKey: (v) => {
				return v.value;
			} });
		});
		const selectMenuInstRef = (0, vue.ref)(null);
		const showMenuRef = (0, vue.ref)(false);
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const controlledValueRef = (0, vue.toRef)(props, "value");
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { menuBoxShadow } } = themeRef.value;
			return { "--n-menu-box-shadow": menuBoxShadow };
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("mention", void 0, cssVarsRef, props) : void 0;
		function doUpdateShowMenu(show) {
			if (props.disabled) return;
			const { onUpdateShow, "onUpdate:show": _onUpdateShow } = props;
			if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, show);
			if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, show);
			if (!show) {
				cachedPrefix = null;
				cachedPartialPatternStart = null;
				cachedPartialPatternEnd = null;
			}
			showMenuRef.value = show;
		}
		function doUpdateValue(value) {
			const { onUpdateValue, "onUpdate:value": _onUpdateValue } = props;
			const { nTriggerFormChange, nTriggerFormInput } = formItem;
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value);
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value);
			nTriggerFormInput();
			nTriggerFormChange();
			uncontrolledValueRef.value = value;
		}
		function getInputEl() {
			return props.type === "text" ? inputInstRef.value.inputElRef : inputInstRef.value.textareaElRef;
		}
		function deriveShowMenu() {
			const inputEl = getInputEl();
			if (document.activeElement !== inputEl) {
				doUpdateShowMenu(false);
				return;
			}
			const { selectionEnd } = inputEl;
			if (selectionEnd === null) {
				doUpdateShowMenu(false);
				return;
			}
			const inputValue = inputEl.value;
			const { separator } = props;
			const { prefix } = props;
			const prefixArray = typeof prefix === "string" ? [prefix] : prefix;
			for (let i = selectionEnd - 1; i >= 0; --i) {
				const char = inputValue[i];
				if (char === separator || char === "\n" || char === "\r") {
					doUpdateShowMenu(false);
					return;
				}
				if (prefixArray.includes(char)) {
					const partialPattern = inputValue.slice(i + 1, selectionEnd);
					doUpdateShowMenu(true);
					props.onSearch?.(partialPattern, char);
					partialPatternRef.value = partialPattern;
					cachedPrefix = char;
					cachedPartialPatternStart = i + 1;
					cachedPartialPatternEnd = selectionEnd;
					return;
				}
			}
			doUpdateShowMenu(false);
		}
		function syncCursor() {
			const { value: cursorAnchor } = cursorRef;
			if (!cursorAnchor) return;
			const inputEl = getInputEl();
			const cursorPos = require_mention_src_utils.getRelativePosition(inputEl);
			const inputRect = inputEl.getBoundingClientRect();
			const wrapperRect = wrapperElRef.value.getBoundingClientRect();
			cursorAnchor.style.left = `${cursorPos.left + inputRect.left - wrapperRect.left}px`;
			cursorAnchor.style.top = `${cursorPos.top + inputRect.top - wrapperRect.top}px`;
			cursorAnchor.style.height = `${cursorPos.height}px`;
		}
		function syncPosition() {
			if (!showMenuRef.value) return;
			followerRef.value?.syncPosition();
		}
		function handleInputUpdateValue(value) {
			doUpdateValue(value);
			syncAfterCursorMove();
		}
		function syncAfterCursorMove() {
			setTimeout(() => {
				syncCursor();
				deriveShowMenu();
				(0, vue.nextTick)().then(syncPosition);
			}, 0);
		}
		function handleInputKeyDown(e) {
			if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
				if (inputInstRef.value?.isCompositing) return;
				syncAfterCursorMove();
			} else if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter") {
				if (inputInstRef.value?.isCompositing) return;
				const { value: selectMenuInst } = selectMenuInstRef;
				if (showMenuRef.value) {
					if (selectMenuInst) {
						e.preventDefault();
						if (e.key === "ArrowUp") selectMenuInst.prev();
						else if (e.key === "ArrowDown") selectMenuInst.next();
						else {
							const pendingOptionTmNode = selectMenuInst.getPendingTmNode();
							if (pendingOptionTmNode) handleSelect(pendingOptionTmNode);
							else doUpdateShowMenu(false);
						}
					}
				} else syncAfterCursorMove();
			}
		}
		function handleInputFocus(e) {
			const { onFocus } = props;
			onFocus?.(e);
			const { nTriggerFormFocus } = formItem;
			nTriggerFormFocus();
			syncAfterCursorMove();
		}
		function focus() {
			inputInstRef.value?.focus();
		}
		function blur() {
			inputInstRef.value?.blur();
		}
		function handleInputBlur(e) {
			const { onBlur } = props;
			onBlur?.(e);
			const { nTriggerFormBlur } = formItem;
			nTriggerFormBlur();
			doUpdateShowMenu(false);
		}
		function handleSelect(tmNode) {
			if (cachedPrefix === null || cachedPartialPatternStart === null || cachedPartialPatternEnd === null) {
				if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("mention", "Cache works unexpectly, this is probably a bug. Please create an issue.");
				return;
			}
			const { rawNode: { value = "" } } = tmNode;
			const inputEl = getInputEl();
			const inputValue = inputEl.value;
			const { separator } = props;
			const nextEndPart = inputValue.slice(cachedPartialPatternEnd);
			const alreadySeparated = nextEndPart.startsWith(separator);
			const nextMiddlePart = `${value}${alreadySeparated ? "" : separator}`;
			doUpdateValue(inputValue.slice(0, cachedPartialPatternStart) + nextMiddlePart + nextEndPart);
			props.onSelect?.(tmNode.rawNode, cachedPrefix);
			const nextSelectionEnd = cachedPartialPatternStart + nextMiddlePart.length + (alreadySeparated ? 1 : 0);
			(0, vue.nextTick)().then(() => {
				inputEl.selectionStart = nextSelectionEnd;
				inputEl.selectionEnd = nextSelectionEnd;
				deriveShowMenu();
			});
		}
		function handleInputMouseDown() {
			if (!props.disabled) syncAfterCursorMove();
		}
		return {
			namespace: namespaceRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedBordered: mergedBorderedRef,
			mergedSize: formItem.mergedSizeRef,
			mergedStatus: formItem.mergedStatusRef,
			mergedTheme: themeRef,
			treeMate: treeMateRef,
			selectMenuInstRef,
			inputInstRef,
			cursorRef,
			followerRef,
			wrapperElRef,
			showMenu: showMenuRef,
			adjustedTo: require__utils_composable_use_adjusted_to.useAdjustedTo(props),
			isMounted: (0, vooks.useIsMounted)(),
			mergedValue: mergedValueRef,
			handleInputFocus,
			handleInputBlur,
			handleInputUpdateValue,
			handleInputKeyDown,
			handleSelect,
			handleInputMouseDown,
			focus,
			blur,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedTheme, mergedClsPrefix, $slots } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-mention`),
			ref: "wrapperElRef"
		}, [((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
			status: this.mergedStatus,
			themeOverrides: mergedTheme.peerOverrides.Input,
			theme: mergedTheme.peers.Input,
			size: this.mergedSize,
			autosize: this.autosize,
			type: this.type,
			ref: "inputInstRef",
			placeholder: this.placeholder,
			onMousedown: this.handleInputMouseDown,
			onUpdateValue: this.handleInputUpdateValue,
			onKeydown: this.handleInputKeyDown,
			onFocus: this.handleInputFocus,
			onBlur: this.handleInputBlur,
			bordered: this.mergedBordered,
			disabled: this.disabled,
			value: this.mergedValue
		}, null, 8, [
			"status",
			"themeOverrides",
			"theme",
			"size",
			"autosize",
			"type",
			"placeholder",
			"onMousedown",
			"onUpdateValue",
			"onKeydown",
			"onFocus",
			"onBlur",
			"bordered",
			"disabled",
			"value"
		])), (0, vue.createVNode)(vueuc.VBinder, null, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VTarget, null, {
			_: 1,
			default: require_vdom.normalizeSlot(() => {
				const style = {
					position: "absolute",
					width: 0
				};
				if (process.env.NODE_ENV !== "production" && this.internalDebug) {
					style.width = "1px";
					style.background = "red";
				}
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					style: (0, vue.normalizeStyle)(style),
					ref: "cursorRef"
				}, null, 4);
			})
		})), ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFollower, {
			ref: "followerRef",
			placement: this.placement,
			show: this.showMenu,
			containerClass: this.namespace,
			to: this.adjustedTo,
			teleportDisabled: this.adjustedTo === require__utils_composable_use_adjusted_to.useAdjustedTo.tdkey
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "fade-in-scale-up-transition",
			appear: this.isMounted
		}, { default: () => {
			const { mergedTheme, onRender } = this;
			onRender?.();
			return this.showMenu ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_select_menu_src_SelectMenu, {
				key: 1,
				clsPrefix: mergedClsPrefix,
				theme: mergedTheme.peers.InternalSelectMenu,
				themeOverrides: mergedTheme.peerOverrides.InternalSelectMenu,
				autoPending: true,
				ref: "selectMenuInstRef",
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-mention-menu`, this.themeClass]),
				loading: this.loading,
				treeMate: this.treeMate,
				virtualScroll: false,
				style: (0, vue.normalizeStyle)(this.cssVars),
				onToggle: this.handleSelect,
				renderLabel: this.renderLabel,
				scrollbarProps: this.scrollbarProps
			}, require_vdom.normalizeSlots($slots), 1032, [
				"clsPrefix",
				"theme",
				"themeOverrides",
				"class",
				"loading",
				"treeMate",
				"style",
				"onToggle",
				"renderLabel",
				"scrollbarProps"
			])) : null;
		} }, 1032, ["appear"])) }, 1032, [
			"placement",
			"show",
			"containerClass",
			"to",
			"teleportDisabled"
		]))] }, 1024)], 2);
	}
});
//#endregion
exports.default = Mention_default;
exports.mentionProps = mentionProps;
