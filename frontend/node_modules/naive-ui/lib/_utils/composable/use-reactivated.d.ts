//#region src/_utils/composable/use-reactivated.d.ts
declare function useReactivated(callback: () => void): {
  isDeactivated: boolean;
};
//#endregion
export { useReactivated };