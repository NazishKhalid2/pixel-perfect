import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [solid, setSolid] = useState(!isHome);

  useEffect(() => {
    if (!isHome) return setSolid(true);
    const onScroll = () => {
      const hero = document.getElementById("hero");
      const end = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight : 0;
      setSolid(window.scrollY > end - 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? "glass" : ""}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Main">
        <Link to="/" aria-label="MENA AQUA Tru home"><Logo /></Link>
        <ul className="hidden gap-8 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="text-sm text-on-dark-muted transition-colors hover:text-on-dark">{l.label}</Link>
            </li>
          ))}
        </ul>
        <a href="https://wa.me/971507183290" className="btn btn-ghost-dark px-4 py-2 text-sm">WhatsApp</a>
      </nav>
    </header>
  );
}
