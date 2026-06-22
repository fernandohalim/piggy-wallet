"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loading } from "@/components/ui/Loading";
import { SyncManager } from "@/components/sync/SyncManager";
import { BottomNav } from "@/components/nav/BottomNav";
import { Sidebar } from "@/components/nav/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <Loading />;
  if (!user) return null;

  return (
    <>
      <SyncManager />
      <Sidebar />
      <div className="lg:pl-60">{children}</div>
      <BottomNav />
    </>
  );
}
