//#region src/config-provider/src/katex.d.ts
/**
 * Minimal katex-compatible types used by Naive UI.
 * katex itself is optional and must be provided by the user.
 */
type KatexOptions = Record<string, unknown>;
interface Katex {
  renderToString: (equation: string, options?: KatexOptions) => string;
}
//#endregion
export { Katex, KatexOptions };