import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, pageHead } from "@/components/site/Placeholder";

export const Route = createFileRoute("/blog")({
  head: pageHead("Blog", "Notes on water quality and filtration in the UAE."),
  component: () => <Placeholder title="Blog" />,
});
