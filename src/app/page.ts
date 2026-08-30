import { html } from "@elurjs/core";
import type { PageMetadata } from "@elurjs/kit";
import { Hero } from "./_components/Hero";
import { Stats } from "./_components/Stats";
// import { SizeBench } from "./_components/SizeBench";
import { InspiredPreview } from "./_components/InspiredPreview";
import { Interop } from "./_components/Interop";
import { QuickStart } from "./_components/QuickStart";
import { Features } from "./_components/Features";
import { Playground } from "./_components/Playground";
import { HowItWorks } from "./_components/HowItWorks";
import { CodeShowcase } from "./_components/CodeShowcase";
import { Ecosystem } from "./_components/Ecosystem";
import { DxEcosystem } from "./_components/DxEcosystem";
import { ElurKit } from "./_components/ElurKit";
import { ElurQuery } from "./_components/ElurQuery";
import { ElurI18n } from "./_components/ElurI18n";
import { ElurAuth } from "./_components/ElurAuth";
import { Comparison } from "./_components/Comparison";
import { InspiredDeep } from "./_components/InspiredDeep";
import { ElurIonic } from "./_components/ElurIonic";
import { IronBikers } from "./_components/IronBikers";
import { Showcases } from "./_components/Showcases";
import { Faq } from "./_components/Faq";
import { Cta } from "./_components/Cta";
import { Contribute } from "./_components/Contribute";

export const generateMetadata = (): PageMetadata => ({
  title: "Elur — Lightweight Reactive JavaScript Framework | ElurJS",
  description:
    "ElurJS is a lightweight reactive JavaScript framework with fine-grained signals, direct DOM updates, no virtual DOM, zero dependencies, and no build step.",
  canonical: "https://www.elur.dev/",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  openGraph: {
    type: "website",
    title: "Elur — Lightweight Reactive JavaScript Framework",
    description:
      "Build fast reactive JavaScript interfaces with ElurJS signals, direct DOM updates, zero dependencies, and no required build step.",
    siteName: "ElurJS",
    url: "https://www.elur.dev/",
    image: "https://www.elur.dev/og-image.jpg",
    imageAlt: "ElurJS — lightweight reactive JavaScript framework",
    imageWidth: 1730,
    imageHeight: 909,
    imageType: "image/jpeg",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elur — Lightweight Reactive JavaScript Framework",
    description:
      "Build fast reactive JavaScript interfaces with ElurJS signals, direct DOM updates, zero dependencies, and no required build step.",
    image: "https://www.elur.dev/og-image.jpg",
    imageAlt: "ElurJS — lightweight reactive JavaScript framework",
  },
  other: {
    keywords:
      "Elur, ElurJS, Elur framework, Elur JavaScript, reactive JavaScript framework, lightweight JavaScript framework, signal-based framework, fine-grained reactivity, no virtual DOM, TypeScript framework",
    googlebot: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    "twitter:site": "@elurjs",
    "twitter:creator": "@elurjs",
  },
});

export default function HomePage() {
  return html`
    ${Hero()}
    ${Stats()}
    ${/* SizeBench() */""}
    ${InspiredPreview()}
    ${Interop()}
    ${QuickStart()}
    ${Features()}
    ${Playground()}
    ${HowItWorks()}
    ${CodeShowcase()}
    ${Ecosystem()}
    ${DxEcosystem()}
    ${ElurKit()}
    ${ElurQuery()}
    ${ElurI18n()}
    ${ElurAuth()}
    ${/* Comparison() */""}
    ${InspiredDeep()}
    ${ElurIonic()}
    ${IronBikers()}
    ${Showcases()}
    ${Faq()}
    ${Cta()}
    ${Contribute()}
  `;
}
