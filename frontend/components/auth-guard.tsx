"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <div className="space-y-2 text-center">
            <div className="mx-auto h-3 w-32 animate-shimmer rounded-full" />
            <div className="mx-auto h-2.5 w-24 animate-shimmer rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}
