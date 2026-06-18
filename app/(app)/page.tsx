"use client";
import { useAuth } from "@/components/auth/AuthProvider";
import { logOut } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const { user } = useAuth();
  return (
    <main className="min-h-dvh max-w-md mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-3xl">🐷</span>
        <h1 className="text-2xl font-semibold">Piggy Wallet</h1>
      </div>
      <p className="text-muted">
        Signed in as {user?.email ?? "your account"}.
      </p>
      <p className="text-sm text-muted">Expense logging arrives in Phase 4.</p>
      <Button variant="outline" onClick={() => logOut()}>
        Log out
      </Button>
    </main>
  );
}
