import { keysOf } from "../../_utils/vue/keysOf.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import formLight from "../styles/light.mjs";
import { formInjectionKey, formItemInstsInjectionKey } from "./context.mjs";
import form_cssr_default from "./styles/form.cssr.mjs";
import { createElementBlock, defineComponent, openBlock, provide, ref } from "vue";
//#region src/form/src/Form.tsx
const _hoisted_1 = ["onSubmit"];
const formProps = {
  ...useTheme.props,
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
    default: e => {
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
var Form_default = defineComponent({
  name: "Form",
  props: formProps,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    useTheme("Form", "-form", form_cssr_default, formLight, props, mergedClsPrefixRef);
    const formItems = {};
    const maxChildLabelWidthRef = ref(void 0);
    const deriveMaxChildLabelWidth = currentWidth => {
      const currentMaxChildLabelWidth = maxChildLabelWidthRef.value;
      if (currentMaxChildLabelWidth === void 0 || currentWidth >= currentMaxChildLabelWidth) maxChildLabelWidthRef.value = currentWidth;
    };
    function invalidateLabelWidth() {
      for (const key of keysOf(formItems)) {
        const formItemInstances = formItems[key];
        for (const formItemInstance of formItemInstances) formItemInstance.invalidateLabelWidth?.();
      }
    }
    async function validate(validateCallback, filter) {
      const {
        paths,
        shouldRuleBeApplied
      } = normalizeValidateFilter(filter);
      return await new Promise((resolve, reject) => {
        const formItemValidationPromises = [];
        for (const key of keysOf(formItems)) {
          if (paths !== null && !paths.includes(key)) continue;
          const formItemInstances = formItems[key];
          for (const formItemInstance of formItemInstances) if (formItemInstance.path) formItemValidationPromises.push(formItemInstance.internalValidate(null, shouldRuleBeApplied));
        }
        Promise.all(formItemValidationPromises).then(results => {
          const formInvalid = results.some(result => !result.valid);
          const errors = [];
          const warnings = [];
          results.forEach(result => {
            if (result.errors?.length) errors.push(result.errors);
            if (result.warnings?.length) warnings.push(result.warnings);
          });
          if (validateCallback) validateCallback(errors.length ? errors : void 0, {
            warnings: warnings.length ? warnings : void 0
          });
          if (formInvalid) reject(errors.length ? errors : void 0);else resolve({
            warnings: warnings.length ? warnings : void 0
          });
        });
      });
    }
    function restoreValidation() {
      for (const key of keysOf(formItems)) {
        const formItemInstances = formItems[key];
        for (const formItemInstance of formItemInstances) formItemInstance.restoreValidation();
      }
    }
    provide(formInjectionKey, {
      props,
      maxChildLabelWidthRef,
      deriveMaxChildLabelWidth
    });
    provide(formItemInstsInjectionKey, {
      formItems
    });
    return Object.assign({
      validate,
      restoreValidation,
      invalidateLabelWidth
    }, {
      mergedClsPrefix: mergedClsPrefixRef
    });
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("form", {
      class: normalizeClass$1([`${mergedClsPrefix}-form`, this.inline && `${mergedClsPrefix}-form--inline`]),
      onSubmit: this.onSubmit
    }, [normalizeVNode(() => this.$slots.default?.())], 42, _hoisted_1);
  }
});
//#endregion
export { Form_default as default, formProps };