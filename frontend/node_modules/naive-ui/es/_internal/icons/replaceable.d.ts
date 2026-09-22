import { GlobalIconConfig } from "../../config-provider/src/internal-interface.js";
import { VNode } from "vue";
//#region src/_internal/icons/replaceable.d.ts
declare function replaceable(name: keyof GlobalIconConfig, icon: () => VNode): import("vue").DefineComponent<{}, () => import("vue").VNodeChild, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { replaceable };