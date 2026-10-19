
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getRideHistory, type Ride } from "@/lib/api";

function getStatusStep(status: string): number {
  switch (status) {
    case "pending":
      return 0;
    case "accepted":
      return 1;
    case "in_progress":
      return 2;
    case "completed":
      return 3;
    default:
      return -1;
  }
}

export default function PassengerRideTrackingPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const loadRides = useCallback(async (automatic = false) => {
    const token = sessionStorage.getItem("saarthiride_token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    if (automatic) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await getRideHistory(token);
      setRides(result.rides);
      setLastUpdated(new Date().toLocaleTimeString());
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not refresh your ride status."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
useEffect(() => {
  let active = true;

  const refreshRides = async (automatic = false) => {
    const token = sessionStorage.getItem("saarthiride_token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    if (automatic) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await getRideHistory(token);

      if (!active) return;

      setRides(result.rides);
      setLastUpdated(new Date().toLocaleTimeString());
      setError("");
    } catch (err) {
      if (!active) return;

      setError(
        err instanceof Error
          ? err.message
          : "Could not refresh your ride status."
      );
    } finally {
      if (active) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  const initialTimer = window.setTimeout(() => {
    void refreshRides();
  }, 0);

  const interval = window.setInterval(() => {
    void refreshRides(true);
  }, 10000);

  return () => {
    active = false;
    window.clearTimeout(initialTimer);
    window.clearInterval(interval);
  };
}, []);
  return (
    <main className="min-h-screen bg-[#f7faf8] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            Saarthi<span className="text-emerald-600">Ride</span>
          </Link>

          <Link
            href="/rides/history"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Ride history
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="font-semibold text-emerald-700">PASSENGER SERVICES</p>

        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          Track your rides
        </h1>

        <p className="mt-3 text-slate-600">
          Check the latest status of your ride requests. Status refreshes
          automatically every 10 seconds while this page is open.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => void loadRides()}
            disabled={loading || refreshing}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading || refreshing ? "Refreshing..." : "Refresh status"}
          </button>

          {lastUpdated && (
            <p className="text-sm text-slate-500">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-8 text-slate-600">Loading your rides...</p>
        ) : rides.length === 0 && !error ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-xl font-bold">No rides to track</h2>
            <p className="mt-2 text-slate-600">
              Request a ride to see its status here.
            </p>
            <Link
              href="/rides/new"
              className="mt-5 inline-block rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Request a ride
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {rides.map((ride) => {
              const step = getStatusStep(ride.status);
              const cancelled = ride.status === "cancelled";

              const steps = [
                "Requested",
                "Driver assigned",
                "Ride in progress",
                "Completed",
              ];

              return (
                <article
                  key={ride.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">Ride #{ride.id}</p>
                      <h2 className="mt-1 text-xl font-bold">
                        Ride progress
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${
                        cancelled
                          ? "bg-red-100 text-red-800"
                          : ride.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-50 text-blue-800"
                      }`}
                    >
                      {ride.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  {cancelled ? (
                    <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-800">
                      This ride has been cancelled.
                    </p>
                  ) : (
                    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                      {steps.map((label, index) => {
                        const complete = step >= index;

                        return (
                          <div key={label} className="flex items-start gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                complete
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {complete ? "✓" : index + 1}
                            </div>

                            <p
                              className={`pt-1 text-sm ${
                                complete
                                  ? "font-semibold text-emerald-800"
                                  : "text-slate-500"
                              }`}
                            >
                              {label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-8 grid gap-5 border-t border-slate-100 pt-6 md:grid-cols-2">
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

                    <div>
                      <p className="text-sm text-slate-500">Driver ID</p>
                      <p className="mt-1 font-semibold">
                        {ride.driver_id ?? "Waiting for assignment"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Vehicle ID</p>
                      <p className="mt-1 font-semibold">
                        {ride.vehicle_id ?? "Waiting for assignment"}
                      </p>
                    </div>
                  </div>

                  {ride.created_at && (
                    <p className="mt-5 text-xs text-slate-500">
                      Requested: {new Date(ride.created_at).toLocaleString()}
                    </p>
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
