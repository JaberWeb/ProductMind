import Link from "next/link";

const footerSections = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },

    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Login" },
      { href: "/register", label: "Register" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-indigo-600">
              ProductMind
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              AI-powered product management platform. Import, enrich, analyze, and optimize your product catalog.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-slate-100 pt-6 text-center">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} ProductMind. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
