
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  cancelRide,
  getRideHistory,
  type AuthUser,
  type Ride,
} from "@/lib/api";

function getSavedRole(): AuthUser["role"] | null {
  const savedUser = sessionStorage.getItem("saarthiride_user");

  if (!savedUser) {
    return null;
  }

  try {
    const user = JSON.parse(savedUser) as AuthUser;

    if (user.role === "passenger" || user.role === "driver") {
      return user.role;
    }

    return null;
  } catch {
    return null;
  }
}

export default function RideHistoryPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [role, setRole] = useState<AuthUser["role"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRides = useCallback(async () => {
    const token = sessionStorage.getItem("saarthiride_token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    setLoading(true);
    setError("");
    setRole(getSavedRole());

    try {
      const result = await getRideHistory(token);
      setRides(result.rides);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load your ride history."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const token = sessionStorage.getItem("saarthiride_token");

    if (!token) {
      window.location.replace("/login");

      return () => {
        isActive = false;
      };
    }

    const savedRole = getSavedRole();

    getRideHistory(token)
      .then((result) => {
        if (!isActive) {
          return;
        }

        setRole(savedRole);
        setRides(result.rides);
        setError("");
      })
      .catch((err: unknown) => {
        if (!isActive) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Could not load your ride history."
        );
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  async function handleCancel(ride: Ride) {
    const canCancel =
      (role === "passenger" &&
        ["pending", "accepted"].includes(ride.status)) ||
      (role === "driver" && ride.status === "accepted");

    if (!canCancel) {
      setError("This ride cannot be cancelled from your account.");
      return;
    }

    if (!window.confirm(`Cancel ride #${ride.id}?`)) {
      return;
    }

    const token = sessionStorage.getItem("saarthiride_token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    setCancellingId(ride.id);
    setError("");
    setMessage("");

    try {
      const result = await cancelRide(token, ride.id);

      setMessage(result.message || "Ride cancelled successfully.");

      await loadRides();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not cancel this ride."
      );
    } finally {
      setCancellingId(null);
    }
  }

  function handleRefresh() {
    setMessage("");
    void loadRides();
  }

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

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              Dashboard
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="font-semibold text-emerald-700">YOUR JOURNEYS</p>

        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          Ride history
        </h1>

        <p className="mt-3 text-slate-600">
          View your ride requests and their latest status.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/rides/new"
            className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Request a ride
          </Link>

          <Link
            href="/rides/track"
            className="rounded-xl border border-emerald-200 bg-white px-5 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Track rides
          </Link>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh history"}
          </button>
        </div>

        {message && (
          <p
            role="status"
            className="mt-6 rounded-xl bg-emerald-50 p-4 text-emerald-800"
          >
            {message}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-50 p-4 text-red-700"
          >
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-8 text-slate-600" role="status">
            Loading ride history...
          </p>
        ) : rides.length === 0 && !error ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-xl font-bold">No rides yet</h2>
            <p className="mt-2 text-slate-600">
              Your ride requests will appear here.
            </p>
            <Link
              href="/rides/new"
              className="mt-4 inline-block font-semibold text-emerald-700 hover:underline"
            >
              Request your first ride
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {rides.map((ride) => {
              const canCancel =
                (role === "passenger" &&
                  ["pending", "accepted"].includes(ride.status)) ||
                (role === "driver" && ride.status === "accepted");

              return (
                <article
                  key={ride.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">
                        Ride #{ride.id}
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        Ride details
                      </h2>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold capitalize text-emerald-800">
                      {ride.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Pickup</p>
                      <p className="mt-1 font-medium">
                        {ride.pickup_latitude}, {ride.pickup_longitude}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Destination</p>
                      <p className="mt-1 font-medium">
                        {ride.destination_latitude},{" "}
                        {ride.destination_longitude}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
                      <div>
                        <p className="text-slate-500">Driver ID</p>
                        <p className="mt-1 font-medium">
                          {ride.driver_id ?? "Not assigned"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Vehicle ID</p>
                        <p className="mt-1 font-medium">
                          {ride.vehicle_id ?? "Not assigned"}
                        </p>
                      </div>
                    </div>

                    {ride.created_at && (
                      <p className="text-xs text-slate-500">
                        Requested:{" "}
                        {new Date(ride.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => void handleCancel(ride)}
                      disabled={cancellingId !== null}
                      className="mt-6 rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancellingId === ride.id
                        ? "Cancelling..."
                        : "Cancel ride"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
