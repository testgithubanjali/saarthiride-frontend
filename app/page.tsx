import Image from "next/image";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7faf8] text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl text-white">
              ↗
            </span>
            <span className="text-2xl font-bold tracking-tight">
              Saarthi<span className="text-emerald-600">Ride</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm hover:text-emerald-600">
              How it works
            </a>
            <a href="#benefits" className="text-sm hover:text-emerald-600">
              Why SaarthiRide?
            </a>
          </nav>

          <a
            href="#book-ride"
            className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Get started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            A smarter way to travel
          </div>

          <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Your journey,
            <br />
            your way with{" "}
            <span className="text-emerald-600">SaarthiRide.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Find nearby rides, connect with drivers, and reach your
            destination with a simpler ride-booking experience.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#book-ride"
              className="rounded-full bg-emerald-600 px-7 py-4 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              Book a ride →
            </a>

            <a
              href="#how-it-works"
              className="rounded-full border border-slate-300 bg-white px-7 py-4 font-semibold transition hover:bg-slate-100"
            >
              How it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600">
            <span>✓ Easy booking</span>
            <span>✓ Nearby vehicles</span>
            <span>✓ Ride tracking</span>
          </div>
        </div>

        {/* Ride Booking Card */}
        <div id="book-ride" className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-emerald-100/70 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">
                  YOUR NEXT JOURNEY
                </p>
                <h2 className="mt-1 text-2xl font-bold">Where to?</h2>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                🚗
              </span>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex flex-col items-center pt-3">
                  <span className="h-3 w-3 rounded-full border-[3px] border-emerald-600" />
                  <span className="my-1 h-12 border-l-2 border-dashed border-slate-300" />
                  <span className="h-3 w-3 rounded-full bg-orange-500" />
                </div>

                <div className="flex-1 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-600">
                      Pickup location
                    </span>
                    <input
                      type="text"
                      placeholder="Enter your pickup location"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-600">
                      Destination
                    </span>
                    <input
                      type="text"
                      placeholder="Where are you going?"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-xl bg-emerald-600 py-4 font-semibold text-white transition hover:bg-emerald-700"
              >
                Find available rides →
              </button>

              <p className="text-center text-xs text-slate-500">
                Choose your locations to plan your journey.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl">
                  📍
                </span>
                <div>
                  <p className="font-semibold">Rides around you</p>
                  <p className="text-sm text-slate-600">
                    Discover nearby available vehicles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold">Simple booking</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter your locations and request a ride through one interface.
            </p>
          </div>
          <div>
            <p className="text-lg font-bold">Nearby vehicles</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Find available vehicles based on their location.
            </p>
          </div>
          <div>
            <p className="text-lg font-bold">Ride status</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Follow the ride lifecycle from request to completion.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-semibold text-emerald-700">THREE SIMPLE STEPS</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Getting there is easier
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            SaarthiRide is designed to make requesting and managing rides
            straightforward.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Enter your locations",
              description:
                "Choose where your journey starts and where you want to go.",
            },
            {
              number: "02",
              title: "Find a ride",
              description:
                "Explore nearby available vehicles and request a ride.",
            },
            {
              number: "03",
              title: "Enjoy your journey",
              description:
                "Follow your ride status until your journey is complete.",
            },
          ].map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-sm font-bold text-emerald-600">
                STEP {step.number}
              </span>
              <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-lg font-bold">
            Saarthi<span className="text-emerald-400">Ride</span>
          </p>
          <p className="text-sm text-slate-400">
            A smarter way to plan your journey.
          </p>
        </div>
      </footer>
    </main>
  );
}