const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_data_table_src_interface = require("./interface.js");
const require_data_table_src_TableParts_Header = require("./TableParts/Header.js");
const require_data_table_src_TableParts_Body = require("./TableParts/Body.js");
let vue = require("vue");
//#region src/data-table/src/MainTable.tsx
var MainTable_default = (0, vue.defineComponent)({
	name: "MainTable",
	setup() {
		const { mergedClsPrefixRef, rightFixedColumnsRef, leftFixedColumnsRef, bodyWidthRef, maxHeightRef, minHeightRef, flexHeightRef, virtualScrollHeaderRef, syncScrollState, scrollXRef } = (0, vue.inject)(require_data_table_src_interface.dataTableInjectionKey);
		const headerInstRef = (0, vue.ref)(null);
		const bodyInstRef = (0, vue.ref)(null);
		const selfElRef = (0, vue.ref)(null);
		const fixedStateInitializedRef = (0, vue.ref)(!(leftFixedColumnsRef.value.length || rightFixedColumnsRef.value.length));
		const bodyStyleRef = (0, vue.computed)(() => {
			return {
				maxHeight: require__utils_css_format_length.formatLength(maxHeightRef.value),
				minHeight: require__utils_css_format_length.formatLength(minHeightRef.value)
			};
		});
		function handleBodyResize(entry) {
			bodyWidthRef.value = entry.contentRect.width;
			syncScrollState("layout");
			if (!fixedStateInitializedRef.value) fixedStateInitializedRef.value = true;
		}
		function getHeaderElement() {
			const { value } = headerInstRef;
			if (value) {
				if (virtualScrollHeaderRef.value) return value.virtualListRef?.listElRef || null;
				else return value.$el;
			}
			return null;
		}
		function getBodyElement() {
			const { value } = bodyInstRef;
			if (value) return value.getScrollContainer();
			return null;
		}
		const exposedMethods = {
			getBodyElement,
			getHeaderElement,
			scrollTo(arg0, arg1) {
				bodyInstRef.value?.scrollTo(arg0, arg1);
			}
		};
		(0, vue.watchEffect)(() => {
			const { value: selfEl } = selfElRef;
			if (!selfEl) return;
			const transitionDisabledClass = `${mergedClsPrefixRef.value}-data-table-base-table--transition-disabled`;
			if (fixedStateInitializedRef.value) setTimeout(() => {
				selfEl.classList.remove(transitionDisabledClass);
			}, 0);
			else selfEl.classList.add(transitionDisabledClass);
		});
		return {
			maxHeight: maxHeightRef,
			mergedClsPrefix: mergedClsPrefixRef,
			selfElRef,
			headerInstRef,
			bodyInstRef,
			bodyStyle: bodyStyleRef,
			flexHeight: flexHeightRef,
			handleBodyResize,
			scrollX: scrollXRef,
			...exposedMethods
		};
	},
	render() {
		const { mergedClsPrefix, maxHeight, flexHeight } = this;
		const headerInBody = maxHeight === void 0 && !flexHeight;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-base-table`),
			ref: "selfElRef"
		}, [headerInBody ? require_vdom.normalizeVNode(() => null) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_TableParts_Header, {
			key: 1,
			ref: "headerInstRef"
		}, null, 512)), ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_TableParts_Body, {
			ref: "bodyInstRef",
			bodyStyle: this.bodyStyle,
			showHeader: headerInBody,
			flexHeight,
			onResize: this.handleBodyResize
		}, null, 8, [
			"bodyStyle",
			"showHeader",
			"flexHeight",
			"onResize"
		]))], 2);
	}
});
//#endregion
module.exports = MainTable_default;
