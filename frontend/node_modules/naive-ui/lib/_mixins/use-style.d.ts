import { Ref } from "vue";
import { CNode } from "css-render";
//#region src/_mixins/use-style.d.ts
declare function useStyle(mountId: string, style: CNode, clsPrefixRef: Ref<string | undefined>): void;
export = useStyle;