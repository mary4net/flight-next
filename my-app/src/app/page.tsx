'use client';

import Link from "next/link";
import Navigation from "@/components/ui/navigation";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br to-white min-h-screen">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-900" style={{ textShadow: "0 0 6px white, 0 0 12px white, 0 0 18px white" }}>Welcome to FlyNext</h1>
        <p className="text-xl text-black mb-10 max-w-xl" style={{ textShadow: "0 0 6px white, 0 0 12px white, 0 0 18px white" }}>
          Your one-stop destination for booking affordable flights and comfortable hotels — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mb-12">
          <Link href="/flight/search" className="px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition">
            ✈️ Book a Flight
          </Link>
          <Link href="/hotelsearch" className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition">
            🏨 Find a Hotel
          </Link>
        </div>

        <div className="text-black">
          <p style={{ textShadow: "0 0 6px white, 0 0 12px white, 0 0 18px white" }}>
            Already booked? <Link href="/booking" className="text-blue-700 underline hover:text-blue-900">Manage your bookings</Link>
          </p>
          <p className="mt-2" style={{ textShadow: "0 0 6px white, 0 0 12px white, 0 0 18px white" }}>
            New here? <Link href="/user/login" className="text-blue-700 underline hover:text-blue-900">Log in or sign up</Link>
          </p>
        </div>
      </main>

    </>
  );
}

