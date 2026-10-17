import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, pageHead } from "@/components/site/Placeholder";

export const Route = createFileRoute("/contact")({
  head: pageHead("Contact", "Contact MENA AQUA Tru in Al Muteena, Deira, Dubai."),
  component: () => <Placeholder title="Contact" />,
});
