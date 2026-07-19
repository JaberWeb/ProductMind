"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { Menu } from "lucide-react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar />
        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
          </div>
          <main className="noise flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
