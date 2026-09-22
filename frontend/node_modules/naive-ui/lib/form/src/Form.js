Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_form_styles_light = require("../styles/light.js");
const require_form_src_context = require("./context.js");
const require_form_src_styles_form_cssr = require("./styles/form.cssr.js");
let vue = require("vue");
//#region src/form/src/Form.tsx
const _hoisted_1 = ["onSubmit"];
const formProps = {
	...require__mixins_use_theme.default.props,
	inline: Boolean,
	labelWidth: [Number, String],
	labelAlign: String,
	labelPlacement: {
		type: String,
		default: "top"
	},
	model: {
		type: Object,
		default: () => {}
	},
	rules: Object,
	disabled: Boolean,
	size: String,
	showRequireMark: {
		type: Boolean,
		default: void 0
	},
	requireMarkPlacement: String,
	showFeedback: {
		type: Boolean,
		default: true
	},
	onSubmit: {
		type: Function,
		default: (e) => {
			e.preventDefault();
		}
	},
	showLabel: {
		type: Boolean,
		default: void 0
	},
	validateMessages: Object
};
const defaultShouldRuleBeApplied = () => true;
function normalizeValidateFilter(filter) {
	if (filter === void 0) return {
		paths: null,
		shouldRuleBeApplied: defaultShouldRuleBeApplied
	};
	if (typeof filter === "function") return {
		paths: null,
		shouldRuleBeApplied: filter
	};
	if (Array.isArray(filter)) return {
		paths: filter,
		shouldRuleBeApplied: defaultShouldRuleBeApplied
	};
	return filter;
}
var Form_default = (0, vue.defineComponent)({
	name: "Form",
	props: formProps,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		require__mixins_use_theme.default("Form", "-form", require_form_src_styles_form_cssr, require_form_styles_light.default, props, mergedClsPrefixRef);
		const formItems = {};
		const maxChildLabelWidthRef = (0, vue.ref)(void 0);
		const deriveMaxChildLabelWidth = (currentWidth) => {
			const currentMaxChildLabelWidth = maxChildLabelWidthRef.value;
			if (currentMaxChildLabelWidth === void 0 || currentWidth >= currentMaxChildLabelWidth) maxChildLabelWidthRef.value = currentWidth;
		};
		function invalidateLabelWidth() {
			for (const key of require__utils_vue_keysOf.keysOf(formItems)) {
				const formItemInstances = formItems[key];
				for (const formItemInstance of formItemInstances) formItemInstance.invalidateLabelWidth?.();
			}
		}
		async function validate(validateCallback, filter) {
			const { paths, shouldRuleBeApplied } = normalizeValidateFilter(filter);
			return await new Promise((resolve, reject) => {
				const formItemValidationPromises = [];
				for (const key of require__utils_vue_keysOf.keysOf(formItems)) {
					if (paths !== null && !paths.includes(key)) continue;
					const formItemInstances = formItems[key];
					for (const formItemInstance of formItemInstances) if (formItemInstance.path) formItemValidationPromises.push(formItemInstance.internalValidate(null, shouldRuleBeApplied));
				}
				Promise.all(formItemValidationPromises).then((results) => {
					const formInvalid = results.some((result) => !result.valid);
					const errors = [];
					const warnings = [];
					results.forEach((result) => {
						if (result.errors?.length) errors.push(result.errors);
						if (result.warnings?.length) warnings.push(result.warnings);
					});
					if (validateCallback) validateCallback(errors.length ? errors : void 0, { warnings: warnings.length ? warnings : void 0 });
					if (formInvalid) reject(errors.length ? errors : void 0);
					else resolve({ warnings: warnings.length ? warnings : void 0 });
				});
			});
		}
		function restoreValidation() {
			for (const key of require__utils_vue_keysOf.keysOf(formItems)) {
				const formItemInstances = formItems[key];
				for (const formItemInstance of formItemInstances) formItemInstance.restoreValidation();
			}
		}
		(0, vue.provide)(require_form_src_context.formInjectionKey, {
			props,
			maxChildLabelWidthRef,
			deriveMaxChildLabelWidth
		});
		(0, vue.provide)(require_form_src_context.formItemInstsInjectionKey, { formItems });
		return Object.assign({
			validate,
			restoreValidation,
			invalidateLabelWidth
		}, { mergedClsPrefix: mergedClsPrefixRef });
	},
	render() {
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("form", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-form`, this.inline && `${mergedClsPrefix}-form--inline`]),
			onSubmit: this.onSubmit
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 42, _hoisted_1);
	}
});
//#endregion
exports.default = Form_default;
exports.formProps = formProps;
