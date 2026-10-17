import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, pageHead } from "@/components/site/Placeholder";

export const Route = createFileRoute("/products")({
  head: pageHead("Products", "Water filtration, softening and UV purification products."),
  component: () => <Placeholder title="Products" />,
});
