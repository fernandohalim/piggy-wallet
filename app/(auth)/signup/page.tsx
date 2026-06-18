"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signUpWithEmail,
  signInWithGoogle,
  authErrorMessage,
} from "@/lib/auth";
import { useOnline } from "@/lib/hooks/useOnline";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { GoogleIcon } from "@/components/ui/GoogleIcon";

export default function SignupPage() {
  const router = useRouter();
  const online = useOnline();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6)
      return setError("Password should be at least 6 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setBusy(true);
    try {
      await signUpWithEmail(email.trim(), password);
      router.replace("/");
    } catch (err) {
      setError(authErrorMessage((err as { code?: string })?.code ?? ""));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle();
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
        <div className="text-4xl">🐷</div>
        <h1 className="text-2xl font-semibold text-ink">Create your wallet</h1>
        <p className="text-sm text-muted">Start tracking in seconds</p>
      </div>

      {!online && (
        <p className="rounded-card bg-accent/15 text-ink text-sm px-4 py-3">
          You&apos;re offline. Creating an account needs an internet connection.
        </p>
      )}
      {error && (
        <p className="rounded-card bg-danger/10 text-danger text-sm px-4 py-3">
          {error}
        </p>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
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
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
        />
        <TextField
          label="Confirm password"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter password"
        />
        <Button type="submit" loading={busy}>
          Sign up
        </Button>
      </form>

      <div className="flex items-center gap-3 text-muted text-xs">
        <span className="h-px bg-border flex-1" /> OR{" "}
        <span className="h-px bg-border flex-1" />
      </div>

      <Button variant="outline" onClick={handleGoogle} loading={busy}>
        <GoogleIcon /> Continue with Google
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
