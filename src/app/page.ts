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
  title: "Elur — Lightweight Reactive Micro-Framework for JavaScript",
  description:
    "Signal-based reactivity that runs natively with ESM/import maps. No virtual DOM. No compiler. ~15 KB gzipped, zero dependencies.",
  canonical: "https://www.elur.dev/",
  openGraph: {
    type: "website",
    title: "Elur — Lightweight Reactive Micro-Framework for JavaScript",
    description:
      "Signal-based reactivity that runs natively with ESM/import maps. No virtual DOM. No compiler.",
    siteName: "Elur",
    url: "https://www.elur.dev/",
    image: "https://www.elur.dev/og-image.jpg",
    imageAlt: "Elur — lightweight reactive framework for JavaScript",
    imageWidth: 1730,
    imageHeight: 909,
    imageType: "image/jpeg",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elur — Lightweight Reactive Micro-Framework for JavaScript",
    description:
      "Signal-based reactivity that runs natively with ESM/import maps. No virtual DOM. No compiler.",
    image: "https://www.elur.dev/og-image.jpg",
    imageAlt: "Elur — lightweight reactive framework for JavaScript",
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
