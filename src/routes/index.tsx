import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { NextStep, Solve, Stock, Trust, WhoWeAre } from "@/components/home/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MENA AQUA Tru | Water Filtration Systems in Dubai" },
      { name: "description", content: "Water filters, softeners and UV purification supplied, installed and serviced across the UAE. Based in Al Muteena, Deira, Dubai." },
      { property: "og:title", content: "MENA AQUA Tru | Pure water. Better living." },
      { property: "og:description", content: "RO systems, whole-house softeners and UV sterilizers installed and serviced by one accountable team in Dubai." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <Solve />
      <WhoWeAre />
      <Stock />
      <Trust />
      <NextStep />
    </main>
  );
}
