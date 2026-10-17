import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-navy text-on-dark-muted">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm">Pure water. Better living.</p>
        </div>
        <div className="text-sm leading-7">
          <p className="text-on-dark">Visit</p>
          <p>Al Muteena, Deira, Dubai, UAE</p>
          <p>Open 7 days, 8:00 AM to 9:00 PM</p>
        </div>
        <div className="text-sm leading-7">
          <p className="text-on-dark">Contact</p>
          <p><a className="hover:text-on-dark" href="tel:+971507183290">Phone 050-7183290</a></p>
          <p><a className="hover:text-on-dark" href="https://wa.me/971507183290">WhatsApp 050-7183290</a></p>
          <p><a className="hover:text-on-dark" href="mailto:sales.aquatru@gmail.com">sales.aquatru@gmail.com</a></p>
        </div>
      </div>
      <div className="border-t border-on-dark/10 py-6 text-center text-xs">
        © 2026 MENA AQUA Tru Water Solutions LLC. All rights reserved.
      </div>
    </footer>
  );
}
