Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
let vue = require("vue");
//#region src/menu/src/useCheckDeprecated.ts
function useCheckDeprecated(props) {
	(0, vue.watchEffect)(() => {
		if (props.items) require__utils_naive_warn.warnOnce("menu", "`items` is deprecated, please use `options` instead.");
		if (props.onOpenNamesChange) require__utils_naive_warn.warnOnce("menu", "`on-open-names-change` is deprecated, please use `on-update:expanded-keys` instead.");
		if (props.onSelect) require__utils_naive_warn.warnOnce("menu", "`on-select` is deprecated, please use `on-update:value` instead.");
		if (props.onExpandedNamesChange) require__utils_naive_warn.warnOnce("menu", "`on-expanded-names-change` is deprecated, please use `on-update:expanded-keys` instead.");
		if (props.expandedNames) require__utils_naive_warn.warnOnce("menu", "`expanded-names` is deprecated, please use `expanded-keys` instead.");
		if (props.defaultExpandedNames) require__utils_naive_warn.warnOnce("menu", "`default-expanded-names` is deprecated, please use `default-expanded-keys` instead.");
	});
}
//#endregion
exports.useCheckDeprecated = useCheckDeprecated;
