//#region src/progress/src/public-types.d.ts
type ProgressStatus = 'success' | 'error' | 'warning' | 'info' | 'default';
interface ProgressGradient {
  stops: string[];
}
//#endregion
export { ProgressGradient, ProgressStatus };