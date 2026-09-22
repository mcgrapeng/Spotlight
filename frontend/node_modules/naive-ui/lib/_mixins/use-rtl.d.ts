import { RtlEnabledState, RtlItem } from "../config-provider/src/internal-interface.js";
import { Ref } from "vue";
//#region src/_mixins/use-rtl.d.ts
declare function useRtl(mountId: string, rtlStateRef: Ref<RtlEnabledState | undefined> | undefined, clsPrefixRef: Ref<string>): Ref<RtlItem | undefined> | undefined;
//#endregion
export { useRtl };