import { createVNodeCache } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementVNode, defineComponent } from "vue";
//#region src/_internal/icons/Forward.tsx
var Forward_default = defineComponent({
  name: "Forward",
  render() {
    return (() => {
      const _cache = createVNodeCache("6fb2c33c1e576c93");
      return _cache[0] || (_cache[0] = createElementVNode("svg", {
        viewBox: "0 0 20 20",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, [createElementVNode("path", {
        d: "M7.73271 4.20694C8.03263 3.92125 8.50737 3.93279 8.79306 4.23271L13.7944 9.48318C14.0703 9.77285 14.0703 10.2281 13.7944 10.5178L8.79306 15.7682C8.50737 16.0681 8.03263 16.0797 7.73271 15.794C7.43279 15.5083 7.42125 15.0336 7.70694 14.7336L12.2155 10.0005L7.70694 5.26729C7.42125 4.96737 7.43279 4.49264 7.73271 4.20694Z",
        fill: "currentColor"
      })], -1));
    })();
  }
});
//#endregion
export { Forward_default as default };