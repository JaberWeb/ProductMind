"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  BarChart3,
  Bot,
  LogOut,
  ChevronDown,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-items", label: "Add Items", icon: PlusCircle },
  { href: "/manage-items", label: "Manage Items", icon: Package },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const aiSubItems = [
  { href: "/ai-assistant?tab=chat", label: "Chat", icon: MessageCircle },
  { href: "/ai-assistant?tab=content", label: "Content Generator", icon: Sparkles },
];

export function Sidebar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const onAiPage = pathname === "/ai-assistant";
  const [search, setSearch] = useState("");
  useEffect(() => {
    setSearch(window.location.search);
  }, []);
  const fullPath = onAiPage ? pathname + search : pathname;
  const [aiOpen, setAiOpen] = useState(onAiPage);

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight text-indigo-600">
          ProductMind
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-indigo-600" />
              )}
              <Icon
                size={18}
                className={`transition-colors ${
                  active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                }`}
              />
              {item.label}
            </Link>
          );
        })}

        <div>
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className={`group relative flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              onAiPage
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {onAiPage && (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-indigo-600" />
            )}
            <Bot
              size={18}
              className={`transition-colors ${
                onAiPage ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
              }`}
            />
            <span className="flex-1 text-left">AI Assistant</span>
            <ChevronDown
              size={15}
              className={`transition-transform ${aiOpen ? "rotate-0" : "-rotate-90"} text-slate-400`}
            />
          </button>
          {aiOpen && (
            <div className="ml-2 mt-1 space-y-0.5 border-l-2 border-slate-100 pl-2">
              {aiSubItems.map((sub) => {
                const SubIcon = sub.icon;
                const subActive = fullPath === sub.href;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`group relative flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      subActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    <SubIcon size={16} />
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-slate-200 p-4">
        {isPending ? (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-2.5 w-32 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ) : (
          <div className="dropdown dropdown-top w-full">
            <div
              tabIndex={0}
              role="button"
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50"
            >
              <div className="avatar placeholder">
                <div className="w-9 rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                  <span>
                    {session?.user?.name?.charAt(0)?.toUpperCase() ||
                      session?.user?.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-slate-900">
                  {session?.user?.name || "User"}
                </p>
                <p className="truncate text-xs text-slate-500">{session?.user?.email}</p>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu z-10 mb-1 w-full rounded-box border border-slate-200 bg-white p-2 shadow-lg"
            >
              <li>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
