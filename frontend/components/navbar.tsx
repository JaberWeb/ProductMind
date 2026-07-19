"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, LogIn, UserPlus, LayoutDashboard, PlusCircle, Package, BarChart3, Bot, Info, Phone, Tag, Grid3x3 } from "lucide-react";

const publicLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/features", label: "Features", icon: Grid3x3 },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
  { href: "/login", label: "Login", icon: LogIn },
  { href: "/register", label: "Register", icon: UserPlus },
];

const authedLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-items", label: "Add Items", icon: PlusCircle },
  { href: "/manage-items", label: "Manage Items", icon: Package },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = session ? authedLinks : publicLinks;

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/80 bg-white/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="relative text-lg font-bold tracking-tight text-indigo-600 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full"
        >
          ProductMind
        </Link>

        <div className="flex items-center gap-0.5">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  active ? "text-indigo-700" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={16}
                  className={
                    active
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }
                />
                {link.label}
                {active && (
                  <span className="absolute -bottom-px left-2 right-2 h-0.5 rounded-full bg-indigo-600" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
