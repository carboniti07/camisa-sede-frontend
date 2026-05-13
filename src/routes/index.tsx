import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Hero } from "@/components/site/Hero";
import ShirtShowcase from "@/components/site/ShirtShowcase";
import { Highlights } from "@/components/site/Highlights";
import { ReservaSection } from "@/components/site/ReservaSection";
import { FaqWidget } from "@/components/site/FaqWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Camisa Oficial · Congresso da Sede AD Brás Rudge Ramos" },
      { name: "description", content: "Reserve a camisa oficial do Congresso da Sede — Tema Profundidade. Pix à vista ou parcelado em 3 datas." },
      { property: "og:title", content: "Camisa Oficial · Congresso da Sede" },
      { property: "og:description", content: "Profundidade — Mas enchei-vos do Espírito Santo. Efésios 5:18." },
    ],
  }),
  component: Index,
});

function Index() {
  const [faqOpen, setFaqOpen] = useState(false);
  const scrollToReserva = () => document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className="min-h-screen">
      <SiteHeader onOpenFaq={() => setFaqOpen(true)} onReservar={scrollToReserva} />
      <main>
        <Hero onReservar={scrollToReserva} />
        <ShirtShowcase />
        <Highlights />
        <ReservaSection />
      </main>
      <SiteFooter />
      <FaqWidget open={faqOpen} setOpen={setFaqOpen} />
    </div>
  );
}
