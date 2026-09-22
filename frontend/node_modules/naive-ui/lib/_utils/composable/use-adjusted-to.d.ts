import { ComputedRef, PropType } from "vue";
//#region src/_utils/composable/use-adjusted-to.d.ts
interface UseAdjustedToProps {
  to?: string | HTMLElement | boolean;
  [key: string]: unknown;
}
declare function useAdjustedTo(props: UseAdjustedToProps): ComputedRef<HTMLElement | string>;
declare namespace useAdjustedTo {
  var tdkey: string;
  var propTo: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
}
//#endregion
export { useAdjustedTo };