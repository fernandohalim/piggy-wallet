"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmail,
  signInWithGoogle,
  authErrorMessage,
} from "@/lib/auth";
import { useOnline } from "@/lib/hooks/useOnline";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { PiggyIcon } from "@/components/ui/Icons";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const online = useOnline();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<unknown>) {
    setError("");
    setBusy(true);
    try {
      await fn();
      router.replace("/");
    } catch (err) {
      setError(authErrorMessage((err as { code?: string })?.code ?? ""));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <Image
          src="/icons/icon-512.png"
          alt="Icon"
          width={100}
          height={100}
          className="mx-auto block mb-4"
        />
        <h1 className="text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="text-sm text-muted">Log in to Piggy Wallet</p>
      </div>

      {!online && (
        <p className="rounded-card bg-accent/15 text-ink text-sm px-4 py-3">
          You&apos;re offline. The first sign-in needs an internet connection.
        </p>
      )}
      {error && (
        <p className="rounded-card bg-danger/10 text-danger text-sm px-4 py-3">
          {error}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(() => signInWithEmail(email.trim(), password));
        }}
        className="space-y-4"
      >
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <Button type="submit" loading={busy}>
          Log in
        </Button>
      </form>

      <div className="flex items-center gap-3 text-muted text-xs">
        <span className="h-px bg-border flex-1" /> OR{" "}
        <span className="h-px bg-border flex-1" />
      </div>

      <Button
        variant="outline"
        onClick={() => run(signInWithGoogle)}
        loading={busy}
      >
        <GoogleIcon /> Continue with Google
      </Button>

      <p className="text-center text-sm text-muted">
        No account?{" "}
        <Link href="/signup" className="text-primary font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
