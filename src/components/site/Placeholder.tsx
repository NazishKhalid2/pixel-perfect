import { Link } from "@tanstack/react-router";

export function Placeholder({ title }: { title: string }) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-tint px-5 pt-16 text-center">
      <p className="eyebrow">MENA AQUA Tru</p>
      <h1 className="mt-3 text-4xl font-semibold">{title}</h1>
      <p className="mt-4 text-muted-foreground">This page is coming soon.</p>
      <Link to="/" className="btn btn-primary mt-8">Back to home</Link>
    </main>
  );
}

export const pageHead = (title: string, desc: string) => () => ({
  meta: [
    { title: `${title} | MENA AQUA Tru` },
    { name: "description", content: desc },
    { property: "og:title", content: `${title} | MENA AQUA Tru` },
    { property: "og:description", content: desc },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
