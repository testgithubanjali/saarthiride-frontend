
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  acceptRide,
  completeRide,
  getPendingRides,
  startRide,
  type Ride,
} from "@/lib/api";

type RideStatus = "pending" | "accepted" | "ongoing" | "completed";

export default function DriverRidesPage() {
  const router = useRouter();

  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyRideId, setBusyRideId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchRides() {
      const token = sessionStorage.getItem("saarthiride_token");
      const userText = sessionStorage.getItem("saarthiride_user");

      if (!token || !userText) {
        router.replace("/login");
        return;
      }

      try {
        const user = JSON.parse(userText) as { role?: string };

        if (user.role !== "driver") {
          router.replace("/dashboard");
          return;
        }

        if (!cancelled) {
          setLoading(true);
          setError("");
        }

        const response = await getPendingRides(token);

        if (!cancelled) {
          setRides(response.rides ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load ride requests."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchRides();

    return () => {
      cancelled = true;
    };
  }, [router, refreshKey]);

  async function handleAction(
    rideId: number,
    action: (token: string, id: number) => Promise<unknown>
  ) {
    const token = sessionStorage.getItem("saarthiride_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      setBusyRideId(rideId);
      setError("");

      await action(token, rideId);

      setRefreshKey((key) => key + 1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update this ride."
      );
    } finally {
      setBusyRideId(null);
    }
  }

  function getStatus(status: string): RideStatus | "unknown" {
    const normalized = status.toLowerCase();

    if (normalized === "pending") return "pending";

    if (normalized === "accepted" || normalized === "assigned") {
      return "accepted";
    }

    if (
      normalized === "ongoing" ||
      normalized === "started" ||
      normalized === "in_progress"
    ) {
      return "ongoing";
    }

    if (normalized === "completed") return "completed";

    return "unknown";
  }

  if (loading && rides.length === 0) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        Loading ride requests...
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-gray-50 px-4 py-8 text-gray-900 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            SaarthiRide Driver
          </p>

          <h1 className="mt-1 text-3xl font-bold">Ride Management</h1>

          <p className="mt-2 text-gray-600">
            Review requests and manage your rides.
          </p>
        </div>

        <button
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={loading}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:bg-gray-100 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {error}
        </div>
      )}

      {rides.length === 0 && !loading ? (
        <section className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">No pending rides</h2>

          <p className="mt-2 text-gray-600">
            New ride requests will appear here when available.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {rides.map((ride) => {
            const status = getStatus(ride.status);
            const busy = busyRideId === ride.id;

            return (
              <article
                key={ride.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">Ride #{ride.id}</h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Passenger ID: {ride.passenger_id}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold capitalize text-blue-800">
                    {ride.status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Pickup
                    </p>

                    <p className="mt-1">
                      {ride.pickup_latitude}, {ride.pickup_longitude}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Destination
                    </p>

                    <p className="mt-1">
                      {ride.destination_latitude},{" "}
                      {ride.destination_longitude}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {status === "pending" && (
                    <button
                      onClick={() => void handleAction(ride.id, acceptRide)}
                      disabled={busyRideId !== null}
                      className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                    >
                      {busy ? "Accepting..." : "Accept Ride"}
                    </button>
                  )}

                  {status === "accepted" && (
                    <button
                      onClick={() => void handleAction(ride.id, startRide)}
                      disabled={busyRideId !== null}
                      className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                    >
                      {busy ? "Starting..." : "Start Ride"}
                    </button>
                  )}

                  {status === "ongoing" && (
                    <button
                      onClick={() => void handleAction(ride.id, completeRide)}
                      disabled={busyRideId !== null}
                      className="rounded-lg bg-purple-700 px-4 py-2 font-semibold text-white hover:bg-purple-800 disabled:opacity-50"
                    >
                      {busy ? "Completing..." : "Complete Ride"}
                    </button>
                  )}

                  {status === "completed" && (
                    <p className="font-medium text-emerald-700">
                      Ride completed
                    </p>
                  )}

                  {status === "unknown" && (
                    <p className="text-sm text-gray-500">
                      No action available for this status.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
