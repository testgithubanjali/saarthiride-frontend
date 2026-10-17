
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    setLoading(true);

    try {
      const result = await loginUser({
        phone: phone.trim(),
        password,
      });

      if (!result.token || !result.user) {
        throw new Error("Login succeeded, but the authentication data is missing.");
      }

      // Keep the session for this browser tab.
      sessionStorage.setItem("saarthiride_token", result.token);
      sessionStorage.setItem(
        "saarthiride_user",
        JSON.stringify(result.user)
      );

      setSuccess(`Welcome, ${result.user.name}! You are now logged in.`);
      setPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-4 py-10 text-slate-900">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 block text-center text-3xl font-bold">
          Saarthi<span className="text-emerald-600">Ride</span>
        </Link>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="mt-2 text-sm text-slate-600">
              Log in to continue your SaarthiRide journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium"
              >
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter your registered phone number"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {success && (
              <div
                role="status"
                className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
              >
                <p className="font-semibold">{success}</p>
                <p className="mt-1">
                  Your authentication token has been saved for this tab.
                </p>
                <Link
                  href="/"
                  className="mt-3 inline-block font-semibold underline"
                >
                  Return to homepage
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-700 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
