Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_message_src_context = require("./context.js");
let vue = require("vue");
//#region src/message/src/use-message.ts
function useMessage() {
	const api = (0, vue.inject)(require_message_src_context.messageApiInjectionKey, null);
	if (api === null) require__utils_naive_warn.throwError("use-message", "No outer <n-message-provider /> founded. See prerequisite in https://www.naiveui.com/en-US/os-theme/components/message for more details. If you want to use `useMessage` outside setup, please check https://www.naiveui.com/zh-CN/os-theme/components/message#Q-&-A.");
	return api;
}
//#endregion
exports.useMessage = useMessage;
