Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_config_provider_src_context = require("../../config-provider/src/context.js");
let vue = require("vue");
let lodash_es = require("lodash");
//#region src/_internal/icons/replaceable.tsx
function replaceable(name, icon) {
	const IconComponent = (0, vue.defineComponent)({ render() {
		return icon();
	} });
	return (0, vue.defineComponent)({
		name: (0, lodash_es.upperFirst)(name),
		setup() {
			const mergedIconsRef = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null)?.mergedIconsRef;
			return () => {
				const iconOverride = mergedIconsRef?.value?.[name];
				return iconOverride ? iconOverride() : ((0, vue.openBlock)(), (0, vue.createBlock)(IconComponent, { key: 1 }));
			};
		}
	});
}
//#endregion
exports.replaceable = replaceable;
