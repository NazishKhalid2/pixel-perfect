import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, pageHead } from "@/components/site/Placeholder";

export const Route = createFileRoute("/about")({
  head: pageHead("About", "About MENA AQUA Tru, water filtration specialists in Dubai."),
  component: () => <Placeholder title="About" />,
});
