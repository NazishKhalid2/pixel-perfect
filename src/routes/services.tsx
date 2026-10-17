import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, pageHead } from "@/components/site/Placeholder";

export const Route = createFileRoute("/services")({
  head: pageHead("Services", "Water testing, installation and scheduled maintenance in the UAE."),
  component: () => <Placeholder title="Services" />,
});
