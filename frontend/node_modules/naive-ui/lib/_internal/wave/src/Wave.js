const require__mixins_use_style = require("../../../_mixins/use-style.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_wave_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/_internal/wave/src/Wave.tsx
var Wave_default = (0, vue.defineComponent)({
	name: "BaseWave",
	props: { clsPrefix: {
		type: String,
		required: true
	} },
	setup(props) {
		require__mixins_use_style("-base-wave", require__internal_wave_src_styles_index_cssr, (0, vue.toRef)(props, "clsPrefix"));
		const selfRef = (0, vue.ref)(null);
		const activeRef = (0, vue.ref)(false);
		let animationTimerId = null;
		(0, vue.onBeforeUnmount)(() => {
			if (animationTimerId !== null) window.clearTimeout(animationTimerId);
		});
		return {
			active: activeRef,
			selfRef,
			play() {
				if (animationTimerId !== null) {
					window.clearTimeout(animationTimerId);
					activeRef.value = false;
					animationTimerId = null;
				}
				(0, vue.nextTick)(() => {
					selfRef.value?.offsetHeight;
					activeRef.value = true;
					animationTimerId = window.setTimeout(() => {
						activeRef.value = false;
						animationTimerId = null;
					}, 1e3);
				});
			}
		};
	},
	render() {
		const { clsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "selfRef",
			"aria-hidden": true,
			class: require_vdom.normalizeClass([`${clsPrefix}-base-wave`, this.active && `${clsPrefix}-base-wave--active`])
		}, null, 2);
	}
});
//#endregion
module.exports = Wave_default;
