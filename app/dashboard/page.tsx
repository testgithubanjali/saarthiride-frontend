
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfile, type AuthUser } from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const token = sessionStorage.getItem("saarthiride_token");

      if (!token) {
        window.location.replace("/login");
        return;
      }

      try {
        const response = await getProfile(token);

        if (!response.user) {
          throw new Error(
            "Profile response did not contain the expected user information."
          );
        }

        if (!cancelled) {
          setUser(response.user);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your profile."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("saarthiride_token");
    sessionStorage.removeItem("saarthiride_user");
    window.location.replace("/login");
  }

  return (
    <main className="min-h-screen bg-[#f7faf8] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            Saarthi<span className="text-emerald-600">Ride</span>
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-full border border-slate-300 px-5 py-2 font-medium hover:bg-slate-100"
          >
            Log out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {loading ? (
          <p className="text-slate-600">Loading your profile...</p>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6"
          >
            <h1 className="text-xl font-bold text-red-800">
              Could not load your profile
            </h1>
            <p className="mt-2 text-red-700">{error}</p>
            <Link
              href="/login"
              className="mt-4 inline-block font-semibold text-emerald-700 underline"
            >
              Return to login
            </Link>
          </div>
        ) : user ? (
          <>
            <p className="font-semibold text-emerald-700">
              YOUR SAARTHIRIDE ACCOUNT
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Welcome, {user.name}!
            </h1>

            <p className="mt-3 text-slate-600">
              Your SaarthiRide account is ready.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <h2 className="text-xl font-bold">Your profile</h2>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-sm text-slate-500">Full name</p>
                    <p className="mt-1 font-semibold">{user.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Phone number</p>
                    <p className="mt-1 font-semibold">{user.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Account role</p>
                    <span className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold capitalize text-emerald-800">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <h2 className="text-xl font-bold">Ready for your next ride?</h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Continue to SaarthiRide to explore the ride-booking
                  experience.
                </p>

                <Link
                  href="/"
                  className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                  Go to homepage →
                </Link>
              </div>
            </div>
          </>
        ) : (
          <p>No profile information was returned by the server.</p>
        )}
      </section>
    </main>
  );
}
