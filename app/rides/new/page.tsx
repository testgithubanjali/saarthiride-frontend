
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createRide } from "@/lib/api";

export default function NewRidePage() {
  const router = useRouter();
  const [pickupLatitude, setPickupLatitude] = useState("");
  const [pickupLongitude, setPickupLongitude] = useState("");
  const [destinationLatitude, setDestinationLatitude] = useState("");
  const [destinationLongitude, setDestinationLongitude] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rideDetails, setRideDetails] = useState<{
    id: number;
    status: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setRideDetails(null);

    const fields = [
      { value: pickupLatitude, label: "Pickup latitude", min: -90, max: 90 },
      { value: pickupLongitude, label: "Pickup longitude", min: -180, max: 180 },
      {
        value: destinationLatitude,
        label: "Destination latitude",
        min: -90,
        max: 90,
      },
      {
        value: destinationLongitude,
        label: "Destination longitude",
        min: -180,
        max: 180,
      },
    ];

    for (const field of fields) {
      const value = Number(field.value);

      if (
        field.value.trim() === "" ||
        !Number.isFinite(value) ||
        value < field.min ||
        value > field.max
      ) {
        setError(
          `${field.label} must be between ${field.min} and ${field.max}.`
        );
        return;
      }
    }

    const token = sessionStorage.getItem("saarthiride_token");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const result = await createRide(token, {
        pickup_latitude: Number(pickupLatitude),
        pickup_longitude: Number(pickupLongitude),
        destination_latitude: Number(destinationLatitude),
        destination_longitude: Number(destinationLongitude),
      });

      setSuccess(result.message || "Ride requested successfully!");

      if (result.ride) {
        setRideDetails({
          id: result.ride.id,
          status: result.ride.status,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not request a ride. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const coordinateFields = [
    {
      id: "pickup-latitude",
      label: "Pickup latitude",
      value: pickupLatitude,
      setter: setPickupLatitude,
      min: -90,
      max: 90,
      placeholder: "e.g. 26.9124",
    },
    {
      id: "pickup-longitude",
      label: "Pickup longitude",
      value: pickupLongitude,
      setter: setPickupLongitude,
      min: -180,
      max: 180,
      placeholder: "e.g. 75.7873",
    },
    {
      id: "destination-latitude",
      label: "Destination latitude",
      value: destinationLatitude,
      setter: setDestinationLatitude,
      min: -90,
      max: 90,
      placeholder: "e.g. 26.9239",
    },
    {
      id: "destination-longitude",
      label: "Destination longitude",
      value: destinationLongitude,
      setter: setDestinationLongitude,
      min: -180,
      max: 180,
      placeholder: "e.g. 75.8267",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7faf8] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            Saarthi<span className="text-emerald-600">Ride</span>
          </Link>

          <Link
            href="/vehicles/nearby"
            className="text-sm font-semibold text-emerald-700 hover:underline"
          >
            Nearby vehicles
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <p className="font-semibold text-emerald-700">BOOK YOUR JOURNEY</p>

        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          Request a ride
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          Enter your pickup and destination coordinates to send a ride request.
          A successful request will initially have pending status.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-xl font-bold">Pickup location</h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {coordinateFields.slice(0, 2).map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="mb-2 block text-sm font-medium"
                >
                  {field.label}
                </label>

                <input
                  id={field.id}
                  type="number"
                  step="any"
                  min={field.min}
                  max={field.max}
                  required
                  value={field.value}
                  onChange={(event) => field.setter(event.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            ))}
          </div>

          <h2 className="mt-8 text-xl font-bold">Destination</h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {coordinateFields.slice(2).map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="mb-2 block text-sm font-medium"
                >
                  {field.label}
                </label>

                <input
                  id={field.id}
                  type="number"
                  step="any"
                  min={field.min}
                  max={field.max}
                  required
                  value={field.value}
                  onChange={(event) => field.setter(event.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            ))}
          </div>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <div
              role="status"
              className="mt-6 rounded-xl bg-emerald-50 p-4 text-emerald-800"
            >
              <p className="font-semibold">{success}</p>

              {rideDetails && (
                <p className="mt-2 text-sm">
                  Ride ID: {rideDetails.id} · Status: {rideDetails.status}
                </p>
              )}

              <Link
                href="/dashboard"
                className="mt-3 inline-block font-semibold underline"
              >
                Go to dashboard
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-emerald-600 px-5 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Requesting ride..." : "Request ride"}
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">
            Ride requests require a logged-in passenger account.
          </p>
        </form>
      </section>
    </main>
  );
}
