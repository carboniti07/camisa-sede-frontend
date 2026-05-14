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
  component: Index,
});

function Index() {
  const [faqOpen, setFaqOpen] = useState(false);

  function scrollToReserva() {
    const reserva = document.getElementById("reserva");

    if (!reserva) return;

    reserva.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="min-h-screen">
      <SiteHeader onOpenFaq={() => setFaqOpen(true)} onReservar={scrollToReserva} />

      <main>
        <Hero onReservar={scrollToReserva} />

        <section
          style={{
            contentVisibility: "auto",
            containIntrinsicSize: "900px",
          }}
        >
          <ShirtShowcase />
        </section>

        <Highlights />
        <ReservaSection />
      </main>

      <SiteFooter />
      <FaqWidget open={faqOpen} setOpen={setFaqOpen} />
    </div>
  );
}