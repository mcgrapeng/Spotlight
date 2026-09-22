import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { AnchorLinkSlots } from "./public-types.js";
import { Ref, SlotsType } from "vue";
//#region src/anchor/src/Link.d.ts
interface AnchorInjection {
  activeHref: Ref<string | null>;
  mergedClsPrefix: Ref<string>;
  updateBarPosition: (el: HTMLElement) => void;
  setActiveHref: (href: string, transition?: boolean) => void;
  collectedLinkHrefs: string[];
  titleEls: HTMLElement[];
}
declare const anchorInjectionKey: import("vue").InjectionKey<AnchorInjection>;
declare const anchorLinkProps: {
  readonly title: StringConstructor;
  readonly href: StringConstructor;
};
type AnchorLinkProps = ExtractPublicPropTypes<typeof anchorLinkProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly title: StringConstructor;
  readonly href: StringConstructor;
}>, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly title: StringConstructor;
  readonly href: StringConstructor;
}>> & Readonly<{}>, {}, SlotsType<AnchorLinkSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { AnchorInjection, AnchorLinkProps, anchorInjectionKey, anchorLinkProps, _default as default };