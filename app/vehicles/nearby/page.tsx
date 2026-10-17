
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  getNearbyVehicles,
  type NearbyVehicle,
} from "@/lib/api";

export default function NearbyVehiclesPage() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("5");

  const [vehicles, setVehicles] = useState<NearbyVehicle[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultRadius, setResultRadius] = useState(5);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSearched(false);

    const lat = Number(latitude);
    const lon = Number(longitude);
    const searchRadius = Number(radius);

    if (
      latitude.trim() === "" ||
      longitude.trim() === "" ||
      !Number.isFinite(lat) ||
      lat < -90 ||
      lat > 90
    ) {
      setError("Enter a valid latitude between -90 and 90.");
      return;
    }

    if (
      longitude.trim() === "" ||
      !Number.isFinite(lon) ||
      lon < -180 ||
      lon > 180
    ) {
      setError("Enter a valid longitude between -180 and 180.");
      return;
    }

    if (
      radius.trim() === "" ||
      !Number.isFinite(searchRadius) ||
      searchRadius <= 0 ||
      searchRadius > 100
    ) {
      setError("Radius must be greater than 0 and at most 100 km.");
      return;
    }

    setLoading(true);
    setVehicles([]);

    try {
      const result = await getNearbyVehicles(lat, lon, searchRadius);
      setVehicles(result.vehicles);
      setResultRadius(result.radius_km);
      setSearched(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not retrieve nearby vehicles. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faf8] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            Saarthi<span className="text-emerald-600">Ride</span>
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-emerald-700 hover:underline"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <p className="font-semibold text-emerald-700">
          FIND YOUR NEXT RIDE
        </p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          Nearby available vehicles
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Enter a location to find available vehicles within your preferred
          search radius.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-8 grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-4"
        >
          <div>
            <label
              htmlFor="latitude"
              className="mb-2 block text-sm font-medium"
            >
              Latitude
            </label>
            <input
              id="latitude"
              type="number"
              step="any"
              min="-90"
              max="90"
              required
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
              placeholder="e.g. 26.9124"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="longitude"
              className="mb-2 block text-sm font-medium"
            >
              Longitude
            </label>
            <input
              id="longitude"
              type="number"
              step="any"
              min="-180"
              max="180"
              required
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
              placeholder="e.g. 75.7873"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="radius"
              className="mb-2 block text-sm font-medium"
            >
              Radius (km)
            </label>
            <input
              id="radius"
              type="number"
              step="any"
              min="0.1"
              max="100"
              required
              value={radius}
              onChange={(event) => setRadius(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Searching..." : "Find vehicles"}
            </button>
          </div>

          <p className="text-sm text-slate-500 md:col-span-4">
            Coordinates must be decimal latitude and longitude. The search
            radius can be up to 100 km.
          </p>
        </form>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {loading && (
          <p className="mt-8 text-slate-600" role="status">
            Searching for nearby vehicles...
          </p>
        )}

        {searched && !loading && (
          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Search results</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Within {resultRadius} km of your selected coordinates.
                </p>
              </div>

              <p className="font-semibold text-emerald-700">
                {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"} found
              </p>
            </div>

            {vehicles.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-lg font-semibold">
                  No available vehicles found
                </p>
                <p className="mt-2 text-slate-600">
                  Try a larger search radius or different coordinates.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle) => (
                  <article
                    key={vehicle.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-emerald-700">
                          AVAILABLE
                        </p>
                        <h3 className="mt-2 text-xl font-bold">
                          {vehicle.model}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {vehicle.registration_number}
                        </p>
                      </div>

                      <span className="text-3xl" aria-hidden="true">
                        🚗
                      </span>
                    </div>

                    <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">Capacity</span>
                        <span className="font-semibold">
                          {vehicle.capacity}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">Distance</span>
                        <span className="font-semibold">
                          {vehicle.distance_km.toFixed(2)} km
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">Vehicle ID</span>
                        <span className="font-semibold">{vehicle.id}</span>
                      </div>
                    </div>

                    <a
                      href={`https://www.google.com/maps?q=${vehicle.latitude},${vehicle.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-block font-semibold text-emerald-700 hover:underline"
                    >
                      View location on map ↗
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
