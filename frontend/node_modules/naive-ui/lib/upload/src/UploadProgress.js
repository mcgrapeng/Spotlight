const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_fade_in_expand_transition_src_FadeInExpandTransition = require("../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.js");
const require_progress_src_Progress = require("../../progress/src/Progress.js");
const require_upload_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/upload/src/UploadProgress.tsx
var UploadProgress_default = (0, vue.defineComponent)({
	name: "UploadProgress",
	props: {
		show: Boolean,
		percentage: {
			type: Number,
			required: true
		},
		status: {
			type: String,
			required: true
		}
	},
	setup() {
		return { mergedTheme: (0, vue.inject)(require_upload_src_interface.uploadInjectionKey).mergedThemeRef };
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_fade_in_expand_transition_src_FadeInExpandTransition, null, {
			_: 1,
			default: require_vdom.normalizeSlot(() => this.show ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_progress_src_Progress.default, {
				key: 1,
				type: "line",
				showIndicator: false,
				percentage: this.percentage,
				status: this.status,
				height: 2,
				theme: this.mergedTheme.peers.Progress,
				themeOverrides: this.mergedTheme.peerOverrides.Progress
			}, null, 8, [
				"percentage",
				"status",
				"theme",
				"themeOverrides"
			])) : null)
		});
	}
});
//#endregion
module.exports = UploadProgress_default;
