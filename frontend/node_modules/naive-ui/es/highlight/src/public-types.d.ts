import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { highlightProps } from "./Highlight.js";
//#region src/highlight/src/public-types.d.ts
type HighlightProps = ExtractPublicPropTypes<typeof highlightProps>;
//#endregion
export { HighlightProps };